import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, of} from 'rxjs';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage/storage.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OptionsService } from '../options/options.service';

@Injectable({
	providedIn: 'root'
})
export class DictionariesService {

	constructor(
		private httpClient: HttpClient,
		private platform: Platform,
		private optionsS: OptionsService,
		private storageS: StorageService,
	) {
		this.platform.ready().then(() => {
			//this.loadData();
		});
	}

	getLocations(): Observable<any> {
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/dictionaries/locations`).pipe(
			catchError((error) => {
				console.log('Error: dictionaries.service - getLocations', error);
				return of();
			}),
			tap(async (res: any) => { })
		);
	}

	getAllCategories(): Observable<any> {
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/dictionaries/categories`).pipe(
			catchError((error) => {
				console.log('Error: dictionaries.service - getAllCategories', error);
				return of();
			}),
			tap(async (res: any) => { })
		);
	}

	getTopCategories(): Observable<any> {
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/dictionaries/categories/top`).pipe(
			catchError((error) => {
				console.log('Error: dictionaries.service - getTopCategories', error);
				return of();
			}),
			tap(async (res: any) => { })
		);
	}

	getCategories(categoryId = 1): Observable<any> {
		if (!categoryId) {
			categoryId = 1;
		}

		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/dictionaries/categories/${categoryId}/children`).pipe(
			catchError((error) => {
				console.log('Error: dictionaries.service - getCategories - ' + categoryId, error);
				return of();
			}),
			tap(async (res: any) => { })
		);
	}

	getCategory(categoryId): Observable<any> {
		return this.httpClient.get(`${this.optionsS.getApiUrl()}/v1/dictionaries/categories/${categoryId}`).pipe(
			catchError((error) => {
				console.log('Error: dictionaries.service - getCategory - ' + categoryId, error);
				return of();
			}),
			tap(async (res: any) => { })
		);
	}

	getPageSections(page, data = {}): Observable<any> {
		data['appVersion'] = this.optionsS.appVersion;

		return this.httpClient.post(`${this.optionsS.getApiUrl()}/v1/page/sections/${page}`, data).pipe(
			catchError((error) => {
				console.log('Error: dictionaries.service - getPageSections - ' + page, error);
				return of();
			}),
			tap(async (res: any) => { })
		);
	}

	public getPage(typepage: string): Observable<any> {
		let urlFull = `${this.optionsS.getApiUrl()}/v1/page/empty/${typepage}`;
		//console.log(urlFull);
		return this.httpClient.get(urlFull, { responseType: 'text' }).pipe(
			tap(async (res: any) => { })
		)
	}

	handleError(error: HttpErrorResponse) {
		return throwError(error);
	}
}
