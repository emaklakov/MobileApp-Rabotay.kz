import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {OptionsService} from "../../../services/options/options.service";
import {RequestDataService} from "../../../services/request-data/request-data.service";
import {PerformerDataService} from "../../../services/performer-data/performer-data.service";

declare var ga: any;

@Component({
	selector: 'app-offer-request',
	templateUrl: './offer-request.page.html',
	styleUrls: ['./offer-request.page.scss'],
})
export class OfferRequestPage implements OnInit {

	userId: string = '';
	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	isRefresh: boolean = true;
	refresher: any;
	filter: any = {
		'type_request': 'offer-request',
		'sort': 'desc',
		'page': '1',
	};
	requestsR: any = [];
	infiniteScroll: any;
	successMessage: string = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private optionsS: OptionsService,
		private requestDataS: RequestDataService,
		private performerDataS: PerformerDataService,
	) {
	}

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.userId = this.activatedRoute.snapshot.paramMap.get('id');

		this.updateLoad();
		this.setPageUrl();
	}

	getRequestsR() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.requestDataS.getMyRequests(this.filter).subscribe(res => {
			if (res.requests && res.requests.length > 0) {
				var arrayTemp1 = Object.values(this.requestsR);
				var arrayTemp2 = Object.values(res.requests)
				this.requestsR = arrayTemp1.concat(arrayTemp2);
			}

			this.filter.page = res.next_page;

			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			if (this.refresher) {
				this.refresher.complete();
			}

			this.isLoad = false;
			this.isRefresh = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			if (this.refresher) {
				this.refresher.complete();
			}
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			this.isLoad = false;
			this.isErrorLoad = true;
			this.isRefresh = false;

			this.optionsS.sendError('offer-request.page - getRequestsR()', err);
		});
	}

	updateLoad() {
		this.resetData();
		this.getRequestsR();
	}

	resetData() {
		this.isRefresh = true;
		this.isLoad = true;
		this.requestsR = [];
		this.filter.page = '1';
	}

	doRefresh(event) {
		this.resetData();
		this.refresher = event.target;
		this.getRequestsR();
	}

	infiniteLoadRequestsR(event) {
		if (this.requestsR && this.requestsR.length > 0) {
			this.infiniteScroll = event.target;
			//console.log('getRequestsR 5');
			this.getRequestsR();
		}
	}

	setPageUrl() {
		try {
			ga('set', 'page', '/performers/offer-request/' + this.userId);
			ga('send', 'pageview');
		} catch (error) { console.log(error); }
	}

	offerRequest(requestId) {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.performerDataS.offerRequest(requestId, this.userId).subscribe(res => {
			this.successMessage = res.message;

			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			if (this.refresher) {
				this.refresher.complete();
			}

			this.isLoad = false;
			this.isRefresh = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			if (this.refresher) {
				this.refresher.complete();
			}
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			this.isLoad = false;
			this.isErrorLoad = true;
			this.isRefresh = false;

			this.optionsS.sendError('offer-request.page - offerRequest()', err);
		});
	}
}
