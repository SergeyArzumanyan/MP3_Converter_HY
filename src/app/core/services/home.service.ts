import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { environment } from "@Environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class HomeService {

  constructor(private http: HttpClient) {}

  public convertToMP3(videoId: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': environment.RapidApiKey,
    });

    const params: HttpParams = new HttpParams().set('id', videoId);

    return this.http.get(environment.RapidApiHost, { headers, params });
  }
}
