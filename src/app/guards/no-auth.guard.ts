import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
	constructor(
		private router: Router,
		public authS: AuthService
	) { }

	canActivate(next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

		return new Promise((resolve, reject) => {
			this.authS.checkAccessToken().then(object => {
				if (object) {
					this.router.navigate(['/']);
					resolve(false);
				} else {
					resolve(true);
				}
			})
		});
	}
}
