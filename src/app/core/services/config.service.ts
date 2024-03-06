import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private systemDefaultTheme: string = this.themeInitialValue;
  public Theme: string = this.systemDefaultTheme;
  public Theme$: BehaviorSubject<string> = new BehaviorSubject<string>(this.Theme);

  constructor() {
    /** @desc Listens to system default theme changes. */
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener(
        'change',
        (e: MediaQueryListEvent) => {
          this.systemDefaultTheme = e.matches ? "dark" : "light";
        }
      );

    this.changeTheme(this.Theme);
  }

  get themeInitialValue(): string {
    const isSystemDark: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isSystemDark ? 'dark' : 'light'
  }

  private toggleTheme(): void {
    this.Theme = this.Theme === 'light' ? 'dark' : 'light';
    this.Theme$.next(this.Theme);
  }

  public changeTheme(theme?: string): void {
    if (!theme) {
      this.toggleTheme();
    }

    this.changeCSSFilePath('theme', this.Theme + '-theme.css');
    this.setHTMLTheme();
  }

  public applyUserThemeSettings(Theme: string): void {
    this.Theme = Theme ? Theme : this.themeInitialValue;
    this.Theme$.next(this.Theme);
    this.changeTheme(this.Theme);
  }

  private setHTMLTheme(): void {
    document.documentElement.style.colorScheme = this.Theme;
  }

  /** @desc Changes filePaths in index.html for layout-{theme}.css and theme-{theme}.css files. */
  private changeCSSFilePath(id: string, cssFileName: string): void {
    const element: HTMLElement | null = document.getElementById(id);

    const cssFilePath: string[] = element.getAttribute('href').split('/');
    cssFilePath[cssFilePath.length - 1] = cssFileName;

    const newURL = cssFilePath.join('/');

    this.replaceLink(element, newURL);
  }

  /** @desc Replaces filePaths in index.html for layout-{theme}.css and theme-{theme}.css files. */
  private replaceLink(linkElement: any, href: string): void {
    linkElement.href = href;
  }
}
