import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LanguageObservableService {
  private language = new Subject<string>();
  public languageStream$ = this.language.asObservable();

  constructor() {}


  setDefaultLanguage(language)
  {
    this.language.next(language); 
  }

  getDefaultLanguage() {
    return this.language;
  }

}
