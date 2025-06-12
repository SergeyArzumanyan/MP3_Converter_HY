import { Component, OnDestroy, OnInit } from '@angular/core';

import { ConfigService, LayoutService } from "@Core/services";
import { LanguageService } from "@Core/services/language.service";
import { fromEvent, Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  constructor(
    public configService: ConfigService,
    private languageService: LanguageService,
    private layoutService: LayoutService,
  ) {
    this.languageService.initLanguage();
  }

  ngOnInit(): void {
    this.detectDeviceView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private detectDeviceView(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if ((this.layoutService.isMobile() && window.innerWidth > 500) || (!this.layoutService.isMobile() && window.innerWidth < 500)) {
          this.layoutService.isMobile.set(window.innerWidth < 500);
        }
      });
  }
}
