import { Component, OnInit } from '@angular/core';
import {OptionsService} from "../../../services/options/options.service";
import {UserDataService} from "../../../services/user-data/user-data.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'app-rating-reviews',
	templateUrl: './rating-reviews.page.html',
	styleUrls: ['./rating-reviews.page.scss'],
})
export class RatingReviewsPage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	isRefresh: boolean = true;
	filter: any = {
		sort: 'desc',
		page: '1',
		userId: '',
	};
	refresher: any;
	feedbacks: any = [];
	infiniteScroll: any;
	rating: string = '';
	ratingStars: string = '';
	countFeedbacks: string = '';
	countCreateRequests: string = '';
	countCompletRequests: string = '';
	countNotCompletRequests: string = '';


	constructor(
		private activatedRoute: ActivatedRoute,
		private optionsS: OptionsService,
		private userDataS: UserDataService,
		private router: Router,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.filter.userId = this.activatedRoute.snapshot.paramMap.get('id');
		this.updateLoad();
	}

	getFeedbacks() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.userDataS.getAllFeedbacks(this.filter).subscribe(res => {
			if (res.feedbacks && res.feedbacks.length > 0) {
				var arrayTemp1 = Object.values(this.feedbacks);
				var arrayTemp2 = Object.values(res.feedbacks)
				this.feedbacks = arrayTemp1.concat(arrayTemp2);
			}

			this.rating = res.rating;
			this.ratingStars = res.rating_stars;
			this.countFeedbacks = res.count_feedbacks;
			this.countCreateRequests = res.count_create_requests;
			this.countCompletRequests = res.count_complet_requests;
			this.countNotCompletRequests = res.count_not_complet_requests;

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

			this.optionsS.sendError('user.rating-reviews.page - getFeedbacks()', err);
		});
	}

	openRequest(route) {
		this.optionsS.routerLink = '/user/rating-reviews/' + this.filter.userId;
		this.router.navigate([route]);
	}

	updateLoad() {
		this.resetData();
		this.getFeedbacks();
	}

	resetData() {
		this.isRefresh = true;
		this.isLoad = true;
		this.feedbacks = [];
		this.filter.page = '1';
	}

	doRefresh(event) {
		this.resetData();
		this.refresher = event.target;
		this.updateLoad();
	}

	infiniteLoadFeedbacks(event) {
		this.infiniteScroll = event.target;
		if (this.feedbacks && this.feedbacks.length > 0) {
			this.getFeedbacks();
		} else {
			if (this.infiniteScroll) {
				this.infiniteScroll.complete();
			}
		}
	}

}
