import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
//import { tap } from 'rxjs/operators';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
//import { register } from '../models/register.model';
//import { Account } from '../models/account.model';
//import { UserForgotUserName } from '../models/user-forgot-username.model'
//import { access } from 'fs';

import { SFAccountSettings } from '../models/sf-account-settings.model';
import { SFContact } from '../models/sf-contact.model';


@Injectable()
export class SFAccountSettingsEndpoint extends EndpointFactory {

  private readonly _sfAccountSettingsUrl: string = "/api/sfaccount/sfaccountsettings";
  private readonly _sfAccountSettingsSaveUrl: string = "/api/sfaccount/savesfaccountsettings"
  private readonly _sfContactsUrl: string = "/api/sfaccount/sfcontacts";
  private readonly _sfContactUrl: string = "/api/sfaccount/sfcontact";
  private readonly _sfContactSaveUrl: string = "/api/sfaccount/savesfcontact";

  get sfAccountSettingsUrl() {
    return this.configurations.baseUrl + this._sfAccountSettingsUrl;
  }

  get sfAccountSettingsSaveUrl() {
    return this.configurations.baseUrl + this._sfAccountSettingsSaveUrl;
  }

  get sfContactsUrl() {
    return this.configurations.baseUrl + this._sfContactsUrl;
  }

  get sfContactUrl() {
    return this.configurations.baseUrl + this._sfContactUrl;
  }

  get sfContactSaveUrl() {
    return this.configurations.baseUrl + this._sfContactSaveUrl;
  }



  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    super(http, configurations, injector);
  }


  // SFAccountSettings
  getSFAccountSettingsEndpoint<T>(): Observable<T> {
    var url = this.sfAccountSettingsUrl;
    var headers = this.getRequestHeaders();
    return this.http
      .get(url, headers)
      .pipe<T>(
        catchError(error => this.handleError(error))
      );
  }

  getSaveSFAccountSettingsEndpoint<T>(sfAccountSettings: SFAccountSettings): Observable<T> {
    let endpointUrl = this.sfAccountSettingsSaveUrl;
    return this.http
      .put<T>(endpointUrl, JSON.stringify(sfAccountSettings), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }


  // SFContacts
  getSFContactsEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
    let endpointUrl = page && pageSize ? `${this.sfContactsUrl}/${page}/${pageSize}` : this.sfContactsUrl;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getSFContactEndpoint<T>(id: number): Observable<T> {
    let endpointUrl = `${this.sfContactUrl}/${id}`;
    return this.http
      .get<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  getSaveSFContactEndpoint<T>(sfContact: SFContact): Observable<T> {
    let endpointUrl = this.sfContactSaveUrl;
    return this.http
      .put<T>(endpointUrl, JSON.stringify(sfContact), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

  //getUpdateSFContactEndpoint<T>(sfContact: SFContact): Observable<T> {
  //  let endpointUrl = `${this.sfContactSaveUrl}/${sfContact.id}`;
  //  return this.http
  //    .put<T>(endpointUrl, JSON.stringify(sfContact), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}



  //getAccount<T>(): Observable<T> {
  //  return this.http
  //    .post(this.sfAccountSettingsLookupUrl, null, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getRegisterConfirmEndpoint<T>(userId: string, code: string): Observable<T> {
  //  let endpointUrl = `${this.registerUrl}/confirm`;

  //  var parms = new HttpParams()
  //    .append("userId", userId)
  //    .append("code", code);

  //  return this.http
  //    .post<T>(endpointUrl, parms, this.getRequestHeadersText())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getUpdatePasswordEndPoint<T>(username: string, currentPassword: string, password: string) {

  //  var parms = new HttpParams()
  //    .append("username", username)
  //    .append("currentPassword", currentPassword)
  //    .append("password", password);
    
  //  return this.http
  //    .post<T>(this.updatePasswordUrl, parms, this.getRequestHeadersText())
  //    .pipe<T>(catchError(error => this.handleError(error)));

  //}

  //getForgotPasswordConfirmEndPoint<T>(code: string, userName: string, password: string) {

  //  var parms = new HttpParams()
  //    .append("code", code)
  //    .append("username", userName)
  //    .append("password", password);

  //  return this.http
  //    .post<T>(this.resetPasswordUrl, parms, this.getRequestHeadersText())
  //    .pipe<T>(catchError(error => this.handleError(error)));

  //}
  //getRegisterEndpoint<T>(data: register): Observable<T> {
  //  return this.http
  //    .post<T>(this.registerUrl, data, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getForgotPasswordEndpoint<T>(username: string): Observable<T> {
  //  return this.http
  //    .post(this.forgotPasswordUrl, JSON.stringify(username), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getForgotUserNameEndpoint<T>(data: UserForgotUserName): Observable<T> {
  //  return this.http
  //    .post(this.forgotUserNameUrl, data, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getQuestionsEndpoint<T>(language: string): Observable<T> {
  //  let endPointUrl = `${this.questionsUrl}/${language}`;

  //  return this.http
  //    .get<T>(endPointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getUserEndpoint<T>(userId?: string): Observable<T> {
  //  let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

  //  return this.http
  //    .get<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
  //  let endpointUrl = `${this.userByUserNameUrl}/${userName}`;

  //  return this.http
  //    .get<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
  //  let endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

  //  return this.http
  //    .get<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getNewUserEndpoint<T>(userObject: any): Observable<T> {

  //  return this.http
  //    .post<T>(this.usersUrl, JSON.stringify(userObject), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
  //  let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

  //  return this.http
  //    .put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getUserPreferencesEndpoint<T>(): Observable<T> {
  //  return this.http
  //    .get<T>(this.currentUserPreferencesUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
  //  return this.http
  //    .put<T>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getUnblockUserEndpoint<T>(userId: string): Observable<T> {
  //  let endpointUrl = `${this.unblockUserUrl}/${userId}`;

  //  return this.http
  //    .put<T>(endpointUrl, null, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getDeleteUserEndpoint<T>(userId: string): Observable<T> {
  //  let endpointUrl = `${this.usersUrl}/${userId}`;

  //  return this.http
  //    .delete<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getSFRoleEndpoint<T>(roleId: string): Observable<T> {
  //  let endpointUrl = `${this.rolesUrl}/${roleId}`;

  //  return this.http
  //    .get<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getSFRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
  //  let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

  //  return this.http
  //    .get<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}



  //getSFRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
  //  let endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

  //  return this.http
  //    .get<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

  //  return this.http
  //    .post<T>(this.rolesUrl, JSON.stringify(roleObject), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
  //  let endpointUrl = `${this.rolesUrl}/${roleId}`;

  //  return this.http
  //    .put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}

  //getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
  //  let endpointUrl = `${this.rolesUrl}/${roleId}`;

  //  return this.http
  //    .delete<T>(endpointUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}


  //getPermissionsEndpoint<T>(): Observable<T> {

  //  return this.http
  //    .get<T>(this.permissionsUrl, this.getRequestHeaders())
  //    .pipe<T>(catchError(error => this.handleError(error)));
  //}
}
