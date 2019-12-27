
export class Address {
  constructor(line1?: string, line2?: string, line3?: string,
    municipality?: string, stateOrProvince?: string, postalCode?: string, country?: string) {

    this.line1 = line1 || '';
    this.line2 = line2 || '';
    this.line3 = line3 || '';
    this.municipality = municipality || '';
    this.stateOrProvince = stateOrProvince || '';
    this.postalCode = postalCode || '';
    this.country = country || '';
  }

  public line1: string;
  public line2: string;
  public line3: string;
  public municipality: string;
  public stateOrProvince: string;
  public postalCode: string;
  public country: string;

}
