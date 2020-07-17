import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserForgotPassword } from '../../models/user-forgot-password.model';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilities } from '../../services/utilities';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  formModel: UserForgotPassword;
  isLoading = false;
  formResetToggle = true;

  errors: string[];

  constructor(
    private router: Router,
    private location: Location,
    private accountService: AccountService) {
  }

  ngOnInit() {
    this.formModel = new UserForgotPassword();
    this.formModel.userName = '';

    this.errors = [];
  }

  formSubmit() {
    this.isLoading = true;

    this.accountService.forgotPassword(this.formModel.userName)
      .subscribe(
        data => this.handleSubmitSuccess(),
        err => this.handleSubmitError(err)
      );
  }

  cancel() {
    this.router.navigate(['/']);
  }


  private handleSubmitSuccess() {
    this.isLoading = false;
    this.router.navigate(['/forgot/password/confirmation']);
  }

  private handleSubmitError(err: HttpErrorResponse) {
    this.isLoading = false;
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
  }
}
