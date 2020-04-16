import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestDataService} from "../../../services/request-data/request-data.service";
import {ToastNotificationsService} from "../../../services/toast-notifications/toast-notifications.service";
import {OptionsService} from "../../../services/options/options.service";

declare var ga: any;

@Component({
	selector: 'app-detail',
	templateUrl: './detail.page.html',
	styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

	offerId: string = '';
	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	offer: any = {};

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private requestDataS: RequestDataService,
		private optionsS: OptionsService,
		private toastNotificationsS: ToastNotificationsService
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.offerId = this.activatedRoute.snapshot.paramMap.get('id');

		this.updateLoad();
	}

	updateLoad() {
		this.getOffer();
	}

	getOffer() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.requestDataS.getOffer(this.offerId).subscribe(res => {
			this.offer = res;

			this.isLoad = false;
		}, err => {
			this.isLoad = false;
			this.isErrorLoad = true;

			this.optionsS.sendError('offers.detail.page - getOffer()', err);
		});
	}

	acceptOffer() {
		this.isLoad = true;
		this.requestDataS.acceptOffer(this.offerId).subscribe(res => {
			if (res && res.id) {
				this.toastNotificationsS.present('Мы оповестим исполнителя о Вашем решении и передадим Ваши контакты. В ближайшее время с Вами свяжуться.', 'primary');

				this.router.navigate(['requests/detail/' + res.id], { replaceUrl: true });
			}

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			this.isLoad = false;

			this.optionsS.sendError('offers.detail.page - acceptOffer()', err);

			this.toastNotificationsS.present('Произошла ошибка при отправки данных. Возможно недоступен сервер. Проверьте свое соединение с интернетом. И повторите еще раз.', 'danger');
		});
	}

	refuseOffer() {
		this.isLoad = true;
		this.requestDataS.refuseOffer(this.offerId).subscribe(res => {
			if (res && res.id) {
				this.toastNotificationsS.present('Вы отказались от предложения. Теперь заявка может принимать новые предложения.', 'primary');

				this.router.navigate(['requests/detail/' + res.id], { replaceUrl: true });
			}

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			this.isLoad = false;

			this.optionsS.sendError('offers.detail.page - refuseOffer()', err);

			this.toastNotificationsS.present('Произошла ошибка при отправки данных. Возможно недоступен сервер. Проверьте свое соединение с интернетом. И повторите еще раз.', 'danger');
		});
	}

	cancelOffer() {
		this.isLoad = true;
		this.requestDataS.cancelOffer(this.offerId).subscribe(res => {
			if (res && res.id) {
				this.toastNotificationsS.present('Ваше предложение отменено. Пока заявка новая, Вы всегда можете предложить свои услуги.', 'primary');

				this.router.navigate(['requests/detail/' + res.id], { replaceUrl: true });
			}

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			this.isLoad = false;

			this.optionsS.sendError('offers.detail.page - cancelOffer()', err);

			this.toastNotificationsS.present('Произошла ошибка при отправки данных. Возможно недоступен сервер. Проверьте свое соединение с интернетом. И повторите еще раз.', 'danger');
		});
	}
}
