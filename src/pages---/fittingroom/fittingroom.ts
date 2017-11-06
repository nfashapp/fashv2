import { Component } from '@angular/core';
import { NavController, NavParams ,ToastController,Nav,Events} from 'ionic-angular';
import { EditroomPage } from '../editroom/editroom';
import { SearchPage } from '../search/search';
import { ChatPage } from '../chat/chat';
import { TutorialchatPage } from '../tutorialchat/tutorialchat';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController ,Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { CreategroupPage } from '../creategroup/creategroup';
import { GroupchatPage } from '../groupchat/groupchat';
import { SigninPage } from '../signin/signin';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment'; // provides moment-style pipes for date formatting
import * as moment from 'moment';
import { TabsPage } from '../tabs/tabs';
import { Media, MediaObject } from '@ionic-native/media';
@Component({
  selector: 'page-fittingroom',
  templateUrl: 'fittingroom.html'
})
export class FittingroomPage {

  userimage: any = []; status; slug; data; share_id = null; datadate;
  accepteduser; time; groupdata: any = []; newusers: any = []; searchArray; username;
  errorValue = '2';
  moment: any;
  fit: any;
  sharebit = 0;
  dPipe = new DatePipe('en-US');
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

  constructor(
    public navCtrl: NavController,
    public nav: Nav,
    public navParams: NavParams,
    public http: Http,
    public events: Events,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public toastCtrl:ToastController,
    public alertCtrl:AlertController,
    public media: Media,

  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
      this.setvarNow="playTrack";
    events.subscribe('page2', (res) => {
      console.log(res);
       if(localStorage.getItem("USERID")){
         delete this.accepteduser;
         this.groupdata = [];
         this.userimage = [];
         clearInterval(this.appsetting.interval);
      this.showuserlist();
    }else{
      this.ConfirmUser();
    }
    })

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
    this.ionViewDidEnter(); 



    this.fit = JSON.parse(localStorage.getItem('fitting_status'));
     if (this.fit == 0) {
        localStorage.setItem('fitting_status', '1')
    }
    console.log('UPDATE  !! !!')
    if(this.navParams.get('sharebit')){
      this.sharebit = this.navParams.get('sharebit');
      this.showuserlist();
    }
    if(this.navParams.get('support') == 'true'){
      console.log('support');
      this.showuserlist();
    }
    this.share_id = this.navParams.get('share_id');
    console.log('fitting room, prod id', this.share_id);
  }
 ConfirmUser() {
    let alert = this.alertCtrl.create({
      title: 'FASH',
      message: 'Please login to use this feature.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
         
              this.navCtrl.push(TabsPage);
           
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.nav.setRoot(SigninPage);
            this.nav.popToRoot();
          }
        }
      ]
    });
    alert.present();
  }
  showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2500,
      cssClass: 'toastCss',
      position: 'middle',
      // closeButtonText: 'ok'
    });
    toast.present();
  }


  public showuserlist() {
     this.groupdata = [];
    this.userimage = [];
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
      console.log(data)
      if(data.data){
           this.status = data.data[0].User.fitting_status;
      console.log(this.status)
      }
   
      // alert(this.status)
      if (this.status == "1") {
        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfittingroomfriend', serialized, options).map(res => res.json()).subscribe(data => {
          //  Loading.dismiss();
          console.log(data)
          console.log('herereeee');
          if (data.data != null) {
            for (var i = 0; i < data.data.length; i++) {
              
              if (data.data[i].Accept.isgroup != 0) { ///************ code for get group data***************/
                 if(data.data[i][0].groupdate != null){
                 var date = data.data[i][0].groupdate;
              var d = moment(date).format('h:mm a');
              this.time = d;
              }else{
                this.time = null;
              }
                data.data[i].Accept.time = this.time;
                this.groupdata.push(data.data[i]);
                this.chatlist();
              } else if (data.data[i].Accept.groupid == user_id) {
               // console.log('else if');
                 data.data[i].Accept.time = this.time;
                this.userimage.push(data.data[i].Users);
                localStorage.setItem('friendlist', JSON.stringify(this.userimage));
                this.chatlist();
              } else {
               // console.log('else');
                data.data[i].Accept.time = this.time;
                this.userimage.push(data.data[i].User);
                localStorage.setItem('friendlist', JSON.stringify(this.userimage));
                this.chatlist();
              }
             // console.log('here rahul');
             // console.log(data.data[i].Accept.created);
              // this.datadate = new Date(data.data[i].Accept.created);
              // console.log(this.datadate);
            }
          }
          // console.log(this.userimage);
          // console.log(this.groupdata);

        })


      } else {
        console.log();
        // this.navCtrl.push(TutorialchatPage);
        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);

        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfittingroomfriend', serialized, options).map(res => res.json()).subscribe(data => {
           Loading.dismiss();
          console.log(data)
          if (data.data != null) {
            console.log('herereeee');
            for (var i = 0; i < data.data.length; i++) {
            
              if (data.data[i].Accept.isgroup != 0) { // code for get group data.
                  if(data.data[i][0].groupdate != null){
                 var date = data.data[i][0].groupdate;
              var d = moment(date).format('h:mm a');
              this.time = d;
              }else{
                this.time = null;
              }
                data.data[i].Accept.time = this.time;
                console.log('IM HERE IF->', data.data[i])
                this.groupdata.push(data.data[i]);
                this.chatlist();
              } else if (data.data[i].Accept.groupid == user_id) { 
                  if(data.data[i][0].date != null){
                 var date = data.data[i][0].date;
              var d = moment(date).format('h:mm a');
              this.time = d;
              }else{
                this.time = null;
              }
                data.data[i].Users.lastmessage = data.data[i][0].message;
                data.data[i].Users.time = this.time;
                console.log('IM HERE ELSE IF->', this.time)
                this.userimage.push(data.data[i].Users);
                console.log('ALL DATA 1', this.userimage)
                this.chatlist();
              } else { // code for get group data.
                  if(data.data[i][0].date != null){
                 var date = data.data[i][0].date;
              var d = moment(date).format('h:mm a');
              this.time = d;
              }else{
                this.time = null;
              }
                data.data[i].User.time = this.time;
                data.data[i].User.lastmessage = data.data[i][0].message;
                this.userimage.push(data.data[i].User);
                console.log('ALL DATA 2', this.userimage)
              }
            }
          }
          console.log(this.userimage);
        })

        this.chatlist();
      }
    })
     },err=>{
       console.log(err);
        Loading.dismiss();
     });
  }

  public accpet(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    if (localStorage.getItem("USERID")) {
      var user_id = localStorage.getItem("USERID");

      var postdata = {
        status: 0,
        groupid: user_id,
        userid: id
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      //  var Loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
      // });
      // Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/acceptdecline', serialized, options).map(res => res.json()).subscribe(data => {
        //Loading.dismiss();
        console.log(data)
        if (data.data != null) {
          this.userimage = [];
          console.log('accepted');
        } else {
          this.userimage = [];
          console.log('decline');
        }
        this.userimage = [];
        delete this.accepteduser;
        this.showuserlist();
        this.chatlist();
      })
      //  });

    }
  }

  public decline(idd) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

    var postdata = {
      status: 1,
      groupid: user_id,
      userid: idd
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    // var Loading = this.loadingCtrl.create({
    //     spinner: 'hide',
    //     content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    //   });
    //   Loading.present().then(() => {
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/acceptdecline', serialized, options).map(res => res.json()).subscribe(data => {
      // Loading.dismiss();
      console.log(data)
      this.userimage = [];
      delete this.accepteduser;
      this.showuserlist();
      this.chatlist();

    })
    //})
  }

  chatlist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    if (localStorage.getItem("USERID")) {
      var user_id = localStorage.getItem("USERID");

      var postdata = {
        userid: user_id
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      // var Loading = this.loadingCtrl.create({
      //     spinner: 'hide',
      //     content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
      //   });
      //   Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/receivedinvitationlistfittingroom', serialized, options).map(res => res.json()).subscribe(data => {
        // Loading.dismiss();
        console.log('new data ->',data)
        if (data.status == 0) {
          if (data.data != null) {
            for (var i = 0; i < data.data.length; i++) {
                  var date = data.data[i].Accept.created;
                  var d = moment(date).format('h:mm a');
                  this.time = d;
                  data.data[i].Accept.time = this.time;
            }

          }
          this.accepteduser = data.data;

        }
        //alert(data.msg)

      })
      //  })
    }
  }

  // used to filter the list
  setFilteredItems() {
    console.log(this.data);
    var keyword = this.data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');;
    console.log(keyword);
    console.log(keyword.length);

    if (keyword.length == 0) {
      console.log('plz write something');
      this.errorValue = '2';
      console.log(this.errorValue);
    } else {

      this.searchArray = this.filterItems(keyword);
      console.log('Filtering');
      this.errorValue = '0';
      console.log(this.errorValue);
    }
  }



  filterItems(searchTerm) {
    console.log('searchTerm.... ' + searchTerm);
    console.log(this.userimage);
    if (this.userimage != undefined) {
      return this.userimage.filter((userlist) => {
        if (userlist.first_name != null) {
          return userlist.first_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }

      });
    }

  }
  // end filter


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.userimage = [];
    this.groupdata = [];
    delete this.accepteduser;
    this.showuserlist();
    console.log('refreshed')
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }


  editPage() {
    this.navCtrl.push(EditroomPage);
  }

  searchPage() {
    this.navCtrl.push(SearchPage);
  }
  creategroupPage() {
    this.navCtrl.push(CreategroupPage);
  }
  groupchatPage(id) {
    var shareid = this.share_id;
    this.navCtrl.push(GroupchatPage, { chat_id: id, share_id: shareid });
  }
  chatPage(id, name) {
    this.username = name;
    var shareid = this.share_id;
    this.navCtrl.push(ChatPage, { chat_id: id, share_id: shareid, name: this.username });
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

}
