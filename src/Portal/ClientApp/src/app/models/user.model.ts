export class User {
  // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
  constructor(id?: string, userName?: string, firstName?: string, lastName?: string, email?: string, phoneNumber?: string, roles?: string[], termsAccepted?: boolean,
              question01?: number, answer01?: string, question02?: number, answer02?: string ) {

    this.id = id;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.roles = roles;
    this.termsAccepted = termsAccepted;

    this.question01 = question01;
    this.answer01 = answer01;
    
    this.question02 = question02;
    this.answer02 = answer02;
  }

  public id: string = '';
  public userName: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public phoneNumber: string = '';
  public accountNumber: string = '';
  public isEnabled: boolean;
  public isLockedOut: boolean;
  public roles: string[];
  public termsAccepted: boolean;
  public question01: number = 0;
  public answer01: string = '';
  public question02: number = 0;
  public answer02: string = '';


  get friendlyName(): string {
    let name = this.lastName || this.userName;
    return name;
  }

}
