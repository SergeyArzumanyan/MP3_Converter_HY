import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { take } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { MessageService } from "primeng/api";

import { IUrlForm, IConvertedVideo } from "@Core/interfaces";
import { HomeService } from "@Core/services";
import { youtubeUrlValidator } from "@Core/validators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public urlForm: FormGroup<IUrlForm> = new FormGroup<IUrlForm>({
    url: new FormControl<string | null>(null, [
      Validators.required,
      youtubeUrlValidator()
    ])
  });

  public pending: boolean = false;

  public convertedVideo: IConvertedVideo | null = null;

  constructor(
    private homeService: HomeService,
    private messageService: MessageService,
  ) {}

  public convertToMP3(): void {
    this.pending = true;
    if (this.urlForm.valid && !this.convertedVideo && this.urlForm.controls.url.value) {
      const videoUrl: URL = new URL(this.urlForm.controls.url.value);
      const videoID: string | null = videoUrl.searchParams.get('v');

      this.homeService.convertToMP3(videoID ?  videoID : '')
        .pipe(take(1))
        .subscribe({
          next: (res: IConvertedVideo) => {
            if (res.duration >= 7200) {
              this.messageService.add({severity: 'error', summary: 'Video is longer than 2 hours'});
              this.reset();
              this.pending = false;
              return;
            }

            if ((res as any).code === 403) {
              this.messageService.add({severity: 'error', summary: 'Code 403, please try again later'});
              this.reset();
              this.pending = false;
              return;
            }

            if (res.progress !== 100) {
              this.messageService.add({severity: 'info', summary: `Video is still processing, ${res.progress}% processed, please try again`});
              this.reset();
              this.pending = false;
              return;
            }

            this.pending = false;
            this.convertedVideo = res;
          },
          error: (e: HttpErrorResponse) => {
            console.error('Error when converting to mp3 --', e);
            this.pending = false;
          }
        });
    } else {
      this.urlForm.markAllAsTouched();
      this.pending = false;
    }
  }

  public downloadMP3(): void {
    if (this.convertedVideo!.link.length > 0) {
      const anchor: HTMLAnchorElement = document.createElement('a');
      anchor.href = this.convertedVideo!.link;
      anchor.download = '';
      anchor.click();
      anchor.remove();
    }
  }

  public subscribeToInputChanges(): void {
    if (!this.urlForm.controls.url.value) {
      this.convertedVideo = null;
    }
  }

  public reset(): void {
    this.convertedVideo = null;
    this.urlForm.reset();
  }
}
