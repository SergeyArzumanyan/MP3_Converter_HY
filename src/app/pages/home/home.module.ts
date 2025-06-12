import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from '@Pages/home/containers';
import { SharedModule } from "@Shared/shared.module";
import { HomeService } from "@Core/services";
import { CoreModule } from "@Core/core.module";


@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        HomeRoutingModule,
        CoreModule
    ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }
