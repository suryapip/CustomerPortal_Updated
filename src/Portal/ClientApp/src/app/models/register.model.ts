import { UserNew } from './user-new.model';
import { Account } from './account.model';

export class register {

  constructor(user?: UserNew, account?: Account) {
    this.user = user || new UserNew();
    this.account = account || new Account();
  }

  user: UserNew;
  account: Account;
  captcha: true;
}

