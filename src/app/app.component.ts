import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { SportyfyPage } from '../pages/sportyfy/sportyfy';
import { HomePage } from '../pages/home/home';
import { ForgetpaswordPage } from '../pages/forgetpasword/forgetpasword';
import { EditroomPage } from '../pages/editroom/editroom';
import { SearchPage } from '../pages/search/search';
import { Camera } from '@ionic-native/camera';
import { ChatPage } from '../pages/chat/chat';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TutorialchatPage } from '../pages/tutorialchat/tutorialchat';
import { EditaddressPage } from '../pages/editaddress/editaddress';
import { Firebase } from '@ionic-native/firebase';
import { GroupchatPage } from '../pages/groupchat/groupchat';
import { PrivacypolicyPage } from '../pages/privacypolicy/privacypolicy';
import { TermsPage } from '../pages/terms/terms';
import { ReturnsPage } from '../pages/returns/returns';
import { GenderPage } from '../pages/gender/gender';
import { NativeAudio } from '@ionic-native/native-audio';


export class NotificationModel {
	public body: string;
	public title: string;
	public tap: boolean
}

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	public user = '';
	@ViewChild(Nav) nav: Nav;
	rootPage: any = SignupPage;
	pages: Array<{ title: string, component: any }>;
	pages2: any;

	constructor(public platform: Platform,
		statusBar: StatusBar,
		splashScreen: SplashScreen,
		public firebase: Firebase,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController, ) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();
			this.firebase.grantPermission();   // for push notifications
			if (this.platform.is('cordova')) {
				// Initialize push notification feature
				//alert("hiiii"+this.platform)
				if (this.platform.is('android')) {
					//alert("android"+this.platform)
					this.initializeFireBaseAndroid()
				} else {
					//	alert("ios"+this.platform)
					this.initializeFireBaseIos();
				}
				//this.platform.is('android') ? this.initializeFireBaseAndroid() : this.initializeFireBaseIos();
			} else {
				//	alert(this.platform)
				console.log('Push notifications are not enabled since this is not a real device');
			}
			this.rootPage = localStorage.getItem("USERID") != null ? TabsPage : SignupPage;
		});
	}

	private initializeFireBaseAndroid(): Promise<any> {
		return this.firebase.getToken()
			.catch(error => console.error('Error getting token', error))
			.then(token => {

				console.log(`The token is ${token}`);

				Promise.all([
					this.firebase.subscribe('firebase-app'), 	// Subscribe to the entire app
					this.firebase.subscribe('android'),			// Subscribe to android users topic
					this.firebase.subscribe('userid-1') 		// Subscribe using the user id (hardcoded in this example)
				]).then((result) => {
					if (result[0]) console.log(`Subscribed to FirebaseDemo`);
					if (result[1]) console.log(`Subscribed to Android`);
					if (result[2]) console.log(`Subscribed as User`);

					this.subscribeToPushNotificationEvents();
				});
			});
	}


	private initializeFireBaseIos(): Promise<any> {
		return this.firebase.grantPermission()
			.catch(error => console.error('Error getting permission', error))
			.then(() => {
				this.firebase.getToken()
					.catch(error => console.error('Error getting token', error))
					.then(token => {

						console.log(`The token is ${token}`);

						Promise.all([
							this.firebase.subscribe('firebase-app'),
							this.firebase.subscribe('ios'),
							this.firebase.subscribe('userid-2')
						]).then((result) => {

							if (result[0]) console.log(`Subscribed to FirebaseDemo`);
							if (result[1]) console.log(`Subscribed to iOS`);
							if (result[2]) console.log(`Subscribed as User`);

							this.subscribeToPushNotificationEvents();
						});
					});
			})

	}
	private saveToken(token: any): Promise<any> {
		console.log('Sending token to the server...');
		return Promise.resolve(true);
	}


	private subscribeToPushNotificationEvents(): void {

		//	alert("hello everyone");
		// Handle token refresh
		this.firebase.onTokenRefresh().subscribe(
			token => {
				console.log(`The new token is ${token}`);
				this.saveToken(token);
			},
			error => {
				console.error('Error refreshing token', error);
			});

		// Handle incoming notifications
		this.firebase.onNotificationOpen().subscribe(
			(notification: NotificationModel) => {
			//	alert('alert - > ' + JSON.stringify(notification))
				 if(notification.tap){
					// alert('Tapped');
					console.log("Received in background");
				} else {
					// alert('Not Tapped');
					console.log("Received in foreground");
				};
				// !notification.tap
				// 	? console.log('The user was using the app when the notification arrived...')
				// 	: console.log('The app was closed when the notification arrived...')

				let toast = this.toastCtrl.create({
					message: '' + notification.title + ': '+notification.body,
					duration: 3000,
					position:"top",
					cssClass: "notification",
				});
				// let notificationAlert = this.alertCtrl.create({
				// 	title: '<center>' + notification.title + '</center>',
				// 	message: notification.body,
				// 	buttons: [{
				// 		text: 'Ignore',
				// 		role: 'cancel'
				// 	}, {
				// 		text: 'View',
				// 		handler: () => {
				// 			//TODO: Your logic here
				// 			this.user = localStorage.getItem('USERID');
				// 			//alert('user' + this.user)
				// 			if (this.user == undefined || this.user == null) {
				// 				this.nav.push(SigninPage);
				// 			} else {
				// 				this.nav.push(TabsPage, { message: notification }); //this.nav.setRoot(this.pages2.SchedulePage);
				// 			}

				// 		}
				// 	}]
				// });

				if (notification.title != undefined) {
					toast.present();
				}
			},
			error => {
				console.error('Error getting the notification', error);
			});
	}
}
