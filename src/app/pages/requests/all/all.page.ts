import { Component, OnInit } from '@angular/core';
import { DictionariesService } from '../../../services/dictionaries/dictionaries.service';
import { RequestDataService } from '../../../services/request-data/request-data.service';
import { OptionsService } from '../../../services/options/options.service';
import {ActivatedRoute, Router} from '@angular/router';

declare var ga: any;

@Component({
	selector: 'app-all',
	templateUrl: './all.page.html',
	styleUrls: ['./all.page.scss'],
})
export class AllPage implements OnInit {

	isErrorLoad: boolean = false;
	isFilteShow: boolean = false;
	isLoad: boolean = true;
	isRefresh: boolean = true;
	sortIconName: string = 'r-desc-sort';
	categories: any;
	selectCategoryId: any = 1;
	selectCategoryText: string = 'Все категории';
	location: any;
	refresher: any;
	filter: any = {
		locationId: '',
		categoryId: '1',
		sort: 'desc',
		page: '1',
	};
	requestsR: any = [];
	infiniteScroll: any;
	urlCategoryId: string = '';


	constructor(
		private activatedRoute: ActivatedRoute,
		private dictionariesS: DictionariesService,
		private requestDataS: RequestDataService,
		private optionsS: OptionsService,
		private router: Router,
	) {
		this.optionsS.optionslocationSelectState.subscribe((data) => {
			if (data) {
				if (this.location != data) {
					this.location = data;
					this.filter.locationId = this.location.id;
				}
			}
		});
	}

	ngOnInit() {
		this.optionsS.notUpdatePage = false;
	}

	public ionViewWillEnter() {
		this.urlCategoryId = this.activatedRoute.snapshot.paramMap.get('id');

		this.location = this.optionsS.getLocationSelect();
		if (this.location && this.location.id) {
			this.filter.locationId = this.location.id;
		}

		if(this.urlCategoryId && this.urlCategoryId != '') {
			this.selectCategoryId = this.urlCategoryId;
			this.filter.categoryId = this.urlCategoryId;
		} else {
			if(this.optionsS.selectCategoryId && this.optionsS.selectCategoryId != '') {
				this.selectCategoryId = this.optionsS.selectCategoryId;
				this.filter.categoryId = this.optionsS.selectCategoryId;
			}
		}
		console.log(this.optionsS.notUpdatePage);
		if (!this.optionsS.notUpdatePage) {
			this.updateLoad();
		} else {
			this.optionsS.notUpdatePage = true;
		}
	}

	openRequest(route) {
		this.optionsS.notUpdatePage = true;
		this.router.navigate([route]);
	}

	updateLoad() {
		this.resetData();
		this.getCategories();
		//console.log('getRequestsR 2');
		//this.getRequestsR();
	}

	resetData() {
		this.isRefresh = true;
		this.isLoad = true;
		this.requestsR = [];
		this.filter.page = '1';
	}

	doRefresh(event) {
		this.resetData();
		this.refresher = event.target;
		//console.log('getRequestsR 1');
		this.getRequestsR();
	}

	getCategories() {
		this.dictionariesS.getAllCategories().subscribe(res => {
			this.categories = res.categories;
			setTimeout(() => {
				this.selectCategoryId = this.filter.categoryId;
				this.setCategoryText(this.filter.categoryId);
				this.getRequestsR();
			}, 50);
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);
		});
	}

	getRequestsR() {
		this.isErrorLoad = false;
		this.isLoad = true;

		this.requestDataS.getAllRequests(this.filter).subscribe(res => {
			if (res.requests && res.requests.length > 0) {
				var arrayTemp1 = Object.values(this.requestsR);
				var arrayTemp2 = Object.values(res.requests)
				this.requestsR = arrayTemp1.concat(arrayTemp2);
			}

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
			console.log(err);

			if (this.refresher) {
				this.refresher.complete();
			}
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			this.isLoad = false;
			this.isRefresh = false;
			this.isErrorLoad = true;
		});
	}

	selectCategory(event) {
		this.filter.categoryId = event.target.value;
		this.selectCategoryId = this.filter.categoryId;
		this.optionsS.selectCategoryId = this.selectCategoryId;

		this.setCategoryText(this.filter.categoryId);

		//console.log('getRequestsR 3');
		this.resetData();
		this.getRequestsR();
	}

	setCategoryText(categoryId) {
		if (categoryId && categoryId != 1) {
			var category = this.categories.find(i => i.id == categoryId);

			var selectCategoryTextTemp = category.name.replace('- ', '');
			if (category.parent_name != '') {
				this.selectCategoryText = selectCategoryTextTemp + ' - ' + category.parent_name;
			} else {
				this.selectCategoryText = selectCategoryTextTemp;
			}
		} else {
			this.selectCategoryText = 'Все категории';
		}

		try {
			ga('set', 'page', '/requests/all/' + this.selectCategoryText);
			ga('send', 'pageview');
		} catch (error) { console.log(error); }
	}

	filteShow() {
		this.isFilteShow = !this.isFilteShow;
	}

	sortRequestsR() {
		if (this.filter.sort == 'asc') {
			this.filter.sort = 'desc';
			this.sortIconName = 'r-desc-sort';
		} else {
			this.filter.sort = 'asc';
			this.sortIconName = 'r-asc-sort';
		}

		//console.log('getRequestsR 4');
		this.resetData();
		this.getRequestsR();
	}

	infiniteLoadRequestsR(event) {
		if (this.requestsR && this.requestsR.length > 0) {
			this.infiniteScroll = event.target;
			//console.log('getRequestsR 5');
			this.getRequestsR();
		}
	}
}
