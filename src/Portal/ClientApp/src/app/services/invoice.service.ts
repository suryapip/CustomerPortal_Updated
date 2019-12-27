import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { InvoiceEndpoint } from './invoice-endpoint.service';
import { AuthService } from './auth.service';
import { Invoice } from '../models/invoice.model';
import { PdfResponse } from '../models/pdf-response.model';

@Injectable()
export class InvoiceService {

  userInvoices: Invoice[];
  invoicesToPay: Invoice[];
  invoicesTotalToPay: number;
  openInvoicesTotal: number;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private invoiceEndpoint: InvoiceEndpoint) {

    this.invoicesToPay = [];
    this.userInvoices = [];
  }


  getOpenInvoices() {
    return this.invoiceEndpoint.getOpenInvoicesEndpoint<Invoice[]>();
  }

  getClosedInvoices() {
    return this.invoiceEndpoint.getClosedInvoicesEndpoint<Invoice[]>();
  }

  setUserInvoices(invoices: Invoice[]) {
    this.userInvoices = invoices;
  }

  getInvoicesToPay(): Invoice[] {

    this.invoicesToPay = [];

    for (let i = 0; i < this.userInvoices.length; i++) {
      if (this.userInvoices[i].userPaymentAmount > 0) {
        this.invoicesToPay.push(this.userInvoices[i]);
      }
    }

    return this.invoicesToPay;
  }

  getOpenInvoicesTotal(): number {

    if (!this.userInvoices) 
      return 0;

    this.openInvoicesTotal = 0;

    for (let i = 0; i < this.userInvoices.length; i++) {
      if (this.userInvoices[i].balance > 0) {
        this.openInvoicesTotal += this.userInvoices[i].balance;
      }
    }


    return this.openInvoicesTotal;
  }

  getInvoicesPaymentTotal(): number {

    if (!this.invoicesToPay)
      return 0;

    this.invoicesTotalToPay = 0;

    for (let i = 0; i < this.invoicesToPay.length; i++) {
      if (this.invoicesToPay[i].userPaymentAmount > 0) {
        this.invoicesTotalToPay += this.invoicesToPay[i].userPaymentAmount;
      }
    }

    return this.invoicesTotalToPay;
  }

  getUserInvoices(): Invoice[] {
    return this.userInvoices;
  }

  getInvoicePDF(invoiceNumber: string): Observable<PdfResponse> {
    return this.invoiceEndpoint.getInvoicePDF(invoiceNumber);
  }
 
}
