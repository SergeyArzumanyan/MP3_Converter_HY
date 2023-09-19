import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent, FooterComponent, NotfoundComponent } from './components';
import { SharedModule } from "@Shared/shared.module";

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
        CommonModule,
        SharedModule,
    ]
})
export class CoreModule {
}
