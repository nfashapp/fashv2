import { Component, ViewChild, ContentChild,NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, Content } from 'ionic-angular';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import { Appsetting } from '../../providers/appsetting';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { ProductdetailsPage } from '../productdetails/productdetails';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Media, MediaObject } from '@ionic-native/media';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  data:any;
  newindex: number;
  lasindex: any;
  isDisabled = false; scrollcard;
   public scrollAmount = 44;
   length;
  @ViewChild(Content) content: Content;
  public Loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  chat_id; editedmsg; editedmsgid; username; typingdata; chatname;scrollbottom;
  moment: any;

   userchat; listImages; time; loggeduser: any;

    /*********** variables for music player */
    index;
    bit: boolean = true;
    playing: boolean = true;
    currentTrack: any;
    title: any;
    audioIndex;
    setvarNow: any;
    tracknow: boolean = true;
    audurl; audio;playsong:any = 0;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public zone: NgZone,
    public media: Media,
    public inappBrowser: InAppBrowser
  ) {
    
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
      this.setvarNow="playTrack";
     this.ionViewDidEnter();
      
    if(this.navParams.get('chat_id')){
    this.chat_id = this.navParams.get('chat_id');
    }

    this.chatname = this.navParams.get('name');
    console.log(this.chatname);
    this.showproductlist();
    this.chatshow();
    /********** Code to refresh page after 1 second **************/
this.appsetting.interval = setInterval(() => {
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

   this.http.post(this.appsetting.myGlobalVar + 'lookbooks/chatlist', serialized, options).map(res => res.json()).subscribe(data => {
     this.Loading.dismiss();
     console.log(data.data);
     if (data.data != null) {
       this.newindex = parseInt(data.data[data.data.length-1].Chat.id);
       console.log('last index : '+this.lasindex);
       if(this.newindex == this.lasindex){
        this.content.scrollToBottom(300);
        this.lasindex = null;
        //this.lasindex = parseInt(data.data[data.data.length-1].Chat.id);
      // alert('last index : '+this.lasindex);
       }
       for (var i = 0; i < data.data.length; i++) {
         var date = data.data[i].Chat.created;
         var d = moment(date).format('h:mm a');
         this.time = d;
         data.data[i].Chat.time = this.time;
         console.log(data.data[i][0].username);
         this.username = data.data[i][0].username;
       }
     }
     this.userchat = data.data;
   })
  }, 2000);
    /***** end **********/
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

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/chatlist', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data.data);
      if (data.data != null) {
        this.lasindex = parseInt(data.data[data.data.length-1].Chat.id)
        
        for (var i = 0; i < data.data.length; i++) {
          var date = data.data[i].Chat.created;
          var d = moment(date).format('h:mm a');
          this.time = d;
         
          data.data[i].Chat.time = this.time;
          console.log(data.data[i][0].username);
          this.username = data.data[i][0].username;
        }
      }
      //this.ionViewDidLoad();
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
      single:1,
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
    console.log('show product');
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

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/chatliststatus', serialized, options).map(res => res.json()).subscribe(data => {
      this.Loading.dismiss();
      console.log(data)
      var share_id: null;
      if(data.data){
      for(var i=0;i<data.data.length;i++){
        console.log(data.data[i].Chat.productlike);
        if(data.data[i].Chat.productlike != null){
          this.isDisabled = true;
        }else{
          this.isDisabled = false;
        }
      }
      this.listImages = data.data.reverse();
      if(this.listImages.length > 0){
        this.scrollcard = 'scrollcard';
      }else{
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
              //this.data = this.editedmsg;
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
    var user_id = localStorage.getItem("USERID");
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
        userid:user_id,
        id: proid,
        like: status
      };
      var serialized = this.serializeObj(postdata);
    } else {
      var postdata1 = {
        userid:user_id,
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
      }else{
         let toast = this.toastCtrl.create({
          message: data.msg,
          duration: 3000
        });
        toast.present();
      }

    })
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
 scrollHandler(event) {
   console.log(`ScrollEvent: ${event}`);
  //  var eve = event;
  //  console.log(eve);
   this.zone.run(()=>{
     console.log('hello')
     if(event == null){
      clearInterval(this.scrollbottom);
     }else{
      this.scrollAmount++;
     }
    
   })
 }


 playTrack(track) {
  console.log(track);
  this.bit = true;
  if(this.appsetting.audio != undefined)
    {
      this.currentTrack = track;
      this.appsetting.audio.play();
    }else{
      track.playing = true;
      track.loaded = true;
      this.currentTrack = track;
      console.log(track);
      console.log("vikrantrack");
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

nexttTrack() {
  let index = this.appsetting.tracks.indexOf(this.currentTrack);
  index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
  this.appsetting.audio=undefined;
  this.playTrack(this.appsetting.tracks[index]);
}

pauseTrack(track) {
  track.loaded = false;
  track.playing = false;
  this.appsetting.audio.pause();
  this.currentTrack = track;
}

pausetyTrack(track) {
  this.bit = false;
  track.loaded = false;
  track.playing = false;
  this.appsetting.audio.pause();
  this.currentTrack = track;
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


ionViewDidEnter(){
  var aa = this;
   this.scrollbottom = setTimeout(function() {
    aa.content.scrollToBottom(300);
   }, 3000);
}


}
