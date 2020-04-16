import { Component, OnInit } from '@angular/core';
import { DictionariesService } from '../../../services/dictionaries/dictionaries.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-add',
	templateUrl: './add.page.html',
	styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

	categories: any;
	isErrorLoad: boolean = false;
	isLoad: boolean = true;

	constructor(
		private dictionariesS: DictionariesService,
		private authS: AuthService,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.updateLoad();
	}

	getCategories() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.dictionariesS.getCategories().subscribe(res => {
			this.categories = res.categories;

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
		this.getCategories();
	}
}
