import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { Utilities } from '../../services/utilities';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
//import { Observable } from 'rxjs';
//import { SecurityQuestion } from '../../models/security-questions.model';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-Keys';
import { LanguageObservableService } from '../../services/language-observable.service';

import { SFAccountSettings } from '../../models/sf-account-settings.model';
//import { SFContact } from '../../models/sf-contact.model';
//import { SFRole } from '../../models/sf-role.model';
import { SFAccountSettingsService } from "../../services/sf-account-settings.service";

@Component({
  selector: 'sf-account-settings',
  templateUrl: './sf-account-settings.component.html',
  styleUrls: ['./sf-account-settings.component.css'],
})
export class SFAccountSettingsComponent implements OnInit {

  private isEditMode = false;
  private isNewUser = false;
  private isSaving = false;
  //private isChangePassword = false;
  private isEditingSelf = false;
  private showValidationErrors = false;
  //private editingUserName: string;
  private uniqueId: string = Utilities.uniqueId();
  private user: User = new User();
  private userEdit: UserEdit = new UserEdit();
  private allRoles: Role[] = [];
  //private isEditingEmailAddress: boolean = false;
  private selectedLanguage: string;

  private sfAccountSettings: SFAccountSettings = new SFAccountSettings();

  public formResetToggle = true;

  public changesSavedCallback: () => void;
  public changesFailedCallback: () => void;
  public changesCancelledCallback: () => void;

  @Input()
  isViewOnly: boolean;

  @Input()
  isGeneralEditor = false;


  //questions: SecurityQuestion[];
  //securityQuestions01: SecurityQuestion[];
  //securityQuestions02: SecurityQuestion[];

  @ViewChild('f')
  private form;

  //ViewChilds Required because ngIf hides template variables from global scope
  @ViewChild('billingAddress1')
  private billingAddress1;

  @ViewChild('billingAddress2')
  private billingAddress2;

  @ViewChild('billingAddress3')
  private billingAddress3;

  @ViewChild('billingMunicipality')
  private billingMunicipality;

  @ViewChild('billingStateOrProvince')
  private billingStateOrProvince;

  @ViewChild('billingPostalCode')
  private billingPostalCode;

  @ViewChild('billingCountry')
  private billingCountry;

  @ViewChild('shippingAddress1')
  private shippingAddress1;

  @ViewChild('shippingAddress2')
  private shippingAddress2;

  @ViewChild('shippingAddress3')
  private shippingAddress3;

  @ViewChild('shippingMunicipality')
  private shippingMunicipality;

  @ViewChild('shippingStateOrProvince')
  private shippingStateOrProvince;

  @ViewChild('shippingPostalCode')
  private shippingPostalCode;

  @ViewChild('shippingCountry')
  private shippingCountry;

  //@ViewChild('userName')
  //private userName;

  //@ViewChild('userPassword')
  //private userPassword;

  //@ViewChild('email')
  //private email;

  //@ViewChild('currentPassword')
  //private currentPassword;

  //@ViewChild('newPassword')
  //private newPassword;

  //@ViewChild('confirmPassword')
  //private confirmPassword;

  //@ViewChild('roles')
  //private roles;

  //@ViewChild('rolesSelector')
  //private rolesSelector;


  constructor(private alertService: AlertService, private sfAccountSettingsService: SFAccountSettingsService, private localStorage: LocalStoreManager, public userInfoService: LanguageObservableService) {
  }

  ngOnInit() {

    // [mholmes] Hard-code values for demo.
    //this.sfAccountSettings.billingAddress1 = '123 Fourth Street';
    //this.sfAccountSettings.billingAddress2 = 'Suite 321';
    //this.sfAccountSettings.billingAddress3 = '';
    //this.sfAccountSettings.billingMunicipality = 'Charlotte';
    //this.sfAccountSettings.billingStateOrProvince = 'NC';
    //this.sfAccountSettings.billingPostalCode = '28120';
    //this.sfAccountSettings.billingCountry = 'United States';
    //this.sfAccountSettings.shippingAddress1 = '123 Fourth Street';
    //this.sfAccountSettings.shippingAddress2 = 'Suite 321';
    //this.sfAccountSettings.shippingAddress3 = '';
    //this.sfAccountSettings.shippingMunicipality = 'Charlotte';
    //this.sfAccountSettings.shippingStateOrProvince = 'NC';
    //this.sfAccountSettings.shippingPostalCode = '28120';
    //this.sfAccountSettings.shippingCountry = 'United States';

    //this.questions = [];
    //this.securityQuestions01 = [];
    //this.securityQuestions02 = [];

    if (this.localStorage.exists(DBkeys.LANGUAGE)) {
      this.selectedLanguage = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
    } else {
      this.selectedLanguage = "en";
    }

    //this.accountService.getQuestions(this.selectedLanguage).subscribe(a => a.forEach(x => {
    //  this.questions.push(x);
    //  this.securityQuestions01.push(x);
    //  this.securityQuestions02.push(x);
    //}));


    if (!this.isGeneralEditor) {
      this.loadSFAccountSettingsData();
    }

    //if (!this.isGeneralEditor) {
    //  this.loadCurrentUserData();
    //}

    this.userInfoService.languageStream$.subscribe(lang => {
      if (this.selectedLanguage != lang) {
        this.selectedLanguage = lang;
        //this.getQuestions(lang);
      }
    });
  }

