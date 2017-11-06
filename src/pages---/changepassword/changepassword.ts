import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { LoadingController, ToastController } from 'ionic-angular';
import { IonicPage, NavController, Nav, NavParams } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { Appsetting } from '../../providers/appsetting';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
	selector: 'page-changepassword',
	templateUrl: 'changepassword.html'
})
export class ChangepasswordPage {
	public data = '';
	/*********** variables for music player */
	index;
	bit: boolean = true;
	playing: boolean = true;
	currentTrack: any;
	title: any;
	audioIndex;
	setvarNow: any;
	tracknow: boolean = true;
	audurl; audio; playsong: any = 0;
	constructor(public navCtrl: NavController,
		public media: Media,
		public nav: Nav,
		public toastCtrl: ToastController,
		public appsetting: Appsetting,
		public loadingCtrl: LoadingController,
		public http: Http,
		public navParams: NavParams) {
		if (localStorage.getItem('currenttrack')) {
			this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
			console.log(this.currentTrack);
		}
		this.setvarNow = "playTrack";
	}

	public Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
		dismissOnPageChange: true
	});

	changePwd(userEmail) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		let options = new RequestOptions({ headers: headers });
		var User: any = JSON.parse(localStorage.getItem("USER_DATA"));
		var email = User.data.User.email;
		console.log(email)
		console.log(userEmail)

		if (userEmail.value.newpassword == userEmail.value.conpassword) {
			var postdata = {
				email: email,
				old_password: userEmail.value.password,
				new_password: userEmail.value.newpassword
			};
			var serialized = this.serializeObj(postdata);
			console.log(postdata);
			this.Loader.present();

			this.http.post(this.appsetting.myGlobalVar + 'users/changepassword', serialized, options).map(res => res.json())
				.subscribe(data => {
					this.Loader.dismiss();
					console.log(" response" + JSON.stringify(data));
					this.data = data;
					console.log(this.data);
					if (data.isSucess == "true") {
						localStorage.clear();
						this.nav.setRoot(SigninPage);
						this.nav.popToRoot();
					} else {
						alert(data.msg);
						this.showToast(data.msg);
					}

				}, err => {

					console.log("Error");

					this.Loader.dismiss();
					console.log("Error!:");
				});

		} else {
			this.showToast('Passwords do not match');
		}

	}
/************ function for play audio ********/
playTrack(track) {
	this.bit = true;
	//var aa = this;
	if(this.appsetting.audio != undefined)
	  {
		this.currentTrack = track;
		this.appsetting.audio.play();
	  }else{
		track.loaded = true;
		track.playing = true;
		this.currentTrack = track;
		const file: MediaObject = this.media.create(this.currentTrack.music);
		localStorage.setItem('currenttrack',JSON.stringify(this.currentTrack));
		this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
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

	showToast(msg) {
		var toast = this.toastCtrl.create({
			message: msg,
			duration: 2000,
			cssClass: 'toastCss',
			position: 'middle',
		});
		toast.present();
	}
	serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}


}
