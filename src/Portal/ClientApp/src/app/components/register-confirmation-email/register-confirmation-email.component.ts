import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilities } from '../../services/utilities';
import { fadeInOut } from '../../services/animations';

@Component({
  selector: 'register-confirm-email',
  templateUrl: './register-confirmation-email.component.html',
  styleUrls: ['./register-confirmation-email.component.css']
})
export class RegisterConfirmationEmailComponent implements OnInit {
    errors: any[];
    isLoading: boolean;
    confirmed: boolean;
    userId: string;
    code: string;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    let userId = this.route.snapshot.paramMap.get('id');
    let code = this.route.snapshot.paramMap.get('code');

    this.errors = [];
    this.confirmed = false;
    this.isLoading = false;
    this.userId = userId;
    this.code = code;


    this.accountService.confirmEmail(userId, code)
      .subscribe(
        data => this.handleSubmitSuccess(data),
        error => this.handleSubmitError(error));
 
  }

  private handleSubmitSuccess(res: boolean) {
    this.errors = [];
    this.isLoading = false;
    this.confirmed = res;
  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
    this.isLoading = false;
  }
}
