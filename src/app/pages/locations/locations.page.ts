import { Component, OnInit, ViewChild } from '@angular/core';
import {IonContent, NavController} from '@ionic/angular';
import { DictionariesService } from '../../services/dictionaries/dictionaries.service';
import { OptionsService } from '../../services/options/options.service';
import {FirebaseX} from "@ionic-native/firebase-x/ngx";

@Component({
	selector: 'app-locations',
	templateUrl: './locations.page.html',
	styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {

	@ViewChild(IonContent, { static: true }) content: IonContent;

	regions: any;
	location: any;
	isLoad: boolean = true;
	isErrorLoad: boolean = false;

	constructor(
		private dictionariesS: DictionariesService,
		private optionsS: OptionsService,
		private navCtrl: NavController,
		private firebaseX: FirebaseX,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.updateLoad();
	}

	updateLoad() {
		this.getLocations();
	}

	getLocations() {
		this.isErrorLoad = false;
		this.isLoad = true;
		var selectLocation = this.optionsS.getLocationSelect();
		if (selectLocation != null) {
			this.location = selectLocation;
		}

		this.dictionariesS.getLocations().subscribe(res => {
			this.regions = res;

			if (this.location) {
				setTimeout(() => {
					this.markLocation(this.location.id)
					this.scrollTo('select-location-icon-' + this.location.id);
				}, 50);
			}

			this.isLoad = false;
		}, err => {
			this.isLoad = false;
			this.isErrorLoad = true;

			this.optionsS.sendError('locations.page - getLocations()', err);
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

		this.optionsS.updateLocationSelect(this.location);
		this.optionsS.notUpdatePage = false;
		this.navCtrl.back();
	}

	markLocation(id: string) {
		if (this.location && this.location.id != id) {
			var selectLocationIconOld = document.getElementById("select-location-icon-" + this.location.id);
			if (selectLocationIconOld) {
				selectLocationIconOld.style.visibility = "hidden";
			}
		}

		var selectLocationIcon = document.getElementById("select-location-icon-" + id);
		if (selectLocationIcon) {
			selectLocationIcon.style.visibility = "visible";
		}
	}

	scrollTo(elementId: string) {
		document.getElementById(elementId).scrollIntoView({ block: 'center'});
	}
}
