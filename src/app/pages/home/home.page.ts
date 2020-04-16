import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserDataService } from '../../services/user-data/user-data.service';
import {Router} from "@angular/router";
import {OptionsService} from "../../services/options/options.service";
import {DictionariesService} from "../../services/dictionaries/dictionaries.service";
import {NotificationDataService} from "../../services/notification-data/notification-data.service";

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

	categories: any;
	categoriesTitle: string = '';
	isLoad: boolean = true;
	isErrorLoad: boolean = false;
	cardImg: string = '';
	pageSections: any;
	viewLoginItem: boolean = false;
	notificationsIconName: string = 'notifications-outline';

	constructor(
		public storageS: StorageService,
		public authS: AuthService,
		private optionsS: OptionsService,
		private router: Router,
		private dictionariesS: DictionariesService,
		private notificationDataS: NotificationDataService,
	) {
		Window["rabotayHome"] = this;
	}

	ngOnInit() {
		this.notificationDataS.notificationsNewState.subscribe((data) => {
			if(data) {
				this.notificationsIconName = 'notifications';
				const notificationsIcon =  document.querySelector('#notificationsIcon');
				if(notificationsIcon && notificationsIcon.classList) {
					notificationsIcon.classList.add('animated', 'swing', 'infinite', 'slow');
				}
			} else {
				this.notificationsIconName = 'notifications-outline';
				const notificationsIcon =  document.querySelector('#notificationsIcon');
				if(notificationsIcon && notificationsIcon.classList) {
					notificationsIcon.classList.remove('animated', 'swing', 'infinite', 'slow');
				}
			}
		});
	}

	public ionViewWillEnter() {
		this.updateLoad();
	}

	getCategories() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.dictionariesS.getTopCategories().subscribe(res => {
			this.categories = res.categories;
			this.categoriesTitle = res.title;
			this.cardImg = res.card_img;

			this.isLoad = false;
			this.viewLoginItem = true;
		}, err => {
			this.isErrorLoad = true;
			this.optionsS.sendError('home.page - getCategories()', err);
		});
	}

	updateLoad() {
		this.getCategories();
		this.getPageSections();
	}

	openCategory(id) {
		this.optionsS.selectCategoryId = id;
		this.optionsS.notUpdatePage = false;
		this.router.navigate(['/requests/all']);
	}

	openUrl(url, target = '_blank', params = '?source=inapp') {
		this.optionsS.openBrowser(url, target, params);
	}

	openRoute(route: string) {
		if (route && route != '') {
			this.router.navigate([route]);
		}
	}

	getPageSections() {
		this.dictionariesS.getPageSections('home').subscribe(res => {
			this.pageSections = res.pageSections;

			for (let pageSection of this.pageSections) {
				if (pageSection.htmlContentId && pageSection.htmlContentId != '') {
					if (pageSection.htmlContent && pageSection.htmlContent != '') {
						this.setPageSectionHtmlContent(pageSection);
					}
				}
			}
		}, err => {
			this.optionsS.sendError('home.page - getPageSections()', err);
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
