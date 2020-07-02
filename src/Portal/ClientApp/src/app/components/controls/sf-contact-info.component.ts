import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { Observable } from 'rxjs';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-Keys';
import { LanguageObservableService } from '../../services/language-observable.service';

import { SFAccountSettings } from '../../models/sf-account-settings.model';
import { SFAccountSettingsService } from "../../services/sf-account-settings.service";
import { SFContact } from "../../models/sf-contact.model";


@Component({
  selector: 'sf-contact-info',
  templateUrl: './sf-contact-info.component.html',
  styleUrls: ['./sf-contact-info.component.css'],
})
export class SFContactInfoComponent implements OnInit {

  private isEditMode = false;
  private isNewContact = false;
  private isSaving = false;
  private showValidationErrors = false;
  private editingContactName: string;
  private uniqueId: string = Utilities.uniqueId();
  private sfAccountSettings: SFAccountSettings = new SFAccountSettings();
  private sfContact: SFContact = new SFContact();
  private sfContactEdit: SFContact = new SFContact();
  private selectedLanguage: string;

  public formResetToggle: boolean = true;

  public changesSavedCallback: () => void;
  public changesFailedCallback: () => void;
  public changesCancelledCallback: () => void;

  
  @Input()
  isViewOnly: boolean;

  @Input()
  isGeneralEditor = false;


  @ViewChild('f')
  private form;

  //ViewChilds Required because ngIf hides template variables from global scope
  @ViewChild('id') private id;
  @ViewChild('accountNumber') private accountNumber;
  @ViewChild('firstName') private firstName;
  @ViewChild('lastName') private lastName;
  @ViewChild('email') private email;
  @ViewChild('phone') private phone;
  @ViewChild('mainContact') private mainContact;
  @ViewChild('billingContact') private billingContact;
  @ViewChild('shippingContact') private shippingContact;
  @ViewChild('serviceContact') private serviceContact;
  @ViewChild('propertyContact') private propertyContact;
  @ViewChild('installationContact') private installationContact;
  @ViewChild('marketingContact') private marketingContact;
  @ViewChild('doNotCall') private doNotCall;
  @ViewChild('doNotEmail') private doNotEmail;
  @ViewChild('active') private active;

  // Computed values from the SFContact model
  @ViewChild('name') private name;

  //@ViewChild('removedLastMainContact') public removedLastMainContact: boolean = false;
  //public numMainContacts: number;
  //public numMainContactsCallback: () => void;


  constructor(private alertService: AlertService, private sfAccountSettingsService: SFAccountSettingsService, private localStorage: LocalStoreManager, public userInfoService: LanguageObservableService) {
  }

  ngOnInit() {
    if (this.localStorage.exists(DBkeys.LANGUAGE)) {
      this.selectedLanguage = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
    } else {
      this.selectedLanguage = "en";
    }

    this.loadSFAccountSettingsData();   // So we can populate the AccountNumber for new Contacts.

    if (!this.isGeneralEditor) {
      this.loadSFContactInfo();
    }

    this.userInfoService.languageStream$.subscribe(lang => {
      if (this.selectedLanguage != lang) {
        this.selectedLanguage = lang;
      }
    });
  }

  // SFAccountSettings

  private loadSFAccountSettingsData() {
    this.alertService.startLoadingMessage();
    this.sfAccountSettingsService.getSFAccountSettings()
      .subscribe(results => this.onSFAccountSettingsDataLoadSuccessful(results), error => this.onSFAccountSettingsDataLoadFailed(error));
  }


  private onSFAccountSettingsDataLoadSuccessful(accountSettings: SFAccountSettings) {
    this.alertService.stopLoadingMessage();
    this.sfAccountSettings = accountSettings;
  }


  private onSFAccountSettingsDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Load Error", `Unable to retrieve account settings from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);

