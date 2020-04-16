ionic serve --external
ionic cordova run -l ios
ionic cordova build ios --prod
ionic cordova build android --prod

---

Select : Project --> Plugins --> CDVInAppBrowser.m and comment out the code

//statusBarFrame.size.height = STATUSBAR_HEIGHT;

CSS - https://tailwindcss.com
