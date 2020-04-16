import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RequestDataService} from "../../../services/request-data/request-data.service";
import {OptionsService} from "../../../services/options/options.service";

@Component({
	selector: 'app-complet',
	templateUrl: './complet.page.html',
	styleUrls: ['./complet.page.scss'],
})
export class CompletPage implements OnInit {

	ratingText: string = 'Поставьте оценку';
	ratingFeedback: number = 0;
	messageFeedback: string = '';
	requestId: string = '';
	isLoad: boolean = true;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private optionsS: OptionsService,
		private requestDataS: RequestDataService,
	) { }

	ngOnInit() {
	}

	public ionViewWillEnter() {
		this.requestId = this.activatedRoute.snapshot.paramMap.get('id');
	}

	rate(index: number) {
		if (index == 1 && this.ratingFeedback == 1) {
			this.ratingFeedback = 0;
			this.ratingText = 'Поставьте оценку';
		} else {
			this.ratingFeedback = index;
		}
	}

	isAboveRating(index: number): boolean {
		return index > this.ratingFeedback;
	}

	getColor(index: number) {
		if (this.isAboveRating(index)) {
			return COLORS.GREY;
		}

		switch (this.ratingFeedback) {
			case 1:
				this.ratingText = 'Хуже некуда';
				return COLORS.RED;
			case 2:
				this.ratingText = 'Плохо';
				return COLORS.RED;
			case 3:
				this.ratingText = 'Нормально';
				return COLORS.YELLOW;
			case 4:
				this.ratingText = 'Хорошо';
				return COLORS.GREEN;
			case 5:
				this.ratingText = 'Отлично';
				return COLORS.GREEN;
			default:
				this.ratingText = 'Поставьте оценку';
				return COLORS.GREY;
		}
	}

	ionInputFeedback(event) {
		let textarea: any = event.target;
		textarea.style.overflow = 'hidden';
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';

		this.messageFeedback = textarea.value;

		return;
	}

	sendFeedback() {
		this.optionsS.notUpdatePage = false;
		if(this.messageFeedback.trim() != '' || this.ratingFeedback > 0) {
			this.isLoad = true;
			var feedback = {
				'message': this.messageFeedback,
				'rating': this.ratingFeedback
			};

			this.requestDataS.sendFeedbackRequest(feedback, this.requestId).subscribe(res => {
				if (res && res.id) {
					this.router.navigate(['requests/my'], { replaceUrl: true });

					this.isLoad = false;
				}
			}, err => {
				console.log(err);
				//this.loadingS.dismiss();

				this.isLoad = false;
			});
		} else {
			this.router.navigate(['requests/my'], { replaceUrl: true });
		}
	}
}

enum COLORS {
	GREY = '#E0E0E0',
	GREEN = '#10dc60',
	YELLOW = '#ffce00',
	RED = '#f04141',
}
