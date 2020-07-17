
import { Address } from './address.model';

export class Company {

  public name: string;
  public email: string;
  public phoneNumber: string;
  public faxNumber: string;
  public bank: string;
  public accountNumber: string;
  public routingNumber: string;
  public currency: string;

  public physicalAddress: Address;
  public mailingAddress: Address;
  public billingAddress: Address;
  public shippingAddress: Address;

}
