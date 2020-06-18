import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin, BehaviorSubject, Notification, combineLatest, concat, from, fromEvent, pipe } from 'rxjs';
import { map, mergeMap, tap, subscribeOn } from 'rxjs/operators';

//import { AccountEndpoint } from './account-endpoint.service';
import { AuthService } from './auth.service';
//import { User } from '../models/user.model';
//import { Role } from '../models/role.model';
import { Account } from '../models/account.model';
//import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
//import { UserEdit } from '../models/user-edit.model';
//import { register } from '../models/register.model';
//import { UserForgotUserName } from '../models/user-forgot-username.model'
//import { SecurityQuestion } from '../models/security-questions.model';
import { validateConfig } from '@angular/router/src/config';

import { SFAccountSettings } from '../models/sf-account-settings.model';
import { SFContact } from '../models/sf-contact.model';
import { SFRole } from '../models/sf-role.model';
import { SFAccountSettingsEndpoint } from './sf-account-settings-endpoint.service';

//export type SFRolesChangedOperation = 'add' | 'delete' | 'modify';
//export interface SFRolesChangedEventArg { roles: SFRole[] | string[]; operation: SFRolesChangedOperation; }

@Injectable()
export class SFAccountSettingsService {

  //public static readonly roleAddedOperation: SFRolesChangedOperation = 'add';
  //public static readonly roleDeletedOperation: SFRolesChangedOperation = 'delete';
  //public static readonly roleModifiedOperation: SFRolesChangedOperation = 'modify';

  //private _rolesChanged = new Subject<SFRolesChangedEventArg>();

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private sfAccountSettingsEndpoint: SFAccountSettingsEndpoint) {
  }

  getSFAccountSettings() {
    return this.sfAccountSettingsEndpoint.getSFAccountSettings<SFAccountSettings>();
  }

  updateSFAccountSettings(sfAccountSettings: SFAccountSettings) {
    return this.sfAccountSettingsEndpoint.getUpdateSFAccountSettingsEndpoint<SFAccountSettings>(sfAccountSettings);
  }

