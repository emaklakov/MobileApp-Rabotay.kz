import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UserDataService } from '../../../services/user-data/user-data.service';
import { ToastNotificationsService } from '../../../services/toast-notifications/toast-notifications.service';
import { OptionsService } from '../../../services/options/options.service';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {LoadingService} from "../../../services/loading/loading.service";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";
import {DictionariesService} from "../../../services/dictionaries/dictionaries.service";

@Component({
	selector: 'app-settings',
	templateUrl: './settings.page.html',
	styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

	errorMessage: string = 'Приносим свои извинения. Сервис временно не доступен. Попробуйте повторить позднее. Возможно проблема с интернетом на устройстве.';

	currentUser: any;
	firstName: string = '';
	lastName: string = '';
	middleName: string = '';
	phone: string = '';
	dateBirth: string = '';
	gender: string = '';
	locationName: string = '';
	locationId: string = '';
	aboutMe: string = '';
	avatarImage: string = '/assets/img/ava-empty.png';
	isErrorLoad: boolean = false;
	isLoad: boolean = true;
	minDate: any;
	maxDate: any;
	refresher: any;
	pageSections: any;

	constructor(
		private camera: Camera,
		private actionSheetController: ActionSheetController,
		private platform: Platform,
		private transfer: FileTransfer,
		private crop: Crop,
		private filePath: FilePath,
		private userDataS: UserDataService,
		private authS: AuthService,
		private router: Router,
		private optionsS: OptionsService,
		private toastNotificationsS: ToastNotificationsService,
		private loadingS: LoadingService,
		private socialSharing: SocialSharing,
		private dictionariesS: DictionariesService,
	) {
		Window["rabotaySettings"] = this;
	}

	ngOnInit() {

	}

	public ionViewWillEnter() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		this.minDate = (yyyy - 80) + '-' + mm + '-' + dd;
		this.maxDate = (yyyy - 6) + '-' + mm + '-' + dd;

		this.getUserData();
	}

	getUserData() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.userDataS.getServerData().subscribe(res => {
			this.updateViewData(res);
		}, err => {
			if (this.refresher) {
				this.refresher.complete();
			}

			this.isErrorLoad = true;
			this.isLoad = false;

			if (err.status == 400) {
				this.openRoute('/');
				this.toastNotificationsS.present(this.errorMessage, 'danger');
			}

			this.optionsS.sendError('user.settings.page - getUserData()', err);
		});
	}

	updateLoad() {
		this.getUserData();
	}

	doRefresh(event) {
		this.refresher = event.target;
		this.updateLoad();
	}

	updateData(element, event) {
		var user = null;

		switch (element) {
			case 'firstName':
				if (event.target.value != this.firstName) {
					if (event.target.value) {
						user = {
							'first_name': event.target.value
						};
					} else {
						if (this.firstName && this.firstName != '') {
							user = {
								'first_name': event.target.value
							};
						}
					}
				}
				break;
			case 'lastName':
				if (event.target.value != this.lastName) {
					if (event.target.value) {
						user = {
							'last_name': event.target.value
						};
					} else {
						if (this.lastName && this.lastName != '') {
							user = {
								'last_name': event.target.value
							};
						}
					}
				}
				break;
			case 'middleName':
				if (event.target.value != this.middleName) {
					if (event.target.value) {
						user = {
							'middle_name': event.target.value
						};
					} else {
						if (this.middleName && this.middleName != '') {
							user = {
								'middle_name': event.target.value
							};
						}
					}
				}
				break;
			case 'dateBirth':
				if (event.target.value != this.dateBirth) {
					if (event.target.value) {
						user = {
							'date_birth': event.target.value
						};
					} else {
						if (this.dateBirth && this.dateBirth != '') {
							user = {
								'date_birth': event.target.value
							};
						}
					}
				}
				break;
			case 'aboutMe':
				if (event.target.value != this.aboutMe) {
					if (event.target.value) {
						user = {
							'about_me': event.target.value
						};
					} else {
						if (this.aboutMe && this.aboutMe != '') {
							user = {
								'about_me': event.target.value
							};
						}
					}
				}
				break;
			case 'gender':
				if (event.target.value != this.gender) {
					if (event.target.value) {
						user = {
							'gender': event.target.value
						};
					} else {
						if (this.gender && this.gender != '') {
							user = {
								'gender': event.target.value
							};
						}
					}
				}
				break;
		}

		if (user) {
			//this.loadingS.present();
			this.userDataS.updateServerData(user).subscribe(res => {
				if (res.status > 0) {
					this.updateViewData(res);
				} else {
					this.authS.logout();
				}
				//this.loadingS.dismiss();
			}, err => {
				if (err.status == 401) {
					this.authS.logout();
				}
				//this.loadingS.dismiss();

				this.optionsS.sendError('user.settings.page - updateData()', err);
			});
		}
	}

	updateViewData(res) {
		if (res && res.status > 0) {
			this.currentUser = res;
			this.firstName = res.first_name;
			this.lastName = res.last_name;
			this.middleName = res.middle_name;
			this.phone = res.phone;
			this.dateBirth = res.info.date_birth;
			this.gender = res.info.gender;
			this.locationName = res.info.location_name;
			this.locationId = res.info.location_id;
			this.aboutMe = res.info.about_me;

			if (res.info.avatar_image && res.info.avatar_image != '') {
				this.avatarImage = res.info.avatar_image;
			} else {
				this.avatarImage = '/assets/img/ava-empty.png';
			}

			if (this.locationId != '' && this.locationName != '') {
				var userLocation = {
					'id': this.locationId,
					'name': this.locationName
				};

				if (!this.optionsS.getLocationSelect) {
					this.optionsS.updateLocationSelect(userLocation);
				}
			}

			this.getPageSections();

			this.isLoad = false;
		} else {
			console.log('updateViewData', res);
			this.authS.logout();
		}

		if (this.refresher) {
			this.refresher.complete();
		}
	}

	changeDateBirth($event) {
		//this.dateBirth = $event.target.value;
	}

	adjustTextarea(event: any): void {
		let textarea: any = event.target;
		textarea.style.overflow = 'hidden';
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
		return;
	}

	openUrl(url, target = '_blank', params = '?source=inapp') {
		this.optionsS.openBrowser(url, target, params);
	}

	openRoute(route: string) {
		if (route && route != '') {
			this.router.navigate([route]);
		}
	}

	logout() {
		this.authS.logout();
	}

	async loadAvatar() {
		const actionSheet = await this.actionSheetController.create({
			header: "Откуда возьмем фото?",
			buttons: [{
				text: 'Из галереи',
				handler: () => {
					this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
				}
			},
			{
				text: 'Фото с камеры',
				handler: () => {
					this.takePicture(this.camera.PictureSourceType.CAMERA);
				}
			},
			{
				text: 'Отмена',
				role: 'cancel'
			}
			]
		});
		await actionSheet.present();
	}

	takePicture(sourceType: PictureSourceType) {
		var options: CameraOptions = {
			quality: 100,
			sourceType: sourceType,
			saveToPhotoAlbum: false,
			correctOrientation: true
		};

		this.camera.getPicture(options).then(imagePath => {
			if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
				this.filePath.resolveNativePath(imagePath)
					.then(filePath => {
						this.cropImage(filePath);
					});
			} else {
				this.cropImage(imagePath);
			}
		}, err => {
			this.optionsS.sendError('user.settings.page - takePicture()', err);
		});
	}

	cropImage(filePath) {
		this.crop.crop(filePath, {
			quality: 100,
			targetWidth: 256,
			targetHeight: 256
		}).then(newImage => {
			let correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
			let currentName = newImage.substr(newImage.lastIndexOf('/') + 1);
			this.startUpload(correctPath, currentName);
		}, err => {
			if (err.code && err.code == 'userCancelled') {

			} else {
				this.toastNotificationsS.present(this.errorMessage, 'danger');
			}

			this.optionsS.sendError('user.settings.page - cropImage()', err);
		});
	}

	startUpload(correctPath, currentName) {
		this.loadingS.present();

		var userAccessToken = this.optionsS.getUserAccessToken();

		var fileTransfer: FileTransferObject = this.transfer.create();
		var uploadOpts: FileUploadOptions = {
			fileKey: 'file',
			fileName: currentName,
			headers: {
				Authorization: 'Bearer ' + userAccessToken
			}
		};

		fileTransfer.upload(correctPath + currentName, `${this.optionsS.getApiUrl()}/v1/users/${this.currentUser.id}/avatar`, uploadOpts)
			.then((data) => {
				if (data && data.responseCode == 200) {
					var user = JSON.parse(data.response);
					//console.log(user);
					if (user.id) {
						this.updateViewData(user);
						this.userDataS.updateData(user);
					}
				} else {
					this.toastNotificationsS.present(this.errorMessage, 'danger');
				}
				this.loadingS.dismiss();
			}, (err) => {
				this.loadingS.dismiss();
				if (err.http_status == 401) {
					this.authS.logout();
				}
				this.toastNotificationsS.present(this.errorMessage, 'danger');

				this.optionsS.sendError('user.settings.page - startUpload()', err);
			}).finally(() => {
				this.loadingS.dismiss();
			});
	}

	async profileShare() {
		if(this.currentUser) {
			await this.socialSharing.share('Мой профиль | Rabotay.kz', 'Rabotay.kz', null, 'https://rabotay.kz/profile/'+this.currentUser.id);
		}
	}

	getPageSections() {
		var data = {
			userId: this.currentUser.id
		};

		this.dictionariesS.getPageSections('settings', data).subscribe(res => {
			this.pageSections = res.pageSections;

			for (let pageSection of this.pageSections) {
				if (pageSection.htmlContentId && pageSection.htmlContentId != '') {
					if (pageSection.htmlContent && pageSection.htmlContent != '') {
						this.setPageSectionHtmlContent(pageSection);
					}
				}
			}
		}, err => {
			this.optionsS.sendError('settings.page - getPageSections()', err);
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
