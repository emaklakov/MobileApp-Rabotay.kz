import {Component, NgZone, OnInit} from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastNotificationsService } from '../../../services/toast-notifications/toast-notifications.service';
import { StorageService } from '../../../services/storage/storage.service';
import { AuthService } from '../../../services/auth/auth.service';
import * as firebase from 'firebase';
import {OptionsService} from "../../../services/options/options.service";

declare var ga: any;

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	isSendSMS: boolean = false;
	errorMessage: string = 'Приносим свои извинения. Сервис временно не доступен. Попробуйте повторить позднее. Возможно проблема с интернетом на устройстве.';
	phoneNumber: string = '';
	verificationId: string = '';
	code: string = '';
	timerSendSMS: number = 59;
	isLoading: boolean = false;
	timer: any;

	public phoneNumberForm: FormGroup;
	public codeSMSForm: FormGroup;

	constructor(
		private firebaseX: FirebaseX,
		public formBuilder: FormBuilder,
		private platform: Platform,
		private router: Router,
		public storageS: StorageService,
		public authS: AuthService,
		private optionsS: OptionsService,
		private toastNotificationsS: ToastNotificationsService,
		private zone: NgZone
	) {
		Window["rabotayLogin"] = this;

		this.phoneNumberForm = formBuilder.group({
			phoneNumber: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[7][0-9]*'), Validators.required])]
		});

		this.codeSMSForm = formBuilder.group({
			codeSMS: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(6), Validators.pattern('[0-9]*'), Validators.required])]
		});
	}

	ngOnInit() {
		//console.log('ngOnInit');
	}

	isPhoneNumberValid() {
		if (this.phoneNumberForm.valid) {
			return true;
		} else {
			this.toastNotificationsS.present('Вы не верно указали номер телефона. Он должен быть указан цифрами без скобок, пробелов и тире.', 'danger');
		}

		return false;
	}

	isSMSValid() {
		if (this.codeSMSForm.valid) {
			return true;
		} else {
			this.toastNotificationsS.present('Вы не верно указали код из SMS. Он состоит из 6 цифр, без пробелов и других символов.', 'danger');
		}

		return false;
	}

	sendSMS() {
		try {
			this.toastNotificationsS.dismiss();

			if (this.isPhoneNumberValid()) {
				this.presentLoading();
				var phoneNumberTemp = '+7' + this.phoneNumber;

				if (this.platform.is('cordova')) {
					(<any>window).FirebasePlugin.verifyPhoneNumber(function (credential) {
						Window["rabotayLogin"].verificationId = credential.verificationId;

						if (credential.instantVerification &&
							credential.code &&
							credential.code != 'null' &&
							credential.code != '123456' &&
							credential.code != '') {
							Window["rabotayLogin"].signInWithCredential(credential.code);
						} else {

							Window["rabotayLogin"].zone.run(() => {
								Window["rabotayLogin"].isSendSMS = true;
								Window["rabotayLogin"].dismissLoading();

								Window["rabotayLogin"].startTimerSendSMS();
							});

							//Window["rabotayLogin"].openSetCodeSMS();
							//Window["rabotayLogin"].isSendSMS = true;
							//Window["rabotayLogin"].dismissLoading();

							//Window["rabotayLogin"].startTimerSendSMS();
						}
					}, function (error) {
						Window["rabotayLogin"].zone.run(() => {
							if (error.code && error.code == 17010) {
								Window["rabotayLogin"].toastNotificationsS.present('У вас слишком много запросов SMS. Ваш номер временно заблокирован. Попробуйте повторить позднее.', 'danger');
							} else {
								Window["rabotayLogin"].toastNotificationsS.present(Window["rabotayLogin"].errorMessage, 'danger');
							}

							Window["rabotayLogin"].dismissLoading();

							Window["rabotayLogin"].optionsS.sendError('login.page - verifyPhoneNumber', error);
						});
					}, phoneNumberTemp, 60, '123456');
				} else {
					this.isSendSMS = true;
					this.dismissLoading();

					this.startTimerSendSMS();
				}
			}
		} catch (error) {
			this.dismissLoading();
			this.toastNotificationsS.present(this.errorMessage, 'danger');

			this.optionsS.sendError('login.page - sendSMS()', error);
		}
	}

	openSetCodeSMS() {
		this.zone.run(() => {
			this.isSendSMS = true;
			this.dismissLoading();

			this.startTimerSendSMS();
		});
	}

	startTimerSendSMS() {
		clearInterval(this.timer);
		this.timerSendSMS = 59;
		this.timer = setInterval(function () {
			Window["rabotayLogin"].timerSendSMS--;
			if (Window["rabotayLogin"].timerSendSMS <= 0) {
				clearInterval(this.timer);
			}
		}, 1000);
	}

	public verifyUserInFirebase = (verificationId, code): Promise<any> => {
		var promise = new Promise((resolve, reject) => {
			let signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
			firebase.auth().signInWithCredential(signInCredential).then((info) => {
				resolve(info);
			}, (error) => {
				this.optionsS.sendError('login.page - verifyUserInFirebase', error);

				reject(error);
			});
		});
		return promise;
	};

	signInWithCredential(code: string = '') {
		this.isSendSMS = true;
		this.presentLoading();

		console.log('signInWithCredential', code);

		if (code != '') {
			this.code = code;
		}

		if (this.platform.is('cordova')) {
			this.verifyUserInFirebase(this.verificationId, this.code).then(function (info) {
				try {
					console.log("Successfully signed in");
					console.log(info);

					//TODO: Сохранить Id пользователя
					var additionalUserInfo = info.additionalUserInfo;
					var user = info.user;

					if (user) {
						Window["rabotayLogin"].storageS.setObject('userPhoneNumber', user.phoneNumber);
						Window["rabotayLogin"].storageS.setObject('userFirebaseUid', user.uid);

						if (additionalUserInfo) {
							user.getIdToken(/* forceRefresh */ true).then(function(idToken) {
								var userAuth = {
									phone: user.phoneNumber,
									firebase_user_uid: user.uid,
									firebase_fcm_token: Window["rabotayLogin"].optionsS.userFirebaseToken,
									id_token: idToken
								};

								console.log(userAuth);

								Window["rabotayLogin"].login(userAuth, additionalUserInfo.isNewUser);
							}).catch(function(error) {
								console.log(error);
								Window["rabotayLogin"].dismissLoading();
								Window["rabotayLogin"].toastNotificationsS.present(Window["rabotayLogin"].errorMessage, 'danger');

								try {
									ga('send', 'exception', {
										'exDescription': error.message,
										'exFatal': true
									});
								} catch (error) { }
							});
						} else {
							Window["rabotayLogin"].dismissLoading();
						}
					} else {
						Window["rabotayLogin"].dismissLoading();
					}
				} catch (error) {
					console.log(error);
					Window["rabotayLogin"].dismissLoading();
					Window["rabotayLogin"].toastNotificationsS.present(Window["rabotayLogin"].errorMessage, 'danger');

					try {
						ga('send', 'exception', {
							'exDescription': error.message,
							'exFatal': true
						});
					} catch (error) { }
				}
			}).catch(function (error) {
				console.error("Failed to sign in", error);

				if (error.code && error.code == 'auth/invalid-verification-code') {
					Window["rabotayLogin"].toastNotificationsS.present('Вы не верно указали код из SMS. Он состоит из 6 цифр, без пробелов и других символов.', 'danger');
				} else {
					Window["rabotayLogin"].toastNotificationsS.present(Window["rabotayLogin"].errorMessage, 'danger');
				}

				Window["rabotayLogin"].dismissLoading();

				try {
					ga('send', 'exception', {
						'exDescription': error.message,
						'exFatal': true
					});
				} catch (error) { }
			});
		} else {
			// Для тестирования в Web
			var userAuth = {
				phone: '+77024472944',
				firebase_user_uid: '2dc7JVdJE2fdgN4BuYbc0v5ImwD2'
			};

			this.login(userAuth, false);
		}
	}

	login(userAuth, isNewUser) {
		this.authS.login(userAuth).subscribe((data) => {
			try {
				if (data &&
					data.access_token &&
					data.access_token != '' &&
					data.user && data.user.status > 0) {
					if (isNewUser) {
						// Перейти в настройки профиля
						this.openRoute('/user/settings');
						//this.dismissLoading();
					} else {
						this.openRoute(this.authS.redirectUrl);
						//this.dismissLoading();
					}

					try {
						ga('set', 'userId', data.user.id);
						ga('set', 'appVersion', this.optionsS.appVersion);
						ga('send', 'pageview');
					} catch (error) { }

				} else {
					this.dismissLoading();
					this.toastNotificationsS.present('Доступ в систему заблокирован.', 'danger');
				}
			} catch (error) {
				console.log(error);
				this.dismissLoading();
				this.toastNotificationsS.present(this.errorMessage, 'danger');

				try {
					ga('send', 'exception', {
						'exDescription': error.message,
						'exFatal': true
					});
				} catch (error) { }
			}
		}, error => {
			this.dismissLoading();
			this.toastNotificationsS.present(this.errorMessage, 'danger');

			this.optionsS.sendError('login.page - login()', error);
		});
	}

	verifySMS() {
		this.toastNotificationsS.dismiss();

		if (this.isSMSValid()) {
			this.signInWithCredential()
		}
	}

	presentLoading() {
		this.isLoading = true;
	}

	dismissLoading() {
		this.isLoading = false;
	}

	openRoute(route: string) {
		if (route && route != '') {
			this.router.navigate([route]);
		}
	}

	public ionViewWillEnter() {
		if(this.timer) {
			clearInterval(this.timer);
		}

		this.isSendSMS = false;
		this.phoneNumber = '';
		this.verificationId = '';
		this.code = '';
		this.timerSendSMS = 59;
		this.dismissLoading();
		this.toastNotificationsS.dismiss();
	}

	wrongNumber() {
		this.ionViewWillEnter();
	}

	eventHandlerPhoneNumber(event) {
		if((event.keyCode && event.keyCode == 13) || (event.key && event.key == 13)) {
			this.sendSMS();
		}
	}

	eventHandlerSMS(event) {
		if((event.keyCode && event.keyCode == 13) || (event.key && event.key == 13)) {
			this.verifySMS();
		}
	}

	openUrl(url) {
		this.optionsS.openBrowser(url);
	}
}
