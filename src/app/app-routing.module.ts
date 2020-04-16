import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './guards/auth.guard';
import {NoAuthGuard} from './guards/no-auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadChildren: './pages/home/home.module#HomePageModule'
	},
	{
		path: 'user/login',
		canActivate: [NoAuthGuard],
		loadChildren: './pages/user/login/login.module#LoginPageModule'
	},
	{
		path: 'user/profile/:id',
		loadChildren: './pages/user/profile/profile.module#ProfilePageModule'
	},
	{
		path: 'user/settings',
		canActivate: [AuthGuard],
		loadChildren: './pages/user/settings/settings.module#SettingsPageModule'
	},
	{
		path: 'user/locations',
		canActivate: [AuthGuard],
		loadChildren: './pages/user/locations/locations.module#LocationsPageModule'
	},
	{
		path: 'user/categories',
		canActivate: [AuthGuard],
		loadChildren: './pages/user/categories/categories.module#CategoriesPageModule'
	},
	{
		path: 'user/balance/detail',
		canActivate: [AuthGuard],
		loadChildren: './pages/user/balance/balance.module#BalancePageModule'
	},
	{
		path: 'user/rating-reviews/:id',
		loadChildren: './pages/user/rating-reviews/rating-reviews.module#RatingReviewsPageModule'
	},
	{
		path: 'notifications/all',
		canActivate: [AuthGuard],
		loadChildren: './pages/notifications/all/all.module#AllPageModule'
	},
	{
		path: 'notifications/detail/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/notifications/detail/detail.module#DetailPageModule'
	},
	{
		path: 'locations',
		loadChildren: './pages/locations/locations.module#LocationsPageModule'
	},
	{
		path: 'requests/add',
		canActivate: [AuthGuard],
		loadChildren: './pages/requests/add/add.module#AddPageModule'
	},
	{
		path: 'requests/add-subcategories/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/requests/add-subcategories/add-subcategories.module#AddSubcategoriesPageModule'
	},
	{
		path: 'requests/add-info/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/requests/add-info/add-info.module#AddInfoPageModule'
	},
	{
		path: 'requests/all',
		loadChildren: './pages/requests/all/all.module#AllPageModule'
	},
	{
		path: 'requests/all/:id',
		loadChildren: './pages/requests/all/all.module#AllPageModule'
	},
	{
		path: 'requests/my',
		canActivate: [AuthGuard],
		loadChildren: './pages/requests/my/my.module#MyPageModule'
	},
	{
		path: 'requests/detail/:id',
		loadChildren: './pages/requests/detail/detail.module#DetailPageModule'
	},
	{
		path: 'requests/add-offer/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/offers/add-offer/add-offer.module#AddOfferPageModule'
	},
	{
		path: 'requests/offers/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/offers/detail/detail.module#DetailPageModule'
	},
	{
		path: 'requests/cancel/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/requests/cancel/cancel.module#CancelPageModule'
	},
	{
		path: 'requests/complet/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/requests/complet/complet.module#CompletPageModule'
	},
	{
		path: 'performers/all',
		loadChildren: './pages/performers/all/all.module#AllPageModule'
	},
	{
		path: 'performers/all/:id',
		loadChildren: './pages/performers/all/all.module#AllPageModule'
	},
	{
		path: 'performers/offer-request/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/performers/offer-request/offer-request.module#OfferRequestPageModule'
	},
	{
		path: 'messages/all',
		canActivate: [AuthGuard],
		loadChildren: './pages/messages/all/all.module#AllPageModule'
	},
	{
		path: 'messages/detail/:id',
		canActivate: [AuthGuard],
		loadChildren: './pages/messages/detail/detail.module#DetailPageModule'
	},
	{
		path: 'about-app',
		loadChildren: './pages/about-app/about-app.module#AboutAppPageModule'
	},
	{
		path: 'page-empty/:typepage',
		loadChildren: './pages/page-empty/page-empty.module#PageEmptyPageModule'
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
	constructor() {
		//console.log('AppRoutingModule');
	}
}
