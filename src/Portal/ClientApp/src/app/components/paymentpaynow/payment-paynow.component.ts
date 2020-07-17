import { Component, OnInit, Input } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from "../../services/invoice.service";
import { PaymentMethod } from '../../models/payment-method.model';
import { PaymentService } from '../../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Utilities } from '../../services/utilities';
import { Router, Event } from '@angular/router';
import { PaymentResult } from '../../models/payment-result-model';

@Component({
  selector: 'payment-paynow',
  templateUrl: './payment-paynow.component.html',
  styleUrls: ['./payment-paynow.component.css'],
  animations: [fadeInOut]
})

export class PaymentPaynowComponent implements OnInit {

  isLoading: boolean;
  formResetToggle: boolean = true;
  isAutoEnrollPopoverVisible: boolean;
  selectedPaymentAmount: number;
  selectedPaymentMethod: string;
  invoiceCurrency: string;
  invoices: Invoice[] = [];
  invoicesToPay: Invoice[] = [];
  paymentMethods: PaymentMethod[] = [];
    errors: string[] = [];
  paymentResponse: PaymentResult;
  selectedRows: number[] = new Array();
  totalBalanceDue: number = 0;
  isBalanceDue: boolean = false;
  isTermsReviewed: boolean = false;
  isTermsVisible: boolean = false;

  radioButtonSelected: number = 0;
  radioButtonNotSelected: number = 1;
  test: string = "testing";

  constructor(public location: Location,public configurations: ConfigurationService, private routerService: Router, private invoiceService: InvoiceService, private paymentService: PaymentService) {
  }

  ngOnInit() {
    
    this.getInvoicesToPay();
    this.getPaymentMethods();
    
    this.selectedPaymentAmount = this.invoiceService.getInvoicesPaymentTotal();
    //this.getUserInvoices();

  }


  getUserInvoices() {



    this.selectedPaymentAmount = 0;

    this.invoiceService
      .getOpenInvoices()
      .subscribe(
        request => {
          setTimeout(() => {
            this.isLoading = false;

            let invoices = request;
            if (invoices !== null)
              invoices.forEach(invoice => {
                if (invoice !== null) {

                  this.invoiceCurrency = (invoice.currency) ? invoice.currency : (invoice.balanceCurrency) ? invoice.balanceCurrency : 'USD';
                  this.selectedPaymentAmount += invoice.balance;

                  if (invoice.balance > 0)
                    this.invoices.push(invoice);
                }
              });
          }, 500);
        },
        error => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
      });
    
    
    
  }
  getPaymentMethods() {

    

    this.isLoading = true;

    this.paymentService.getPaymentMethods()
      .subscribe(
        request => {
          setTimeout(() => {
            this.isLoading = false;
            this.paymentMethods = request;

            let method = this.paymentMethods.find(x => x.currentAutoPayMethod);
            if (method)
              this.selectedPaymentMethod = method.id;

          }, 500);
        },
        error => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
  }
 

  setPaymentMethod(id: string) {
    this.selectedPaymentMethod = id;
  }

  private handleSubmitSuccess(res: PaymentResult) {
    this.errors = [];
    this.isLoading = false;

    this.paymentResponse = res;



    this.isTermsReviewed = false;
    this.isTermsVisible = false;

    if (this.invoiceService.getOpenInvoicesTotal() - this.selectedPaymentAmount <= 0) {
      alert("Payment Successful. A payment confirmation email has been sent to you. Your account is now eligible for AutoPay");
      this.routerService.navigate(['/secure/payment/autopay']);
    }
    else {
      alert("Payment Successful. A payment confirmation email has been sent to you.");
      this.routerService.navigate(['/landing']);
    }

    this.invoiceService.userInvoices = [];
    this.invoiceService.invoicesToPay = [];

  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);

    alert("Declined. Please contact us. We will gladly assist you with your payment.");

    this.errors = serverError;
    this.isLoading = false;

    this.isTermsReviewed = false;
    this.isTermsVisible = false;

    this.routerService.navigate(['/landing']);
  }

  get canPayNow(): boolean {
    if (this.selectedPaymentMethod && this.selectedPaymentMethod.length > 0)
      return true;

    return false;
  }
  paynow() {
    if (!this.canPayNow) {
      alert("Select a Payment Method");
      return false;
    }

    if (!this.isTermsReviewed) {
      this.isTermsReviewed = true;
      this.isTermsVisible = true;
      return;
    }

    this.isLoading = true;

    const invoices = this.invoicesToPay.map(x => x.invoiceNumber);
    const amount = this.invoiceService.getInvoicesPaymentTotal();

    this.paymentService.submitPayment(this.selectedPaymentMethod, invoices, amount)
      .subscribe(
        data => this.handleSubmitSuccess(data),
        err => this.handleSubmitError(err));

  }

  getInvoices(): Invoice[] {
    //return this.invoices;
    return this.invoiceService.getUserInvoices();
  }

  getInvoicesToPay() {

    //alert(caller);
    this.invoicesToPay = this.invoiceService.getInvoicesToPay();
  }

  togglePopover(e) {
    this.isAutoEnrollPopoverVisible = !this.isAutoEnrollPopoverVisible;
    return this.isAutoEnrollPopoverVisible;
  }

  formatAmount(amount: number) {
    if (isNaN(amount)) {
      return (0).toFixed(2);
    }
    return (amount).toFixed(2);
  }

  formatDate(d: string) {
    if (d == null) { return null; }
    var dt = new Date(d);
    return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
  }

  cancel() {
    this.invoiceService.userInvoices = [];
    this.invoiceService.invoicesToPay = [];

    this.location.back();
  }
  
}
