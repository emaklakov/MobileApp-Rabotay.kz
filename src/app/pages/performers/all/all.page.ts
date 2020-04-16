import {Component, OnInit} from '@angular/core';
import {OptionsService} from "../../../services/options/options.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DictionariesService} from "../../../services/dictionaries/dictionaries.service";
import {PerformerDataService} from "../../../services/performer-data/performer-data.service";
import {StorageService} from "../../../services/storage/storage.service";

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
	categories: any;
	selectCategoryId: any = 1;
	selectCategoryText: string = 'Все категории';
	location: any;
	refresher: any;
	filter: any = {
		type_performer: 'all',
		locationId: '',
		categoryId: '1',
		sort: 'desc',
		page: '1',
		favorites: '',
	};
	performers: any = [];
	infiniteScroll: any;
	urlCategoryId: string = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private dictionariesS: DictionariesService,
		private performerDataS: PerformerDataService,
		private optionsS: OptionsService,
		private storageS: StorageService,
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
		//this.getPerformersType();
	}

	resetData() {
		this.isRefresh = true;
		this.isLoad = true;
		this.performers = [];
		this.filter.page = '1';
		this.filter.favorites = '';
	}

	doRefresh(event) {
		this.resetData();
		this.refresher = event.target;
		this.getPerformersType();
	}

	infiniteLoadPerformers(event) {
		if (this.performers && this.performers.length > 0) {
			this.infiniteScroll = event.target;
			this.getPerformersType();
		}
	}

	getCategories() {
		this.dictionariesS.getAllCategories().subscribe(res => {
			this.categories = res.categories;
			setTimeout(() => {
				this.selectCategoryId = this.filter.categoryId;
				this.setCategoryText(this.filter.categoryId);
				this.getPerformersType();
			}, 50);
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);
		});
	}

	getPerformersType() {
		if(this.filter.type_performer == 'all') {
			this.filter.favorites = '';

			this.optionsS.notUpdatePage = false;

			this.getPerformers();
		} else {

			this.storageS.getObject('profiles-favorites').then(object => {
				let favorites = new Set();
				if (object != null) {
					this.filter.favorites = object.toString();
				}

				this.optionsS.notUpdatePage = false;

				this.getPerformers();
			});
		}
	}

	getPerformers() {
		this.isErrorLoad = false;
		this.isLoad = true;

		if(this.selectCategoryId != 1) {
			this.performerDataS.getAllPerformers(this.filter).subscribe(res => {
				if (res.performers && res.performers.length > 0) {
					var arrayTemp1 = Object.values(this.performers);
					var arrayTemp2 = Object.values(res.performers)
					this.performers = arrayTemp1.concat(arrayTemp2);
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

				/*
				if(this.filter.type_performer == 'favorites') {
					this.storageS.getObject('profiles-favorites').then(object => {
						let favorites = new Set();
						if (object != null) {
							favorites = new Set(object);
						}

						let favoritesRet = new Set();
						if (this.performers &&
							this.performers != null &&
							this.performers.length &&
							this.performers.length > 0) {
							favoritesRet = new Set();
							this.performers.forEach(function(item, i, arr) {
								//console.log( arr[i].user_id );
								favoritesRet.add(arr[i].user_id.toString());
							});

							favorites.forEach(function(item, i, arr) {
								//console.log( i + ": " + item + " (массив:" + arr + ")" );
								if (!favoritesRet.has(item)) {
									favorites.delete(item);
								}
							});
						}

						this.storageS.setObject('profiles-favorites', Array.from(favorites));
					});
				}
				*/
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
		} else {
			if (this.refresher) {
				this.refresher.complete();
			}
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}

			this.isLoad = false;
			this.isRefresh = false;
			this.isErrorLoad = false;
		}
	}

	filteShow() {
		this.isFilteShow = !this.isFilteShow;
	}

	selectCategory(event) {
		this.filter.categoryId = event.target.value;
		this.selectCategoryId = this.filter.categoryId;
		this.optionsS.selectCategoryId = this.selectCategoryId;

		this.setCategoryText(this.filter.categoryId);

		this.resetData();
		this.getPerformersType();
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
			ga('set', 'page', '/performers/all/' + this.selectCategoryText);
			ga('send', 'pageview');
		} catch (error) { console.log(error); }
	}

	changeSegmentTypePerformer(event) {
		this.filter.type_performer = event.target.value;
		this.resetData();
		this.getPerformersType();
	}
}
