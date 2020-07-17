import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin, BehaviorSubject, Notification, combineLatest, concat, from, fromEvent, pipe } from 'rxjs';
import { map, mergeMap, tap, subscribeOn } from 'rxjs/operators';
//import { TranslateService } from '@ngx-translate/core';

import { AuthService } from './auth.service';
import { validateConfig } from '@angular/router/src/config';

import { SFAccountSettings } from '../models/sf-account-settings.model';
import { SFContact } from '../models/sf-contact.model';
import { SFAccountSettingsEndpoint } from './sf-account-settings-endpoint.service';
import { SFCountry } from '../models/sf-country.model';

@Injectable()
export class SFAccountSettingsService {

  // TODO: Implement country strings in language files.
  private sfCountries: SFCountry[] = [
    new SFCountry("Afghanistan", "AFG"),
    new SFCountry("Åland Islands", "ALA"),
    new SFCountry("Albania", "ALB"),
    new SFCountry("Algeria", "DZA"),
    new SFCountry("American Samoa", "ASM"),
    new SFCountry("Andorra", "AND"),
    new SFCountry("Angola", "AGO"),
    new SFCountry("Anguilla", "AIA"),
    new SFCountry("Antarctica", "ATA"),
    new SFCountry("Antigua and Barbuda", "ATG"),
    new SFCountry("Argentina", "ARG"),
    new SFCountry("Armenia", "ARM"),
    new SFCountry("Aruba", "ABW"),
    new SFCountry("Australia", "AUS"),
    new SFCountry("Austria", "AUT"),
    new SFCountry("Azerbaijan", "AZE"),
    new SFCountry("Bahamas", "BHS"),
    new SFCountry("Bahrain", "BHR"),
    new SFCountry("Bangladesh", "BGD"),
    new SFCountry("Barbados", "BRB"),
    new SFCountry("Belarus", "BLR"),
    new SFCountry("Belgium", "BEL"),
    new SFCountry("Belize", "BLZ"),
    new SFCountry("Benin", "BEN"),
    new SFCountry("Bermuda", "BMU"),
    new SFCountry("Bhutan", "BTN"),
    new SFCountry("Bolivia", "BOL"),
    new SFCountry("Bonaire", "BES"),
    new SFCountry("Bosnia and Herzegovina", "BIH"),
    new SFCountry("Botswana", "BWA"),
    new SFCountry("Bouvet Island", "BVT"),
    new SFCountry("Brazil", "BRA"),
    new SFCountry("British Indian Ocean Territory", "IOT"),
    new SFCountry("Brunei Darussalam", "BRN"),
    new SFCountry("Bulgaria", "BGR"),
    new SFCountry("Burkina Faso", "BFA"),
    new SFCountry("Burundi", "BDI"),
    new SFCountry("Cambodia", "KHM"),
    new SFCountry("Cameroon", "CMR"),
    new SFCountry("Canada", "CAN"),
    new SFCountry("Cape Verde", "CPV"),
    new SFCountry("Cayman Islands", "CYM"),
    new SFCountry("Central African Republic", "CAF"),
    new SFCountry("Chad", "TCD"),
    new SFCountry("Chile", "CHL"),
    new SFCountry("China", "CHN"),
    new SFCountry("Christmas Island", "CXR"),
    new SFCountry("Cocos (keeling) Islands", "CCK"),
    new SFCountry("Colombia", "COL"),
    new SFCountry("Comoros", "COM"),
    new SFCountry("Congo", "COG"),
    new SFCountry("Congo, The Democratic Republic of The", "COD"),
    new SFCountry("Cook Islands", "COK"),
    new SFCountry("Costa Rica", "CRI"),
    new SFCountry("Côte D'ivoire", "CIV"),
    new SFCountry("Croatia", "HRV"),
    new SFCountry("Cuba", "CUB"),
    new SFCountry("Curaçao", "CUW"),
    new SFCountry("Cyprus", "CYP"),
    new SFCountry("Czech Republic", "CZE"),
    new SFCountry("Denmark", "DNK"),
    new SFCountry("Djibouti", "DJI"),
    new SFCountry("Dominica", "DMA"),
    new SFCountry("Dominican Republic", "DOM"),
    new SFCountry("Ecuador", "ECU"),
    new SFCountry("Egypt", "EGY"),
    new SFCountry("El Salvador", "SLV"),
    new SFCountry("Equatorial Guinea", "GNQ"),
    new SFCountry("Eritrea", "ERI"),
    new SFCountry("Estonia", "EST"),
    new SFCountry("Ethiopia", "ETH"),
    new SFCountry("Falkland Islands (malvinas)", "FLK"),
    new SFCountry("Faroe Islands", "FRO"),
    new SFCountry("Fiji", "FJI"),
    new SFCountry("Finland", "FIN"),
    new SFCountry("France", "FRA"),
    new SFCountry("French Guiana", "GUF"),
    new SFCountry("French Polynesia", "PYF"),
    new SFCountry("French Southern Territories", "ATF"),
    new SFCountry("Gabon", "GAB"),
    new SFCountry("Gambia", "GMB"),
    new SFCountry("Georgia", "GEO"),
    new SFCountry("Germany", "DEU"),
    new SFCountry("Ghana", "GHA"),
    new SFCountry("Gibraltar", "GIB"),
    new SFCountry("Greece", "GRC"),
    new SFCountry("Greenland", "GRL"),
    new SFCountry("Grenada", "GRD"),
    new SFCountry("Guadeloupe", "GLP"),
    new SFCountry("Guam", "GUM"),
    new SFCountry("Guatemala", "GTM"),
    new SFCountry("Guernsey", "GGY"),
    new SFCountry("Guinea", "GIN"),
    new SFCountry("Guinea-bissau", "GNB"),
    new SFCountry("Guyana", "GUY"),
    new SFCountry("Haiti", "HTI"),
    new SFCountry("Heard Island and Mcdonald Islands", "HMD"),
    new SFCountry("Holy See (vatican City State)", "VAT"),
    new SFCountry("Honduras", "HND"),
    new SFCountry("Hong Kong", "HKG"),
    new SFCountry("Hungary", "HUN"),
    new SFCountry("Iceland", "ISL"),
    new SFCountry("India", "IND"),
    new SFCountry("Indonesia", "IDN"),
    new SFCountry("Iran, Islamic Republic of", "IRN"),
    new SFCountry("Iraq", "IRQ"),
    new SFCountry("Ireland", "IRL"),
    new SFCountry("Isle of Man", "IMN"),
    new SFCountry("Israel", "ISR"),
    new SFCountry("Italy", "ITA"),
    new SFCountry("Jamaica", "JAM"),
    new SFCountry("Japan", "JPN"),
    new SFCountry("Jersey", "JEY"),
    new SFCountry("Jordan", "JOR"),
    new SFCountry("Kazakhstan", "KAZ"),
    new SFCountry("Kenya", "KEN"),
    new SFCountry("Kiribati", "KIR"),
    new SFCountry("Korea, Democratic People's Republic of", "PRK"),
    new SFCountry("Korea, Republic of", "KOR"),
    new SFCountry("Kosovo", "XKX"),
    new SFCountry("Kuwait", "KWT"),
    new SFCountry("Kyrgyzstan", "KGZ"),
    new SFCountry("Lao People's Democratic Republic", "LAO"),
    new SFCountry("Latvia", "LVA"),
    new SFCountry("Lebanon", "LBN"),
    new SFCountry("Lesotho", "LSO"),
    new SFCountry("Liberia", "LBR"),
    new SFCountry("Libya", "LBY"),
    new SFCountry("Liechtenstein", "LIE"),
    new SFCountry("Lithuania", "LTU"),
    new SFCountry("Luxembourg", "LUX"),
    new SFCountry("Macao", "MAC"),
    new SFCountry("Macedonia, The Former Yugoslav Republic of", "MKD"),
    new SFCountry("Madagascar", "MDG"),
    new SFCountry("Malawi", "MWI"),
    new SFCountry("Malaysia", "MYS"),
    new SFCountry("Maldives", "MDV"),
    new SFCountry("Mali", "MLI"),
    new SFCountry("Malta", "MLT"),
    new SFCountry("Marshall Islands", "MHL"),
    new SFCountry("Martinique", "MTQ"),
    new SFCountry("Mauritania", "MRT"),
    new SFCountry("Mauritius", "MUS"),
    new SFCountry("Mayotte", "MYT"),
    new SFCountry("Mexico", "MEX"),
    new SFCountry("Micronesia, Federated States of", "FSM"),
    new SFCountry("Moldova, Republic of", "MDA"),
    new SFCountry("Monaco", "MCO"),
    new SFCountry("Mongolia", "MNG"),
    new SFCountry("Montenegro", "MNE"),
    new SFCountry("Montserrat", "MSR"),
    new SFCountry("Morocco", "MAR"),
    new SFCountry("Mozambique", "MOZ"),
    new SFCountry("Myanmar", "MMR"),
    new SFCountry("Namibia", "NAM"),
    new SFCountry("Nauru", "NRU"),
    new SFCountry("Nepal", "NPL"),
    new SFCountry("Netherlands", "NLD"),
    new SFCountry("Netherlands Antilles", "ANT"),
    new SFCountry("New Caledonia", "NCL"),
    new SFCountry("New Zealand", "NZL"),
    new SFCountry("Nicaragua", "NIC"),
    new SFCountry("Niger", "NER"),
    new SFCountry("Nigeria", "NGA"),
    new SFCountry("Niue", "NIU"),
    new SFCountry("Norfolk Island", "NFK"),
    new SFCountry("Northern Mariana Islands", "MNP"),
    new SFCountry("Norway", "NOR"),
    new SFCountry("Oman", "OMN"),
    new SFCountry("Pakistan", "PAK"),
    new SFCountry("Palau", "PLW"),
    new SFCountry("Palestinian Territory, Occupied", "PSE"),
    new SFCountry("Panama", "PAN"),
    new SFCountry("Papua New Guinea", "PNG"),
    new SFCountry("Paraguay", "PRY"),
    new SFCountry("Peru", "PER"),
    new SFCountry("Philippines", "PHL"),
    new SFCountry("Pitcairn", "PCN"),
    new SFCountry("Poland", "POL"),
    new SFCountry("Portugal", "PRT"),
    new SFCountry("Puerto Rico", "PRI"),
    new SFCountry("Qatar", "QAT"),
    new SFCountry("Réunion", "REU"),
    new SFCountry("Romania", "ROU"),
    new SFCountry("Russian Federation", "RUS"),
    new SFCountry("Rwanda", "RWA"),
    new SFCountry("Saint Barthélemy", "BLM"),
    new SFCountry("Saint Helena", "SHN"),
    new SFCountry("Saint Kitts and Nevis", "KNA"),
    new SFCountry("Saint Lucia", "LCA"),
    new SFCountry("Saint Martin (French Part)", "MAF"),
    new SFCountry("Saint Pierre and Miquelon", "SPM"),
    new SFCountry("Saint Vincent and The Grenadines", "VCT"),
    new SFCountry("Samoa", "WSM"),
    new SFCountry("San Marino", "SMR"),
    new SFCountry("Sao Tome and Principe", "STP"),
    new SFCountry("Saudi Arabia", "SAU"),
    new SFCountry("Senegal", "SEN"),
    new SFCountry("Serbia", "SRB"),
    new SFCountry("Seychelles", "SYC"),
    new SFCountry("Sierra Leone", "SLE"),
    new SFCountry("Singapore", "SGP"),
    new SFCountry("Sint Maartin (Dutch Part)", "SXM"),
    new SFCountry("Slovakia", "SVK"),
    new SFCountry("Slovenia", "SVN"),
    new SFCountry("Solomon Islands", "SLB"),
    new SFCountry("Somalia", "SOM"),
    new SFCountry("South Africa", "ZAF"),
    new SFCountry("South Georgia and The South Sandwich Islands", "SGS"),
    new SFCountry("South Sudan", "SSD"),
    new SFCountry("Spain", "ESP"),
    new SFCountry("Sri Lanka", "LKA"),
    new SFCountry("Sudan", "SDN"),
    new SFCountry("Suriname", "SUR"),
    new SFCountry("Svalbard and Jan Mayen", "SJM"),
    new SFCountry("Swaziland", "SWZ"),
    new SFCountry("Sweden", "SWE"),
    new SFCountry("Switzerland", "CHE"),
    new SFCountry("Syrian Arab Republic", "SYR"),
    new SFCountry("Taiwan, Province of China", "TWN"),
    new SFCountry("Tajikistan", "TJK"),
    new SFCountry("Tanzania, United Republic of", "TZA"),
    new SFCountry("Thailand", "THA"),
    new SFCountry("Timor-Leste", "TLS"),
    new SFCountry("Togo", "TGO"),
    new SFCountry("Tokelau", "TKL"),
    new SFCountry("Tonga", "TON"),
    new SFCountry("Trinidad and Tobago", "TTO"),
    new SFCountry("Tunisia", "TUN"),
    new SFCountry("Turkey", "TUR"),
    new SFCountry("Turkmenistan", "TKM"),
    new SFCountry("Turks and Caicos Islands", "TCA"),
    new SFCountry("Tuvalu", "TUV"),
    new SFCountry("Uganda", "UGA"),
    new SFCountry("Ukraine", "UKR"),
    new SFCountry("United Arab Emirates", "ARE"),
    new SFCountry("United Kingdom", "GBR"),
    new SFCountry("United States", "USA"),
    new SFCountry("United States Minor Outlying Islands", "UMI"),
    new SFCountry("Uruguay", "URY"),
    new SFCountry("Uzbekistan", "UZB"),
    new SFCountry("Vanuatu", "VUT"),
    new SFCountry("Venezuela, Bolivarian Republic of", "VEN"),
    new SFCountry("Viet Nam", "VNM"),
    new SFCountry("Virgin Islands, British", "VGB"),
    new SFCountry("Virgin Islands, U.S.", "VIR"),
    new SFCountry("Wallis and Futuna", "WLF"),
    new SFCountry("Western Sahara", "ESH"),
    new SFCountry("Yemen", "YEM"),
    new SFCountry("Zambia", "ZMB"),
    new SFCountry("Zimbabwe", "ZWE")
  ];

