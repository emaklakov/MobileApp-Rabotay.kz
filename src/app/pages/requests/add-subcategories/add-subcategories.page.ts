import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DictionariesService } from '../../../services/dictionaries/dictionaries.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
	selector: 'app-add-subcategories',
	templateUrl: './add-subcategories.page.html',
	styleUrls: ['./add-subcategories.page.scss'],
})
export class AddSubcategoriesPage implements OnInit {

	subcategoriesTitle: string = 'Загрузка...';
	categoryId = null;
	categories: any;
	isErrorLoad: boolean = false;
	isLoad: boolean = true;

	constructor(
		private activatedRoute: ActivatedRoute,
		private dictionariesS: DictionariesService,
		private authS: AuthService,
		private router: Router,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.updateLoad();
	}

	getCategories() {
		this.isErrorLoad = false;
		this.isLoad = true;
		this.dictionariesS.getCategories(this.categoryId).subscribe(res => {
			this.subcategoriesTitle = res.title;
			if (res.categories.length > 1) {
				this.categories = res.categories;
			} else {
				for (var category of res.categories) {
					this.router.navigate(['/requests/add-info/' + category.id], { replaceUrl: true });
				}
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
		this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
		this.getCategories();
	}
}
