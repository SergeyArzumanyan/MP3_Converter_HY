import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent, FooterComponent, NotfoundComponent } from './components';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotfoundComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    NotfoundComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule {
}
