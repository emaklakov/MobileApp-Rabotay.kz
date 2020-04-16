import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { OptionsService } from '../options/options.service';
import { StorageService } from '../storage/storage.service';
import { UserDataService } from '../user-data/user-data.service';
import {NotificationDataService} from "../notification-data/notification-data.service";

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	authState = new BehaviorSubject(false);
	redirectUrl: string = '/';

	constructor(
		private httpClient: HttpClient,
		private optionsS: OptionsService,
		private router: Router,
		private platform: Platform,
		private storageS: StorageService,
		private userDataS: UserDataService,
		private notificationDataS: NotificationDataService,
	) {
		this.userDataS.authS = this;

		this.platform.ready().then(() => {
			this.checkAccessToken();
		});
	}

	login(user: any): Observable<any> {
		return this.httpClient.post(`${this.optionsS.getApiUrl()}/v1/login`, user).pipe(
			tap(async (res: any) => {
				if (res.user && res.user.status > 0) {
					if (res.access_token != '') {
						this.authState.next(true);
						this.userDataS.updateData(res.user);
						this.optionsS.updateUserAccessToken(res.access_token);
						this.notificationDataS.getNotificationsNewState().subscribe(res => { });
					} else {
						this.authState.next(false);
						this.optionsS.removeUserAccessToken();
						this.userDataS.updateData(null);
					}
				} else {
					this.authState.next(false);
					this.optionsS.removeUserAccessToken();
					this.userDataS.updateData(null);
				}
			})
		);
	}

	async logout(redirectUrl = '/') {
		this.authState.next(false);
		this.router.navigate([redirectUrl]);
		this.optionsS.removeUserAccessToken();
		await this.storageS.remove('userPhoneNumber');
		await this.storageS.remove('userFirebaseUid');
		this.userDataS.updateData(null);
	}

	async checkAccessToken(): Promise<boolean> {
		return await this.storageS.getObject('userAccessToken').then(object => {
			if (object != null && object != '') {
				this.authState.next(true);
				this.optionsS.updateUserAccessToken(object);
				this.userDataS.loadData();
				this.notificationDataS.loadData();
				this.userDataS.sendFCMToken();
				return true;
			} else {
				this.authState.next(false);
				this.optionsS.updateUserAccessToken(object);
				return false;
			}
		});
	}

	isAuthenticated() {
		return this.authState.value;
	}
}
