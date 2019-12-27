import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { isNumber } from 'util';
import { Router, Event } from '@angular/router';
import { PdfResponse } from "../../models/pdf-response.model";
import { AppTranslationService } from '../../services/app-translation.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [fadeInOut]
})
export class LandingComponent implements OnInit {

  isLoading: boolean;

  invoiceCurrency: string = 'USD';
  totalBalanceDue: number = 0;
  isBalanceDue: boolean = false;
  canPayOnSite: boolean = true;

  selectedPaymentAmount: number;

  radioButtonSelected: number = 0;
  radioButtonNotSelected: number = 1;
  selectedRows: number[] = new Array();

  constructor(private translationService: AppTranslationService,public configurations: ConfigurationService, private invoiceService: InvoiceService, private accountService: AccountService, private routerService: Router) {

  }

  ngOnInit() {
  
    this.getOpenInvoices();

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


  setSelectedvalue(index: number, balance: number) {
    if (this.selectedRows != null && this.selectedRows.length >= index) {
      if (this.selectedRows[index] == this.radioButtonNotSelected) {
        this.selectedRows[index] = this.radioButtonSelected;
        this.selectedPaymentAmount += balance;
        this.invoiceService.getUserInvoices()[index].userPaymentAmount = balance;
        return;
      }
      this.selectedRows[index] = this.radioButtonNotSelected;
      if (this.selectedPaymentAmount > 0) {
        this.selectedPaymentAmount -= balance;
      }
      this.invoiceService.getUserInvoices()[index].userPaymentAmount = 0;
    }
  }

  paynow() {

    this.routerService.navigate(['secure/payment/paynow']);
  }

  getSelectedValue(index: number) {
    if (this.selectedRows != null && this.selectedRows.length >= index) {
      if (this.selectedRows[index] == this.radioButtonSelected) { return true; }
    }
    return false;
  }

  getOpenInvoices() {

    this.selectedPaymentAmount = 0;


    // keep invoice list until user logs off. Caching in the service
    if (this.invoiceService.getUserInvoices() != null && this.invoiceService.getUserInvoices().length > 0) {

      this.invoiceCurrency = this.invoiceService.getUserInvoices()[0].currency;

      for (let i = 0; i < this.invoiceService.getUserInvoices().length; i++) {
        if (isNumber(this.invoiceService.getUserInvoices()[i].totalAmountPaid) && isNumber(this.invoiceService.getUserInvoices()[i].totalAmount)) {
          this.totalBalanceDue += (this.invoiceService.getUserInvoices()[i].balance);
        }
        if (this.invoiceService.getUserInvoices()[i].userPaymentAmount > 0) {
          this.selectedPaymentAmount += this.invoiceService.getUserInvoices()[i].userPaymentAmount;

          if (!this.restrictPaymentTerms(this.invoiceService.getUserInvoices()[i])) {
            this.selectedRows.push(this.radioButtonSelected);
          } else {
            this.selectedRows.push(this.radioButtonNotSelected);
          }

        } else {
          this.selectedRows.push(this.radioButtonNotSelected);
        }

        this.isBalanceDue = (this.totalBalanceDue > 0);

      }
      return;
    }



    this.isLoading = true;

    this.invoiceService.getOpenInvoices()
      .subscribe(
        request => {
          setTimeout(() => {

            this.isLoading = false;
            this.invoiceService.setUserInvoices(request);

            let tempSelectedPaymentAmount: number = 0.0;

            if (this.invoiceService.getUserInvoices() != null && this.invoiceService.getUserInvoices().length > 0) {

              this.invoiceCurrency = this.invoiceService.getUserInvoices()[0].currency;

              for (let i = 0; i < this.invoiceService.getUserInvoices().length; i++) {
                if (isNumber(this.invoiceService.getUserInvoices()[i].totalAmountPaid) && isNumber(this.invoiceService.getUserInvoices()[i].totalAmount)) {
                  this.totalBalanceDue += (this.invoiceService.getUserInvoices()[i].balance);
                 
                  if (!this.restrictPaymentTerms(this.invoiceService.getUserInvoices()[i])) {
                    tempSelectedPaymentAmount += (this.invoiceService.getUserInvoices()[i].balance);
                    this.invoiceService.getUserInvoices()[i].userPaymentAmount = this.invoiceService.getUserInvoices()[i].balance;
                  } else {
                    this.invoiceService.getUserInvoices()[i].userPaymentAmount = 0;
                  }

                }
                //this.selectedRows.push(this.radioButtonSelected);

                if (!this.restrictPaymentTerms(this.invoiceService.getUserInvoices()[i])) {
                  this.selectedRows.push(this.radioButtonSelected);
                } else {
                  this.selectedRows.push(this.radioButtonNotSelected);
                }

              }

              this.isBalanceDue = (this.totalBalanceDue > 0);
              this.selectedPaymentAmount = tempSelectedPaymentAmount;


            }


          }, 500);
        },
        error => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
  }


  getInvoices() {
    return this.invoiceService.getUserInvoices()
  }

  getCustomerCurrency() {
    return this.invoiceCurrency;
  }

  getTotalDueF() {
    return this.totalBalanceDue.toFixed(2);
  }

  getInvoicePdf(invoiceNumber: string) {
    this.invoiceService.getInvoicePDF(invoiceNumber).subscribe(
      response => {
        setTimeout(() => {
          window.open('/api/invoice/download?id=' + response.id, 'target="_blank"','',false);
        }, 500);
      });
  }


  restrictPaymentTerms(invoice: Invoice) {
    // Do not allow Customers with a Payment Term of: DUE1st  or NET30CC to pay invoices in Account Center
    var paymentTerm = invoice.paymentTerms;
    //Due on 1st ,Net 30 CC
    if (paymentTerm === "Due on 1st" || paymentTerm === "Net 30 CC") {
      return true;
    }
    return false;
  }

  getInvoiceStatus(invoice: Invoice) {
    var dueDate = new Date(invoice.dateDue);
    var currentDate = new Date(Date.now()) ;

    
    
    if (dueDate < currentDate) {
      return false; //"PAST DUE"
    }
    return true //"DUE NOW"

    //if (invoice.status.indexOf('Overd') > 0) { return 'OVERDUE'; }
    //if (invoice.status.indexOf('Due') >0) { return 'DUENOW'; }
    //if (invoice.status == "PaidInPart") { return 'Partially Paid'; }
    //if (invoice.status == "PaidInFull") { return 'Paid In Full'; }
    //return invoice.status;
  }

  getInvoiceAmountF(invoice: Invoice) {
    if (isNaN(invoice.totalAmount)) {
      return (0).toFixed(2);
    }
    return invoice.totalAmount.toFixed(2);
  }

  getBalanceDueF(invoice: Invoice) {
    if (isNaN(invoice.balance)) {
      return (0).toFixed(2);
    }
    return (invoice.balance).toFixed(2);
  }

  getSelectedPaymentAmountF() {
    if (isNaN(this.selectedPaymentAmount)) {
      return (0).toFixed(2);
    }
    return (this.selectedPaymentAmount).toFixed(2);
  }

  getFormatedDate(d: string) {
    if (d == null) { return null; }
    var dt = new Date(d);
    var formattedDate = formatDate(dt, "dd-MMM-yyyy", "en-US");
    // return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear()
    return formattedDate;
  }

}
