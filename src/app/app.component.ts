import { Component, ViewChildren, QueryList } from '@angular/core';

import {Platform, IonRouterOutlet, ToastController, MenuController, NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { OptionsService } from './services/options/options.service';
import { UserDataService } from './services/user-data/user-data.service';

import {NavigationEnd, Router} from '@angular/router';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import * as firebase from 'firebase';
import {NotificationDataService} from "./services/notification-data/notification-data.service";

declare var ga: any;

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss']
})
export class AppComponent {
	public appPages = [
		{
			title: 'Главная',
			url: '/home',
			icon: 'home',
			class: '',
		},
		{
			title: 'Создать заявку',
			url: '/requests/add',
			icon: 'add',
			class: 'item-strong-main-menu',
		},
		{
			title: 'Все заявки',
			url: '/requests/all',
			icon: 'list',
			class: '',
		},
		{
			title: 'Мои заявки',
			url: '/requests/my',
			icon: 'filing',
			class: '',
		},
		{
			title: 'Исполнители',
			url: '/performers/all',
			icon: 'people',
			class: '',
		},
		/*
		{
			title: 'Сообщения',
			url: '/messages/all',
			icon: 'chatbubbles',
			class: '',
		},
		*/
		{
			title: 'Уведомления',
			url: '/notifications/all',
			icon: 'notifications',
			class: '',
		},
		{
			title: 'О приложении',
			url: '/about-app',
			icon: 'information-circle-outline',
			class: '',
		}
	];

	@ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

	uuid: string = '';
	route: string = '';
	lastTimeBackPress: number = 0;
	timePeriodToExit: number = 2000;
	tokenFCM: string = '';
	appUserData: any;
	appUserIsAuthenticated: boolean = false;
	appLocationSelect: any;
	avatarImage: string = '/assets/img/ava-empty.png';
	appV: string = '';
	notificationsNew: boolean = false;

