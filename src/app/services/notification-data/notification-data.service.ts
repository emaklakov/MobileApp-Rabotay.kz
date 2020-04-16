import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {OptionsService} from "../options/options.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import { catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class NotificationDataService {

	notificationsNewState = new BehaviorSubject(false);

	authHeaders: any;

	constructor(
		private httpClient: HttpClient,
		private optionsS: OptionsService,
	) {}

	loadData() {
		this.getNotificationsNewState().subscribe(res => { });
	}

	updateNotificationsNewState(data) {
		this.notificationsNewState.next(data);
	}

	getNotificationsNewState(): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/notifications/new-exists`;
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			catchError((error) => {
				console.log('error', error);

				return of();
			}),
			tap(async (res: any) => {
				this.notificationsNewState.next(res.new_notifications_exists);
			})
		);
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

	getAllNotifications(filter: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/notifications?page=${filter.page}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	getNotification(notificationId: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/notifications/${notificationId}`;
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	receivedNotification(notificationId: any): Observable<any> {
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/notifications/${notificationId}/received`;
		return this.httpClient.get(fullUrl).pipe(
			tap(async (res: any) => { })
		);
	}
}
