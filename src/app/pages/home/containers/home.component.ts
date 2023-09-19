import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { take } from "rxjs";

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

  constructor(private homeService: HomeService) {}

  public convertToMP3(): void {
    this.pending = true;
    if (this.urlForm.valid && !this.convertedVideo && this.urlForm.controls.url.value) {
      const videoUrl: URL = new URL(this.urlForm.controls.url.value);
      const videoID: string | null = videoUrl.searchParams.get('v');

      this.homeService.convertToMP3(videoID ?  videoID : '')
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.pending = false;
            this.convertedVideo = res;

            if (res.code === 403) {
              this.reset();
            }
          },
          error: (err) => {
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
      window.open(this.convertedVideo!.link, '_self');
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
