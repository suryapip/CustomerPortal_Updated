export class SFAccountSettings {
  public id: number;
  // Note: The AccountCaseSafeId column contains the SalesForce unique identifier for the Account record, 
  //   and is only used by Richa's sync process; we don't need to read or write it here in the app.
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
}
