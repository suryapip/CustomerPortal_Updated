import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-Keys';
import { LanguageObservableService } from '../../services/language-observable.service';

import { SFAccountSettings } from '../../models/sf-account-settings.model';
import { SFAccountSettingsService } from "../../services/sf-account-settings.service";

@Component({
  selector: 'sf-account-settings',
  templateUrl: './sf-account-settings.component.html',
  styleUrls: ['./sf-account-settings.component.css'],
})
export class SFAccountSettingsComponent implements OnInit {

  private isEditMode = false;
  private isSaving = false;
  private showValidationErrors = false;
  private uniqueId: string = Utilities.uniqueId();
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


  @ViewChild('f')
  private form;

  //ViewChilds Required because ngIf hides template variables from global scope
  @ViewChild('billingLine1')
  private billingLine1;

  @ViewChild('billingLine2')
  private billingLine2;

  @ViewChild('billingLine3')
  private billingLine3;

  @ViewChild('billingMunicipality')
  private billingMunicipality;

  @ViewChild('billingStateOrProvince')
  private billingStateOrProvince;

  @ViewChild('billingPostalCode')
  private billingPostalCode;

  @ViewChild('billingCountry')
  private billingCountry;

  @ViewChild('shippingLine1')
  private shippingLine1;

  @ViewChild('shippingLine2')
  private shippingLine2;

  @ViewChild('shippingLine3')
  private shippingLine3;

  @ViewChild('shippingMunicipality')
  private shippingMunicipality;

  @ViewChild('shippingStateOrProvince')
  private shippingStateOrProvince;

  @ViewChild('shippingPostalCode')
  private shippingPostalCode;

  @ViewChild('shippingCountry')
  private shippingCountry;


  constructor(private alertService: AlertService, private sfAccountSettingsService: SFAccountSettingsService, private localStorage: LocalStoreManager, public userInfoService: LanguageObservableService) {
  }


  ngOnInit() {

    if (this.localStorage.exists(DBkeys.LANGUAGE)) {
      this.selectedLanguage = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
    } else {
      this.selectedLanguage = "en";
    }

    if (!this.isGeneralEditor) {
      this.loadSFAccountSettingsData();
    }

    this.userInfoService.languageStream$.subscribe(lang => {
      if (this.selectedLanguage != lang) {
        this.selectedLanguage = lang;
      }
    });
  }


  private loadSFAccountSettingsData() {
    this.alertService.startLoadingMessage();
    this.sfAccountSettingsService.getSFAccountSettings()
      .subscribe(results => this.onSFAccountSettingsDataLoadSuccessful(results), error => this.onSFAccountSettingsDataLoadFailed(error));
  }


  private onSFAccountSettingsDataLoadSuccessful(accountSettings: SFAccountSettings) {
    this.alertService.stopLoadingMessage();
    this.sfAccountSettings = accountSettings;
    this.billingLine1 = accountSettings.billingLine1;
    this.billingLine2 = accountSettings.billingLine2;
    this.billingLine3 = accountSettings.billingLine3;
    this.billingMunicipality = accountSettings.billingMunicipality;
    this.billingStateOrProvince = accountSettings.billingStateOrProvince;
    this.billingPostalCode = accountSettings.billingPostalCode;
    this.billingCountry = accountSettings.billingCountry;
    this.shippingLine1 = accountSettings.shippingLine1;
    this.shippingLine2 = accountSettings.shippingLine2;
    this.shippingLine3 = accountSettings.shippingLine3;
    this.shippingMunicipality = accountSettings.shippingMunicipality;
    this.shippingStateOrProvince = accountSettings.shippingStateOrProvince;
    this.shippingPostalCode = accountSettings.shippingPostalCode;
    this.shippingCountry = accountSettings.shippingCountry;
  }


  private onSFAccountSettingsDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Load Error", `Unable to retrieve account settings from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);

    this.sfAccountSettings = new SFAccountSettings();
  }


  private edit() {
    this.isEditMode = true;
    this.showValidationErrors = true;
  }


  private save() {
    this.isSaving = true;
    this.alertService.startLoadingMessage("Saving changes...");
    this.sfAccountSettingsService.saveSFAccountSettings(this.sfAccountSettings)
      .subscribe(
        response => this.saveSuccessHelper(response),
        error => this.saveFailedHelper(error));
  }


  private saveSuccessHelper(response: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.showValidationErrors = false;
    this.resetForm();
    if (!this.isGeneralEditor) {
      this.loadSFAccountSettingsData();
    }
    this.alertService.showMessage("Success", "Changes to Account Settings were saved successfully", MessageSeverity.success);
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
    if (!this.isGeneralEditor) {
      this.loadSFAccountSettingsData();
    }
    if (this.changesFailedCallback)
      this.changesFailedCallback();
  }


  private cancel() {
    this.showValidationErrors = false;
    this.resetForm();

    if (!this.isGeneralEditor) {
      this.loadSFAccountSettingsData();
    }

    this.alertService.showMessage("Cancelled", "Operation cancelled by user", MessageSeverity.default);
    this.alertService.resetStickyMessage();

    if (!this.isGeneralEditor)
      this.isEditMode = false;

    if (this.changesCancelledCallback)
      this.changesCancelledCallback();
  }


  private close() {
    this.showValidationErrors = false;
    this.resetForm();
    this.isEditMode = false;

    if (!this.isGeneralEditor) {
      this.loadSFAccountSettingsData();
    }

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

}
