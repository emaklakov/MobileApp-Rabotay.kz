import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestDataService } from '../../../services/request-data/request-data.service';
import { UserDataService } from "../../../services/user-data/user-data.service";
import { AuthService } from "../../../services/auth/auth.service";
import {OptionsService} from "../../../services/options/options.service";
import {ToastNotificationsService} from "../../../services/toast-notifications/toast-notifications.service";
import {DictionariesService} from "../../../services/dictionaries/dictionaries.service";

declare var ga: any;

@Component({
	selector: 'app-detail',
	templateUrl: './detail.page.html',
	styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

	requestId: string = '';
	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	requestR: any = {};
	currentUser: any;
	isDetailshow: boolean = true;
	isOffershow: boolean = false;
	statusIcon: string = 'square-outline';
	statusColor: string = '';
	routerLink: string = '/requests/all';
	pageSections: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private authS: AuthService,
		private requestDataS: RequestDataService,
		private userDataS: UserDataService,
		private optionsS: OptionsService,
		private toastNotificationsS: ToastNotificationsService,
		private dictionariesS: DictionariesService,
	) {
		Window["rabotayRequestDetail"] = this;
	}

	ngOnInit() {

	}

	public ionViewWillEnter() {
		this.requestId = this.activatedRoute.snapshot.paramMap.get('id');

		if (this.userDataS.currentUser) {
			this.currentUser = this.userDataS.currentUser;
		}

		var routerLinkTemp = this.optionsS.routerLink;
		if(routerLinkTemp != '') {
			this.routerLink = routerLinkTemp;
			this.optionsS.routerLink = '';
		}

		this.updateLoad();
	}


	updateLoad() {
		this.getRequestR();
	}

	getRequestR() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.requestDataS.getRequest(this.requestId).subscribe(res => {
			this.requestR = res;
			//console.log(this.requestR);
			this.statusIcon = this.getStatusIcon(this.requestR.status);
			this.statusColor = this.getStatusColor(this.requestR.status);

			this.getPageSections();

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			this.isLoad = false;
			this.isErrorLoad = true;

			this.optionsS.sendError('detail.page - getRequestR()', err);
		});
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

	addOffer() {
		this.router.navigate(['/requests/add-offer/' + this.requestId]);
	}

	redirectLogin() {
		this.authS.redirectUrl = '/requests/detail/' + this.requestId;
		this.router.navigate(['/user/login']);
	}

	openOffer(offerId, performerId) {
		if(this.currentUser && this.currentUser.id == performerId) {
			this.router.navigate(['requests/offers/' + offerId]);
		}

		if(this.requestR.its_my) {
			this.router.navigate(['requests/offers/' + offerId]);
		}

		if(this.currentUser && this.currentUser.id != performerId && !this.requestR.its_my) {
			this.router.navigate(['user/profile/' + performerId]);
		}

		if(!this.currentUser) {
			this.router.navigate(['user/profile/' + performerId]);
		}
	}

	completRequestR() {
		this.isLoad = true;
		this.requestDataS.completRequest(this.requestR.id).subscribe(res => {
			if (res && res.id) {
				this.router.navigate(['requests/complet/' + res.id], { replaceUrl: true });
			}

			this.isLoad = false;
		}, err => {
			this.isLoad = false;

			this.optionsS.sendError('detail.page - completRequestR()', err);

			this.toastNotificationsS.present('Произошла ошибка при отправки данных. Возможно недоступен сервер. Проверьте свое соединение с интернетом. И повторите еще раз.', 'danger');
		});
	}

	getPageSections() {
		var data = {
			requestId: this.requestId
		};

		this.dictionariesS.getPageSections('request', data).subscribe(res => {
			this.pageSections = res.pageSections;

			for (let pageSection of this.pageSections) {
				if (pageSection.htmlContentId && pageSection.htmlContentId != '') {
					if (pageSection.htmlContent && pageSection.htmlContent != '') {
						this.setPageSectionHtmlContent(pageSection);
					}
				}
			}
		}, err => {
			this.optionsS.sendError('request.detail.page - getPageSections()', err);
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

	openUrl(url, target = '_blank', params = '?source=inapp') {
		this.optionsS.openBrowser(url, target, params);
	}

	openRoute(route: string) {
		if (route && route != '') {
			this.router.navigate([route]);
		}
	}
}
