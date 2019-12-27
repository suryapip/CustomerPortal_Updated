import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';

import { LandingComponent } from "./components/landing/landing.component";

import { NotFoundComponent } from "./components/not-found/not-found.component";
import { LoginComponent } from "./components/login/login.component";

import { RegisterComponent } from "./components/register/register.component";
import { RegisterConfirmationComponent } from './components/register-confirmation/register-confirmation.component';
import { RegisterConfirmationEmailComponent } from "./components/register-confirmation-email/register-confirmation-email.component";

import { ForgotUserNameComponent } from "./components/forgot-username/forgot-username.component";
import { ForgotUserNameConfirmationComponent } from "./components/forgot-username-confirmation/forgot-username-confirmation.component";

import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { ForgotPasswordConfirmationComponent } from './components/forgot-password-confirmation/forgot-password-confirmation.component';

import { InvoiceClosedComponent } from './components/invoices-closed/invoices-closed.component';
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { ContactUsExtComponent } from "./components/contact-us-ext/contact-us-ext.component";

import { SettingsComponent } from "./components/settings/settings.component";

import { PaymentProfileComponent } from "./components/paymentprofile/payment-profile.component";
import { PaymentPaynowComponent } from "./components/paymentpaynow/payment-paynow.component";
import { PaymentAutopayComponent } from "./components/paymentautopay/payment-autopay.component";
import { PaymentEditComponent } from "./components/paymentedit/payment-edit.component";

import { PrivacyComponent } from "./components/privacy/privacy.component";
import { TermsComponent } from "./components/terms/terms.component";
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


const routes: Routes = [
  { path: "login", component: LoginComponent, data: { title: "Login" } },
  {
    path: 'secure',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "payment",
        children: [
          { path: "paynow", component: PaymentPaynowComponent, data: { title: "Pay Now" } },
          { path: "profile", component: PaymentProfileComponent, data: { title: "Payment Profiles" } },
          { path: "autopay", component: PaymentAutopayComponent, data: { title: "Auto Pay" } },
          { path: ":id", component: PaymentEditComponent, data: { title: "Edit Payment Method" } },
          { path: "", component: PaymentEditComponent, data: { title: "Add Payment Method" }, pathMatch: 'full' },
        ]
      },
      { path: "invoices", component: InvoiceClosedComponent, data: { title: "Invoice History" } },
      { path: "contactus", component: ContactUsComponent, data: { title: "Contact Us" } },
      { path: "settings", component: SettingsComponent, data: { title: "Settings" } },
      { path: "", component: LandingComponent, data: { title: "Invoices" } },
    ]
  },
  { path: "contactus",    component: ContactUsExtComponent, data: { title: "Contact Us" } },
  { path: "privacy",      component: PrivacyComponent, data: { title: "Privacy Policy" } },
  { path: "terms",        component: TermsComponent, data: { title: "Terms & Conditions" } },
  {
    path: "register",
    children: [
      { path: ":id/:code", component: RegisterConfirmationEmailComponent, data: { title: "Email Confirmation" } },
      { path: ":id", component: RegisterConfirmationComponent, data: { title: "Confirmation" } },
      { path: '', component: RegisterComponent, data: { title: "Register" }, pathMatch: 'full' },
    ]
  },
  {
    path: "forgot",
    children: [
      { path: 'username/confirmation',  component: ForgotUserNameConfirmationComponent, data: { title: "Confirmation" } },
      { path: 'username',               component: ForgotUserNameComponent, data: { title: "Forgot Username" }, pathMatch: 'full' },
      { path: 'password/confirmation',  component: ForgotPasswordConfirmationComponent, data: { title: "Confirmation" } },
      { path: "password/:id/:code",     component: ResetPasswordComponent, data: { title: "Reset Password" } },
      { path: 'password',               component: ForgotPasswordComponent, data: { title: "Forgot Password" }, pathMatch: 'full' },
    ]
  },


  { path: "landing",      redirectTo: 'secure' },
  { path: "",             redirectTo: 'secure', pathMatch: 'full' },
  { path: "**",           component: NotFoundComponent, data: { title: "Page Not Found" } },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard]
})
export class AppRoutingModule { }