  //public getQuestions(language) {
  //  this.questions = [];
  //  this.securityQuestions01 = [];
  //  this.securityQuestions02 = [];
  //  this.accountService.getQuestions(language).subscribe(a => {
  //    if (a && a.length > 0) {
  //      this.questions = a;
  //      this.securityQuestions01 = a;
  //      this.securityQuestions02 = a;
  //    }
  //  });
  //}


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


    //private loadCurrentUserData() {
  //  this.alertService.startLoadingMessage();

  //  if (this.canViewAllRoles) {
  //    this.accountService.getUserAndRoles().subscribe(results => this.onCurrentUserDataLoadSuccessful(results[0], results[1]), error => this.onCurrentUserDataLoadFailed(error));
  //  }
  //  else {
  //    this.accountService.getUser().subscribe(user => this.onCurrentUserDataLoadSuccessful(user, user.roles.map(x => new Role(x))), error => this.onCurrentUserDataLoadFailed(error));
  //  }
  //}




  //private getQuestionText(id: number) {
  //  var question = this.questions.find(q => q.referenceEnglishId == id);
  //  return (question) ? question.question : '';
  //}


  //private getRoleByName(name: string) {
  //  return this.allRoles.find((r) => r.name == name)
  //}



  //private showErrorAlert(caption: string, message: string) {
  //  this.alertService.showMessage(caption, message, MessageSeverity.error);
  //}


  //public deletePasswordFromUser(user: UserEdit | User) {
  //  let userEdit = <UserEdit>user;

  //  delete userEdit.currentPassword;
  //  delete userEdit.newPassword;
  //  delete userEdit.confirmPassword;
  //}


  private edit() {
    //Object.assign(this.userEdit, this.user);
    //this.isEditingSelf = this.accountService.currentUser ? this.user.id == this.accountService.currentUser.id : false;
    this.isEditMode = true;
    this.showValidationErrors = true;
    //this.isChangePassword = false;
  }


  private save() {
    this.isSaving = true;
    this.alertService.startLoadingMessage("Saving changes...");

    //this.sfAccountSettingsService.updateUser(this.userEdit, this.isEditingSelf)
    //  .subscribe(
    //    response => this.saveSuccessHelper(response),
    //    error => this.saveFailedHelper(error));
  }


  private saveSuccessHelper(user?: User) {
    //this.testIsRoleUserCountChanged(this.user, this.userEdit);

    //if (user)
    //  Object.assign(this.userEdit, user);

    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    //this.isChangePassword = false;
    this.showValidationErrors = false;

    //this.deletePasswordFromUser(this.userEdit);
    //Object.assign(this.user, this.userEdit);
    //this.userEdit = new UserEdit();
    this.resetForm();

    //if (this.isGeneralEditor) {
    //  if (this.isNewUser)
    //    this.alertService.showMessage("Success", `User \"${this.user.userName}\" was created successfully`, MessageSeverity.success);
    //  else if (!this.isEditingSelf)
    //    this.alertService.showMessage("Success", `Changes to user \"${this.user.userName}\" was saved successfully`, MessageSeverity.success);
    //}

    //if (this.isEditingSelf) {
      this.alertService.showMessage("Success", "Changes to Account Settings were saved successfully", MessageSeverity.success);

      //if (this.isEditingEmailAddress) {
      //  this.alertService.showMessage("Username", "The email address to access your account has been updated", MessageSeverity.success);
      //}
      //this.refreshSFAccountSettings();
    //}

    this.isEditMode = false;
    //this.isEditingEmailAddress = false;


    if (this.changesSavedCallback)
      this.changesSavedCallback();
  }


