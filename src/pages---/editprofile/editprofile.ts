import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
import { CardPage } from '../card/card';
import { AddressPage } from '../address/address';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})
export class EditprofilePage {
  id; country; data; imageTosend; myState_in; srcImage; profile;
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
  public data1 = {
    fname: "",
    lname: "",
    email: "",
    number: "",
    gender: "",
    myDate: "",
    shop: "",

  };

  public Loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    private camera: Camera,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public media: Media, ) {
    this.getdata()
    if (localStorage.getItem('currenttrack')) {
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
    }
    this.setvarNow = "playTrack";
    var user_data = JSON.parse(localStorage.getItem("USER_DATA"))
    console.log(user_data.data.User.username)
    this.id = user_data.data.User.id
    console.log(user_data.data.User.id)
    this.countrylist()
    // alert('updated')
  }


  getdata() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    var postdata = {
      id: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    if (localStorage.getItem('userfbdata') != null || localStorage.getItem('userfbdata') != undefined) {
      var usedata = JSON.parse(localStorage.getItem('userfbdata'));
      console.log(usedata.state_in);
      this.data1 = {
        fname: usedata.first_name,
        lname: usedata.last_name,
        email: usedata.email,
        number: "",
        gender: usedata.gender,
        shop: 'US',//usedata.state_in,
        myDate: usedata.dob,
      }
      console.log('COUNTRY CODE->', localStorage.getItem('country'))
      if (localStorage.getItem('country')) {
        this.data1.shop = localStorage.getItem('country');
      } else {
        this.data1.shop = 'US';
      }

      console.log('SELECTED CN', this.data1.shop);
    } else {
      this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
        this.Loading.dismiss();
        console.log(data);
        if (data.data) {
          this.profile = data.data[0].User
          this.srcImage = this.profile.image
          this.data1 = {
            fname: this.profile.first_name,
            lname: this.profile.last_name,
            email: this.profile.email,
            number: this.profile.phone,
            gender: this.profile.gender,
            myDate: this.profile.dob,
            shop: this.profile.state_in,
          }
        }

        console.log(data)
        console.log('COUNTRY CODE->', localStorage.getItem('country'))
        if (localStorage.getItem('country')) {
          this.data1.shop = localStorage.getItem('country');
        } else {
          this.data1.shop = 'US';
        }
        console.log('SELECTED CN', this.data1.shop)
      })
    }
  }





  public editprofile(edit) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.imageTosend = '';
    if (edit.value.lname == null) {
      edit.value.lname = "";
    }

    var data1 = {
      first_name: edit.value.fname,
      last_name: edit.value.lname,
      email: edit.value.email,
      phone: edit.value.number,
      dob: edit.value.myDate,
      address: edit.value.email,
      cards: "",
      state_in: edit.value.shop,
      gender: edit.value.gender,
      id: this.id,
    };
    console.log(data1)
    var serialized = this.serializeObj(data1);

    this.http.post(this.appsetting.myGlobalVar + 'users/editprofile', serialized, options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data)
        if (data.isSucess == "true") {
          let toast = this.toastCtrl.create({
            message: "Profile is updated",
            duration: 2000,
            cssClass: 'toastCss',
            position: 'middle',

          });
          toast.present();
          //alert("Profile is updated")
          this.navCtrl.push(ProfilePage);
        } else {

        }


      })
  }


  public countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });

    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data)
        this.country = data;
        console.log(this.country)


      })
  }

  card() {
    this.navCtrl.push(CardPage);
  }
  address() {
    this.navCtrl.push(AddressPage);
  }

  /************ function for play audio ********/
  playTrack(track) {
    this.bit = true;
    //var aa = this;
    if (this.appsetting.audio != undefined) {
      this.currentTrack = track;
      this.appsetting.audio.play();
    } else {
      track.loaded = true;
      track.playing = true;
      this.currentTrack = track;
      const file: MediaObject = this.media.create(this.currentTrack.music);
      localStorage.setItem('currenttrack', JSON.stringify(this.currentTrack));
      this.appsetting.audio = file;
      this.appsetting.audio.play();
    }

    this.appsetting.audio.onSuccess.subscribe(() => {
      if (this.tracknow == true) {
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
    this.appsetting.audio = undefined;
    this.playTrack(this.appsetting.tracks[index]);
  }

  nextTrack() {
    this.setvarNow = "nextTrack";
    let index = this.appsetting.tracks.indexOf(this.currentTrack);
    index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
    this.appsetting.audio = undefined;
    this.playTrack(this.appsetting.tracks[index]);
  }

  prevTrack() {
    this.setvarNow = "prevTrack";
    let index = this.appsetting.tracks.indexOf(this.currentTrack);
    index > 0 ? index-- : index = this.appsetting.tracks.length - 1;
    this.appsetting.audio = undefined;
    this.playTrack(this.appsetting.tracks[index]);
  }


  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }


}
