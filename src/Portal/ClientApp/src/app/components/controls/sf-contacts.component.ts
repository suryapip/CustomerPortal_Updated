import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, ViewChildren, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { Utilities } from "../../services/utilities";

import { SFAccountSettingsService } from "../../services/sf-account-settings.service";
import { SFContact } from "../../models/sf-contact.model";
import { SFContactInfoComponent } from "./sf-contact-info.component";
import { SFContactRole } from "../../models/sf-contact-role.model";

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

  // A contact's roles are stored as individual boolean fields in the SFContacts table, not in a separate association table.
  // The SFContactRole object is hardcoded on the UI side for display purposes; it doesn't propagate to the database.
  allRoles: SFContactRole[] = [
    new SFContactRole('Main', 'Main Contact'),
    new SFContactRole('Billing', 'Billing Contact'),
    new SFContactRole('Shipping', 'Shipping Contact'),
    new SFContactRole('Service', 'Service Contact'),
    new SFContactRole('Property', 'Property Contact'),
    new SFContactRole('Installation', 'Installation Contact'),
    new SFContactRole('Marketing', 'Marketing Contact')
  ];

  @ViewChild('indexTemplate') indexTemplate: TemplateRef<any>;
  @ViewChild('contactNameTemplate') contactNameTemplate: TemplateRef<any>;
  @ViewChild('rolesTemplate') rolesTemplate: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;
  @ViewChild('editorModal') editorModal: ModalDirective;
  @ViewChild('sfContactEditor') sfContactEditor: SFContactInfoComponent;

  constructor(private alertService: AlertService, private translationService: AppTranslationService, private sfAccountSettingsService: SFAccountSettingsService) {
  }


  ngOnInit() {

    let gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: "index", name: '#', width: 40, cellTemplate: this.indexTemplate, canAutoResize: false },
      { prop: 'name', name: gT('Contacts.management.Name'), width: 130, cellTemplate: this.contactNameTemplate },
      { prop: 'email', name: gT('Contacts.management.Email'), width: 90 },
      { prop: 'phone', name: gT('Contacts.management.Phone'), width: 120 },
      { prop: 'roles', name: gT('Contacts.management.Roles'), width: 120, cellTemplate: this.rolesTemplate },
      { prop: 'active', name: gT('Contacts.management.Active'), width: 70 },
    ];

    this.columns.push({ name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false });

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
  }


  addNewContactToList() {
    if (this.sourceContact) {
      Object.assign(this.sourceContact, this.editedContact);

      let sourceIndex = this.rowsCache.indexOf(this.sourceContact, 0);
      if (sourceIndex > -1)
        Utilities.moveArrayItem(this.rowsCache, sourceIndex, 0);

      sourceIndex = this.rows.indexOf(this.sourceContact, 0);
      if (sourceIndex > -1)
        Utilities.moveArrayItem(this.rows, sourceIndex, 0);

      this.editedContact = null;
      this.sourceContact = null;
    }
    else {
      let sfContact = new SFContact();
      Object.assign(sfContact, this.editedContact);
      this.editedContact = null;

      let maxIndex = 0;
      for (let u of this.rowsCache) {
        if ((<any>u).index > maxIndex)
          maxIndex = (<any>u).index;
      }

      (<any>sfContact).index = maxIndex + 1;

      this.rowsCache.splice(0, 0, sfContact);
      this.rows.splice(0, 0, sfContact);
      this.rows = [...this.rows];
    }
  }


  loadData() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;
    //this.accountService.getUsersAndRoles().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
    this.sfAccountSettingsService.getSFContacts().subscribe(results => this.onDataLoadSuccessful(results), error => this.onDataLoadFailed(error));
  }


  //onDataLoadSuccessful(sfContacts: SFContact[], roles: Role[]) {
  onDataLoadSuccessful(sfContacts: SFContact[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    sfContacts.forEach((sfContact, index, sfContacts) => {
      (<any>sfContact).index = index + 1;
    });

    this.rowsCache = [...sfContacts];
    this.rows = sfContacts;

    //this.allRoles = roles;
  }


  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage("Load Error", `Unable to retrieve contacts from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
      MessageSeverity.error, error);
  }


  onSearchChanged(value: string) {
    this.rows = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.email, r.phone));
  }

  onEditorModalHidden() {
    this.editingContactName = null;
    this.sfContactEditor.resetForm(true);
  }


  newSFContact() {
    this.editingContactName = null;
    this.sourceContact = null;
    //this.editedContact = this.sfContactEditor.newSFContact(this.allRoles);
    this.editedContact = this.sfContactEditor.newSFContact();
    this.editorModal.show();
  }


  editSFContact(row: SFContact) {
    this.editingContactName = { name: row.name };
    this.sourceContact = row;
    //this.editedContact = this.sfContactEditor.editSFContact(row, this.allRoles);
    this.editedContact = this.sfContactEditor.editSFContact(row);
    this.editorModal.show();
  }

}
