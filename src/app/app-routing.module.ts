import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from "@Core/components";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('app/pages/home/home.module').then(m => m.HomeModule)
  },

  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