  constructor(private router: Router, private http: HttpClient, private authService: AuthService,
    private sfAccountSettingsEndpoint: SFAccountSettingsEndpoint) { //, private translateService: TranslateService) {
  }


  // SFAccountSettings
  getSFAccountSettings() {
    return this.sfAccountSettingsEndpoint.getSFAccountSettingsEndpoint<SFAccountSettings>();
  }

  saveSFAccountSettings(sfAccountSettings: SFAccountSettings) {
    return this.sfAccountSettingsEndpoint.getSaveSFAccountSettingsEndpoint<SFAccountSettings>(sfAccountSettings);
  }


  // SFContacts
  getSFContacts(page?: number, pageSize?: number) {
    return this.sfAccountSettingsEndpoint.getSFContactsEndpoint<SFContact[]>(page, pageSize);
  }

  getSFContact(id?: number) {
    return this.sfAccountSettingsEndpoint.getSFContactEndpoint<SFContact>(id);
  }

  saveSFContact(sfContact: SFContact) {
    return this.sfAccountSettingsEndpoint.getSaveSFContactEndpoint<SFContact>(sfContact);
  }


  // SFCountries
  getSFCountries() {
    //return this.translateService.get('Countries');
    return this.sfCountries;
  }

  getSFCountry(code?: string) {
    if (!code) return new SFCountry("", "");
    for (let sfCountry of this.sfCountries) {
      if (sfCountry.code == code) return sfCountry; //code.toUpperCase()
    }
    return new SFCountry("", "");
  }

}
