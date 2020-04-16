import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestDataService} from "../../../services/request-data/request-data.service";
import {AuthService} from "../../../services/auth/auth.service";
import {OptionsService} from "../../../services/options/options.service";
import {ToastNotificationsService} from "../../../services/toast-notifications/toast-notifications.service";

declare var ga: any;

@Component({
	selector: 'app-cancel',
	templateUrl: './cancel.page.html',
	styleUrls: ['./cancel.page.scss'],
})
export class CancelPage implements OnInit {

	requestId: string = '';
	canceledDescription: string = '';
	isLoad: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private requestDataS: RequestDataService,
		private authS: AuthService,
		private optionsS: OptionsService,
		private router: Router,
		private toastNotificationsS: ToastNotificationsService
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
	}

	ionInputCanceledDescription(event) {
		let textarea: any = event.target;
		textarea.style.overflow = 'hidden';
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';

		this.canceledDescription = textarea.value;

		return;
	}

	cancelRequest() {
		if(this.canceledDescription.trim() != '') {
			this.isLoad = true;
			var request = {
				id: this.requestId,
				status: 40,
				canceled_description: this.canceledDescription
			};

			this.requestDataS.updateRequest(request).subscribe(res => {
				this.optionsS.notUpdatePage = false;
				this.router.navigate(['/requests/detail/' + this.requestId]);

				this.isLoad = false;
			}, err => {
				console.log('cancelRequest err', err);

				this.isLoad = false;

				try {
					ga('send', 'exception', {
						'exDescription': err.message,
						'exFatal': true
					});
				} catch (error) { }

				this.toastNotificationsS.present('Произошла ошибка при отправки данных. Возможно недоступен сервер. Проверьте свое соединение с интернетом. И повторите еще раз.', 'danger');

				if (err.status == 401) {
					this.authS.logout();
				}
			});
		} else {
			this.toastNotificationsS.present('Вам обязательно нужно написать причину отмены заявки.', 'danger');
		}

	}
}
