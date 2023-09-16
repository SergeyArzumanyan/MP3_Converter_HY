import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public colorScheme: string = localStorage.getItem('selectedTheme') || 'light';
  public colorScheme$: BehaviorSubject<string> = new BehaviorSubject<string>(this.colorScheme);

  constructor() {
    this.addLinksToDocument();
    if (!localStorage.getItem('selectedTheme')) {
      localStorage.setItem('selectedTheme', this.colorScheme);
    }
  }

  private setColorSchemeStates(): void {
    this.colorScheme = this.colorScheme === 'light' ? 'dark' : 'light';
    this.colorScheme$.next(this.colorScheme);
    localStorage.setItem('selectedTheme', this.colorScheme);
  }

  public changeColorScheme(): void {
    this.setColorSchemeStates();
    this.addLinksToDocument();
  }

  private addLinksToDocument(): void {
    this.addOrReplaceLink('layout-css', 'layouts', `layout-${this.colorScheme}.css`);
    this.addOrReplaceLink('theme-css', 'themes', `theme-${this.colorScheme}.css`);
    this.setColorSchemeOfHTML();
  }

  private addOrReplaceLink(id: string, styleSheetPath: string, fileName: string): void {
    if (!document.getElementById(id)) {
      const linkElement: HTMLLinkElement = document.createElement('link');

      linkElement.id = id;
      linkElement.rel = 'stylesheet'
      linkElement.type = 'text/css';
      linkElement.href = `assets/${styleSheetPath}/${fileName}`;

      document.querySelector('head')!.appendChild(linkElement);
    } else {
      const existingLinkElement: any = document.getElementById(id);

      existingLinkElement.href = `assets/${styleSheetPath}/${fileName}`;
    }
  }

  private setColorSchemeOfHTML(): void {
    document.documentElement.style.colorScheme = this.colorScheme;
  }

}
