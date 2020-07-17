import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';


@Component({
  selector: 'forgot-username-confirmation',
  templateUrl: './forgot-username-confirmation.component.html',
  styleUrls: ['./forgot-username-confirmation.component.css']
})
export class ForgotUserNameConfirmationComponent implements OnInit {
    id: string;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.id = id;

    //this.accountService.confirmForgotUsername(id)
    //show username
  }

}
