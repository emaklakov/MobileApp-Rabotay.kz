import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage/storage.service';
import { cordova } from '@ionic-native/core';

declare var ga: any;

@Injectable({
	providedIn: 'root'
})
export class OptionsService {

	optionslocationSelectState = new BehaviorSubject(null);
	optionsuserAccessToken = new BehaviorSubject(null);

	notUpdatePage: boolean = true;
	appVersion: string = '';
	userFirebaseToken: string = '';
	routerLink: string = '';
	InAppBrowser: any;
	selectCategoryId: string = '';
	timerSMS: any;

	//apiUrl: string = 'http://127.0.0.1:8000';
	//apiUrl: string = 'http://127.0.0.1:8001';
	//apiUrl: string = 'http://api.rabotay.local';
	apiUrl: string = 'https://api.rabotay.kz';

	constructor(
		private storageS: StorageService,
		private platform: Platform,
	) {
		this.platform.ready().then(() => {
			console.log('Load Options');
			this.loadLocationSelect();
			this.loadUserAccessToken();
		});
	}

	getApiUrl() {
		return this.apiUrl;
	}

	loadLocationSelect() {
		this.storageS.getObject('selectLocation').then(object => {
			if(object && object != null) {
				this.optionslocationSelectState.next(object);
			}
		});
	}

	updateLocationSelect(location) {
		this.optionslocationSelectState.next(location);
		this.storageS.setObject('selectLocation', location);
	}

	getLocationSelect() {
		return this.optionslocationSelectState.value;
	}

	removeLocationSelect() {
		this.optionslocationSelectState.next(null);
		this.storageS.remove('selectLocation');
	}

	loadUserAccessToken() {
		this.storageS.getObject('userAccessToken').then(object => {
			if (object != null) {
				this.optionsuserAccessToken.next(object);
			}
		});
	}

	updateUserAccessToken(userAccessToken) {
		this.optionsuserAccessToken.next(userAccessToken);
		this.storageS.setObject('userAccessToken', userAccessToken);
	}

	getUserAccessToken() {
		return this.optionsuserAccessToken.value;
	}

	removeUserAccessToken() {
		this.optionsuserAccessToken.next(null);
		this.storageS.remove('userAccessToken');
	}

	openBrowser(url, target = '_blank', params = '?source=inapp') {
		var options = "location=yes,hidden=no,toolbarcolor=#10dc60,closebuttoncaption=Закрыть,closebuttoncolor=#ffffff,hideurlbar=yes,toolbarcolor=#10dc60,hidenavigationbuttons=yes,zoom=no,clearcache=yes,clearsessioncache=yes,usewkwebview=yes";
		window.open = (<any>cordova).InAppBrowser.open;
		var ref = (<any>cordova).InAppBrowser.open(url + params, target, options);
	}

	sendError(description, error) {
		console.log('Error: '+description, error);

		try {
			ga('send', 'exception', {
				'exDescription': description+error+': '+error.message,
				'exFatal': true
			});
		} catch (error) { }
	}
}
