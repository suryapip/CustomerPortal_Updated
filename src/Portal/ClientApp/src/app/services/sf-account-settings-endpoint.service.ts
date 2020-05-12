import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { register } from '../models/register.model';
import { Account } from '../models/account.model';
import { UserForgotUserName } from '../models/user-forgot-username.model'
import { access } from 'fs';


@Injectable()
export class SFAccountSettingsEndpoint extends EndpointFactory {

  private readonly _userAccountLookupUrl: string = "/api/customer/getuseraccount";

  private readonly _questionsUrl: string = "/api/account/questions";
  private readonly _registerUrl: string = "/api/account/register";

  private readonly _forgotUserNameUrl: string = "/api/account/forgot/username";
  private readonly _forgotPasswordUrl: string = "/api/account/forgot/password";
  private readonly _updatePasswordUrl: string = "/api/account/reset/updatepassword";
  private readonly _resetPasswordUrl: string = "/api/account/reset/password";
  private readonly _usersUrl: string = "/api/account/users";
  private readonly _userByUserNameUrl: string = "/api/account/users/username";
  private readonly _unblockUserUrl: string = "/api/account/users/unblock";

  private readonly _rolesUrl: string = "/api/account/roles";
  private readonly _roleByRoleNameUrl: string = "/api/account/roles/name";
  private readonly _permissionsUrl: string = "/api/account/permissions";


  private readonly _currentUserUrl: string = "/api/account/users/me";
  private readonly _currentUserPreferencesUrl: string = "/api/account/users/me/preferences";


  get accountLookupUrl() { return this.configurations.baseUrl + this._userAccountLookupUrl; }

  get questionsUrl() { return this.configurations.baseUrl + this._questionsUrl; }
  get registerUrl() { return this.configurations.baseUrl + this._registerUrl; }

  get forgotUserNameUrl() { return this.configurations.baseUrl + this._forgotUserNameUrl; }
  get forgotPasswordUrl() { return this.configurations.baseUrl + this._forgotPasswordUrl; }
  get updatePasswordUrl() { return this.configurations.baseUrl + this._updatePasswordUrl; }
  get resetPasswordUrl() { return this.configurations.baseUrl + this._resetPasswordUrl; }
  get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
  get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
  get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
  get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
  get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
  get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }

  get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
  get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }


  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    super(http, configurations, injector);
  }

  
  getAccount<T>(): Observable<T> {
    return this.http
      .post(this.accountLookupUrl, null, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getRegisterConfirmEndpoint<T>(userId: string, code: string): Observable<T> {
    let endpointUrl = `${this.registerUrl}/confirm`;

    var parms = new HttpParams()
      .append("userId", userId)
      .append("code", code);

    return this.http
      .post<T>(endpointUrl, parms, this.getRequestHeadersText())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getUpdatePasswordEndPoint<T>(username: string, currentPassword: string, password: string) {

    var parms = new HttpParams()
      .append("username", username)
      .append("currentPassword", currentPassword)
      .append("password", password);
    
    return this.http
      .post<T>(this.updatePasswordUrl, parms, this.getRequestHeadersText())
      .pipe<T>(catchError(error => this.handleError(error)));

  }

  getForgotPasswordConfirmEndPoint<T>(code: string, userName: string, password: string) {

    var parms = new HttpParams()
      .append("code", code)
      .append("username", userName)
      .append("password", password);

    return this.http
      .post<T>(this.resetPasswordUrl, parms, this.getRequestHeadersText())
      .pipe<T>(catchError(error => this.handleError(error)));

  }
  getRegisterEndpoint<T>(data: register): Observable<T> {
    return this.http
      .post<T>(this.registerUrl, data, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getForgotPasswordEndpoint<T>(username: string): Observable<T> {
    return this.http
      .post(this.forgotPasswordUrl, JSON.stringify(username), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getForgotUserNameEndpoint<T>(data: UserForgotUserName): Observable<T> {
    return this.http
      .post(this.forgotUserNameUrl, data, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getQuestionsEndpoint<T>(language: string): Observable<T> {
    let endPointUrl = `${this.questionsUrl}/${language}`;

    return this.http
      .get<T>(endPointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getUserEndpoint<T>(userId?: string): Observable<T> {
    let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
    let endpointUrl = `${this.userByUserNameUrl}/${userName}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    let endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getNewUserEndpoint<T>(userObject: any): Observable<T> {

    return this.http
      .post<T>(this.usersUrl, JSON.stringify(userObject), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
    let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

    return this.http
      .put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getUserPreferencesEndpoint<T>(): Observable<T> {
    return this.http
      .get<T>(this.currentUserPreferencesUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
    return this.http
      .put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getUnblockUserEndpoint<T>(userId: string): Observable<T> {
    let endpointUrl = `${this.unblockUserUrl}/${userId}`;

    return this.http
      .put<T>(endpointUrl, null, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getDeleteUserEndpoint<T>(userId: string): Observable<T> {
    let endpointUrl = `${this.usersUrl}/${userId}`;

    return this.http
      .delete<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getRoleEndpoint<T>(roleId: string): Observable<T> {
    let endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
    let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }



  getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    let endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

    return this.http
      .post<T>(this.rolesUrl, JSON.stringify(roleObject), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
    let endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http
      .put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
    let endpointUrl = `${this.rolesUrl}/${roleId}`;

    return this.http
      .delete<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  getPermissionsEndpoint<T>(): Observable<T> {

    return this.http
      .get<T>(this.permissionsUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
}
