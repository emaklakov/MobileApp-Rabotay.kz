import { Component, OnInit } from '@angular/core';
import { DictionariesService } from '../../../services/dictionaries/dictionaries.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { AuthService } from '../../../services/auth/auth.service';
import {NavController} from "@ionic/angular";
import {FirebaseX} from "@ionic-native/firebase-x/ngx";

@Component({
	selector: 'app-locations',
	templateUrl: './locations.page.html',
	styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

	regions: any;
	location: any;
	isLoad: boolean = true;
	isErrorLoad: boolean = false;

	constructor(
		private dictionariesS: DictionariesService,
		private userDataS: UserDataService,
		private authS: AuthService,
		private navCtrl: NavController,
		private firebaseX: FirebaseX,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.getLocations();
	}

	updateLoad() {
		this.getLocations();
	}

	getLocations() {
		this.isErrorLoad = false;
		this.isLoad = true;
		var currentUser = this.userDataS.currentUser;

		if (currentUser.info && currentUser.info.location_id) {
			this.location = {
				id: currentUser.info.location_id,
				name: currentUser.info.location_name
			}
		}

		this.dictionariesS.getLocations().subscribe(res => {
			this.regions = res;
			setTimeout(() => {
				if (this.location) {
					this.markLocation(this.location.id);
					this.scrollTo('user-location-icon-' + this.location.id);
				}
			}, 50);

			this.isLoad = false;
		}, err => {
			console.log(err);
			this.isLoad = false;
			this.isErrorLoad = true;
		});
	}

	selectLocation(id: string, name: string) {
		this.markLocation(id);

		if (this.location && this.location.id && this.location.id != '') {
			this.firebaseX.unsubscribe("rabotay-location-"+this.location.id);
		}

		this.location = {
			'id': id,
			'name': name
		};

		if (this.location && this.location.id && this.location.id != '') {
			this.firebaseX.subscribe("rabotay-location-"+this.location.id);
		}

		this.saveLocation();
	}

	saveLocation() {
		var user = {
			'location_id': this.location.id
		};

		this.userDataS.updateServerData(user).subscribe(res => {
			if (res.status == 0) {
				this.authS.logout();
			}
		}, err => {
			console.log(err)
			if (err.status == 401) {
				this.authS.logout();
			}
		});

		this.navCtrl.back();
	}

	markLocation(id: string) {
		if (this.location && this.location.id != id) {
			var userLocationIconOld = document.getElementById("user-location-icon-" + this.location.id);
			if (userLocationIconOld) {
				userLocationIconOld.style.visibility = "hidden";
			}
		}

		var userLocationIcon = document.getElementById("user-location-icon-" + id);
		if (userLocationIcon) {
			userLocationIcon.style.visibility = "visible";
		}
	}

	scrollTo(elementId: string) {
		document.getElementById(elementId).scrollIntoView({ block: 'center'});
	}
}
