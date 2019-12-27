import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, NgModuleFactoryLoader } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ConfigurationService } from '../../services/configuration.service';

import { UserLogin } from '../../models/user-login.model';
import { InvoiceService } from '../../services/invoice.service';
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { modelState } from '../../models/ctp.interface';
import { element } from 'protractor';
import { Account } from '../../models/account.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  model: UserLogin;
  @Input() data: UserLogin;
  @Output() submit = new EventEmitter();
  loginSubscription: Subscription;
  loginStatusSubscription: any;
  errors: string[];


  isLoading = false;
  isEdit = false;
  isError = false;
  @Input() isModal = false;

  formResetToggle = true;
  modalClosedCallback: () => void;



  constructor(private authService: AuthService,
    private router: Router,
    private configurationService: ConfigurationService,
    private invoiceService: InvoiceService,
    private accountService: AccountService) {

    this.invoiceService.setUserInvoices(null);

    this.errors = [];
  }


  ngOnInit() {
    this.isEdit = false;
    this.setForm();

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    } else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
        if (this.getShouldRedirect()) {
          this.authService.redirectLoginUser();
        }
      });
    }
  }
  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }

    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }


  private setForm() {
    if (!this.isEdit) {
      this.model = new UserLogin('', '', this.authService.rememberMe);
    } else {
      this.model = new UserLogin(
        this.data.userName,
        this.data.password,
        this.data.rememberMe || this.authService.rememberMe
      );
    }
  }


  reset() {
    this.formResetToggle = false;
    this.errors = [];


    setTimeout(() => {
      this.formResetToggle = true;
    });
  }
  getShouldRedirect() {
    return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }
  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }


  private handleSubmitSuccess(res) {
    const eventObj = {
      isEdit: this.isEdit,
      data: res
    };


    this.errors = [];
    this.isError = false;
    this.isLoading = false;
    this.submit.emit(eventObj);

    //setTimeout(() => {
    //  this.accountService.getAccount().subscribe(
    //    account => {
    //      this.accountService.setCurrentAccount(account);
    //      this.routerService.navigateByUrl('/Landing');
    //    });
    //}, 500);
  }
  private handleSubmitError(err) {
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
    const eventObj = {
      isEdit: this.isEdit,
      error: this.errors
    };


    this.isLoading = false;
    this.isError = true;
    this.submit.emit(eventObj);
  }


  login() {
    this.isLoading = true;
    this.errors = [];

    //if (!this.isEdit) {
    this.loginSubscription = this.authService.login(this.model.userName, this.model.password, this.model.rememberMe)
      .subscribe(
        data => this.handleSubmitSuccess(data),
        err => this.handleSubmitError(err)
      );
  }

  IsSelectedLanguageFrench() {
    if (this.configurationService.language == "fr") {
      return true;
    }
    return false;
  }

}
