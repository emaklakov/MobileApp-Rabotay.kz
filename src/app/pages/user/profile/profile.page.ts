import {Component, OnInit} from '@angular/core';
import {UserDataService} from "../../../services/user-data/user-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OptionsService} from "../../../services/options/options.service";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {DictionariesService} from "../../../services/dictionaries/dictionaries.service";
import {AlertController} from "@ionic/angular";
import {StorageService} from "../../../services/storage/storage.service";

declare var ga: any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.page.html',
	styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	userId: string = '';
	profile: any = {};
	pageSections: any;
	isFavorite = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private userDataS: UserDataService,
		private optionsS: OptionsService,
		private socialSharing: SocialSharing,
		private dictionariesS: DictionariesService,
		private storageS: StorageService,
		private router: Router,
		public alertController: AlertController
	) {
		Window["rabotayProfile"] = this;
	}

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.userId = this.activatedRoute.snapshot.paramMap.get('id');

		this.updateLoad();
	}

	getUserProfile() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.userDataS.getServerProfile(this.userId).subscribe(res => {
			this.profile = res;

			document.title = 'Профиль: ' + res.first_last_middle_name;

			this.isLoad = false;
		}, err => {
			console.log('getUserProfile err', err);
			console.log('logout', err.status);

			this.isLoad = false;
			this.isErrorLoad = true;
		});
	}

	isUserFavorite() {
		this.storageS.getObject('profiles-favorites').then(object => {
			let favorites = new Set();
			if (object != null) {
				favorites = new Set(object);
				if (favorites.has(this.userId)) {
					this.isFavorite = true;
				}
			}
		});
	}

	updateLoad() {
		this.getUserProfile();
		this.isUserFavorite();
		this.getPageSections();
	}

	openUrl(url, target = '_blank', params = '?source=inapp') {
		this.optionsS.openBrowser(url, target, params);
	}

	openRoute(route: string) {
		if (route && route != '') {
			this.router.navigate([route]);
		}
	}

	toggleFavorite() {
		this.storageS.getObject('profiles-favorites').then(object => {
			let favorites = new Set();
			if (object != null) {
				favorites = new Set(object);
			}

			if (this.isFavorite) {
				favorites.delete(this.userId);
				this.isFavorite = false;

				try {
					ga('send', 'event', 'Profiles-Favorites', 'del', this.userId, 1);
				} catch (error) { }
			} else {
				favorites.add(this.userId);
				this.isFavorite = true;

				try {
					ga('send', 'event', 'Profiles-Favorites', 'add', this.userId, 1);
				} catch (error) { }
			}

			this.storageS.setObject('profiles-favorites', Array.from(favorites));

			this.optionsS.notUpdatePage = false;
		});
	}

	async profileShare() {
		if(this.profile) {
			await this.socialSharing.share('Профиль: ' + this.profile.first_last_middle_name + ' | Rabotay.kz', 'Rabotay.kz', null, 'https://rabotay.kz/profile/'+this.userId);
		}
	}

	getPageSections() {
		var data = {
			userId: this.userId
		};

		this.dictionariesS.getPageSections('profile', data).subscribe(res => {
			this.pageSections = res.pageSections;

			for (let pageSection of this.pageSections) {
				if (pageSection.htmlContentId && pageSection.htmlContentId != '') {
					if (pageSection.htmlContent && pageSection.htmlContent != '') {
						this.setPageSectionHtmlContent(pageSection);
					}
				}
			}
		}, err => {
			this.optionsS.sendError('profile.page - getPageSections()', err);
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

	async presentAvatar() {
		const alert = await this.alertController.create({
			message: '<img src="'+this.profile.avatar_image+'">',
			buttons: ['Закрыть']
		});

		await alert.present();
	}
}
