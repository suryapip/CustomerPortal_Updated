export class SFContact {
  public id: number;
  public accountNumber: string;
  public name: string;
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

  // A contact's roles are stored as individual boolean fields in the SFContacts table, not in a separate association table.
  // The SFContactRole object and roles [] array are coded on the UI side for display purposes.
  public roles(): string[] {
    var roles: string[];
    if (this.mainContact) roles.push('Main');
    if (this.billingContact) roles.push('Billing');
    if (this.shippingContact) roles.push('Shipping');
    if (this.serviceContact) roles.push('Service');
    if (this.propertyContact) roles.push('Property');
    if (this.installationContact) roles.push('Installation');
    if (this.marketingContact) roles.push('Marketing');
    return roles;
  }

}
