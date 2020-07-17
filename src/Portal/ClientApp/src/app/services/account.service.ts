import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin, BehaviorSubject, Notification, combineLatest, concat, from, fromEvent, pipe } from 'rxjs';
import { map, mergeMap, tap, subscribeOn } from 'rxjs/operators';



import { AccountEndpoint } from './account-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Account } from '../models/account.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { UserEdit } from '../models/user-edit.model';
import { register } from '../models/register.model';
import { UserForgotUserName } from '../models/user-forgot-username.model'
import { SecurityQuestion } from '../models/security-questions.model';
import { validateConfig } from '@angular/router/src/config';



export type RolesChangedOperation = 'add' | 'delete' | 'modify';
export interface RolesChangedEventArg { roles: Role[] | string[]; operation: RolesChangedOperation; }



@Injectable()
export class AccountService {

  public static readonly roleAddedOperation: RolesChangedOperation = 'add';
  public static readonly roleDeletedOperation: RolesChangedOperation = 'delete';
  public static readonly roleModifiedOperation: RolesChangedOperation = 'modify';

  private _rolesChanged = new Subject<RolesChangedEventArg>();


  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private accountEndpoint: AccountEndpoint) {
  }



  register(request: register) {
    return this
      .accountEndpoint
      .getRegisterEndpoint<register>(request)
      .pipe(map(response => this.processRegisterResponse(response)));
  }
  private processRegisterResponse(response: register) {

    const account = response.account;

    if (account == null) {
      throw new Error('Account was empty');
    }
    return response;
  }

  forgotUserName(data: UserForgotUserName) {
    return this.accountEndpoint.getForgotUserNameEndpoint(data);
  }
  forgotPassword(username: string) {
    return this.accountEndpoint.getForgotPasswordEndpoint(username);
  }
  confirmEmail(userId: string, code: string) {
    return this.accountEndpoint.getRegisterConfirmEndpoint<boolean>(userId, code);
  }
  confirmForgotPassword(code: string, userName: string, password: string) {
    return this.accountEndpoint.getForgotPasswordConfirmEndPoint<boolean>(code, userName, password);
  }
  confirmUpdatePassword(userName: string, currentPassword: string, password: string) {
    return this.accountEndpoint.getUpdatePasswordEndPoint<boolean>(userName, currentPassword, password);
  }
  getQuestions(language: string) {
    return this.accountEndpoint.getQuestionsEndpoint<SecurityQuestion[]>(language);
  }
  getUser(userId?: string) {
    return this.accountEndpoint.getUserEndpoint<User>(userId);
  }

  getAccount() {
    return this.accountEndpoint.getAccount<Account>();    
  }

  getUserAndRoles(userId?: string) {

    return forkJoin(
      this.accountEndpoint.getUserEndpoint<User>(userId),
      this.accountEndpoint.getRolesEndpoint<Role[]>());
  }

  getUsers(page?: number, pageSize?: number) {

    return this.accountEndpoint.getUsersEndpoint<User[]>(page, pageSize);
  }

  getUsersAndRoles(page?: number, pageSize?: number) {

    return forkJoin(
      this.accountEndpoint.getUsersEndpoint<User[]>(page, pageSize),
      this.accountEndpoint.getRolesEndpoint<Role[]>());
  }


  updateUser(user: UserEdit, isSelf?: boolean) {
    if (isSelf)
      return this.accountEndpoint.getUpdateUserEndpoint<User>(user);

    if (user.id) {      
      //return this.accountEndpoint.getUpdateUserEndpoint<User>(user, user.id);
      return this.accountEndpoint.getUpdateUserEndpoint<User>(user);
    }
    else {
      alert("here1");
      return this.accountEndpoint.getUserByUserNameEndpoint<User>(user.userName).pipe<User>(
        mergeMap(foundUser => {
          user.id = foundUser.id;
          return this.accountEndpoint.getUpdateUserEndpoint<User>(user, user.id);
        }));
    }
  }


  newUser(user: UserEdit) {
    return this.accountEndpoint.getNewUserEndpoint<User>(user);
  }


  getUserPreferences() {
    return this.accountEndpoint.getUserPreferencesEndpoint<string>();
  }

  updateUserPreferences(configuration: string) {
    return this.accountEndpoint.getUpdateUserPreferencesEndpoint(configuration);
  }


  deleteUser(userOrUserId: string | UserEdit): Observable<User> {

    if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
      return this.accountEndpoint.getDeleteUserEndpoint<User>(<string>userOrUserId).pipe<User>(
        tap(data => this.onRolesUserCountChanged(data.roles)));
    } else {

      if (userOrUserId.id) {
        return this.deleteUser(userOrUserId.id);
      } else {
        return this.accountEndpoint.getUserByUserNameEndpoint<User>(userOrUserId.userName).pipe<User>(
          mergeMap(user => this.deleteUser(user.id)));
      }
    }
  }


  unblockUser(userId: string) {
    return this.accountEndpoint.getUnblockUserEndpoint(userId);
  }


  userHasPermission(permissionValue: PermissionValues): boolean {
    return this.permissions.some(p => p == permissionValue);
  }


  refreshLoggedInUser() {
    return this.authService.refreshLogin();
  }




  getRoles(page?: number, pageSize?: number) {

    return this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize);
  }


  getRolesAndPermissions(page?: number, pageSize?: number) {

    return forkJoin(
      this.accountEndpoint.getRolesEndpoint<Role[]>(page, pageSize),
      this.accountEndpoint.getPermissionsEndpoint<Permission[]>());
  }


  updateRole(role: Role) {
    if (role.id) {
      return this.accountEndpoint.getUpdateRoleEndpoint<Role>(role, role.id).pipe<Role>(
        tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
    } else {
      return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(role.name).pipe<Role>(
        mergeMap((foundRole, i) => {
          role.id = foundRole.id;
          return this.accountEndpoint.getUpdateRoleEndpoint<Role>(role, role.id);
        }),
        tap(data => this.onRolesChanged([role], AccountService.roleModifiedOperation)));
    }
  }


  newRole(role: Role) {
    return this.accountEndpoint.getNewRoleEndpoint<Role>(role).pipe<Role>(
      tap(data => this.onRolesChanged([role], AccountService.roleAddedOperation)));
  }


  deleteRole(roleOrRoleId: string | Role): Observable<Role> {

    if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
      return this.accountEndpoint.getDeleteRoleEndpoint<Role>(<string>roleOrRoleId).pipe<Role>(
        tap(data => this.onRolesChanged([data], AccountService.roleDeletedOperation)));
    } else {

      if (roleOrRoleId.id) {
        return this.deleteRole(roleOrRoleId.id);
      } else {
        return this.accountEndpoint.getRoleByRoleNameEndpoint<Role>(roleOrRoleId.name).pipe<Role>(
          mergeMap(role => this.deleteRole(role.id)));
      }
    }
  }

  getPermissions() {

    return this.accountEndpoint.getPermissionsEndpoint<Permission[]>();
  }


  private onRolesChanged(roles: Role[] | string[], op: RolesChangedOperation) {
    this._rolesChanged.next({ roles: roles, operation: op });
  }


  onRolesUserCountChanged(roles: Role[] | string[]) {
    return this.onRolesChanged(roles, AccountService.roleModifiedOperation);
  }


  getRolesChangedEvent(): Observable<RolesChangedEventArg> {
    return this._rolesChanged.asObservable();
  }



  get permissions(): PermissionValues[] {
    return this.authService.userPermissions;
  }

  get currentUser() {
    return this.authService.currentUser;
  }
}
