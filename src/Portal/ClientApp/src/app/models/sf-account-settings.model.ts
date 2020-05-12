import { Account } from './account.model';
import { Address } from './address.model';
import { SFContact } from './sf-contact.model';

export class SFAccountSettings {
  public id: number;
  public account: Account;

  public billingAddress: Address = new Address();
  public shippingAddress: Address = new Address();

  public contacts: SFContact[];
}
