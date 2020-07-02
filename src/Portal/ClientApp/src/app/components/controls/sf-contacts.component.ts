import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, ViewChildren, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";

import { SFAccountSettingsService } from "../../services/sf-account-settings.service";
import { SFContact } from "../../models/sf-contact.model";
import { SFContactInfoComponent } from "./sf-contact-info.component";

@Component({
  selector: 'sf-contacts',
  templateUrl: './sf-contacts.component.html',
  styleUrls: ['./sf-contacts.component.css']
})
export class SFContactsComponent implements OnInit, AfterViewInit {
  columns: any[] = [];
  rows: SFContact[] = [];
  rowsCache: SFContact[] = [];
  editedContact: SFContact;
  sourceContact: SFContact;
  editingContactName: { name: string };
  loadingIndicator: boolean;
  //numMainContacts: number;

  //@ViewChild('indexTemplate') indexTemplate: TemplateRef<any>;
  @ViewChild('rolesTemplate') rolesTemplate: TemplateRef<any>;
  @ViewChild('activeTemplate') activeTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('editorModal') editorModal: ModalDirective;
  @ViewChild('sfContactEditor') sfContactEditor: SFContactInfoComponent;

  constructor(private alertService: AlertService, private translationService: AppTranslationService, private sfAccountSettingsService: SFAccountSettingsService) {
  }


  ngOnInit() {

    let gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      //{ prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
      { prop: 'name', name: gT('Contacts.management.Name'), width: 120 },
      { prop: 'email', name: gT('Contacts.management.Email'), width: 140 },
      { prop: 'phone', name: gT('Contacts.management.Phone'), width: 90 },
      { prop: 'roles', name: gT('Contacts.management.Roles'), width: 170, cellTemplate: this.rolesTemplate },
      { prop: 'active', name: gT('Contacts.management.Active'), width: 30, cellTemplate: this.activeTemplate },
    ];

    this.columns.push({ name: '', width: 65, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

    this.loadData();
  }


  ngAfterViewInit() {

    this.sfContactEditor.changesSavedCallback = () => {
      this.addNewContactToList();
      this.editorModal.hide();
    };

    this.sfContactEditor.changesCancelledCallback = () => {
      this.editedContact = null;
      this.sourceContact = null;
      this.editorModal.hide();
    };

    //this.sfContactEditor.numMainContactsCallback = () => {
    //  this.sfContactEditor.numMainContacts = this.getNumMainContacts();
    //};

  }


  addNewContactToList() {
    try {
      this.fillName(this.editedContact);
      this.fillRoles(this.editedContact);
      // Edit Contact
      if (this.sourceContact) {
        Object.assign(this.sourceContact, this.editedContact);

        //// Move edited contact to the top of the grid
        //let sourceIndex = this.rowsCache.indexOf(this.sourceContact, 0);
        //if (sourceIndex > -1)
        //  Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);
        //sourceIndex = this.rows.indexOf(this.sourceContact, 0);
        //if (sourceIndex > -1)
        //  Utilities.moveArrayItem(this.rows, sourceIndex, 0);

        this.editedContact = null;
        this.sourceContact = null;
      }
      // New Contact
      else {
        let sfContact = new SFContact();
        Object.assign(sfContact, this.editedContact);
        this.editedContact = null;

        //let maxIndex = 0;
        //for (let u of this.rowsCache) {
        //  if ((<any>u).index > maxIndex)
        //    maxIndex = (<any>u).index;
        //}

        //(<any>sfContact).index = maxIndex + 1;

        this.rowsCache.splice(0, 0, sfContact);
        this.rows.splice(0, 0, sfContact);
        this.rows = [...this.rows];
      }
    }
    catch (e) {
      throw Error(Utilities.getErrorString(e, 'SFContactsComponent.addNewContactToList'));
    }

  }


  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    this.sfAccountSettingsService.getSFContacts().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
  }


  onDataLoadSuccessful(sfContacts: SFContact[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    //this.numMainContacts = 0;

    sfContacts.forEach((sfContact, index, sfContacts) => {
      //(<any>sfContact).index = index + 1;
      this.fillName((<any>sfContact));
      this.fillRoles(<any>sfContact);
      //if ((<any>sfContact).mainContact) this.numMainContacts++;
    });

    this.rowsCache = [...sfContacts];
    this.rows = sfContacts;
  }


  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage("Load Error", `Unable to retrieve contacts from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);
  }


  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.firstName, r.lastName, r.email, r.phone));
  }

  onEditorModalHidden() {
    this.editingContactName = null;
    this.sfContactEditor.resetForm(true);
  }


  newSFContact() {
    this.editingContactName = null;
    this.sourceContact = null;
    this.editedContact = this.sfContactEditor.newSFContact();
    this.editorModal.show();
  }


  editSFContact(row: SFContact) {
    this.editingContactName = { name: row.name };
    this.sourceContact = row;
    this.editedContact = this.sfContactEditor.editSFContact(row);
    this.editorModal.show();
  }


  // Populate the contact's full name.
  fillName(sfContact: SFContact) {
    let firstName = sfContact.firstName ? (sfContact.firstName.toLowerCase() != 'null' ? sfContact.firstName : '') : '';
    sfContact.name = (firstName + ' ' + sfContact.lastName).trim();
  }

  // Populate the contact's Roles.
  fillRoles(sfContact: SFContact) {
    sfContact.roles = [];
    if (sfContact.mainContact) sfContact.roles.push('Main');
    if (sfContact.billingContact) sfContact.roles.push('Billing');
    if (sfContact.shippingContact) sfContact.roles.push('Shipping');
    if (sfContact.serviceContact) sfContact.roles.push('Service');
    if (sfContact.propertyContact) sfContact.roles.push('Property');
    if (sfContact.installationContact) sfContact.roles.push('Installation');
    if (sfContact.marketingContact) sfContact.roles.push('Marketing');
  }

  getNumMainContacts() {
    let numMainContacts = 0;
    //let sfContacts = this.rows;
    for(let sfContact of this.rows) 
      if (sfContact.mainContact) numMainContacts++;
    return numMainContacts;
  }

}
