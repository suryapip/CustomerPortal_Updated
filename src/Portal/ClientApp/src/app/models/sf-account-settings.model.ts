import { Account } from './account.model';
import { Address } from './address.model';
import { SFContact } from './sf-contact.model';

export class SFAccountSettings {
  public id: number;
  public account: Account;

  //public billingAddress: Address = new Address();
  //public shippingAddress: Address = new Address();
  public accountNumber: string;
  public billingLine1: string;
  public billingLine2: string;
  public billingLine3: string;
  public billingMunicipality: string;
  public billingStateOrProvince: string;
  public billingPostalCode: string;
  public billingCountry: string;
  public shippingLine1: string;
  public shippingLine2: string;
  public shippingLine3: string;
  public shippingMunicipality: string;
  public shippingStateOrProvince: string;
  public shippingPostalCode: string;
  public shippingCountry: string;

  public contacts: SFContact[];
}
