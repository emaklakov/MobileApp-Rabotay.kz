import {Component, OnInit} from '@angular/core';
import {OptionsService} from "../../services/options/options.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DictionariesService} from "../../services/dictionaries/dictionaries.service";

@Component({
	selector: 'app-page-empty',
	templateUrl: './page-empty.page.html',
	styleUrls: ['./page-empty.page.scss'],
})
export class PageEmptyPage implements OnInit {

	pageTitle: string = 'Загрузка...';
	typePage: string = '';
	isLoad: boolean = true;
	isErrorLoad: boolean = false;

	constructor(
		private optionsS: OptionsService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private dictionariesS: DictionariesService,
	) {
		Window["rabotayPageEmpty"] = this;
	}

	ngOnInit() {
		this.typePage = this.activatedRoute.snapshot.paramMap.get('typepage');

		this.getPage();
	}

	updateLoad() {
		this.getPage();
	}

	getPage() {
		this.isLoad = true;
		this.isErrorLoad = false;
		this.pageTitle = 'Загрузка...';

		this.dictionariesS.getPage(this.typePage)
			.subscribe(res => {
				//console.log(res);
				document.querySelector('#htmlContentPageEmpty').innerHTML = res;

				setTimeout(() => {
					this.pageTitle = document.querySelector('#page-title').innerHTML;
				}, 500);

				this.isLoad = false;
			}, err => {
				this.optionsS.sendError('empty.page - getPage('+this.typePage+')', err);
				this.isErrorLoad = true;
				this.isLoad = false;

				this.pageTitle = 'Ошибка загрузки';
			});
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
