import { NgModule, ErrorHandler } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastaModule } from 'ngx-toasta';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PopoverModule } from "ngx-bootstrap/popover";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ChartsModule } from 'ng2-charts';
import { NgxCaptchaModule } from '../../GoogleCaptcha/ngx-captcha-lib/src/lib';

import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { PaymentService } from './services/payment.service';
import { PaymentServiceEndpoint } from './services/payment-service-endpoint.service';
import { InvoiceService } from './services/invoice.service';
import { InvoiceEndpoint } from './services/invoice-endpoint.service';

import { EqualValidator } from './directives/equal-validator.directive';
import { NotEqualValidator } from './directives/notequal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';
import { BootstrapSelectDirective } from './directives/bootstrap-select.directive';
import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';
import { GroupByPipe } from './pipes/group-by.pipe';

import { AppComponent } from "./components/app.component";
import { LandingComponent } from "./components/landing/landing.component";
import { LoginComponent } from "./components/login/login.component";

import { SettingsComponent } from "./components/settings/settings.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

import { TodoDemoComponent } from "./components/controls/todo-demo.component";
import { StatisticsDemoComponent } from "./components/controls/statistics-demo.component";
import { NotificationsViewerComponent } from "./components/controls/notifications-viewer.component";
import { SearchBoxComponent } from "./components/controls/search-box.component";
import { UserInfoComponent } from "./components/controls/user-info.component";
import { UserPreferencesComponent } from "./components/controls/user-preferences.component";
import { UsersManagementComponent } from "./components/controls/users-management.component";
import { RolesManagementComponent } from "./components/controls/roles-management.component";
import { RoleEditorComponent } from "./components/controls/role-editor.component";

import { RegisterComponent } from './components/register/register.component';
import { RegisterConfirmationComponent } from './components/register-confirmation/register-confirmation.component';
import { RegisterConfirmationEmailComponent } from "./components/register-confirmation-email/register-confirmation-email.component";

import { ForgotUserNameComponent } from './components/forgot-username/forgot-username.component';
import { ForgotUserNameConfirmationComponent } from './components/forgot-username-confirmation/forgot-username-confirmation.component';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotPasswordConfirmationComponent } from './components/forgot-password-confirmation/forgot-password-confirmation.component';

import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import { PaymentProfileComponent } from "./components/paymentprofile/payment-profile.component";
import { PaymentPaynowComponent } from "./components/paymentpaynow/payment-paynow.component";
import { PaymentAutopayComponent } from "./components/paymentautopay/payment-autopay.component";
import { PaymentEditComponent } from "./components/paymentedit/payment-edit.component";

import { PrivacyComponent } from "./components/privacy/privacy.component";
import { TermsComponent } from "./components/terms/terms.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { ContactUsExtComponent } from "./components/contact-us-ext/contact-us-ext.component";

import { InvoiceClosedComponent } from './components/invoices-closed/invoices-closed.component';
import { ModelStateDirective } from './directives/modelstate.directive';
import { LanguageObservableService } from "./services/language-observable.service";

import { SFAccountSettingsComponent } from "./components/controls/sf-account-settings.component";
import { SFAccountSettingsService } from "./services/sf-account-settings.service";
import { SFAccountSettingsEndpoint } from "./services/sf-account-settings-endpoint.service";
import { SFContactInfoComponent } from "./components/controls/sf-contact-info.component";
import { SFContactsComponent } from "./components/controls/sf-contacts.component";


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader
      }
    }),
    NgxDatatableModule,
    ToastaModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    ChartsModule,
    NgxCaptchaModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SettingsComponent,
    UsersManagementComponent, UserInfoComponent, UserPreferencesComponent,
    RolesManagementComponent, RoleEditorComponent,
    NotFoundComponent,
    NotificationsViewerComponent,
    SearchBoxComponent,
    StatisticsDemoComponent, TodoDemoComponent,
    EqualValidator,
    NotEqualValidator,
    ModelStateDirective,
    LastElementDirective,
    AutofocusDirective,
    BootstrapTabDirective,
    BootstrapToggleDirective,
    BootstrapSelectDirective,
    BootstrapDatepickerDirective,
    GroupByPipe,
    LandingComponent,
    RegisterComponent,
    RegisterConfirmationComponent,
    RegisterConfirmationEmailComponent,
    ResetPasswordComponent,
    ForgotUserNameComponent,
    ForgotPasswordComponent,
    ForgotPasswordConfirmationComponent,
    ForgotUserNameConfirmationComponent,
    PaymentProfileComponent,
    PaymentPaynowComponent,
    PaymentAutopayComponent,
    PaymentEditComponent,
    PrivacyComponent,
    TermsComponent,
    InvoiceClosedComponent,
    ContactUsComponent,
    ContactUsExtComponent,
    SFAccountSettingsComponent,
    SFContactsComponent,
    SFContactInfoComponent
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    AlertService,
    ConfigurationService,
    AppTitleService,
    AppTranslationService,
    NotificationService,
    NotificationEndpoint,
    AccountService,
    AccountEndpoint,
    LocalStoreManager,
    EndpointFactory,
    InvoiceService,
    InvoiceEndpoint,
    PaymentService,
    PaymentServiceEndpoint,
    LanguageObservableService,
    SFAccountSettingsService,
    SFAccountSettingsEndpoint
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
  }
}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
