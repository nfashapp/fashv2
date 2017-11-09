import { Component, ViewChild, ContentChild } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController, ToastController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, Content } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { Appsetting } from '../../providers/appsetting';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { ProductdetailsPage } from '../productdetails/productdetails';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Media, MediaObject } from '@ionic-native/media';
import * as moment from 'moment';


@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html'
})
export class GroupchatPage {
  length: number;
  @ViewChild(Content) content: Content;

  public Loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  chat_id; editedmsg; editedmsgid; scrollcard;
  moment: any;
  data:any=''; userchat; listImages; time; loggeduser: any; groupdata; username: any;
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
    public alertCtrl: AlertController,
    public http: Http,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public media: Media,
    public inappBrowser: InAppBrowser
  ) {
    if (localStorage.getItem('currenttrack')) {
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
    }
    this.setvarNow = "playTrack";
    if (localStorage.getItem("USER_DATA")) {
      var user_data = JSON.parse(localStorage.getItem("USER_DATA")).data;
      this.username = user_data.User.first_name;
      console.log(user_data.User.first_name);
    }
    platform.ready().then(() => {
      var lastTimeBackPress = 0;
      var timePeriodToExit = 2000;

      platform.registerBackButtonAction(() => {
        // get current active page
        let view = this.navCtrl.getActive();
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          this.platform.exitApp(); //Exit from app
        } else {
          // alert('Press back again to exit App?');
          let toast = this.toastCtrl.create({
            message: 'Press back again to exit from app?',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          lastTimeBackPress = new Date().getTime();
        }
      });
    });
    this.ionViewDidEnter();
    this.appsetting.interval = setInterval(() => {
      this.content.scrollToBottom(300);
      this.chatshow();
    }, 1000);
    this.chat_id = this.navParams.get('chat_id');
    this.chatshow();
    this.Groupdata();
    this.showproductlist();

    var share_id = this.navParams.get('share_id');
    console.log(share_id)
    if (share_id) {
      console.log('Share\...........');
      this.shareImage(share_id);

    }
    this.editedmsg = null;
  }

  public back() {
    if(this.appsetting.interval){
      clearInterval(this.appsetting.interval);
      this.navCtrl.push(FittingroomPage, { share_id: null, support: 'true' });
    }else{
      this.navCtrl.push(FittingroomPage, { share_id: null, support: 'true' });
    }
    
  }

  public chatshow() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    this.loggeduser = localStorage.getItem("USERID");
    var ddata = {
      friendid: this.chat_id,
      userid: user_id
    };
    console.log(ddata);
    var serialized = this.serializeObj(ddata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/groupchatlist', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.data != null) {
        for (var i = 0; i < data.data.length; i++) {

          var date = data.data[i].Chat.created;
          var d = moment(date).format('h:mm a');
          this.time = d;

          data.data[i].Chat.time = this.time;

        }
      }

      this.userchat = data.data;

    })
  }


  public onetoone() {
    var message = document.getElementById('message').innerHTML;
    console.log(document.getElementById('message').innerHTML);
    console.log(message.length);
    this.length = message.length;
   // return false;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    if(message.length>0){
    var postdata = {
      friendid: this.chat_id,
      message: message,
      status: 1,
      single: 0,
      userid: user_id,
      productid: ""
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/onetoonechat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      this.chatshow()
      document.getElementById('message').innerHTML = '';
    })
  }else{

  }
  }


  public shareImage(share_id) {
    // alert(share_id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

    var postdata = {
      friendid: this.chat_id,
      message: '',
      status: 0,
      userid: user_id,
      productid: share_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);


    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/onetoonechat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      share_id = null;
      this.showproductlist()



    })
  }

  public showproductlist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    var user_id = localStorage.getItem("USERID")
    var postdata = {
      friendid: this.chat_id,
      userid: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/groupchatliststatus', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.data) {
        this.listImages = data.data.reverse();
        if (this.listImages.length > 0) {
          this.scrollcard = 'scrollcard';
        } else {
          this.scrollcard = '';
        }
      }



    })
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  presentActionSheet(msgid, msg, userid) {
    console.log(msgid);
    console.log(msg);
    console.log(userid);
    var user_id = localStorage.getItem("USERID")
    if (userid != user_id) {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Delete message',
            role: 'delete',
            handler: () => {
              console.log('delete clicked');
              console.log(msgid);
              console.log(msg);
              this.editedmsg = msg;
              this.editedmsgid = msgid;
              this.deleteMessage(msgid);


            }
          }
        ]
      });
      actionSheet.present();
    } else {
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Delete message',
            role: 'delete',
            handler: () => {
              console.log('delete clicked');
              console.log(msgid);
              console.log(msg);
              this.editedmsg = msg;
              this.editedmsgid = msgid;
              this.deleteMessage(msgid);


            }
          }, {
            text: 'Edit message',
            role: 'edit',
            handler: () => {

              console.log('edit clicked');
              console.log(msgid);
              console.log(msg);
              this.editedmsg = msg;
              this.editedmsgid = msgid;
              document.getElementById('message').innerHTML = this.editedmsg;

            }
          }
        ]
      });
      actionSheet.present();
    }

  }

  editedchat() {
    console.log(this.editedmsgid);
    console.log(editedmsg);
    var editedmsg = document.getElementById('message').innerHTML;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    var postdata = {
      id: this.editedmsgid,
      message: editedmsg
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/editchat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        document.getElementById('message').innerHTML = '';
        this.editedmsg = null;
        delete this.editedmsg;
        this.chatshow();
      } else {
        this.editedmsg = null;
        delete this.editedmsg;
        document.getElementById('message').innerHTML = '';
        let toast = this.toastCtrl.create({
          message: 'Error in edit message! try again',
          duration: 3000
        });
        toast.present();

      }


    })

  }

  deleteMessage(msgid) {
    console.log(this.editedmsgid);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var postdata = {
      userid: user_id,
      id: msgid
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/deletechat', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        document.getElementById('message').innerHTML = '';
        this.editedmsg = null;
        delete this.editedmsg;
        this.chatshow();
      } else {
        this.editedmsg = null;
        delete this.editedmsg;
        document.getElementById('message').innerHTML = '';
        let toast = this.toastCtrl.create({
          message: 'Error in deleting message! try again',
          duration: 3000
        });
        toast.present();

      }


    })

  }

  productPage(id) {
    this.navCtrl.push(ProductdetailsPage, { prod_id: id })
  }

  /********************************************************/
  Groupdata() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    var postdata = {
      id: this.chat_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/groupdata', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        console.log(data.data.Fitting.username);
        var g = data.data.Fitting.username.split(', ');
        console.log(g);
        var rs = g.indexOf(this.username);
        g.splice(rs, 1);
        console.log(g);
        console.log(rs);
        this.username = g.join(", ");
        console.log(this.username);
        // this.groupdata = data.data.Fitting;
      } else {


      }


    })

  }

  /***********************function for product like dislike on chat */
  public likeDislikeProduct(proid, status) {
    console.log(proid);
    // alert(message)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    if (status == 1) {
      var postdata = {
        userid: user_id,
        id: proid,
        like: status
      };
      var serialized = this.serializeObj(postdata);
    } else {
      var postdata1 = {
        userid: user_id,
        id: proid,
        dislike: status
      };
      var serialized = this.serializeObj(postdata1);
    }
    console.log(postdata);



    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/likedislikeproduct', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      if (data.status == 0) {
        this.showproductlist();
      }


    })
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
      localStorage.setItem('currenttrack',JSON.stringify(this.currentTrack));
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    this.chatshow();
    this.showproductlist();
    console.log('refreshed')
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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
/*************** In App purchase for brands *********************/
InAppPurchage(link){
  console.log('link here--->'+link);
  if(link != null && link != ""){
     var target = '_blank';
  var options = 'location=no';
  var brandsite = this.inappBrowser.create(link, target, options);
  console.log(link);
  console.log(target);
  console.log(brandsite);
  brandsite.on('loadstart').subscribe((e) => {
    console.log(e);
    let url = e.url;
    console.log(url);
  }, err => {
    console.log("InAppBrowser loadstart Event Error: " + err);
  });

  brandsite.on('exit').subscribe((e) => {
  })
}else{
  //  let toast = this.toastCtrl.create({
  //       message: 'Target url empty.',
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     toast.present();
}
}
}
