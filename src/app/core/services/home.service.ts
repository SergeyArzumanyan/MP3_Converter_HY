import { Observable } from "rxjs";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";


import { IConvertedVideo } from "@Core/interfaces";
import { environment } from "@Environments/environment";

@Injectable()
export class HomeService {

  constructor(private http: HttpClient) {}

  public convertToMP3(videoId: string): Observable<IConvertedVideo> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': environment.RapidApiKey,
    });

    const params: HttpParams = new HttpParams().set('id', videoId);

    return this.http.get<IConvertedVideo>(environment.RapidApiHost, { headers, params });
  }
}
