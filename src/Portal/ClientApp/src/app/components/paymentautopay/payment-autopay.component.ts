import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { Location } from '@angular/common';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { PaymentMethod } from '../../models/payment-method.model';
import { PaymentService } from '../../services/payment.service';
//import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { HttpErrorResponse } from '@angular/common/http';
import { Utilities } from '../../services/utilities';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'payment-autopay',
  templateUrl: './payment-autopay.component.html',
  styleUrls: ['./payment-autopay.component.css'],
  animations: [fadeInOut]
})
export class PaymentAutopayComponent implements OnInit {

  isAutoEnrollPopoverVisible: boolean;
  isLoading: boolean;
  errors: string[] = [];
  isTermsReviewed: boolean = false;
  isTermsVisible: boolean = false;
  isUnenrolling: boolean = false;
  canPayOnSite: boolean = true;
  isAutoPayActive: boolean = false;
  isEnrolling: boolean = false;

  paymentMethods: PaymentMethod[];
  currentAutoPaymentMethod: PaymentMethod;
  isAutoPayEnabled: boolean;

  constructor(
    public configurations: ConfigurationService,
    private location: Location,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.getPaymentMethods();

    this.invoiceService.getInvoicesToPay();
    this.isAutoPayEnabled = this.invoiceService.getOpenInvoicesTotal() <= 0;

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



  getPaymentMethods() {

    this.isLoading = true;

    this.paymentService.getPaymentMethods()
      .subscribe(
        data => this.handleGetMethodsSuccess(data),
        err => this.handleSubmitError(err));
  }


  changeAutoPay(index: number) {
    if (!this.isAutoPayEnabled)
      return;

    this.paymentMethods.forEach((pm, i) => {
      pm.currentAutoPayMethod = i == index;
    });

    this.isAutoPayActive = true;
    this.isEnrolling = true;
  }


  private handleSubmitSuccess(res: PaymentMethod) {
    this.errors = [];
    this.isLoading = false;
    this.isTermsReviewed = false;
    this.isTermsVisible = false;

    this.getPaymentMethods();

    alert("You have successfully enrolled in Autopay");
    
    //this.location.back();
  }

  private handleAutopaySubmitSuccess(res: PaymentMethod) {

    this.errors = [];
    this.isLoading = false;
    this.isTermsReviewed = false;
    this.isTermsVisible = false;

    this.getPaymentMethods();

    alert("AUTOPAY unenrollment requested - Please allow up to 72 hours to for AUTOPAY unenrollment to take affect. ");



  }



  private handleGetMethodsSuccess(res: PaymentMethod[]) {
    this.errors = [];
    this.isLoading = false;
     
    this.paymentMethods = res;
    this.currentAutoPaymentMethod = res.find(pm => pm.currentAutoPayMethod);
    
    this.isTermsReviewed = false;
    this.isTermsVisible = false;

    if (this.currentAutoPaymentMethod != null) {
      if (this.currentAutoPaymentMethod.isDefault) {
        this.isUnenrolling = true;
      }
      this.isAutoPayActive = true;
      this.isEnrolling = false;
    }

  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
    this.isLoading = false;

    this.isTermsReviewed = false;
    this.isTermsVisible = false;
  }


  saveAutoPay() {
    if (!this.isAutoPayEnabled)
      return;

    if (!this.isTermsReviewed) {
      this.isTermsReviewed = true;
      this.isTermsVisible = true;
      return;
    }

    this.isLoading = true;



    var method = this.paymentMethods.find(pm => pm.currentAutoPayMethod);
    if (method == null) {
      method = this.currentAutoPaymentMethod;
      method.currentAutoPayMethod = false;
    }


    this.paymentService.savePaymentMethod(method).subscribe(
      data => this.handleSubmitSuccess(data),
      error => this.handleSubmitError(error));
  }


  togglePopover(e) {
    this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
    return this.isAutoEnrollPopoverVisible;
  }

  unenrollAutoPay(): void {
    //if (!this.isAutoPayEnabled)
    //  return;

    //this.paymentMethods.forEach(pm => pm.currentAutoPayMethod = false);
    this.currentAutoPaymentMethod.isDefault = true;

    this.paymentService.savePaymentMethod(this.currentAutoPaymentMethod).subscribe(
      data => this.handleAutopaySubmitSuccess(data),
      error => this.handleSubmitError(error));

  }

  cancel() {
    this.isTermsReviewed = false;
    this.isTermsVisible = false;

    this.getPaymentMethods();

    this.invoiceService.getInvoicesToPay();
    this.isAutoPayEnabled = this.invoiceService.getOpenInvoicesTotal() <= 0;

    this.getSiteAccount();
  }

  refresh(): void {
    this.getPaymentMethods();
  }
}
