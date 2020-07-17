import { Injectable } from '@angular/core';

import { AppTranslationService } from './app-translation.service';
import { LocalStoreManager } from './local-store-manager.service';
import { DBkeys } from './db-Keys';
import { Utilities } from './utilities';
import { environment } from '../../environments/environment';



type UserConfiguration = {
    language: string,
    homeUrl: string,
    theme: string,
    showDashboardStatistics: boolean,
    showDashboardNotifications: boolean,
    showDashboardTodo: boolean,
};

@Injectable()
export class ConfigurationService {

    public static readonly appVersion: string = "0.1.0";

    public baseUrl = environment.baseUrl || Utilities.baseUrl();
    public loginUrl = environment.loginUrl;
    public fallbackBaseUrl = "http://localhost";

    //***Specify default configurations here***
    public static readonly defaultLanguage: string = "en";
    public static readonly defaultHomeUrl: string = "/";
    public static readonly defaultTheme: string = "Default";
    public static readonly defaultShowDashboardStatistics: boolean = true;
    public static readonly defaultShowDashboardNotifications: boolean = true;
    public static readonly defaultShowDashboardTodo: boolean = false;
    //***End of defaults***  

    private _language: string = null;
    private _homeUrl: string = null;
    private _theme: string = null;
    private _showDashboardStatistics: boolean = null;
    private _showDashboardNotifications: boolean = null;
    private _showDashboardTodo: boolean = null;


    constructor(private localStorage: LocalStoreManager, private translationService: AppTranslationService) {
        this.loadLocalChanges();
    }



    private loadLocalChanges() {

        if (this.localStorage.exists(DBkeys.LANGUAGE)) {
            this._language = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
            this.translationService.changeLanguage(this._language);
        }
        else {
            this.resetLanguage();
        }

        if (this.localStorage.exists(DBkeys.HOME_URL))
            this._homeUrl = this.localStorage.getDataObject<string>(DBkeys.HOME_URL);

        if (this.localStorage.exists(DBkeys.THEME))
            this._theme = this.localStorage.getDataObject<string>(DBkeys.THEME);

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_STATISTICS))
            this._showDashboardStatistics = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_STATISTICS);

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS))
            this._showDashboardNotifications = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_TODO))
            this._showDashboardTodo = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_TODO);
    }


    private saveToLocalStore(data: any, key: string) {
        setTimeout(() => this.localStorage.savePermanentData(data, key));
    }


    public import(value: string) {

        this.clearLocalChanges();

        if (!value)
            return;

        let config: UserConfiguration = Utilities.JSonTryParse(value);

        if (config.language != null)
            this.language = config.language;

        if (config.homeUrl != null)
            this.homeUrl = config.homeUrl;

        if (config.theme != null)
            this.theme = config.theme;

        if (config.showDashboardStatistics != null)
            this.showDashboardStatistics = config.showDashboardStatistics;

        if (config.showDashboardNotifications != null)
            this.showDashboardNotifications = config.showDashboardNotifications;

        if (config.showDashboardTodo != null)
            this.showDashboardTodo = config.showDashboardTodo;
    }


  public export(changesOnly = true): string {
        let exportValue: UserConfiguration =
            {
                language:                   changesOnly ? this._language : this.language,
                homeUrl:                    changesOnly ? this._homeUrl : this.homeUrl,
                theme:                      changesOnly ? this._theme : this.theme,
                showDashboardStatistics:    changesOnly ? this._showDashboardStatistics : this.showDashboardStatistics,
                showDashboardNotifications: changesOnly ? this._showDashboardNotifications : this.showDashboardNotifications,
                showDashboardTodo:          changesOnly ? this._showDashboardTodo : this.showDashboardTodo,
            };
                      
        return JSON.stringify(exportValue);
    }


    public clearLocalChanges() {
        this._language = null;
        this._homeUrl = null;
        this._theme = null;
        this._showDashboardStatistics = null;
        this._showDashboardNotifications = null;
        this._showDashboardTodo = null;

        this.localStorage.deleteData(DBkeys.LANGUAGE);
        this.localStorage.deleteData(DBkeys.HOME_URL);
        this.localStorage.deleteData(DBkeys.THEME);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_STATISTICS);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_TODO);

        this.resetLanguage();
    }


  public clearLogOutChanges() {
    this._homeUrl = null;
    this._theme = null;
    this._showDashboardStatistics = null;
    this._showDashboardNotifications = null;
    this._showDashboardTodo = null;

    this.localStorage.deleteData(DBkeys.HOME_URL);
    this.localStorage.deleteData(DBkeys.THEME);
    this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_STATISTICS);
    this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
    this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_TODO);
  }


    private resetLanguage() {
        let language = this.translationService.useBrowserLanguage();

        if (language) {
            this._language = language;
        }
        else {
            this._language = this.translationService.changeLanguage()
        }
    }




  set language(value: string) {
        this._language = value;
        this.saveToLocalStore(value, DBkeys.LANGUAGE);
        this.translationService.changeLanguage(value);
    }
  get language() {
        if (this._language != null)
            return this._language;

        return ConfigurationService.defaultLanguage;
    }


    set homeUrl(value: string) {
        this._homeUrl = value;
        this.saveToLocalStore(value, DBkeys.HOME_URL);
    }
    get homeUrl() {
        if (this._homeUrl != null)
            return this._homeUrl;

        return ConfigurationService.defaultHomeUrl;
    }


    set theme(value: string) {
        this._theme = value;
        this.saveToLocalStore(value, DBkeys.THEME);
    }
    get theme() {
        if (this._theme != null)
            return this._theme;

        return ConfigurationService.defaultTheme;
    }


    set showDashboardStatistics(value: boolean) {
        this._showDashboardStatistics = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_STATISTICS);
    }
    get showDashboardStatistics() {
        if (this._showDashboardStatistics != null)
            return this._showDashboardStatistics;

        return ConfigurationService.defaultShowDashboardStatistics;
    }


    set showDashboardNotifications(value: boolean) {
        this._showDashboardNotifications = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
    }
    get showDashboardNotifications() {
        if (this._showDashboardNotifications != null)
            return this._showDashboardNotifications;

        return ConfigurationService.defaultShowDashboardNotifications;
    }


    set showDashboardTodo(value: boolean) {
        this._showDashboardTodo = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_TODO);
    }
    get showDashboardTodo() {
        if (this._showDashboardTodo != null)
            return this._showDashboardTodo;

        return ConfigurationService.defaultShowDashboardTodo;
    }
}
