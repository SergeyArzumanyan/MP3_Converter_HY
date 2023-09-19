import { Injectable } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public selectedLang: string = localStorage.getItem('selectedLang') || 'en';

  constructor(private translateService: TranslateService) {}

  public initLanguage(): void {
    localStorage.setItem('selectedLang', this.selectedLang);
    this.translateService.use(this.selectedLang);
  }

  // public changeLanguage():  void {
  //   this.selectedLang = '';
  //   this.initLanguage();
  // }
}
