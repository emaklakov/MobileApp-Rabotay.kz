import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { OptionsService } from '../options/options.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RequestDataService {

	constructor(
		private httpClient: HttpClient,
		private optionsS: OptionsService,
	) { }

	authHeaders: any;

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

	createRequest(request: any): Observable<any> {
		this.getAccessToken();
		return this.httpClient.post(`${this.optionsS.getApiUrl()}/v1/requests`, request, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	getAllRequests(filter: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/requests?category_id=${filter.categoryId}&location_id=${filter.locationId}&sort=${filter.sort}&page=${filter.page}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	getRequest(requestId: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/requests/${requestId}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	updateRequest(request: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/requests/${request.id}`;
		//console.log(fullUrl);
		return this.httpClient.put(fullUrl, request, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	completRequest(requestId) {
		this.getAccessToken();
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/requests/${requestId}/complet`, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	sendFeedbackRequest(feedback: any, requestId): Observable<any> {
		this.getAccessToken();
		return this.httpClient.post(`${this.optionsS.getApiUrl()}/v1/requests/${requestId}/feedback`, feedback, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	createOffer(offer: any): Observable<any> {
		this.getAccessToken();
		return this.httpClient.post(`${this.optionsS.getApiUrl()}/v1/offers`, offer, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	getOffer(offerId): Observable<any> {
		this.getAccessToken();
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/offers/${offerId}`, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	acceptOffer(offerId) {
		this.getAccessToken();
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/offers/${offerId}/accept`, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	cancelOffer(offerId) {
		this.getAccessToken();
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/offers/${offerId}/cancel`, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	refuseOffer(offerId) {
		this.getAccessToken();
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/offers/${offerId}/refuse`, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	getMyRequests(filter: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/users/requests/my?page=${filter.page}`;
		//console.log(fullUrl);
		return this.httpClient.post(fullUrl, filter, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}
}
