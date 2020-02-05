import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, OnChanges, ViewChild } from "@angular/core";
import { FormsModule, NgForm, NgModel, ValidationErrors, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { forEach } from "@angular/router/src/utils/collection";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription, Observable } from "rxjs";

import { AccountService } from "../../services/account.service";
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';
import { register } from '../../models/register.model';
import { Account } from '../../models/account.model';
import { Address } from '../../models/address.model';
import { SecurityQuestion } from "../../models/security-questions.model";
import { User } from "../../models/user.model";
import { modelState } from "../../models/ctp.interface";
import { element } from "protractor";
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-Keys';
import { AppTranslationService } from "../../services/app-translation.service";
import { LanguageObservableService } from "../../services/language-observable.service";
import { ReCaptcha2Component } from "../../../../GoogleCaptcha/ngx-captcha-lib/src/lib";





@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: register;
  @Input() data: register;
  @Output() submit = new EventEmitter();
  registerSubscription: Subscription;
  isAcctNoPopoverVisible: boolean;
  isPinNoPopoverVisible: boolean;
  isUsernamePopoverVisible: boolean;
  isPasswordPopoverVisible: boolean;
  here: boolean = false;
  errorMessage: string ="";
  private selectedLanguage: string;

  isLoading = false;
  isEdit = false;
  isError = false;
  isAccount = false;
  isUser = false;
  @Input() isModal = false;

  errors: string[];
  formResetToggle = true;

  modalClosedCallback: () => void;

  securityQuestions01: SecurityQuestion[];
  securityQuestions02: SecurityQuestion[];

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  public siteKey: string = '';
  public useGlobalDomain: boolean = false;
  public aFormGroup: FormGroup;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  //public isDev = (['localhost', 'dev30web01.scentair.local', 'dev30web01'].indexOf(document.location.hostname.toLowerCase()) > -1) // mholmes

  constructor(
    private accountService: AccountService,
    private configurations: ConfigurationService,
    private router: Router,
    private location: Location, private localStorage: LocalStoreManager, private translationService: AppTranslationService, public userInfoService: LanguageObservableService) {
    
  }

  ngOnInit() {

     
    // Prod
    this.siteKey = '6LforZoUAAAAAJPt4NAqNpmu5rvY_zsfzNigCAsn';
    // Stage
    //this.siteKey = '6LdSmZgUAAAAAA-RJe4UxWSoYMx9_lrHsah1P8xT';
    // Local
    //this.siteKey = '6LdNz5cUAAAAAIO1jk77YhsJdZspLzqxC4U8kLSH';
    // Dev (mholmes)
    //this.siteKey = '6LfLTNMUAAAAACSnpgaixNUpe0Hqo9wMcJimb1xb';

    this.securityQuestions01 = [];
    this.securityQuestions02 = [];
    this.errors = [];
    this.isEdit = false;
    this.setForm();

    //if (this.getShouldRedirect()) {
    //  this.authService.redirectLoginUser();
    //}
    //else {
    //  this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
    //    if (this.getShouldRedirect()) {
    //      this.authService.redirectLoginUser();
    //    }
    //  });
    //}

    if (this.localStorage.exists(DBkeys.LANGUAGE)) {
      this.selectedLanguage = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
    } else {
      this.selectedLanguage = 'en';
    }
 

    this.accountService.getQuestions(this.selectedLanguage).subscribe(a => a.forEach(x => {
      this.securityQuestions01.push(x);
      this.securityQuestions02.push(x);
    }));

    this.userInfoService.languageStream$.subscribe(lang => {
      if (this.selectedLanguage != lang) {
        this.selectedLanguage = lang;
        this.getQuestions(lang);
      }
    });

  }
  ngOnDestroy() {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

  public getQuestions(language) {
    this.securityQuestions01 = [];
    this.securityQuestions02 = [];
    this.accountService.getQuestions(language).subscribe(a => {
      if (a && a.length > 0) {
        this.securityQuestions01 = a;
        this.securityQuestions02 = a;
      }
    });
  }


  private setForm() {
    if (!this.isEdit) {
      this.model = new register();
    } else {
      this.model = new register(
        this.data.user,
        this.data.account
      );

      this.isAccount = this.model.account &&
                       this.model.account.name &&
                       this.model.account.number &&
                       this.model.account.name.length > 0 &&
                       this.model.account.number.length > 0;
      this.isUser    = this.model.user &&
                       this.model.user.id &&
                       this.model.user.id.length > 0;

      this.isError = this.errors !== null && this.errors.length > 0;
      this.isLoading = false;

      setTimeout(() => {
        const eventObj = {
          isEdit: this.isEdit,
          data: this.model,
          errors: this.errors,
          isAccount: this.isAccount,
        };
        this.submit.emit(eventObj);


        if (this.isAccount && this.isUser)
          this.router.navigate(['/register/confirmation']);

      }, 500);
    }
  }

  
  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }
  offerAlternateHost() {

  }
  reset() {
    this.formResetToggle = false;

    this.errors = [];    
    this.isLoading = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }


  private handleSubmitSuccess(res: register) {
    this.isLoading = false;
    this.data = res;
    this.isEdit = true;
    this.errors = [];

    this.setForm();
  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);
    
    var error = serverError.length > 0 ? serverError[0].includes("already") : false;
    if (error) {
      this.errorMessage = "Register.ErrorMessage1";
      this.here = true;
    }
    else
    {
      this.errorMessage = "Register.ErrorMessage2";
      this.here = false;
    }
    
    this.isLoading = false;
    this.setForm();
    this.captchaReset();
  }


  register() {
    this.isLoading = true;
    

    this.registerSubscription = this.accountService.register(this.model)
      .subscribe(
        data => this.handleSubmitSuccess(data),
        err => this.handleSubmitError(err)
      );
  }

  cancel() {
    this.location.back();
  }

  toggleAcctNoPopover(e) {
    this.isAcctNoPopoverVisible = !this.isAcctNoPopoverVisible;
    return this.isAcctNoPopoverVisible;
  }

  togglePinNoPopover(e) {
    this.isPinNoPopoverVisible = !this.isPinNoPopoverVisible;
    return this.isPinNoPopoverVisible;
  }

  toggleUsernamePopover(e) {
    this.isUsernamePopoverVisible = !this.isUsernamePopoverVisible;
    return this.isUsernamePopoverVisible;
  }

  togglePasswordPopover(e) {
    this.isPasswordPopoverVisible = !this.isPasswordPopoverVisible;
    return this.isPasswordPopoverVisible;
  }

  
  captchaHandleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
     
  }

  captchaReset(): void {
    this.captchaElem.resetCaptcha();
  }

  CaptchaHandleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

  captchaHandleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
  }

  captchaHandleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
  }

}
