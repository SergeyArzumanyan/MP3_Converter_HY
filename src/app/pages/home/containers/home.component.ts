import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { finalize, take } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { MessageService } from "primeng/api";

import { HotKey } from "@Core/enums";
import { youtubeUrlValidator } from "@Core/validators";
import { IUrlForm, IConvertedVideo } from "@Core/interfaces";
import { HomeService, HotKeysService, LayoutService } from "@Core/services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  urlForm: FormGroup<IUrlForm> = new FormGroup<IUrlForm>({
    url: new FormControl<string | null>(null, [
      Validators.required,
      youtubeUrlValidator()
    ])
  });

  HotKey: typeof HotKey = HotKey;

  pending: boolean = false;
  convertedVideo: IConvertedVideo | null = null;

  constructor(
    private homeService: HomeService,
    private messageService: MessageService,
    private hotKeysService: HotKeysService,
    private cdr: ChangeDetectorRef,
    public layoutService: LayoutService,
  ) {
  }

  ngOnInit(): void {
    this.listenToHotKeys();
  }

  private listenToHotKeys(): void {
    this.hotKeysService.registerHotKey(
      [HotKey.Shift, HotKey.C],
      () => this.convertToMP3(),
    );

    this.hotKeysService.registerHotKey(
      [HotKey.Shift, HotKey.D],
      () => this.downloadMP3(),
    );

    this.hotKeysService.registerHotKey(
      [HotKey.Shift, HotKey.R],
      () => this.reset(),
    );

    this.hotKeysService.registerHotKey(
      [HotKey.Meta, HotKey.V],
      () => this.pasteTheLink(),
    );

    this.hotKeysService.registerHotKey(
      [HotKey.Ctrl, HotKey.V],
      () => this.pasteTheLink(),
    );
  }

  convertToMP3(): void {
    if (!this.urlForm.controls.url.value || this.urlForm.invalid) {
      this.urlForm.markAllAsTouched();
      this.pending = false;
      this.cdr.markForCheck();
      return;
    }

    this.pending = true;
    this.cdr.markForCheck();
    const videoUrl: URL = new URL(this.urlForm.controls.url.value);
    const videoID: string | null = videoUrl.searchParams.get('v');

    this.homeService.convertToMP3(videoID ? videoID : '')
      .pipe(
        take(1),
        finalize(() => {
          this.pending = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (res: IConvertedVideo) => {
          if (res.duration >= 7200) {
            this.messageService.add({ severity: 'error', summary: 'Video is longer than 2 hours' });
            this.reset();
            return;
          }

          if ((res as any).code === 403) {
            this.messageService.add({ severity: 'error', summary: 'Code 403, please try again later' });
            this.reset();
            return;
          }

          if (res.progress !== 100) {
            this.messageService.add({
              severity: 'info',
              summary: `Video is still processing, ${ res.progress }% processed, please try again`
            });
            this.reset();
            return;
          }

          this.convertedVideo = res;
        },
        error: (e: HttpErrorResponse) => console.error('Error when converting to mp3 --', e),
      });
  }

  downloadMP3(): void {
    if (!this.convertedVideo?.link || this.convertedVideo?.link?.length < 0) {
      return;
    }

    const anchor: HTMLAnchorElement = document.createElement('a');
    anchor.href = this.convertedVideo!.link;
    anchor.download = '';
    anchor.click();
    anchor.remove();
  }

  subscribeToInputChanges(): void {
    if (!this.urlForm.controls.url.value) {
      this.convertedVideo = null;
      this.cdr.markForCheck();
    }
  }

  reset(): void {
    this.convertedVideo = null;
    this.urlForm.reset();
    this.cdr.markForCheck();
  }

  pasteTheLink(): void {
    navigator.clipboard.readText()
      .then((copiedLink: string) => {
        this.urlForm.controls.url.setValue(copiedLink);
        this.cdr.markForCheck();
      });
  }
}
