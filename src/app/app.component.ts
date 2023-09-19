import { Component } from '@angular/core';

import { ConfigService } from "@Core/services";
import { LanguageService } from "@Core/services/language.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public configService: ConfigService,
    private languageService: LanguageService,
  ) {
    this.languageService.initLanguage();
  }
}