    this.sfAccountSettings = new SFAccountSettings();
  }


  // SFContact

  private loadSFContactInfo() {
    this.alertService.startLoadingMessage();
    this.sfAccountSettingsService.getSFContact().subscribe(results => this.onSFContactInfoLoadSuccessful(results), error => this.onSFContactInfoLoadFailed(error));
  }


  private onSFContactInfoLoadSuccessful(sfContact: SFContact) {
    this.alertService.stopLoadingMessage();
    this.sfContact = sfContact;
    this.id = sfContact.id;
    this.accountNumber = sfContact.accountNumber;
    this.firstName = sfContact.firstName;
    this.lastName = sfContact.lastName;
    this.email = sfContact.email;
    this.phone = sfContact.phone;
    this.mainContact = sfContact.mainContact;
    this.billingContact = sfContact.billingContact;
    this.shippingContact = sfContact.shippingContact;
    this.serviceContact = sfContact.serviceContact;
    this.propertyContact = sfContact.propertyContact;
    this.installationContact = sfContact.installationContact;
    this.marketingContact = sfContact.marketingContact;
    this.doNotCall = sfContact.doNotCall;
    this.doNotEmail = sfContact.doNotEmail;
    this.active = sfContact.active

    // Computed values from the SFContact model
    this.fillName(sfContact);
    this.name = sfContact.name;
  }

  private onSFContactInfoLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Load Error", `Unable to retrieve contact data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);

    this.sfContact = new SFContact();
  }


  private edit() {
    if (this.isNewContact) 
      this.sfContact.accountNumber = this.sfAccountSettings.accountNumber;
    Object.assign(this.sfContactEdit, this.sfContact);
    this.isEditMode = true;
    this.showValidationErrors = true;
  }


  private save() {
    this.isSaving = true;
    this.alertService.startLoadingMessage("Saving changes...");
    this.sfAccountSettingsService.saveSFContact(this.sfContactEdit)
      .subscribe(
        response => this.saveSuccessHelper(response),
        error => this.saveFailedHelper(error));
  }


  private saveSuccessHelper(sfContact?: SFContact) {
    if (sfContact)
      Object.assign(this.sfContactEdit, sfContact);

    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.showValidationErrors = false;

    this.fillName(this.sfContactEdit);
    Object.assign(this.sfContact, this.sfContactEdit);
    this.sfContactEdit = new SFContact();
    this.resetForm();

    if (this.isGeneralEditor) {
      if (this.isNewContact)
        this.alertService.showMessage("Success", `Contact \"${this.sfContact.name}\" was created successfully`, MessageSeverity.success);
      else
        this.alertService.showMessage("Success", `Changes to contact \"${this.sfContact.name}\" were saved successfully`, MessageSeverity.success);
    }

    this.isEditMode = false;

    if (this.changesSavedCallback)
      this.changesSavedCallback();
  }


  private saveFailedHelper(error: any) {
    this.isSaving = false;
    this.showValidationErrors = true;

    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Save Error", "The below errors occurred whilst saving your changes:", MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);

    this.resetForm();

    if (this.changesFailedCallback)
      this.changesFailedCallback();
  }


  private cancel() {
    if (this.isGeneralEditor)
      this.sfContactEdit = this.sfContact = new SFContact();
    else
      this.sfContactEdit = new SFContact();

    this.showValidationErrors = false;
    this.resetForm();

    this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
    this.alertService.resetStickyMessage();

    if (!this.isGeneralEditor)
      this.isEditMode = false;

    if (this.changesCancelledCallback)
      this.changesCancelledCallback();
  }


  private close() {
    this.sfContactEdit = this.sfContact = new SFContact();
    this.showValidationErrors = false;
    this.resetForm();
    this.isEditMode = false;

    if (this.changesSavedCallback)
      this.changesSavedCallback();
  }


  resetForm(replace = false) {
    if (!replace) {
      this.form.reset();
    }
    else {
      this.formResetToggle = false;

      setTimeout(() => {
        this.formResetToggle = true;
      });
    }
  }


  newSFContact() {
    this.isGeneralEditor = true;
    this.isNewContact = true;

    this.editingContactName = null;
    this.sfContact = this.sfContactEdit = new SFContact();
    this.sfContactEdit.active = true;
    this.edit();

    //this.numMainContactsCallback();     // Get the current number of Main contacts from the parent page.
    //this.removedLastMainContact = (this.sfContact.mainContact && !this.sfContactEdit.mainContact && this.numMainContacts == 1);

    return this.sfContactEdit;
  }

  editSFContact(sfContact: SFContact) {
    if (sfContact) {
      this.isGeneralEditor = true;
      this.isNewContact = false;

      this.editingContactName = sfContact.name;
      this.sfContact = new SFContact();
      this.sfContactEdit = new SFContact();
      Object.assign(this.sfContact, sfContact);
      Object.assign(this.sfContactEdit, sfContact);
      this.edit();

      //this.numMainContactsCallback();     // Get the current number of Main contacts from the parent page.
      //this.removedLastMainContact = (this.sfContact.mainContact && !this.sfContactEdit.mainContact && this.numMainContacts == 1);

      return this.sfContactEdit;
    }
    else {
      return this.newSFContact();
    }
  }


  displaySFContact(sfContact: SFContact) {
    this.sfContact = new SFContact();
    Object.assign(this.sfContact, sfContact);
    this.isEditMode = false;
  }


  private showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }


  // Populate the contact's full name.
  fillName(sfContact: SFContact) {
    let firstName = sfContact.firstName ? (sfContact.firstName.toLowerCase() != 'null' ? sfContact.firstName : '') : '';
    sfContact.name = (firstName + ' ' + sfContact.lastName).trim();
  }

}
