import { Company } from './company.model';
import { Address } from './address.model';
import { Account } from './account.model';
import { InvoiceItem } from './invoice-item.model';
import { InvoicePayment } from './invoice-payment.model';

export class Invoice {


  public billingEntity: Company;
  public shippingAddress: Address;
  public shippingNumber: string;
  public shippingMethod: string;
  public shippingResult: string;
  public taxId: string;
  public invoiceNumber: string;
  public customerReferenceNumber: string;
  public customerPurchaseOrderNumber: string;
  public status: string;
  public paymentTerms: string;
  public currency: string;
  public discountAmount: number;
  public subTotalAmount: number;
  public taxRate: number;
  public taxAmount: number;
  public totalAmount: number;
  public totalAmountPaid: number;
  public serviceFrom: string;
  public serviceTo: string;
  public date: string;
  public dateDue: string;
  public comments: string;
  public balance: number;
  public balanceCurrency: string;

  public details: InvoiceItem[];
  public payments: InvoicePayment[];

  public userPaymentAmount: number;


}
