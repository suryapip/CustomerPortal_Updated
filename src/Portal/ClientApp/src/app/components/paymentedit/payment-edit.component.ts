import { Component, OnInit, OnDestroy, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { fadeInOut } from '../../services/animations';
import { ConfigurationService } from '../../services/configuration.service';
import { PaymentService } from "../../services/payment.service";
import { PaymentProfile } from '../../models/payment-profile.model';
import { Location } from '@angular/common';
import { AccountService } from "../../services/account.service";
import { Account } from '../../models/account.model';
import { HttpErrorResponse } from "@angular/common/http";
import { Utilities } from "../../services/utilities";
import { switchMap } from 'rxjs/operators';
//import { element } from "@angular/core/src/render3/instructions";
import { InvoiceService } from "../../services/invoice.service";
import { ReCaptcha2Component } from "../../../../GoogleCaptcha/ngx-captcha-lib/src/lib";
import { FormGroup } from "@angular/forms";
import { LanguageObservableService } from "../../services/language-observable.service";
 




@Component({
  selector: 'payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css'],
  animations: [fadeInOut]
})
export class PaymentEditComponent implements OnInit {

  paymentProfile: PaymentProfile;

  errors: string[] = [];
  isLoading: boolean;
  isEdit: boolean;

  id: string;
  now: Date;
  thisMonth: number;
  thisYear: number;
  isAccount: boolean;
  isAutoPayChecked: boolean;
  isAutoEnabled: boolean;
  isAchAcctNoPopoverVisible: boolean;
  isRoutingNoPopoverVisible: boolean;
  isUS: boolean = true;
  currency: string = "USD";
  public selectedLanguage: string ="en";


  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  public siteKey:string = '';
  public useGlobalDomain: boolean = false;
  public aFormGroup: FormGroup;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;


  constructor(
    public location: Location,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private configurations: ConfigurationService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    public userInfoService: LanguageObservableService) {
  }

  ngOnInit() {


    // Note: Captcha SiteKey appears in 3 locations within the code base:
    //   - Portal\appsettings.json
    //   - Portal\ClientApp\src\app\components\paymentedit\payment-edit.component.ts
    //   - Portal\ClientApp\src\app\components\register\register.component.ts
    //Prod
    //this.siteKey = '6LforZoUAAAAAJPt4NAqNpmu5rvY_zsfzNigCAsn';
    //Stage
    //this.siteKey = '6LdSmZgUAAAAAA-RJe4UxWSoYMx9_lrHsah1P8xT';
    //Local
    //this.siteKey = '6LdNz5cUAAAAAIO1jk77YhsJdZspLzqxC4U8kLSH';
    // Dev (mholmes)
    this.siteKey = '6LfLTNMUAAAAACSnpgaixNUpe0Hqo9wMcJimb1xb';

    this.isAccount = false;
    this.isLoading = false;
    this.isEdit = false;

    this.invoiceService.getInvoicesToPay()
    this.isAutoEnabled = false;

    this.getSiteAccount();



    let autoPay = this.route.snapshot.fragment != null && this.route.snapshot.fragment.toLowerCase() == 'auto';
    this.isAutoPayChecked = autoPay
    let id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    
    this.paymentProfile = new PaymentProfile()
    this.paymentProfile.paymentType = "Credit";
    //this.paymentProfile.currentAutoPayMethod = this.isAutoEnabled && this.isAutoPayChecked;

    this.now = new Date(Date.now());
    this.thisMonth = this.now.getMonth();
    this.thisYear = this.now.getFullYear();

    if (id) {
      this.paymentService.getPaymentMethod(id)
        .subscribe(
          data => this.handleGetSuccess(data),
          err => this.handleSubmitError(err)
      );


    }
    else {
      //this.accountService.getAccount().subscribe(x => {
      //  this.paymentProfile.name = x.name;
      //  this.paymentProfile.address = x.address;
      //});
    }


    this.userInfoService.languageStream$.subscribe(lang => {
      if (this.selectedLanguage != lang) {
        this.selectedLanguage = lang;
      }
    });
     

  }

  getSiteAccount() {
    this.accountService.getAccount().subscribe(account => this.saveSuccessHelper(account), error => this.saveFailedHelper(error));

  }

  saveSuccessHelper(res: Account) {
    if (res.currency != 'USD' && res.currency != 'CAD')
      this.router.navigate(['secure/landing']);
    else
      this.currency = res.currency;
  }

  saveFailedHelper(res: Account) {
    this.router.navigate(['secure/landing']);
  }

  changeCountry(currCode: string) {
    if (currCode == 'US')
      this.isUS = true;
    else
      this.isUS = false;

  }

  changePaymentType(paymentType: string) {
    if (paymentType == 'ECP') {
      this.isAccount = true;
      this.paymentProfile.cardCCV = '';
      this.paymentProfile.cardExpirationMonth = '';
      this.paymentProfile.cardExpirationYear = '';
      this.paymentProfile.cardNumber = '';
      this.paymentProfile.cardType == '';
    }
    else {
      this.isAccount = false;
      this.paymentProfile.achAccountType = '';
      this.paymentProfile.achAccountNumber = '';
      this.paymentProfile.achRoutingNumber = '';
      this.paymentProfile.bank = '';
    }
  }

  private handleGetSuccess(res: PaymentProfile) {
    this.errors = [];
    this.isLoading = false;
    this.isEdit = true;

    this.paymentProfile = res;

    this.changePaymentType(res.paymentType);
    this.changeCountry(res.address.country);
  }
  private handleSubmitSuccess(res: PaymentProfile) {
    this.errors = [];
    this.isLoading = false;

    this.location.back();
  }
  private handleDeleteSuccess(res: boolean) {
    this.errors = [];
    this.isLoading = false;

    this.location.back();
  }
  private handleSubmitError(err: HttpErrorResponse) {
    const serverError = Utilities.getHttpErrors(err);

    this.errors = serverError;
    this.isLoading = false;
    this.captchaReset();
  }


  cancel() {
    this.location.back();
  }

  savePayment() {
    this.isLoading = true;

    this.paymentProfile.currency = this.currency;

    this.paymentService.savePaymentProfile(this.paymentProfile)
      .subscribe(
        data => this.handleSubmitSuccess(data),
        err => this.handleSubmitError(err)
      );
  }
  deletePayment() {
    this.isLoading = true;

    this.paymentService.deletePaymentProfile(this.paymentProfile.id)
      .subscribe(
        data => this.handleDeleteSuccess(data),
        err => this.handleSubmitError(err)
      );

  }
  
  toggleAchAcctNoPopover(e) {
    this.isAchAcctNoPopoverVisible = !this.isAchAcctNoPopoverVisible;
    return this.isAchAcctNoPopoverVisible;
  }

  toggleRoutingNoPopover(e) {
    this.isRoutingNoPopoverVisible = !this.isRoutingNoPopoverVisible;
    return this.isRoutingNoPopoverVisible;
  }


  captchaReset(): void {
    this.captchaElem.resetCaptcha();
  }

  CaptchaHandleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
  }

  captchaHandleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
  }

  captchaHandleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
  }


  //loadScript() {
  //  //var iFrameHead = window.frames["secureFrame"];
  //  //var myscript = document.createElement('script');
  //  //myscript.type = 'text/javascript;';
  //  //myscript.src = "/assets/js/scentair.js";
  //  //iFrameHead.appendChild(myscript);
  //}
}
