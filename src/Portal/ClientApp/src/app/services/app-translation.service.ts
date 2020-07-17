import { Injectable } from '@angular/core';
import { TranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable, Subject, of } from 'rxjs';



@Injectable()
export class AppTranslationService {

  readonly defaultLanguage = 'en';
  private onLanguageChanged = new Subject<string>();
  languageChanged$ = this.onLanguageChanged.asObservable();

  constructor(private translate: TranslateService) {
     
    this.setDefaultLanguage(this.defaultLanguage);
  }


  addLanguages(lang: string[]) {
    this.translate.addLangs(lang);
  }


  setDefaultLanguage(lang: string) {
    this.translate.setDefaultLang(lang);
  }

  getDefaultLanguage() {
    return this.translate.defaultLang;
  }

  getBrowserLanguage() {
    return this.translate.getBrowserLang();
  }


  useBrowserLanguage(): string | void {
    const browserLang = this.getBrowserLanguage();

    // TODO: Correct Dutch language code to NL; remove DE and SP.
    if (browserLang.match(/en|fr|de|nl|ar|ko|pt|sp|es|zh/)) {
      this.changeLanguage(browserLang);
      return browserLang;
    }
  }

  changeLanguage(language: string = 'en') {
     
    if (!language) {
      language = this.translate.defaultLang;
    }

    if (language != this.translate.currentLang) {
      setTimeout(() => {
        this.translate.use(language);
        this.onLanguageChanged.next(language);
      });
    }

    return language;
  }


  getTranslation(key: string | Array<string>, interpolateParams?: Object): string | any {
    return this.translate.instant(key, interpolateParams);
  }


  getTranslationAsync(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return this.translate.get(key, interpolateParams);
  }

}




export class TranslateLanguageLoader implements TranslateLoader {

  public getTranslation(lang: string): any {
    //Note Dynamic require(variable) will not work. Require is always at compile time

    switch (lang) {
      case 'en':
        return of(require('../assets/locale/en.json'));
      case 'fr':
        return of(require('../assets/locale/fr.json'));
      case 'es':
        return of(require('../assets/locale/sp.json'));
      case 'sp':                                          // TODO: Remove incorrect/redundant language code SP.
        return of(require('../assets/locale/sp.json'));
      case 'de':                                          // TODO: Correct the Dutch language code to NL, remove incorrect/redundant DE.
        return of(require('../assets/locale/de.json'));
      case 'nl':                                          
        return of(require('../assets/locale/de.json'));
      case 'pt':                                          // There's currently no option in app.component.html to select Portuguese.
        return of(require('../assets/locale/pt.json'));
      case 'ar':                                          // There's currently no option in app.component.html to select Arabic.
        return of(require('../assets/locale/ar.json'));
      case 'ko':                                          // There's currently no option in app.component.html to select Korean.
        return of(require('../assets/locale/ko.json'));
      case 'zh':
        return of(require('../assets/locale/zh.json'));
      default:
    }
  }
}
