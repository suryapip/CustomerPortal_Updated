import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList, ElementRef, DebugElement } from "@angular/core";
import { Router, NavigationStart } from '@angular/router';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity } from '../services/alert.service';
import { NotificationService } from "../services/notification.service";
import { AppTranslationService } from "../services/app-translation.service";
import { AccountService } from '../services/account.service';
import { LocalStoreManager } from '../services/local-store-manager.service';
import { AppTitleService } from '../services/app-title.service';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { Permission } from '../models/permission.model';
import { LoginComponent } from "../components/login/login.component";
import { Account } from "../models/account.model";
import { element } from "protractor";
import { Subject, Observable, Subscription } from "rxjs";
import { access } from "fs";
import { LanguageObservableService } from "../services/language-observable.service";


var alertify: any = require('../assets/scripts/alertify.js');


@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {

  isAutoEnrollPopoverVisible: boolean;
  isAppLoaded: boolean;
  isUserLoggedIn: boolean;
  shouldShowLoginModal: boolean;
  removePrebootScreen: boolean;
  newNotificationCount = 0;
  appTitle = "Portal";
  appLogo = '../assets/images/sa-logo.png';
  globeImage = '../assets/images/Globe Icon.png';


  stickyToasties: number[] = [];

  dataLoadingConsecutiveFailurs = 0;
  notificationsLoadingSubscription: any;

  @ViewChildren('loginModal,loginControl')
  modalLoginControls: QueryList<any>;

  loginModal: ModalDirective;
  loginControl: LoginComponent;
  accountSubcription: Subscription;
  CurrentAccount: Subject<Account>;
  pageAccount: Account;


  get notificationsTitle() {

    let gT = (key: string) => this.translationService.getTranslation(key);

    if (this.newNotificationCount)
      return `${gT("app.Notifications")} (${this.newNotificationCount} ${gT("app.New")})`;
    else
      return gT("app.Notifications");
  }


  constructor(
    storageManager: LocalStoreManager,
    private toastaService: ToastaService,
    private toastaConfig: ToastaConfig,
    private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private appTitleService: AppTitleService,
    private authService: AuthService,
    private translationService: AppTranslationService,
    public configurations: ConfigurationService,
    public userInfoService: LanguageObservableService,
    public router: Router) {

    storageManager.initialiseStorageSyncListener();

    translationService.addLanguages(["en", "fr", "sp", "de", "es", "zh"]);
    translationService.setDefaultLanguage('en');


    this.toastaConfig.theme = 'bootstrap';
    this.toastaConfig.position = 'top-right';
    this.toastaConfig.limit = 100;
    this.toastaConfig.showClose = true;

    this.appTitleService.appName = this.appTitle;
    this.CurrentAccount = new Subject<Account>();
    this.pageAccount = null;
  }


  ngAfterViewInit() {

  }
  

  onLoginModalShown() {
    this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again", MessageSeverity.info);
  }


  onLoginModalHidden() {
    this.alertService.resetStickyMessage();
    this.loginControl.reset();
    this.shouldShowLoginModal = false;

    if (this.authService.isSessionExpired)
      this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again to renew your session", MessageSeverity.warn);
  }


  onLoginModalHide() {
    this.alertService.resetStickyMessage();
  }

  languageChange() {
     
    this.userInfoService.setDefaultLanguage(this.configurations.language);
  }


  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn;
    if (!this.isUserLoggedIn)
      this.configurations.import(null);
    this.userInfoService.setDefaultLanguage("en");

    // 1 sec to ensure all the effort to get the css animation working is appreciated :|, Preboot screen is removed .5 sec later
    setTimeout(() => this.isAppLoaded = true, 1000);
    setTimeout(() => this.removePrebootScreen = true, 1500);

    setTimeout(() => {
      if (this.isUserLoggedIn) {
        this.alertService.resetStickyMessage();
      }
    }, 2000);


    this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
    this.alertService.getMessageEvent().subscribe(message => this.showToast(message, false));
    this.alertService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));

    this.authService.reLoginDelegate = () => this.shouldShowLoginModal = true;

    this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;

      setTimeout(() => {
        if (this.isUserLoggedIn) {
          this.initNotificationsLoading();
        }
        else {
          var message = "";
          this.translationService.getTranslationAsync("app.SessionEnd").subscribe((s) => message = s);
          this.alertService.showMessage(message, "", MessageSeverity.default);
          this.unsubscribeNotifications();

        }
      }, 500);
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        let url = (<NavigationStart>event).url;

        if (url !== url.toLowerCase()) {
          this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
        }
      }
    });
  }


  ngOnDestroy() {
    this.unsubscribeNotifications();
  }


  private unsubscribeNotifications() {
    if (this.notificationsLoadingSubscription)
      this.notificationsLoadingSubscription.unsubscribe();

    if (this.accountSubcription)
      this.accountSubcription.unsubscribe();
  }



  initNotificationsLoading() {

    this.notificationsLoadingSubscription = this.notificationService.getNewNotificationsPeriodically()
      .subscribe(notifications => {
        this.dataLoadingConsecutiveFailurs = 0;
        this.newNotificationCount = notifications.filter(n => !n.isRead).length;
      },
        error => {
          this.alertService.logError(error);

          if (this.dataLoadingConsecutiveFailurs++ < 20)
            setTimeout(() => this.initNotificationsLoading(), 5000);
          else
            this.alertService.showStickyMessage("Load Error", "Loading new notifications from the server failed!", MessageSeverity.error);
      });

    this.accountSubcription = this.accountService.getAccount().subscribe(
      account => {
        if (account) {
          this.pageAccount = account
        }
      });

    this.accountSubcription = this.accountService.getAccount().subscribe(
      account => {
        if (account) {
          this.CurrentAccount.next(account)      
          this.router.navigateByUrl('/Landing');
        }
      });


    
    
  }
  
  markNotificationsAsRead() {

    let recentNotifications = this.notificationService.recentNotifications;

    if (recentNotifications.length) {
      this.notificationService.readUnreadNotification(recentNotifications.map(n => n.id), true)
        .subscribe(response => {
          for (let n of recentNotifications) {
            n.isRead = true;
          }

          this.newNotificationCount = recentNotifications.filter(n => !n.isRead).length;
        },
          error => {
            this.alertService.logError(error);
            this.alertService.showMessage("Notification Error", "Marking read notifications failed", MessageSeverity.error);

          });
    }
  }



  showDialog(dialog: AlertDialog) {

    alertify.set({
      labels: {
        ok: dialog.okLabel || "OK",
        cancel: dialog.cancelLabel || "Cancel"
      }
    });

    switch (dialog.type) {
      case DialogType.alert:
        alertify.alert(dialog.message);

        break
      case DialogType.confirm:
        alertify
          .confirm(dialog.message, (e) => {
            if (e) {
              dialog.okCallback();
            }
            else {
              if (dialog.cancelCallback)
                dialog.cancelCallback();
            }
          });

        break;
      case DialogType.prompt:
        alertify
          .prompt(dialog.message, (e, val) => {
            if (e) {
              dialog.okCallback(val);
            }
            else {
              if (dialog.cancelCallback)
                dialog.cancelCallback();
            }
          }, dialog.defaultValue);

        break;
    }
  }

  showToast(message: AlertMessage, isSticky: boolean) {

    if (message == null) {
      for (let id of this.stickyToasties.slice(0)) {
        this.toastaService.clear(id);
      }

      return;
    }

    let toastOptions: ToastOptions = {
      title: message.summary,
      msg: message.detail,
      timeout: isSticky ? 0 : 4000
    };


    if (isSticky) {
      toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

      toastOptions.onRemove = (toast: ToastData) => {
        let index = this.stickyToasties.indexOf(toast.id, 0);

        if (index > -1) {
          this.stickyToasties.splice(index, 1);
        }

        toast.onAdd = null;
        toast.onRemove = null;
      };
    }


    switch (message.severity) {
      case MessageSeverity.default:   this.toastaService.default(toastOptions); break;
      case MessageSeverity.info:      this.toastaService.info(toastOptions); break;
      case MessageSeverity.success:   this.toastaService.success(toastOptions); break;
      case MessageSeverity.error:     this.toastaService.error(toastOptions); break;
      case MessageSeverity.warn:      this.toastaService.warning(toastOptions); break;
      case MessageSeverity.wait:      this.toastaService.wait(toastOptions); break;
    }
  }





  logout() {
    this.authService.logout();
    this.authService.redirectLogoutUser();
  }


  getYear() {
    return new Date().getUTCFullYear();
  }


  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }


  get fullName(): string {
    return this.authService.currentUser ? this.authService.currentUser.lastName : "";
  }



  get canViewCustomers() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewCustomersPermission
  }

  get canViewProducts() {
    return this.accountService.userHasPermission(Permission.viewUsersPermission); //eg. viewProductsPermission
  }

  get canViewOrders() {
    return true; //eg. viewOrdersPermission
  }


  togglePopover(e) {
    this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
    return this.isAutoEnrollPopoverVisible;
  }

  
}
