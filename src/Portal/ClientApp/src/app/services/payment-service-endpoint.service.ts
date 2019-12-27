import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { pipe } from '@angular/core/src/render3/pipe';
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentProfile } from '../models/payment-profile.model';


@Injectable()
export class PaymentServiceEndpoint extends EndpointFactory {
  private readonly baseUrlPayment: string = "/api/payment";
  private readonly _autopayUrl: string = "/api/payment/auto";

  get getPaymentUrl() { return this.configurations.baseUrl + this.baseUrlPayment; }
  get autopayUrl() { return this.configurations.baseUrl + this._autopayUrl; }

  constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
    super(http, configurations, injector);
  }


  getPaymentEndpoint<T>(paymentMethodId: string): Observable<T> {
    let endpointUrl = `${this.getPaymentUrl}/${paymentMethodId}`;

    return this.http
      .get(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
  getPaymentsEndpoint<T>(): Observable<T> {
    let endpointUrl = `${this.getPaymentUrl}/list`;

    return this.http
      .get(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
  savePaymentMethod<T>(paymentMethod: PaymentMethod): Observable<T> {
 
    return this.http
      .put<T>(this.autopayUrl, JSON.stringify(paymentMethod), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
  savePaymentProfile<T>(paymentProfile: PaymentProfile): Observable<T> {
    return this.http
      .put<T>(this.getPaymentUrl, JSON.stringify(paymentProfile), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
  deletePaymentProfile<T>(paymentMethodId: string): Observable<T> {
    let endpointUrl = `${this.getPaymentUrl}/${paymentMethodId}`;

    return this.http
      .delete<T>(endpointUrl, this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
  submitPayment<T>(paymentMethodId: string, invoiceNumbers: string[], PaymentAmount: number): Observable<T> {
    let endpointUrl = `${this.getPaymentUrl}/pay/${paymentMethodId}`;

    return this.http
      .post<T>(endpointUrl, JSON.stringify({ invoices: invoiceNumbers, PaymentAmount: PaymentAmount }), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error)));
  }
}
