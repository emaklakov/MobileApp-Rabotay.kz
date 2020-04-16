import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RequestDataService} from "../../../services/request-data/request-data.service";
import {OptionsService} from "../../../services/options/options.service";

declare var ga: any;

@Component({
	selector: 'app-my',
	templateUrl: './my.page.html',
	styleUrls: ['./my.page.scss'],
})
export class MyPage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	isRefresh: boolean = true;
	refresher: any;
	filter: any = {
		'type_request': 'iclient',
		'sort': 'desc',
		'page': '1',
	};
	requestsR: any = [];
	infiniteScroll: any;
	emptyRequestsR: string = 'У Вас еще нет созданных заявок';

	constructor(
		private router: Router,
		private optionsS: OptionsService,
		private requestDataS: RequestDataService,
	) { }

	ngOnInit() {
		this.optionsS.notUpdatePage = false;
	}

	public ionViewWillEnter() {
		if (!this.optionsS.notUpdatePage) {
			this.updateLoad();
		} else {
			this.optionsS.notUpdatePage = true;
		}

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

			this.optionsS.sendError('my.page - getRequestsR()', err);
		});
	}

	updateLoad() {
		this.resetData();
		this.getRequestsR();
	}

	getStatusIcon(status) {
		var statusList = {
			'0': 'square-outline',
			'10': 'sync',
			'20': 'checkbox-outline',
			'30': 'close-circle-outline',
			'40': 'trash',
			'50': 'trash',
		};

		return statusList[status];
	}

	getStatusColor(status) {
		var statusList = {
			'0': 'light',
			'10': 'warning',
			'20': 'success',
			'30': 'danger',
			'40': 'danger',
			'50': 'danger',
		};

		return statusList[status];
	}

	openRequest(route) {
		this.optionsS.notUpdatePage = true;
		this.optionsS.routerLink = '/requests/my';
		this.router.navigate([route]);
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

	changeSegmentTypeRequest(event) {
		this.filter.type_request = event.target.value;

		if(event.target.value == 'iclient') {
			this.emptyRequestsR = 'У Вас еще нет созданных заявок';
		} else {
			this.emptyRequestsR = 'Ваши услуги еще не приняли';
		}

		this.setPageUrl();

		this.optionsS.notUpdatePage = false;

		this.updateLoad();
	}

	setPageUrl() {
		try {
			ga('set', 'page', '/requests/my/' + this.filter.type_request);
			ga('send', 'pageview');
		} catch (error) { console.log(error); }
	}
}
