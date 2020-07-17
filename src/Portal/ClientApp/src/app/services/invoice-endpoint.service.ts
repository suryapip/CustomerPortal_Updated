import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { pipe } from '@angular/core/src/render3/pipe';
import { PdfResponse } from '../models/pdf-response.model';

@Injectable()
export class InvoiceEndpoint extends EndpointFactory {

  private readonly _openInvoicesUrl: string = "/api/invoice/open";
  private readonly _closedInvoicesUrl: string = "/api/invoice/closed";
  private readonly _invoicePdfUrl: string = "/api/invoice/pdf";
 
  get openInvoicesUrl() { return this.configurations.baseUrl + this._openInvoicesUrl; }
  get closedInvoicesUrl() { return this.configurations.baseUrl + this._closedInvoicesUrl; } 
  get pdfUrl() { return this.configurations.baseUrl + this._invoicePdfUrl; }

  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    super(http, configurations, injector);
  }

  // get open invoices
  getOpenInvoicesEndpoint<T>(): Observable<T> {
    //debugger;
    return this.http.post(this.openInvoicesUrl, null, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getOpenInvoicesEndpoint());
      }));
  }


  // get closed invoices
  getClosedInvoicesEndpoint<T>(): Observable<T> {
    return this.http.post(this.closedInvoicesUrl, null, this.getRequestHeaders()).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getClosedInvoicesEndpoint());
      }));
  }


  getInvoicePDF(invoiceNumber: string): Observable<PdfResponse> {
    //debugger;
    let pdflink = this.pdfUrl + "?InvoiceNumber=" + invoiceNumber;
    return this.http.get(pdflink, this.getRequestHeaders()).pipe<PdfResponse>();
    }

}
