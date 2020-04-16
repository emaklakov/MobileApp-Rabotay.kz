import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestDataService} from "../../../services/request-data/request-data.service";
import {UserDataService} from "../../../services/user-data/user-data.service";
import {ToastNotificationsService} from "../../../services/toast-notifications/toast-notifications.service";
import {OptionsService} from "../../../services/options/options.service";

declare var ga: any;

@Component({
	selector: 'app-add-offer',
	templateUrl: './add-offer.page.html',
	styleUrls: ['./add-offer.page.scss'],
})
export class AddOfferPage implements OnInit {

	requestId: string = '';
	requestR: any = {};
	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	offerDescription: string = '';
	offerPrice: number = 0;
	currentUser: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private requestDataS: RequestDataService,
		private userDataS: UserDataService,
		private toastNotificationsS: ToastNotificationsService,
		private optionsS: OptionsService,
	) {
	}

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
		this.currentUser = this.userDataS.currentUser;

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

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			this.isLoad = false;
			this.isErrorLoad = true;

			this.optionsS.sendError('add-offer.page - getRequestR()', err);
		});
	}

	ionInputDescription(event) {

		let textarea: any = event.target;
		textarea.style.overflow = 'hidden';
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';

		this.offerDescription = textarea.value;

		return;
	}

	ionInputPrice(event) {
		this.offerPrice = event.target.value;
	}

	createOffer() {
		if(this.requestR.price != 'Не указан' || this.offerPrice > 0) {
			this.isLoad = true;
			var offer = {
				'request_r_id': this.requestId,
				'performer_user_id': this.currentUser.id,
				'description': this.offerDescription,
				'price': this.offerPrice
			};

			this.requestDataS.createOffer(offer).subscribe(res => {
				if (res && res.id) {
					this.router.navigate(['requests/detail/' + this.requestId], { replaceUrl: true });
				}

				this.toastNotificationsS.present('Вы предложили свои услуги заказчику. Мы сейчас его об этом оповестим. Если он их примет, то мы откроем Вам доступ к его контактам.', 'primary');

				this.isLoad = false;
			}, err => {
				this.isLoad = false;

				this.optionsS.sendError('add-offer.page - createOffer()', err);
			});
		} else {
			this.toastNotificationsS.present('Заказчик не указал бюджет. Вам нужно предложить свою стоимость.', 'danger');
		}
	}
}
