import { Address } from "./address.model";

export class PaymentProfile {

  
  constructor(id?: string, paymentType?: string, paymentBillToName?: string,
    name?: string, address?: Address, 
    cardCardType?: string, cardNumber?: string, cardExpirationMonth?: string, cardExpirationYear?: string, cardCCV?: string, achAccountType?: string, achAccountNumber?: string, achRoutingNumber?: string,
    currentAutoPayMethod?: boolean, bank?: string, currency?: string) {

    this.id = id;

    this.paymentType = paymentType || '';
    this.paymentBillToName = paymentBillToName || '';
    this.bank = bank || '';
    this.currency = currency || '';

    this.name = name || '';
    this.address = address || new Address();
    
    this.cardType = cardCardType || '';
    this.cardNumber = cardNumber || '';
    this.cardExpirationMonth = cardExpirationMonth || '';
    this.cardExpirationYear = cardExpirationYear || '';
    this.cardCCV = cardCCV || '';

    this.achAccountType = achAccountType || '';
    this.achAccountNumber = achAccountNumber || '';
    this.achRoutingNumber = achRoutingNumber || '';

    this.currentAutoPayMethod = currentAutoPayMethod || false;

    this.captcha = false;
  }



  public id: string;
  public paymentType: string;
  public paymentBillToName: string;
  public bank: string;
  public currency: string;

  public name: string;
  public address: Address;
  
  // credit card
  public cardType: string;
  public cardNumber: string;
  public cardExpirationMonth: string;
  public cardExpirationYear: string;
  public cardCCV: string;

  // ACH
  public achAccountType: string;
  public achAccountNumber: string;
  public achRoutingNumber: string;

  public isDefault: boolean;
  public currentAutoPayMethod: boolean;

  public captcha: boolean;
}
