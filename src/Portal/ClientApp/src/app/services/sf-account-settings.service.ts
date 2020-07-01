import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin, BehaviorSubject, Notification, combineLatest, concat, from, fromEvent, pipe } from 'rxjs';
import { map, mergeMap, tap, subscribeOn } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { validateConfig } from '@angular/router/src/config';

import { SFAccountSettings } from '../models/sf-account-settings.model';
import { SFContact } from '../models/sf-contact.model';
import { SFAccountSettingsEndpoint } from './sf-account-settings-endpoint.service';

@Injectable()
export class SFAccountSettingsService {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private sfAccountSettingsEndpoint: SFAccountSettingsEndpoint) {
  }


  // SFAccountSettings
  getSFAccountSettings() {
    return this.sfAccountSettingsEndpoint.getSFAccountSettingsEndpoint<SFAccountSettings>();
  }

  saveSFAccountSettings(sfAccountSettings: SFAccountSettings) {
    return this.sfAccountSettingsEndpoint.getSaveSFAccountSettingsEndpoint<SFAccountSettings>(sfAccountSettings);
  }


  // SFContacts
  getSFContacts(page?: number, pageSize?: number) {
    return this.sfAccountSettingsEndpoint.getSFContactsEndpoint<SFContact[]>(page, pageSize);
  }

  getSFContact(id?: number) {
    return this.sfAccountSettingsEndpoint.getSFContactEndpoint<SFContact>(id);
  }

  saveSFContact(sfContact: SFContact) {
    return this.sfAccountSettingsEndpoint.getSaveSFContactEndpoint<SFContact>(sfContact);
  }

}
