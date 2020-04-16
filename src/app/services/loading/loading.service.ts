import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {

	loading: any;

	constructor(
		public loadingController: LoadingController,
	) { }

	async present() {
		this.loading = await this.loadingController.create({
			message: 'Пожалуйста, подождите...',
			showBackdrop: false,
			keyboardClose: true,
		});
		await this.loading.present();

		const { role, data } = await this.loading.onDidDismiss();
	}

	async dismiss() {
		if (this.loading) {
			await this.loading.dismiss();
		}
	}
}
