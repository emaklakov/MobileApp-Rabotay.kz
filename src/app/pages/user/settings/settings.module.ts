import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Crop } from '@ionic-native/crop/ngx';

const routes: Routes = [
	{
		path: '',
		component: SettingsPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	providers: [
		FileTransfer,
		Crop,
	],
	declarations: [SettingsPage]
})
export class SettingsPageModule { }
