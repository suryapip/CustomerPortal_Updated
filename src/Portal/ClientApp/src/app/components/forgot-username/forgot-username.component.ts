import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserForgotUserName } from '../../models/user-forgot-username.model';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.css']
})
export class ForgotUserNameComponent implements OnInit {

  formModel: UserForgotUserName;
  isEmailPopoverVisible: boolean;
  isAcctNoPopoverVisible: boolean;
  isLoading: boolean = false;


  constructor(
    private routerService: Router,
    private location: Location,
    private accountService: AccountService)
  {

    this.formModel = new UserForgotUserName();
    

    this.formModel.accountNumber = '';
    this.formModel.emailAddress = '';

  }

  ngOnInit() {
  }

  formSubmit() {
    this.isLoading = true;
    console.log(this.formModel);

    this.accountService.forgotUserName(this.formModel).subscribe(data => this.handleSubmitSuccess(),
      err => this.handleSubmitError()
    );
  }

  cancel() {
    this.routerService.navigate(['/']);
  }


  private handleSubmitSuccess() {
    this.isLoading = false;

    this.routerService.navigate(['/forgot/username/confirmation']);

  }

  private handleSubmitError() {
    this.isLoading = false;

    this.routerService.navigate(['/forgot/username/confirmation']);

  }

  toggleAcctNoPopover(e) {
    this.isAcctNoPopoverVisible = !this.isAcctNoPopoverVisible;
    return this.isAcctNoPopoverVisible;
  }

  toggleEmailPopover(e) {
    this.isEmailPopoverVisible = !this.isEmailPopoverVisible;
    return this.isEmailPopoverVisible;
  }


}