	configFirebase = {
		apiKey: 'AIzaSyD_unrlO0jSsgHwqCeEiRweurJHAsPlnrc',
		projectId: 'rabotay-kz',
	};

	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private authS: AuthService,
		private optionsS: OptionsService,
		private userDataS: UserDataService,
		private notificationDataS: NotificationDataService,
		private firebaseX: FirebaseX,
		private appVersion: AppVersion,
		private router: Router,
		public toastController: ToastController,
		private statusBar: StatusBar,
		public menuCtrl: MenuController,
		private navCtrl: NavController

	) {
		this.initializeApp();

		this.platform.resume.subscribe((res) => {
			console.log('App Resumed');
			this.authS.checkAccessToken();
		});

		firebase.initializeApp(this.configFirebase);

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				var url = event.urlAfterRedirects;
				var appPage = this.appPages.find(i => i.url == url);

				if(appPage && appPage != undefined) {
					document.title = appPage.title;
				} else {
					switch (url) {
						case '/locations':
							document.title = "Населенные пункты";
							break;
						case '/user/login':
							document.title = "Вход";
							break;
						case '/user/settings':
							document.title = "Настройки";
							break;
						case '/balance/detail':
							document.title = "Ваш баланс";
							break;
						case '/user/locations':
							document.title = "Населенные пункты - Настройки";
							break;
						case '/user/locations':
							document.title = "Населенные пункты - Настройки";
							break;
						default:
							document.title = "Rabotay";
					}
				}

				try {
					if (this.appUserData && this.appUserData.id) {
						ga('set', 'dimension1', this.appUserData.id);
					}

					ga('set', 'appVersion', this.appV);
					ga('set', 'page', url);
					ga('send', 'pageview');
				} catch (error) { console.log(error); }
			}
		});

		try {
			ga('set', 'appName', 'Rabotay');
			if (this.platform.is("android")) {
				ga('set', 'appId', 'kz.rabotay.android');
			} else if (this.platform.is("ios")) {
				ga('set', 'appId', 'kz.rabotay.ios');
			}

			this.appVersion.getVersionNumber().then(value => {
				ga('set', 'appVersion', value);
				ga('send', 'pageview');
			}).catch(err => {
				//alert(err);
			});

		} catch (error) { console.log(error); }
	}

	initPushNotification() {
		if (this.platform.is('cordova')) {
			// Initialize push notification feature
			this.platform.is('ios') ? this.initializeFireBaseIos() : this.initializeFireBaseAndroid();

			this.firebaseX.onTokenRefresh().subscribe(
				token => {
					//console.log(`The new token is ${token}`);
					this.registerToken(token);
				},
				error => {
					this.optionsS.sendError('initPushNotification onTokenRefresh()', error);
				});
		} else {
			console.log('Push notifications are not enabled since this is not a real device');
		}
	}

	initializeFireBaseAndroid(): Promise<any> {
		return this.firebaseX.getToken()
			.then(token => {
				//console.log(`The token is ${token}`);
				this.tokenFCM = token;
				this.registerToken(token);
				this.subscribeToPushNotificationEvents();
			})
			.catch(error => {
				this.optionsS.sendError('initializeFireBaseAndroid getToken()', error);
			});
	}

	initializeFireBaseIos(): Promise<any> {
		return this.firebaseX.hasPermission().then(hasPermission => {
			if(!hasPermission) {
				this.firebaseX.grantPermission()
					.catch(error => {
						this.optionsS.sendError('initializeFireBaseIos grantPermission()', error);
					})
					.then(() => {
						this.firebaseX.getToken()
							.catch(error => {
								this.optionsS.sendError('initializeFireBaseIos getToken()', error);
							})
							.then(token => {
								//console.log(`The token is ${token}`);
								this.tokenFCM = `${token}`;
								this.registerToken(`${token}`);
								this.subscribeToPushNotificationEvents();
							});
					});
			}
		});
	}

	subscribeTopics() {
		this.firebaseX.subscribe("rabotay-marketing");
		//this.firebaseX.subscribe("rabotay-test");

		var devicePlatform = '';
		if (this.platform.is("android")) {
			devicePlatform = 'android';
		}
		if (this.platform.is("ios")) {
			devicePlatform = 'ios';
		}

		if (devicePlatform != '') {
			this.firebaseX.subscribe(devicePlatform);
		}
	}

	subscribeToPushNotificationEvents() {
		this.firebaseX.onMessageReceived()
			.subscribe(async data => {
				console.log(data);
				if (this.platform.is("android")) {
					if (data && data.messageType == "notification") {
						//if (data) {
						if (data.tap) {
							if (data.route) {
								//console.log(data.route);
								this.router.navigate([data.route]);
								this.firebaseX.clearAllNotifications().then(null);
								this.firebaseX.setBadgeNumber(0).then(null);
							} else {
								//this.router.navigate([data.route]);
							}
						}

						this.notificationDataS.loadData();

						if(data.notification_id) {
							this.notificationDataS.receivedNotification(data.notification_id).subscribe(res => { });
						}
					}
				}

				if (this.platform.is("ios")) {
					if (data) {
						console.log('data', data);
						if (data.route) {
							//console.log(data.route);
							this.route = data.route;

							this.notificationDataS.loadData();

							if(data.notification_id) {
								console.log('data.notification_id', data.notification_id);
								this.notificationDataS.receivedNotification(data.notification_id).subscribe(res => { });
							}
						}

						if (data.tap) {
							if (this.route != '') {
								//console.log(data.route);
								var routeTemp = this.route;
								this.route = '';

								this.router.navigate([routeTemp]);
								this.firebaseX.clearAllNotifications().then(null);
								this.firebaseX.setBadgeNumber(0).then(null);
							} else {
								//this.router.navigate([data.route]);
							}
						}
					}
				}
			},
				(err) => {
					console.log(`Error registering onNotification callback: ${err}`);
				},
				() => {
					console.log(`onNotification callback complete`);
				});
	}

	registerToken(token: string) {
		try {
			this.subscribeTopics();
			this.optionsS.userFirebaseToken = token;
		} catch (error) {
			console.log('Error save token Firebase')
		}
	}

	initializeData() {
		this.authS.authState.subscribe((data) => {
			if(data != null) {
				this.appUserIsAuthenticated = data;
			} else {
				this.appUserIsAuthenticated = false;
			}

			if(!this.appUserIsAuthenticated) {
				this.avatarImage = '/assets/img/ava-empty.png';
			}
		});

		this.userDataS.userData.subscribe((data) => {
			this.appUserData = data;

			if (this.appUserData && this.appUserData.info) {
				if (this.appUserData.info.avatar_image && this.appUserData.info.avatar_image != '') {
					this.avatarImage = this.appUserData.info.avatar_image;
				} else {
					this.avatarImage = '/assets/img/ava-empty.png';
				}
			}
		});

		this.notificationDataS.notificationsNewState.subscribe((data) => {
			this.notificationsNew = data;
		});

		this.optionsS.optionslocationSelectState.subscribe((data) => {
			this.appLocationSelect = data;
		});

		console.log('initializeData');
	}

	backButtonEnable() {
		this.platform.backButton.subscribe(async () => {
			this.menuCtrl.isOpen().then(isOpen => {
				if(isOpen) {
					this.menuCtrl.close().then();
				} else {
					this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
						if (
							this.router.url === "/home" ||

							this.router.url === "/" ||
							this.router.url === ""
						) {
							if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
								navigator['app'].exitApp();
							} else {
								this.presentToast();
								this.lastTimeBackPress = new Date().getTime();
							}
						} else if (
							this.router.url === "/requests/all" ||
							this.router.url === "/requests/my" ||
							this.router.url === "/messages/all" ||
							this.router.url === "/notifications/all"
						) {
							if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
								this.navCtrl.navigateRoot('home');
							} else {
								this.lastTimeBackPress = new Date().getTime();
							}
						} else {
							//this.navCtrl.back();
						}
					});
				}
			});

		});
	}

	async presentToast() {
		const toast = await this.toastController.create({
			message: 'Нажмите еще раз чтоб выйти',
			duration: 2000,
			color: 'primary',
			cssClass: 'toast-back-button',
		});
		toast.present();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			//this.statusBar.styleDefault();
			this.statusBar.styleLightContent();
			this.statusBar.show();
			this.statusBar.backgroundColorByHexString('#10dc60');

			this.initializeData();
			this.backButtonEnable();

			this.splashScreen.hide();

			try {
				if (this.platform.is('cordova')) {
					this.initPushNotification();

					this.appVersion.getVersionNumber().then(value => {
						this.appV = value;
						this.optionsS.appVersion = value;
					}).catch(err => {
						console.log(err);
					});
				}

				this.firebaseX.setAnalyticsCollectionEnabled(false);
			} catch (err) {
				this.optionsS.sendError('initializeApp', err);
			}
		});
	}
}
