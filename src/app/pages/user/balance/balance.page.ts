import {Component, OnInit} from '@angular/core';
import {OptionsService} from "../../../services/options/options.service";
import {UserDataService} from "../../../services/user-data/user-data.service";
import {DictionariesService} from "../../../services/dictionaries/dictionaries.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-balance',
	templateUrl: './balance.page.html',
	styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	isRefresh: boolean = true;
	filter: any = {
		sort: 'desc',
		page: '1',
	};
	refresher: any;
	payments: any = [];
	infiniteScroll: any;
	balance: number = 0;
	customMessage: string = '';
	userId: string = '';
	pageSections: any;

	constructor(
		private optionsS: OptionsService,
		private userDataS: UserDataService,
		private dictionariesS: DictionariesService,
		private router: Router,
	) {
		Window["rabotayBalance"] = this;
	}

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.updateLoad();
	}

	openUrl(url, target = '_blank', params = '?source=inapp') {
		this.optionsS.openBrowser(url, target, params);
	}

	openRoute(route: string) {
		if (route && route != '') {
			this.router.navigate([route]);
		}
	}

	getPayments() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.userDataS.getAllPayments(this.filter).subscribe(res => {
			if (res.payments && res.payments.length > 0) {
				var arrayTemp1 = Object.values(this.payments);
				var arrayTemp2 = Object.values(res.payments)
				this.payments = arrayTemp1.concat(arrayTemp2);
			}

			this.balance = res.balance;
			this.customMessage = res.custom_message;
			this.userId = res.user_id;

			this.filter.page = res.next_page;

			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			if (this.refresher) {
				this.refresher.complete();
			}

			this.getPageSections();

			this.isLoad = false;
			this.isRefresh = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);

			if (this.refresher) {
				this.refresher.complete();
			}
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			this.isLoad = false;
			this.isErrorLoad = true;
			this.isRefresh = false;
		});
	}

	updateLoad() {
		this.resetData();
		this.getPayments();
	}

	resetData() {
		this.isRefresh = true;
		this.isLoad = true;
		this.payments = [];
		this.filter.page = '1';
	}

	doRefresh(event) {
		this.resetData();
		this.refresher = event.target;
		this.updateLoad();
	}

	infiniteLoadPayments(event) {
		this.infiniteScroll = event.target;
		if (this.payments && this.payments.length > 0) {
			this.getPayments();
		} else {
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}
		}
	}

	getPageSections() {
		var data = {
			userId: this.userId
		};

		this.dictionariesS.getPageSections('balance', data).subscribe(res => {
			this.pageSections = res.pageSections;

			for (let pageSection of this.pageSections) {
				if (pageSection.htmlContentId && pageSection.htmlContentId != '') {
					if (pageSection.htmlContent && pageSection.htmlContent != '') {
						this.setPageSectionHtmlContent(pageSection);
					}
				}
			}
		}, err => {
			this.optionsS.sendError('balance.page - getPageSections()', err);
		});
	}

	setPageSectionHtmlContent(pageSection: any) {
		setTimeout(() => {
			try {
				var pageSectionElement = document.querySelector('#' + pageSection.htmlContentId);

				if (pageSectionElement && pageSectionElement != undefined) {
					pageSectionElement.innerHTML = pageSection.htmlContent;
				} else {
					this.setPageSectionHtmlContent(pageSection);
				}
			} catch (error) { }
		}, 50);
	}
}
