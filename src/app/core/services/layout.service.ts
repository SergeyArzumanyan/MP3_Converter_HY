import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isMobile: WritableSignal<boolean> = signal(window.innerWidth < 500);
}
