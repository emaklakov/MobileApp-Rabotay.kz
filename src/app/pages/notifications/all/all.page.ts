import {Component, OnInit} from '@angular/core';
import {OptionsService} from "../../../services/options/options.service";
import {Router} from "@angular/router";
import {NotificationDataService} from "../../../services/notification-data/notification-data.service";

@Component({
	selector: 'app-all',
	templateUrl: './all.page.html',
	styleUrls: ['./all.page.scss'],
})
export class AllPage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	isRefresh: boolean = true;
	filter: any = {
		sort: 'desc',
		page: '1',
	};
	refresher: any;
	notifications: any = [];
	infiniteScroll: any;

	constructor(
		private optionsS: OptionsService,
		private notificationDataS: NotificationDataService,
		private router: Router,
	) {
	}

	ngOnInit() {
		this.optionsS.notUpdatePage = false;
	}

	public ionViewWillEnter() {
		if (!this.optionsS.notUpdatePage) {
			this.updateLoad();
		} else {
			this.optionsS.notUpdatePage = true;
		}
	}

	getNotifications() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.notificationDataS.getAllNotifications(this.filter).subscribe(res => {

			if (res.notifications && res.notifications.length > 0) {
				var arrayTemp1 = Object.values(this.notifications);
				var arrayTemp2 = Object.values(res.notifications)
				this.notifications = arrayTemp1.concat(arrayTemp2);
			}

			this.notificationDataS.updateNotificationsNewState(res.new_notifications_exists);

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

			this.optionsS.sendError('notifications.all.page - getNotifications()', err);
		});
	}

	updateLoad() {
		this.resetData();
		this.getNotifications();
	}

	resetData() {
		this.isLoad = true;
		this.notifications = [];
		this.filter.page = '1';
	}

	doRefresh(event) {
		this.refresher = event.target;
		this.updateLoad();
	}

	openNotification(route) {
		this.optionsS.notUpdatePage = true;
		this.router.navigate([route]);
	}

	infiniteLoadNotifications(event) {
		if (this.notifications && this.notifications.length > 0) {
			this.infiniteScroll = event.target;
			this.getNotifications();
		}
	}
}
