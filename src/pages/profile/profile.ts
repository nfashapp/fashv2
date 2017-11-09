import { Component } from '@angular/core';
import { NavController, App, Nav } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { SigninPage } from '../signin/signin';
import { OrderhistoryPage } from '../orderhistory/orderhistory';
import { EditprofilePage } from '../editprofile/editprofile';
import { SettingPage } from '../setting/setting';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { LoadingController, AlertController ,Platform,ToastController} from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { ChatPage } from '../chat/chat';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	public fbstats = '';
	country;
	profile;
	city; user_id;

	imageTosend;
	srcImage: string;
	public CameraPopoverOptions;
	public imgTosend; finalImg: '';
	  /********** variables for music player **********/
	  index;
	  bit: boolean = true;
	  // tracks: any = [];
	  playing: boolean = true;
	  currentTrack: any;
	  title: any;
	  audioIndex;
	  setvarNow: any;
	  tracknow: boolean = true;
	  audurl; audio;playsong:any = 0;

	constructor(public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public appsetting: Appsetting,
		public http: Http,
		public actionSheetCtrl: ActionSheetController,
		private camera: Camera,
		private socialSharing: SocialSharing,
		public app: App,
		public nav: Nav,
		private facebook: Facebook,
		 public platform: Platform,
		  public toastCtrl: ToastController,
		  public media: Media,
	) {
		platform.ready().then(() => {
        var lastTimeBackPress = 0;
        var timePeriodToExit  = 2000;
        platform.registerBackButtonAction(() => {
            // get current active page
            let view = this.navCtrl.getActive();
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                    this.platform.exitApp(); //Exit from app
                } else {
                 // alert('Press back again to exit App?');
                    let toast = this.toastCtrl.create({
                        message:  'Press back again to exit from app?',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                    lastTimeBackPress = new Date().getTime();
                }
        });
	});
	if(localStorage.getItem('currenttrack')){
		this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
		console.log(this.currentTrack);
	  }
	  this.setvarNow="playTrack";
    this.ionViewDidEnter(); 
		if (localStorage.getItem("USERID")) {
			this.user_id = localStorage.getItem("USERID");
			console.log(this.user_id)
			this.profilePage()
			this.fbstats = localStorage.getItem('fabuser');
		}

		this.country = localStorage.getItem('country')
		this.city = localStorage.getItem('city')
	}

	public Loader = this.loadingCtrl.create({
		spinner: 'bubbles'
	});



	CameraAction() {
		console.log('opening');
		let actionsheet = this.actionSheetCtrl.create({
			title: "Choose Album",
			buttons: [{
				text: 'Camera',
				handler: () => {
					this.Loader.present();
					const options: CameraOptions = {
						quality: 5,
						sourceType: 1,
						targetWidth: 800,
						allowEdit: true,
						targetHeight: 800,
						correctOrientation: true,
						destinationType: this.camera.DestinationType.DATA_URL,
						encodingType: this.camera.EncodingType.JPEG,
						mediaType: this.camera.MediaType.PICTURE
					}
					this.camera.getPicture(options).then((imageUri) => {
						this.Loader.dismiss();
						this.srcImage = 'data:image/jpeg;base64,' + imageUri;
						//this.imgTosend = imageUri;
						//	alert(imageUri);
						let headers = new Headers();
						headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
						let options = new RequestOptions({ headers: headers });
						var user_id = localStorage.getItem("USERID");
						var postdata = {
							id: user_id,
							img: imageUri
						};
						console.log(postdata);
						//alert(JSON.stringify(postdata));
						var serialized = this.serializeObj(postdata);
						var Loading = this.loadingCtrl.create({
							spinner: 'bubbles'
						});
						Loading.present().then(() => {
							this.http.post(this.appsetting.myGlobalVar + 'users/saveimage', serialized, options).map(res => res.json()).subscribe(data => {
								Loading.dismiss();
								console.log(data);
							})
						}, err => {
							Loading.dismiss();
							//	alert(JSON.stringify(err));
						})

					}, (err) => {
						this.Loader.dismiss();
						//alert(JSON.stringify(err));
						console.log(err);
					});
				}
			},
			{
				text: 'Gallery',
				handler: () => {
					console.log("Gallery Clicked");
					//alert("get Picture")
					this.Loader.present();
					const options: CameraOptions = {
						quality: 5,
						sourceType: 0,
						targetWidth: 800,
						targetHeight: 800,
						allowEdit: true,
						correctOrientation: true,
						destinationType: this.camera.DestinationType.DATA_URL,
						encodingType: this.camera.EncodingType.JPEG,
						mediaType: this.camera.MediaType.PICTURE
					}

					this.camera.getPicture(options).then((imageData) => {
						console.log(imageData);
						this.Loader.dismiss();
						//	alert(imageData);
						this.srcImage = 'data:image/jpeg;base64,' + imageData;
						//this.imgTosend = imageData;
						//this.Loader.dismiss();
						let headers = new Headers();
						headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
						let options = new RequestOptions({ headers: headers });
						var user_id = localStorage.getItem("USERID");
						var postdata = {
							id: user_id,
							img: imageData
						};
						console.log(postdata);
						//	alert(JSON.stringify(postdata));
						var serialized = this.serializeObj(postdata);
						var Loading = this.loadingCtrl.create({
							spinner: 'bubbles'
						});
						Loading.present().then(() => {
							this.http.post(this.appsetting.myGlobalVar + 'users/saveimage', serialized, options).map(res => res.json()).subscribe(data => {
								Loading.dismiss();
								console.log(data);
							})
						}, err => {
							Loading.dismiss();
							//alert(JSON.stringify(err));
						})
					}, (err) => {
						this.Loader.dismiss();
						//alert(JSON.stringify(err));
						// Handle error
					});
				}
			},
			{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
					//  actionsheet.dismiss();

				}
			}]
		});

		actionsheet.present();
	}
	profilePage() {
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var user_id = localStorage.getItem("USERID");
		var postdata = {
			id: user_id
		};
		console.log(postdata);
		var serialized = this.serializeObj(postdata);
		 var Loading = this.loadingCtrl.create({
        spinner: 'bubbles',
      });
      Loading.present().then(() => {
		this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
			Loading.dismiss();
			console.log(data);
			this.profile = data.data[0].User;
			this.srcImage = this.profile.image;
			console.log(this.profile);
			//	alert(JSON.stringify(this.profile));

		})
	  },err=>{
       console.log(err);
        Loading.dismiss();
     });
	}

	login() {
		this.nav.popToRoot();
	}
	
	socailsharing() {
		this.socialSharing.share("Are you not on Fash yet? Get it now!", null, null, "https://itunes.apple.com/us/app/apple-store/id1294432276?mt=8" + "Download android app from google play store: "+"https://play.google.com/store/apps/details?id=io.fash&hl=en")
			.then(() => {
				//alert("success");
			},
			() => {
				//	alert("failed");
			})
	}


	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}


	public logout() {
		if (localStorage.getItem('logIn_role') == 'FB') {
			this.facebookLogout();
		} else {
			localStorage.clear();
			this.app.getRootNav().setRoot(SigninPage);
		}
	}

	facebookLogout() {
		this.facebook.logout().then((sucess) => {
			localStorage.clear();
			this.app.getRootNav().setRoot(SigninPage);
		}).catch((error) => {
		})
	}
	doRefresh(refresher) {
		console.log('Begin async operation', refresher);
		delete this.profile;
		delete this.srcImage;
		this.profilePage();
		console.log('refreshed')
		setTimeout(() => {
			console.log('Async operation has ended');
			refresher.complete();
		}, 2000);
	}
	orderhistoryPage() {
		this.navCtrl.push(OrderhistoryPage);
	}
	editprofilePage() {
		this.navCtrl.push(EditprofilePage);
	}
	settingPage() {
		this.navCtrl.push(SettingPage);
	}
	changepasswordPage() {
		this.navCtrl.push(ChangepasswordPage);
	}
	chatPage() {
		this.navCtrl.push(FittingroomPage,{support:'true'});
	}
  ionViewDidEnter() {
    console.log('rahul');
    console.log(window.navigator.onLine);
    if (window.navigator.onLine == true) {
    } else {
      let toast = this.toastCtrl.create({
        message: 'Network connection failed',
        duration: 3000,
        position: 'top'
      });
      toast.present();
	}
  }

  playTrack(track) {
    console.log(track);
    this.bit = true;
    var aa = this;
    if(this.appsetting.audio != undefined)
      {
        this.currentTrack = track;
        this.appsetting.audio.play();
      }else{
        track.playing = true;
        this.currentTrack = track;
		const file: MediaObject = this.media.create(this.currentTrack.music);
		localStorage.setItem('currenttrack',JSON.stringify(this.currentTrack));
		this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
        //localStorage.setItem('currenttrack',JSON.stringify(this.currentTrack));
        this.appsetting.audio = file;
        this.appsetting.audio.play();
      }

    this.appsetting.audio.onSuccess.subscribe(() => {
    if (this.tracknow == true) {
      //localStorage.setItem('currenttrack',this.currentTrack);
        this.nexttTrack();
      }
    }, err => {
    })

  }

  pauseTrack(track) {
    track.playing = false;
    this.appsetting.audio.pause();
    this.currentTrack = track;
  }

  pausetyTrack(track) {
    this.bit = false;
    track.playing = false;
    this.appsetting.audio.pause();
    this.currentTrack = track;
  }

  nexttTrack() {
    let index = this.appsetting.tracks.indexOf(this.currentTrack);
    index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
    this.appsetting.audio=undefined;
    this.playTrack(this.appsetting.tracks[index]);
  }

  nextTrack() {
    this.setvarNow = "nextTrack";
    let index = this.appsetting.tracks.indexOf(this.currentTrack);
    index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
    this.appsetting.audio=undefined;
    this.playTrack(this.appsetting.tracks[index]);
  }

  prevTrack() {
    this.setvarNow = "prevTrack";
    let index = this.appsetting.tracks.indexOf(this.currentTrack);
    index > 0 ? index-- : index = this.appsetting.tracks.length - 1;
    this.appsetting.audio=undefined;
    this.playTrack(this.appsetting.tracks[index]);
  }



}
