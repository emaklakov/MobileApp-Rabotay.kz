import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot({
			//rippleEffect: true,
			animated: true,
			mode: 'md',
		}),
		HttpClientModule,
		AppRoutingModule,
		IonicStorageModule.forRoot(),
	],
	providers: [
		StatusBar,
		SplashScreen,
		FirebaseX,
		AppVersion,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		Camera,
		File,
		WebView,
		FilePath,
		SocialSharing,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
