import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent, HotKeysHintComponent } from './components';
import { SharedModule } from "@Shared/shared.module";

@NgModule({
  declarations: [
    HeaderComponent,
    HotKeysHintComponent,
  ],
    exports: [
        HeaderComponent,
        HotKeysHintComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ]
})
export class CoreModule {}
