import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { PaymentServiceEndpoint } from './payment-service-endpoint.service';
import { AuthService } from './auth.service';
import { PaymentMethod } from '../models/payment-method.model';
import { PaymentProfile } from '../models/payment-profile.model';
import { Invoice } from '../models/invoice.model';
import { PaymentResult } from '../models/payment-result-model';


@Injectable()
export class PaymentService {
  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
                              private paymentServiceEndpoint: PaymentServiceEndpoint) {
  }
  getPaymentMethod(id: string) {
    return this.paymentServiceEndpoint.getPaymentEndpoint<PaymentProfile>(id);
  }

  getPaymentMethods() {
    return this.paymentServiceEndpoint.getPaymentsEndpoint<PaymentMethod[]>();
  }
  savePaymentMethod(paymentMethod: PaymentMethod) {
    return this.paymentServiceEndpoint.savePaymentMethod<PaymentMethod>(paymentMethod);
  }
  savePaymentProfile(paymentProfile: PaymentProfile) {
    return this.paymentServiceEndpoint.savePaymentProfile<PaymentProfile>(paymentProfile);
  }
  deletePaymentProfile(id: string) {
    return this.paymentServiceEndpoint.deletePaymentProfile<boolean>(id);
  }
  submitPayment(paymentMethodId: string, invoiceNumbers: string[], paymentAmount: number) {
    return this.paymentServiceEndpoint.submitPayment<PaymentResult>(paymentMethodId, invoiceNumbers, paymentAmount);
  }
}
