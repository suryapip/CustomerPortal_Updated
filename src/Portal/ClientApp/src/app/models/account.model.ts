
import { Address } from './address.model';

export class Account {

  number: string;
  pin: string;
  name: string;
  email: string;
  phoneNumber: string;
  currency: string;
  //displayName: string;
  //id: string;
  //rpDisplayName: string;

  address: Address = new Address();
  
}
