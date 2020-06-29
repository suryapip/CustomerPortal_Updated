import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { Observable } from 'rxjs';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-Keys';
import { LanguageObservableService } from '../../services/language-observable.service';

import { SFAccountSettingsService } from "../../services/sf-account-settings.service";
import { SFContact } from "../../models/sf-contact.model";
import { SFContactRole } from "../../models/sf-contact-role.model";


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
  private sfContact: SFContact = new SFContact();
  private sfContactEdit: SFContact = new SFContact();
  private isEditingEmailAddress: boolean = false;
  private selectedLanguage: string;

  // A contact's roles are stored as individual boolean fields in the SFContacts table, not in a separate association table.
  // The SFContactRole object is hardcoded on the UI side for display purposes; it doesn't propagate to the database.
  //allRoles: SFContactRole[] = [
  //  new SFContactRole('Main', 'Main Contact'),
  //  new SFContactRole('Billing', 'Billing Contact'),
  //  new SFContactRole('Shipping', 'Shipping Contact'),
  //  new SFContactRole('Service', 'Service Contact'),
  //  new SFContactRole('Property', 'Property Contact'),
  //  new SFContactRole('Installation', 'Installation Contact'),
  //  new SFContactRole('Marketing', 'Marketing Contact')
  //];

  public formResetToggle = true;

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
  @ViewChild('accountNumber') private accountNumber;
  @ViewChild('name') private name;
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
  //@ViewChild('roles') private roles;
  //@ViewChild('rolesSelector') private rolesSelector;


  constructor(private alertService: AlertService, private sfAccountSettingsService: SFAccountSettingsService, private localStorage: LocalStoreManager, public userInfoService: LanguageObservableService) {
  }

  ngOnInit() {
    if (this.localStorage.exists(DBkeys.LANGUAGE)) {
      this.selectedLanguage = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
    } else {
      this.selectedLanguage = "en";
    }

    if (!this.isGeneralEditor) {
      this.loadSFContactInfo();
    }

    this.userInfoService.languageStream$.subscribe(lang => {
      if (this.selectedLanguage != lang) {
        this.selectedLanguage = lang;
      }
    });
  }


  private loadSFContactInfo() {
    this.alertService.startLoadingMessage();
    this.sfAccountSettingsService.getSFContact().subscribe(results => this.onSFContactInfoLoadSuccessful(results), error => this.onSFContactInfoLoadFailed(error));
  }


  private onSFContactInfoLoadSuccessful(sfContact: SFContact) {
    this.alertService.stopLoadingMessage();
    this.sfContact = sfContact;
    //this.allRoles = roles;
  }

  private onSFContactInfoLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Load Error", `Unable to retrieve contact data from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);

    this.sfContact = new SFContact();
  }


  //private getRoleByName(name: string) {
  //  return this.allRoles.find((r) => r.name == name)
  //}


  private showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }


  private edit() {
    Object.assign(this.sfContactEdit, this.sfContact);
    this.isEditMode = true;
    this.showValidationErrors = true;
  }


  private save() {
    this.isSaving = true;
    this.alertService.startLoadingMessage("Saving changes...");

    if (this.sfContact.email != this.sfContactEdit.email) {
      this.isEditingEmailAddress = true;
    }

    //if (this.isNewContact) {
    this.sfAccountSettingsService.saveSFContact(this.sfContactEdit)
      .subscribe(
        response => this.saveSuccessHelper(response),
        error => this.saveFailedHelper(error));
    //}
    //else {
    //  this.sfAccountSettingsService.updateSFContact(this.sfContactEdit)
    //    .subscribe(
    //      response => this.saveSuccessHelper(response),
    //      error => this.saveFailedHelper(error));
    //}
  }


  private saveSuccessHelper(sfContact?: SFContact) {
    //this.testIsRoleUserCountChanged(this.sfContact, this.sfContactEdit);

    if (sfContact)
      Object.assign(this.sfContactEdit, sfContact);

    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.showValidationErrors = false;

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
    this.isEditingEmailAddress = false;

    if (this.changesSavedCallback)
      this.changesSavedCallback();
  }


  private saveFailedHelper(error: any) {
    this.isSaving = false;
    this.isEditingEmailAddress = false;
    this.showValidationErrors = true;

    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Save Error", "The below errors occurred whilst saving your changes:", MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);

    this.resetForm();

    if (this.changesFailedCallback)
      this.changesFailedCallback();
  }


  //private testIsRoleUserCountChanged(currentSFContact: SFContact, editedSFContact: SFContact) {

  //  let rolesAdded = this.isNewContact ? editedSFContact.roles : editedSFContact.roles.filter(role => currentSFContact.roles.indexOf(role) == -1);
  //  let rolesRemoved = this.isNewContact ? [] : currentSFContact.roles.filter(role => editedSFContact.roles.indexOf(role) == -1);

  //  let modifiedRoles = rolesAdded.concat(rolesRemoved);

  //  if (modifiedRoles.length)
  //    setTimeout(() => this.sfAccountSettingsService.onRolesUserCountChanged(modifiedRoles));
  //}


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


  //private refreshLoggedInUser() {
  //  this.sfAccountSettingsService.refreshLoggedInUser()
  //    .subscribe(user => {
  //      this.loadCurrentSFContactData();
  //    },
  //      error => {
  //        this.alertService.resetStickyMessage();
  //        this.alertService.showStickyMessage("Refresh failed", "An error occurred whilst refreshing logged in user information from the server", MessageSeverity.error, error);
  //      });
  //}


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


  //newSFContact(allRoles: SFContactRole[]) {
  newSFContact() {
    this.isGeneralEditor = true;
    this.isNewContact = true;

    //this.allRoles = [...allRoles];
    this.editingContactName = null;
    this.sfContact = this.sfContactEdit = new SFContact();
    //this.sfContactEdit.accountNumber = 
    this.sfContactEdit.active = true;
    this.edit();

    return this.sfContactEdit;
  }

  //editSFContact(sfContact: SFContact, allRoles: SFContactRole[]) {
  editSFContact(sfContact: SFContact) {
    if (sfContact) {
      this.isGeneralEditor = true;
      this.isNewContact = false;

      //this.setRoles(sfContact, allRoles);
      this.editingContactName = sfContact.name;
      this.sfContact = new SFContact();
      this.sfContactEdit = new SFContact();
      Object.assign(this.sfContact, sfContact);
      Object.assign(this.sfContactEdit, sfContact);
      this.edit();

      return this.sfContactEdit;
    }
    else {
      //return this.newSFContact(allRoles);
      return this.newSFContact();
    }
  }


  //displaySFContact(sfContact: SFContact, allRoles?: SFContactRole[]) {
  displaySFContact(sfContact: SFContact) {
    this.sfContact = new SFContact();
    Object.assign(this.sfContact, sfContact);
    //this.setRoles(sfContact, allRoles);
    this.isEditMode = false;
  }

  //private setRoles(sfContact: SFContact, allRoles?: SFContactRole[]) {
  //  this.allRoles = allRoles ? [...allRoles] : [];
  //  if (sfContact.roles) {
  //    for (let ur of sfContact.roles()) {
  //      if (!this.allRoles.some(r => r.name == ur))
  //        this.allRoles.unshift(new SFContactRole(ur));
  //    }
  //  }
  //  if (allRoles == null || this.allRoles.length != allRoles.length)
  //    setTimeout(() => this.rolesSelector.refresh());
  //}

}
