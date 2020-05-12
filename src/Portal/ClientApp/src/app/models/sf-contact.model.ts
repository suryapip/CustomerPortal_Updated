import { SFRole } from './sf-role.model';

export class SFContact {
  public id: number;
  public name: string;
  public email: string;
  public phoneNumber: string;
  public marketingOptOut: boolean;
  public active: boolean;
  
  public roles: SFRole[];
}
