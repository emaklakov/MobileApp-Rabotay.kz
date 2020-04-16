import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {OptionsService} from "../options/options.service";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class PerformerDataService {

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

	getAllPerformers(filter: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/performers?page=${filter.page}`;
		//console.log(fullUrl);
		return this.httpClient.post(fullUrl, filter, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}

	offerRequest(requestId: any, userId: any): Observable<any> {
		this.getAccessToken();
		var fullUrl = `${this.optionsS.getApiUrl()}/v1/requests/${requestId}/offer-request/${userId}`;
		//console.log(fullUrl);
		return this.httpClient.get(fullUrl, this.authHeaders).pipe(
			tap(async (res: any) => { })
		);
	}
}
