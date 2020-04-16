import { Component, OnInit } from '@angular/core';
import {NotificationDataService} from "../../../services/notification-data/notification-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OptionsService} from "../../../services/options/options.service";

@Component({
	selector: 'app-detail',
	templateUrl: './detail.page.html',
	styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

	notificationId: string = '';
	notification: any = {};
	isErrorLoad: boolean = false;
	isLoad: boolean = true;

	constructor(
		private activatedRoute: ActivatedRoute,
		private notificationDataS: NotificationDataService,
		private optionsS: OptionsService,
		private router: Router,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.notificationId = this.activatedRoute.snapshot.paramMap.get('id');

		this.updateLoad();
	}

	updateLoad() {
		this.getNotification();
	}

	getNotification() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.notificationDataS.getNotification(this.notificationId).subscribe(res => {
			this.notification = res;
			this.optionsS.notUpdatePage = !res.is_update;

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			this.isLoad = false;
			this.isErrorLoad = true;

			this.optionsS.sendError('notifications.detail.page - getNotifications()', err);
		});
	}

	openRoute(route) {
		if(route.indexOf('https://') >= 0) {
			this.openUrl(route);
		} else {
			this.router.navigate(['/'+route]);
		}
	}

	openUrl(url) {
		this.optionsS.openBrowser(url);
	}
}
