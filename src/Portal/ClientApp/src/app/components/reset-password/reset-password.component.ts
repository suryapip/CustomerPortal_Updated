import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilities } from '../../services/utilities';
import { UserEdit } from '../../models/user-edit.model';
import { fadeInOut } from '../../services/animations';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  errors: any[] = [];
  isLoading = false;
  isConfirmed = false;

  model: {
    userName: string,
    newPassword: string,
    confirmPassword: string
  };

    userId: string;
    code: string;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location)
  {
  }

  ngOnInit() {
    let userId = this.route.snapshot.paramMap.get('id');
    let code = this.route.snapshot.paramMap.get('code');

    this.model = {
      userName: '',
      newPassword: '',
      confirmPassword: ''
    };

    this.userId = userId;
    this.code = code;
  }

  cancel() {
    this.router.navigate(["/"]);
  }

  resetPassword() {
    this.isLoading = true;

    this.accountService.confirmForgotPassword(this.code, this.model.userName, this.model.newPassword)
      .subscribe(
        data => this.handleSubmitSuccess(data),
        error => this.handleSubmitError(error));
  }

  private handleSubmitSuccess(res: boolean) {
    this.errors = [];
    this.isLoading = false;

    this.isConfirmed = true;
  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
    this.isConfirmed = false;
    this.isLoading = false;
  }

}
