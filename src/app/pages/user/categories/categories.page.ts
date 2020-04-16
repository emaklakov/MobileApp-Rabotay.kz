import {Component, OnInit} from '@angular/core';
import {OptionsService} from "../../../services/options/options.service";
import {UserDataService} from "../../../services/user-data/user-data.service";
import {LoadingService} from "../../../services/loading/loading.service";

@Component({
	selector: 'app-categories',
	templateUrl: './categories.page.html',
	styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	subscriptions: any;
	location: any;

	constructor(
		private optionsS: OptionsService,
		private userDataS: UserDataService,
		private loadingS: LoadingService,
	) {
	}

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.location = this.optionsS.getLocationSelect();
		if(this.location) {
			this.updateLoad();
		} else {
			this.isLoad = false;
		}
	}

	updateLoad() {
		this.getSubscriptions();
	}

	getSubscriptions() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.userDataS.getAllSubscriptions(this.location.id).subscribe(res => {
			this.subscriptions = res.subscriptions;

			this.isLoad = false;
			this.isErrorLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);

			this.isLoad = false;
			this.isErrorLoad = true;
		});
	}

	selectSubscription(categoryId, subcategoryId = '') {
		this.loadingS.present();

		var category = this.subscriptions.find(i => i.category_id == categoryId);

		var subcategories = category.subcategories;
		var subcategory = subcategories.find(i => i.subcategory_id == subcategoryId);

		if(subcategory.subscription_id) {
			this.unSubscribe(subcategory.subscription_id, categoryId, subcategory.subcategory_id)
		} else {
			this.setSubscribe(categoryId, subcategory.subcategory_id)
		}
	}

	unSubscribe(subscriptionId, categoryId, subcategoryId) {
		this.userDataS.unSubscribe(subscriptionId).subscribe(res => {
			var userSubscriptionIcon = document.getElementById("select-subscription-icon-" + subcategoryId);
			if (userSubscriptionIcon) {
				userSubscriptionIcon.style.visibility = "hidden";

				var category = this.subscriptions.find(i => i.category_id == categoryId);

				var subcategories = category.subcategories;
				var subcategory = subcategories.find(i => i.subcategory_id == subcategoryId);
				subcategory.subscription_id = null;

				if(category.category_id == subcategory.subcategory_id) {
					category.subscription_id = null;
				}
			}

			this.loadingS.dismiss();
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);

			this.loadingS.dismiss();
		});
	}

	setSubscribe(categoryId, subcategoryId) {
		this.userDataS.setSubscribe(subcategoryId, this.location.id).subscribe(res => {
			var userSubscriptionIcon = document.getElementById("select-subscription-icon-" + subcategoryId);
			if (userSubscriptionIcon) {
				userSubscriptionIcon.style.visibility = "visible";

				var category = this.subscriptions.find(i => i.category_id == categoryId);

				var subcategories = category.subcategories;
				var subcategory = subcategories.find(i => i.subcategory_id == subcategoryId);
				subcategory.subscription_id = res.id;

				if(category.category_id == subcategory.subcategory_id) {
					category.subscription_id = res.id;
				}
			}

			this.loadingS.dismiss();
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);

			this.loadingS.dismiss();
		});
	}

	openCategory(categoryId) {
		var subcategories = document.getElementById("parent-category-" + categoryId);
		subcategories.classList.toggle("hidden");
	}
}