  private saveFailedHelper(error: any) {
    this.isSaving = false;
    //this.isChangePassword = false;
    //this.isEditingEmailAddress = false;
    this.showValidationErrors = true;

    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Save Error", "The below errors occurred whilst saving your changes:", MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);


    this.resetForm();


    if (this.changesFailedCallback)
      this.changesFailedCallback();
  }



  //private testIsRoleUserCountChanged(currentUser: User, editedUser: User) {

  //  let rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) == -1);
  //  let rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) == -1);

  //  let modifiedRoles = rolesAdded.concat(rolesRemoved);

  //  if (modifiedRoles.length)
  //    setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
  //}



  private cancel() {
    if (this.isGeneralEditor)
      this.userEdit = this.user = new UserEdit();
    else
      this.userEdit = new UserEdit();

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
    this.userEdit = this.user = new UserEdit();
    this.showValidationErrors = false;
    this.resetForm();
    this.isEditMode = false;

    if (this.changesSavedCallback)
      this.changesSavedCallback();
  }



  //private refreshSFAccountSettings() {
  //  this.sfAccountSettingsService.refreshSFAccountSettings()
  //    .subscribe(sfAccountSettings => {
  //      this.loadSFAccountSettingsData();
  //    },
  //      error => {
  //        this.alertService.resetStickyMessage();
  //        this.alertService.showStickyMessage("Refresh failed", "An error occurred whilst refreshing Account Settings from the server", MessageSeverity.error, error);
  //      });
  //}


  //private changePassword() {
  //  this.isChangePassword = true;
  //}


  //private unlockUser() {
  //  this.isSaving = true;
  //  this.alertService.startLoadingMessage("Enabling User...");


  //  this.accountService.unblockUser(this.userEdit.id)
  //    .subscribe(response => {
  //      this.isSaving = false;
  //      this.userEdit.isLockedOut = false;
  //      this.alertService.stopLoadingMessage();
  //      this.alertService.showMessage("Success", "User has been successfully enabled", MessageSeverity.success);
  //    },
  //      error => {
  //        this.isSaving = false;
  //        this.alertService.stopLoadingMessage();
  //        this.alertService.showStickyMessage("Enable User Error", "The below errors occurred while enabling the user:", MessageSeverity.error, error);
  //        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  //      });
  //}


  resetForm(replace = false) {
    //this.isChangePassword = false;

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


  //newUser(allRoles: Role[]) {
  //  this.isGeneralEditor = true;
  //  this.isNewUser = true;

  //  this.allRoles = [...allRoles];
  //  //this.editingUserName = null;
  //  this.user = this.userEdit = new UserEdit();
  //  this.userEdit.isEnabled = true;
  //  this.edit();

  //  return this.userEdit;
  //}

  //editUser(user: User, allRoles: Role[]) {
  //  if (user) {
  //    this.isGeneralEditor = true;
  //    this.isNewUser = false;

  //    //this.setRoles(user, allRoles);
  //    //this.editingUserName = user.userName;
  //    this.user = new User();
  //    this.userEdit = new UserEdit();
  //    Object.assign(this.user, user);
  //    Object.assign(this.userEdit, user);
  //    this.edit();

  //    return this.userEdit;
  //  }
  //  else {
  //    return this.newUser(allRoles);
  //  }
  //}


  //displayUser(user: User, allRoles?: Role[]) {

  //  this.user = new User();
  //  Object.assign(this.user, user);
  //  //this.deletePasswordFromUser(this.user);
  //  //this.setRoles(user, allRoles);

  //  this.isEditMode = false;
  //}

  //private setRoles(user: User, allRoles?: Role[]) {

  //  this.allRoles = allRoles ? [...allRoles] : [];

  //  if (user.roles) {
  //    for (let ur of user.roles) {
  //      if (!this.allRoles.some(r => r.name == ur))
  //        this.allRoles.unshift(new Role(ur));
  //    }
  //  }

  //  if (allRoles == null || this.allRoles.length != allRoles.length)
  //    setTimeout(() => this.rolesSelector.refresh());
  //}



  //get canViewAllRoles() {
  //  return this.accountService.userHasPermission(Permission.viewRolesPermission);
  //}

  //get canAssignRoles() {
  //  return this.accountService.userHasPermission(Permission.assignRolesPermission);
  //}
}
