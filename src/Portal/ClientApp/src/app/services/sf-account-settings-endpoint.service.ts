import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

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
      .post<T>(endpointUrl, JSON.stringify(sfContact), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }

}
