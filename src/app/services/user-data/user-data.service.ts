import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
//import { Platform } from '@ionic/angular';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OptionsService } from '../options/options.service';
import { error } from 'util';

declare var ga: any;

@Injectable({
	providedIn: 'root'
})
export class UserDataService {

	authS: any;
	userData = new BehaviorSubject([]);
	currentUser: any;
	authHeaders: any;

	constructor(
		private httpClient: HttpClient,
		//private platform: Platform,
		private optionsS: OptionsService,
		private storageS: StorageService,
	) {}

	loadData(): void {
		this.storageS.getObject('userData').then((data) => {
			this.updateData(data);
			this.getServerData().subscribe(res => { });
		});
	}

	updateData(data): void {
		if (data && data != null) {
			this.currentUser = data;
			this.storageS.setObject('userData', data);

			try {
				ga('set', 'userId', data.user.id);
				ga('set', 'appVersion', this.optionsS.appVersion);
				ga('send', 'pageview');
			} catch (error) { }
		} else {
			this.currentUser = null;
			this.storageS.remove('userData');
		}

		this.userData.next(data);
	}

	updateServerData(user: any): Observable<any> {
		if (this.currentUser && this.currentUser.id) {
			this.getAccessToken();
			return this.httpClient.put(`${this.optionsS.getApiUrl()}/v1/users/${this.currentUser.id}`, user, this.authHeaders).pipe(
				tap(async (res: any) => {
					//console.log(res);
					if (res && res.status > 0) {
						this.updateData(res);
					} else {
						//this.updateData(null);
						//this.optionsS.removeUserAccessToken();
						this.authS.logout();
					}
				})
			);
		}

		return new Observable();
	}

	getAccessToken() {
		var accessToken = this.optionsS.getUserAccessToken();
		this.authHeaders = {
			headers: new HttpHeaders({
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + accessToken
			})
		};
	}

	getServerData(): Observable<any> {
		this.currentUser = this.userData.value;

		if (this.currentUser && this.currentUser.id) {
			this.getAccessToken();
			console.log('user-data.service - getServerData');
			return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/users/${this.currentUser.id}/data`, this.authHeaders).pipe(
				catchError((error) => {
					console.log('user-data.service - Error - getServerData()', error);

					if (error.status == 401) {
						this.authS.logout();
						this.updateData(null);
					}

					return of();
				}),
				tap(async (res: any) => {
					//console.log('authS 2', this.authS);
					//console.log(res);
					if (res && res.status > 0) {
						this.updateData(res);
					} else {
						this.authS.logout();
						this.updateData(null);
					}
				})
			);
		} else {
			//this.authS.logout();
			//this.updateData(null);
		}

		return new Observable();
	}

	getServerProfile(userId): Observable<any> {
		this.getAccessToken();
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/users/${userId}`, this.authHeaders).pipe(
			catchError((error) => {
				console.log('Error: user-data.service - getServerProfile', error);
				return of();
			}),
			tap(async (res: any) => {})
		);
	}

	handleError(error: HttpErrorResponse) {
		return throwError(error);
	}

	sendFCMToken() {
		if(this.optionsS.userFirebaseToken && this.optionsS.userFirebaseToken != '') {
			var user = {
				'firebase_fcm_token': this.optionsS.userFirebaseToken,
			};

			this.updateServerData(user).subscribe(res => { });
		}
	}

	getAllPayments(filter: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/payments?page=${filter.page}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	getAllFeedbacks(filter: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/users/${filter.userId}/rating?page=${filter.page}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl).pipe(
			tap(async (res: any) => { })
		);
	}

	getAllSubscriptions(locationId: any): Observable<any> {
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/subscriptions/${locationId}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	unSubscribe(subscriptionId: any): Observable<any> {
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/subscriptions/${subscriptionId}`;
		//console.log(fullUrl);
		return this.httpClient.delete(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	setSubscribe(categoryId: any, locationId: any): Observable<any> {
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/subscriptions`;
		var data = {
			"category_id": categoryId,
			"location_id": locationId
		};

		return this.httpClient.post(fullUrl, data, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}
}
