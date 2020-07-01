export class SFContact {
  public id: number;
  public accountNumber: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string;
  public mainContact: boolean;
  public billingContact: boolean;
  public shippingContact: boolean;
  public serviceContact: boolean;
  public propertyContact: boolean;
  public installationContact: boolean;
  public marketingContact: boolean;
  public doNotCall: boolean;
  public doNotEmail: boolean;
  public active: boolean;

  // Computed values
  public name: string;
  public roles: string[];

}
