import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ToastNotificationsService {

	toast: any;

	constructor(
		public toastController: ToastController
	) { }

	async present(message: string, messageType: string) {
		if (this.toast) {
			this.toast.dismiss();
		}

		this.toast = await this.toastController.create({
			message: message,
			duration: 10000,
			position: 'top',
			color: messageType,
			cssClass: 'toast-notifications',
			buttons: [
				{
					text: 'закрыть',
					role: 'cancel',
					handler: () => {
						//this.toast = null;
					}
				}
			]
		});

		this.toast.present();
	}

	async dismiss() {
		if (this.toast) {
			await this.toast.dismiss();
		}
	}
}
