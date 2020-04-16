import {Component, OnInit} from '@angular/core';
import {OptionsService} from "../../services/options/options.service";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {DictionariesService} from "../../services/dictionaries/dictionaries.service";
import {Router} from "@angular/router";

@Component({
	selector: 'app-about-app',
	templateUrl: './about-app.page.html',
	styleUrls: ['./about-app.page.scss'],
})
export class AboutAppPage implements OnInit {

	appVersion: string = '';
	pageSections: any;

	constructor(
		private optionsS: OptionsService,
		private socialSharing: SocialSharing,
		private dictionariesS: DictionariesService,
		private router: Router,
	) {
		Window["rabotayAboutApp"] = this;
	}

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.appVersion = this.optionsS.appVersion;
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

	async appShare() {
		await this.socialSharing.share('Rabotay в своё удовольствие!', 'Rabotay.kz', null, 'https://rabotay.kz/app');
	}

	getPageSections() {
		var data = {
			appVersion: this.appVersion
		};

		this.dictionariesS.getPageSections('about-app', data).subscribe(res => {
			this.pageSections = res.pageSections;

			for (let pageSection of this.pageSections) {
				if (pageSection.htmlContentId && pageSection.htmlContentId != '') {
					if (pageSection.htmlContent && pageSection.htmlContent != '') {
						this.setPageSectionHtmlContent(pageSection);
					}
				}
			}
		}, err => {
			this.optionsS.sendError('about-app.page - getPageSections()', err);
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
