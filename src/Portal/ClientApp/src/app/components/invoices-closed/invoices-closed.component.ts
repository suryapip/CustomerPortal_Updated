import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { isNumber } from 'util';
import { Event } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'invoices-closed',
  templateUrl: './invoices-closed.component.html',
  styleUrls: ['./invoices-closed.component.css'],
  animations: [fadeInOut]
})
export class InvoiceClosedComponent implements OnInit {

  isLoading: boolean;
  invoices: Invoice[];
  invoiceCurrency: string = 'USD';
  
  constructor(
    public configurations: ConfigurationService,
    private invoiceService: InvoiceService) {

    this.getClosedInvoices();
  }

  ngOnInit() {
  }

  
  getClosedInvoices() {

    this.isLoading = true;

    this.invoiceService.getClosedInvoices()
      .subscribe(
        request => {
          setTimeout(() => {
            this.isLoading = false;
            this.invoices = request;
          }, 500);
        },
        error => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
  }

  getInvoiceStatus(invoice: Invoice) {
    if (invoice.status == "") { return 'InvoiceHistory..Cancelled'; }
    if (invoice.status == "Due") { return 'InvoiceHistory.Open'; }
    if (invoice.status == "PaidInPart") { return 'InvoiceHistory.PartiallyPaid'; }
    if (invoice.status == "PaidInFull") { return 'InvoiceHistory.PaidInFull'; }
    //return invoice.status;
    return 'Processing';
  }
  
  getInvoiceAmountF(invoice: Invoice) {
    
    if (isNaN(invoice.totalAmountPaid)) {
      return (0).toFixed(2);
    }
    return invoice.totalAmountPaid.toFixed(2);
  }

  getFormatedDate(d: string) {
    if (d == null) { return null; }
    var dt = new Date(d);
    var formattedDate = formatDate(dt, "dd-MMM-yyyy", "en-US");
    // return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear()
    return formattedDate;
  }


  getInvoicePdf(invoiceNumber: string) {
    this.invoiceService.getInvoicePDF(invoiceNumber).subscribe(
      response => {
        setTimeout(() => {
          window.open('/api/invoice/download?id=' + response.id, 'target="_blank"');
        }, 500);
      });
  }

}
