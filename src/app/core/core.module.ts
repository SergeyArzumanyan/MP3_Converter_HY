import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components';
import { SharedModule } from "@Shared/shared.module";

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class CoreModule {}