//register(request: register) {
  //  return this
  //    .sfAccountSettingsEndpoint
  //    .getRegisterEndpoint<register>(request)
  //    .pipe(map(response => this.processRegisterResponse(response)));
  //}
  //private processRegisterResponse(response: register) {
  //  const account = response.account;
  //  if (account == null) {
  //    throw new Error('Account was empty');
  //  }
  //  return response;
  //}

  //forgotUserName(data: UserForgotUserName) {
  //  return this.sfAccountSettingsEndpoint.getForgotUserNameEndpoint(data);
  //}
  //forgotPassword(username: string) {
  //  return this.sfAccountSettingsEndpoint.getForgotPasswordEndpoint(username);
  //}
  //confirmEmail(userId: string, code: string) {
  //  return this.sfAccountSettingsEndpoint.getRegisterConfirmEndpoint<boolean>(userId, code);
  //}
  //confirmForgotPassword(code: string, userName: string, password: string) {
  //  return this.sfAccountSettingsEndpoint.getForgotPasswordConfirmEndPoint<boolean>(code, userName, password);
  //}
  //confirmUpdatePassword(userName: string, currentPassword: string, password: string) {
  //  return this.sfAccountSettingsEndpoint.getUpdatePasswordEndPoint<boolean>(userName, currentPassword, password);
  //}
  //getQuestions(language: string) {
  //  return this.sfAccountSettingsEndpoint.getQuestionsEndpoint<SecurityQuestion[]>(language);
  //}
  //getUser(userId?: string) {
  //  return this.sfAccountSettingsEndpoint.getUserEndpoint<User>(userId);
  //}

  //getAccount() {
  //  return this.sfAccountSettingsEndpoint.getAccount<Account>();    
  //}

  //getUserAndRoles(userId?: string) {

  //  return forkJoin(
  //    this.sfAccountSettingsEndpoint.getUserEndpoint<User>(userId),
  //    this.sfAccountSettingsEndpoint.getRolesEndpoint<Role[]>());
  //}

  //getUsers(page?: number, pageSize?: number) {

  //  return this.sfAccountSettingsEndpoint.getUsersEndpoint<User[]>(page, pageSize);
  //}

  //getUsersAndRoles(page?: number, pageSize?: number) {

  //  return forkJoin(
  //    this.sfAccountSettingsEndpoint.getUsersEndpoint<User[]>(page, pageSize),
  //    this.sfAccountSettingsEndpoint.getRolesEndpoint<Role[]>());
  //}


  //updateUser(user: UserEdit, isSelf?: boolean) {
  //  if (isSelf)
  //    return this.sfAccountSettingsEndpoint.getUpdateUserEndpoint<User>(user);

  //  if (user.id) {      
  //    //return this.sfAccountSettingsEndpoint.getUpdateUserEndpoint<User>(user, user.id);
  //    return this.sfAccountSettingsEndpoint.getUpdateUserEndpoint<User>(user);
  //  }
  //  else {
  //    alert("here1");
  //    return this.sfAccountSettingsEndpoint.getUserByUserNameEndpoint<User>(user.userName).pipe<User>(
  //      mergeMap(foundUser => {
  //        user.id = foundUser.id;
  //        return this.sfAccountSettingsEndpoint.getUpdateUserEndpoint<User>(user, user.id);
  //      }));
  //  }
  //}


  //newUser(user: UserEdit) {
  //  return this.sfAccountSettingsEndpoint.getNewUserEndpoint<User>(user);
  //}


  //getUserPreferences() {
  //  return this.sfAccountSettingsEndpoint.getUserPreferencesEndpoint<string>();
  //}

  //updateUserPreferences(configuration: string) {
  //  return this.sfAccountSettingsEndpoint.getUpdateUserPreferencesEndpoint(configuration);
  //}


  //deleteUser(userOrUserId: string | UserEdit): Observable<User> {

  //  if (typeof userOrUserId === 'string' || userOrUserId instanceof String) {
  //    return this.sfAccountSettingsEndpoint.getDeleteUserEndpoint<User>(<string>userOrUserId).pipe<User>(
  //      tap(data => this.onRolesUserCountChanged(data.roles)));
  //  } else {

  //    if (userOrUserId.id) {
  //      return this.deleteUser(userOrUserId.id);
  //    } else {
  //      return this.sfAccountSettingsEndpoint.getUserByUserNameEndpoint<User>(userOrUserId.userName).pipe<User>(
  //        mergeMap(user => this.deleteUser(user.id)));
  //    }
  //  }
  //}


  //unblockUser(userId: string) {
  //  return this.sfAccountSettingsEndpoint.getUnblockUserEndpoint(userId);
  //}


  //userHasPermission(permissionValue: PermissionValues): boolean {
  //  return this.permissions.some(p => p == permissionValue);
  //}


  //refreshLoggedInUser() {
  //  return this.authService.refreshLogin();
  //}




  //getRoles(page?: number, pageSize?: number) {

  //  return this.sfAccountSettingsEndpoint.getRolesEndpoint<Role[]>(page, pageSize);
  //}


  //getRolesAndPermissions(page?: number, pageSize?: number) {

  //  return forkJoin(
  //    this.sfAccountSettingsEndpoint.getRolesEndpoint<Role[]>(page, pageSize),
  //    this.sfAccountSettingsEndpoint.getPermissionsEndpoint<Permission[]>());
  //}


  //updateRole(role: Role) {
  //  if (role.id) {
  //    return this.sfAccountSettingsEndpoint.getUpdateRoleEndpoint<Role>(role, role.id).pipe<Role>(
  //      tap(data => this.onRolesChanged([role], SFAccountSettingsService.roleModifiedOperation)));
  //  } else {
  //    return this.sfAccountSettingsEndpoint.getRoleByRoleNameEndpoint<Role>(role.name).pipe<Role>(
  //      mergeMap((foundRole, i) => {
  //        role.id = foundRole.id;
  //        return this.sfAccountSettingsEndpoint.getUpdateRoleEndpoint<Role>(role, role.id);
  //      }),
  //      tap(data => this.onRolesChanged([role], SFAccountSettingsService.roleModifiedOperation)));
  //  }
  //}


  //newRole(role: Role) {
  //  return this.sfAccountSettingsEndpoint.getNewRoleEndpoint<Role>(role).pipe<Role>(
  //    tap(data => this.onRolesChanged([role], SFAccountSettingsService.roleAddedOperation)));
  //}


  //deleteRole(roleOrRoleId: string | Role): Observable<Role> {

  //  if (typeof roleOrRoleId === 'string' || roleOrRoleId instanceof String) {
  //    return this.sfAccountSettingsEndpoint.getDeleteRoleEndpoint<Role>(<string>roleOrRoleId).pipe<Role>(
  //      tap(data => this.onRolesChanged([data], SFAccountSettingsService.roleDeletedOperation)));
  //  } else {

  //    if (roleOrRoleId.id) {
  //      return this.deleteRole(roleOrRoleId.id);
  //    } else {
  //      return this.sfAccountSettingsEndpoint.getRoleByRoleNameEndpoint<Role>(roleOrRoleId.name).pipe<Role>(
  //        mergeMap(role => this.deleteRole(role.id)));
  //    }
  //  }
  //}

  //getPermissions() {

  //  return this.sfAccountSettingsEndpoint.getPermissionsEndpoint<Permission[]>();
  //}


  //private onRolesChanged(roles: Role[] | string[], op: SFRolesChangedOperation) {
  //  this._rolesChanged.next({ roles: roles, operation: op });
  //}


  //onRolesUserCountChanged(roles: Role[] | string[]) {
  //  return this.onRolesChanged(roles, SFAccountSettingsService.roleModifiedOperation);
  //}


  //getRolesChangedEvent(): Observable<SFRolesChangedEventArg> {
  //  return this._rolesChanged.asObservable();
  //}



  //get permissions(): PermissionValues[] {
  //  return this.authService.userPermissions;
  //}

  //get currentUser() {
  //  return this.authService.currentUser;
  //}
}
