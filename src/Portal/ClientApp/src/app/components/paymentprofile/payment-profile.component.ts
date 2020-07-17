import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { PaymentMethod } from '../../models/payment-method.model';
import { PaymentService } from '../../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilities } from '../../services/utilities';


@Component({
  selector: 'payment-profile',
  templateUrl: './payment-profile.component.html',
  styleUrls: ['./payment-profile.component.css'],
  animations: [fadeInOut]
})
export class PaymentProfileComponent implements OnInit {

  isLoading: boolean;
  isAutoEnrollPopoverVisible: boolean;
  canPayOnSite: boolean = true;
  paymentMethods: PaymentMethod[];
    errors: string[] = [];

    constructor(public configurations: ConfigurationService, private paymentService: PaymentService, private accountService: AccountService) {
  }

  ngOnInit() {
    this.getPaymentMethods();
    this.getSiteAccount();
  }

  getSiteAccount() {
    this.accountService.getAccount().subscribe(account => this.saveSuccessHelper(account), error => this.saveFailedHelper(error));

  }

  saveSuccessHelper(res: Account) {
    if (res.currency != 'USD' && res.currency != 'CAD')
      this.canPayOnSite = false;


  }

  saveFailedHelper(res: Account) {
    this.canPayOnSite = true;
  }

  private handleSubmitSuccess(res: PaymentMethod[]) {
    this.errors = [];
    this.isLoading = false;

    this.paymentMethods = res;
  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
    this.isLoading = false;
  }
 
  getPaymentMethods() {

    this.isLoading = true;

    this.paymentService.getPaymentMethods()
      .subscribe(
        data => this.handleSubmitSuccess(data),
        err => this.handleSubmitError(err));
  }


  togglePopover(e) {
    this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
    return this.isAutoEnrollPopoverVisible;
  }

}
