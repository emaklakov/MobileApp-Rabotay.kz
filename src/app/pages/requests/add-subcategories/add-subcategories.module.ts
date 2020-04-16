import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddSubcategoriesPage } from './add-subcategories.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubcategoriesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddSubcategoriesPage]
})
export class AddSubcategoriesPageModule {}
