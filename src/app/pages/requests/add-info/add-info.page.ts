import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DictionariesService } from '../../../services/dictionaries/dictionaries.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { OptionsService } from '../../../services/options/options.service';
import { ToastNotificationsService } from '../../../services/toast-notifications/toast-notifications.service';
import { RequestDataService } from '../../../services/request-data/request-data.service';

@Component({
	selector: 'app-add-info',
	templateUrl: './add-info.page.html',
	styleUrls: ['./add-info.page.scss'],
})
export class AddInfoPage implements OnInit {

	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	infoTitle: string = 'Загрузка...';
	subcategoryId = null;
	category: any;
	currentUser: any;
	location: any;
	requestTitle: string = '';
	requestDescription: string = '';
	requestAddress: string = '';
	requestStartDate: string = '';
	requestEndDate: string = '';
	requestPrice: number = 0;
	minDate: any;
	maxDate: any;

	constructor(
		private activatedRoute: ActivatedRoute,
		private dictionariesS: DictionariesService,
		private authS: AuthService,
		private router: Router,
		private userDataS: UserDataService,
		private optionsS: OptionsService,
		private toastNotificationsS: ToastNotificationsService,
		private requestDataS: RequestDataService
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		this.minDate = yyyy + '-' + mm + '-' + dd;
		this.maxDate = (yyyy + 1) + '-' + mm + '-' + dd;

		this.updateLoad();
	}

	getCategory() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.dictionariesS.getCategory(this.subcategoryId).subscribe(res => {
			this.infoTitle = res.name;
			this.category = res;

			if (this.userDataS.currentUser) {
				this.currentUser = this.userDataS.currentUser;

				var selectLocation = this.optionsS.getLocationSelect();
				if (selectLocation != null) {
					this.location = selectLocation;
				} else {
					if (this.currentUser.info && this.currentUser.info.location_id) {
						this.location = {
							id: this.currentUser.info.location_id,
							name: this.currentUser.info.location_name
						}
					}
				}

			} else {
				this.router.navigate(['requests/add']);
			}

			this.isLoad = false;
		}, err => {
			//TODO: Если произошла ошибка, то вывести сообщение
			console.log(err);

			this.isLoad = false;
			this.isErrorLoad = true;

			if (err.status == 401) {
				this.authS.logout();
			}
		});
	}

	updateLoad() {
		this.subcategoryId = this.activatedRoute.snapshot.paramMap.get('id');
		//console.log(this.subcategoryId);
		this.getCategory();
	}

	ionInputTitle(event) {
		this.requestTitle = event.target.value;
	}

	ionInputDescription(event) {

		let textarea: any = event.target;
		textarea.style.overflow = 'hidden';
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';

		this.requestDescription = textarea.value;

		return;
	}

	ionInputAddress(event) {
		this.requestAddress = event.target.value;
	}

	changeRequestStartDate(event) {
		this.requestStartDate = event.target.value;
	}

	changeRequestEndDate(event) {
		this.requestEndDate = event.target.value;
	}

	ionInputPrice(event) {
		this.requestPrice = event.target.value;
	}

	createRequest() {
		if (this.location && this.location.id && this.requestTitle.trim() != '') {
			this.isLoad = true;
			this.toastNotificationsS.dismiss();

			var requestR = {
				'category_id': this.subcategoryId,
				'location_id': this.location.id,
				'address': this.requestAddress.trim() != '' ? this.requestAddress : '',
				'title': this.requestTitle,
				'description': this.requestDescription.trim() != '' ? this.requestDescription : '',
				'price': this.requestPrice,
				'date_start': this.requestStartDate.trim() != '' ? this.requestStartDate : '',
				'date_end': this.requestEndDate.trim() != '' ? this.requestEndDate : '',
			};

			this.requestDataS.createRequest(requestR).subscribe(res => {
				//console.log(res);
				if (res && res.id) {
					this.optionsS.notUpdatePage = false;
					this.router.navigate(['requests/detail/' + res.id], { replaceUrl: true });
				}

				this.isLoad = false;
			}, err => {
				console.log(err);

				this.isLoad = false;

				if (err.status == 401) {
					this.authS.redirectUrl = '/requests/add';
					this.authS.logout('/user/login');
				}
				//this.loadingS.dismiss();
			});

		} else {
			this.toastNotificationsS.present('Заголовок и Населенный пункт должны быть указаны обязательно.', 'danger');
		}
	}
}
