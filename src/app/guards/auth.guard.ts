import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		public authS: AuthService
	) { }

	canActivate(next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

		return new Promise((resolve, reject) => {
			this.authS.checkAccessToken().then(object => {
				if (object) {
					resolve(true);
				} else {
					this.authS.redirectUrl = state.url;
					this.router.navigate(['user/login']);
					resolve(false);
				}
			})
		});
	}
}
