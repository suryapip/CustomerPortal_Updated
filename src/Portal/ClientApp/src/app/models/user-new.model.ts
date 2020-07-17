import { User } from './user.model';


export class UserNew extends User {

  constructor(newPassword?: string, confirmPassword?: string) {
    super();

    this.newPassword = newPassword || '';
    this.confirmPassword = confirmPassword || '';

  }

  public newPassword: string;
  public confirmPassword: string;
}
