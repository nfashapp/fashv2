import { Component } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';

import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Appsetting } from '../../providers/appsetting';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { SocialSharing } from '@ionic-native/social-sharing';
//  import { TutorialchatPage } from '../tutorialchat/tutorialchat'; //
import { SigninPage } from '../signin/signin'; //
import { TabsPage } from '../tabs/tabs';
import { Media, MediaObject } from '@ionic-native/media';

import { Events } from 'ionic-angular';
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  public status; checkedid;
  user: any = ''
  data: any = '';
  data1: any = '';
  searchlist: any = null;
  hasHitbefore = 0;
  user_id; friends: any = []; time; accepteduser;
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
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public toastCtrl: ToastController,
    public events: Events,
    public nav : Nav,
    public media: Media,
  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
      this.setvarNow="playTrack";
    this.events.subscribe('page2', (res) => {
      this.hasHitbefore = 0;
      if(localStorage.getItem('USERID') == null || undefined){
          let toast = this.toastCtrl.create({
      message: "Please login to use this feature",
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
    
      } else {
          this.userslist();
          this.chatlist();
      }
    })

  }

  public getuser() {
    // alert("start")
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/userslist'; 

    var postdata = {
      id: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    });


    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();
        console.log(data)
        this.status = data.data[0].User.fitting_status;
        console.log(this.status);
        //alert(this.status)
        if (this.status == "1") {
          var postdata = {
            userid: user_id
          };
          console.log(postdata);
          // var serialized = this.serializeObj(postdata);

        } else {
          //this.navCtrl.push(TutorialchatPage);
        }

      })
    })

  }
  public showuserlist() {
    // alert("start")
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID")
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/userslist'; 

    var postdata = {
      id: user_id
    };

    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../assets/images/Loading_icon.gif">'
    });
    this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {

      console.log(data)
      this.status = data.data[0].User.fitting_status;
      console.log(this.status)
      // alert(this.status)
      if (this.status == "1") {
        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);
        // var Loading = this.loadingCtrl.create({
        //         spinner: 'hide',
        //         content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
        //       });
        //       Loading.present().then(() => {
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/userslist', serialized, options).map(res => res.json()).subscribe(data => {
          // Loading.dismiss();
          console.log(data)
          this.searchlist = data.data;
          console.log(this.searchlist);


        })
        //})

      } else {

        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);

        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/userslist', serialized, options).map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log(data)
          this.searchlist = data.data;
          console.log(this.searchlist)

        })

      }


    })

  }


  public SearchPage(ddd, text) {
    console.log(ddd);
    console.log(ddd.length);
    if (ddd.length >= 3) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      let options = new RequestOptions({ headers: headers });
      var postdata = {
        slug: ddd
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/searchuser', serialized, options).map(res => res.json()).subscribe(data => {
        console.log(data)
        this.searchlist = data.data;
        console.log(this.searchlist);
      })
    } else if (ddd.length == 0) {
      this.checkedid = null;
      this.searchlist = null;
    }

  }


  showToast() {
    let toast = this.toastCtrl.create({
      message: "Oops! It's you",
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  getID(id) {//alert('clicked');
    var userid = localStorage.getItem("USERID")
    console.log(id);
    if (id == userid) {
      this.checkedid = null;
      this.showToast();
    } else {
      this.user_id = id;
      this.checkedid = id;
    }

  }

  sendInvitation() {
    console.log(this.user_id);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    //  var Loading = this.loadingCtrl.create({
    //   spinner: 'hide',
    //  content: '<img src="../assets/images/Loading_icon.gif">'
    // });
    if (localStorage.getItem("USERID")) {
      var loggedinuser_id = localStorage.getItem("USERID");

      var postdata = {
        userid: loggedinuser_id,
        groupid: this.user_id
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      // var Loading = this.loadingCtrl.create({
      //   spinner: 'hide',
      //   content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
      // });
      // Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/addfriendfittingroom', serialized, options).map(res => res.json()).subscribe(data => {
        // Loading.dismiss();
        console.log(data)
        if (data.status == 0) {
          this.checkedid = null;
          this.navCtrl.push(FittingroomPage);
        } else if (data.status == 2) {
          let alert = this.alertCtrl.create({
            title: 'FASH Invitation',
            subTitle: data.msg,
            buttons: ['Dismiss']
          });
          alert.present();
        } else {
          let alert = this.alertCtrl.create({
            title: 'FASH Invitation',
            subTitle: data.msg,
            buttons: ['Dismiss']
          });
          alert.present();
        }

      })
      //})

    }

  }

  public userslist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

    var postdata = {
      id: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    //  var Loading = this.loadingCtrl.create({
    //     spinner: 'hide',
    //     content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    //   });
    //   Loading.present().then(() => {
    this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
      //this.Loading.dismiss();
      console.log(data)
      this.status = data.data[0].User.fitting_status;
      console.log(this.status)
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


          if (data.data != null) {
            for (var i = 0; i < data.data.length; i++) {
              var date = data.data[i].Accept.created;
              var d = new Date(date);
              var hh = d.getHours();
              var m = d.getMinutes();
              var s = d.getSeconds();
              console.log('hours:' + hh); console.log("minute:" + m); console.log('seconds:' + s);
              var dd = "AM";
              var h = hh;
              if (h >= 12) {
                h = hh - 12;
                dd = "PM";
              }
              if (h == 0) {
                h = 12;
              }
              console.log(h + ':' + m + ' ' + dd);
              this.time = h + ':' + m + ' ' + dd;
              data.data[i].Accept.time = this.time;
              console.log(data.data[i].Accept.isgroup);
              if (data.data[i].Accept.isgroup != 0) {
                console.log('if');
                // this.groupdata.push(data.data[i]);
                if (data.data[i].Accept.groupid == user_id) {

                } else {
                  this.chat();
                  this.hasHitbefore = 1;
                }

              } else if (data.data[i].Accept.groupid == user_id) {
                console.log('else if');
                this.friends.push(data.data[i].Users);
                if (this.friends.length > 1) {
                  if (this.hasHitbefore == 1) {

                  } else {
                    this.chat();
                    this.hasHitbefore = 1
                  }

                }
                //  localStorage.setItem('friendlist', JSON.stringify(this.friends));

              } else {
                console.log('else');
                this.friends.push(data.data[i].User);
                if (this.friends.length > 1) {
                  if (this.hasHitbefore == 1) {

                  } else {
                    this.chat();
                    this.hasHitbefore = 1
                  }
                }
                // localStorage.setItem('friendlist', JSON.stringify(this.friends));

              }

            }
          }
          console.log(this.friends);
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
          // Loading.dismiss();
          console.log(data)
          if (data.data) {
            for (var i = 0; i < data.data.length; i++) {
              var date = data.data[i].Accept.created;
              var d = new Date(date);
              var hh = d.getHours();
              var m = d.getMinutes();
              var s = d.getSeconds();
              console.log('hours:' + hh); console.log("minute:" + m); console.log('seconds:' + s);
              var dd = "AM";
              var h = hh;
              if (h >= 12) {
                h = hh - 12;
                dd = "PM";
              }
              if (h == 0) {
                h = 12;
              }
              console.log(h + ':' + m + ' ' + dd);
              this.time = h + ':' + m + ' ' + dd;
              data.data[i].Accept.time = this.time;
              console.log(data.data[i].Accept.isgroup);
              if (data.data[i].Accept.isgroup != 0) {
                if (data.data[i].Accept.groupid == user_id) {

                } else {

                  if (this.hasHitbefore == 1) {
                    console.log('hashitbefore :'+this.hasHitbefore);

                  } else {
                    this.chat();
                    this.hasHitbefore = 1
                  }
                }

              } else if (data.data[i].Accept.groupid == user_id) {
                console.log('else if');
                this.friends.push(data.data[i].Users);
                console.log(this.friends.length);
                if (this.friends.length > 1) {
                  if (this.hasHitbefore == 1) {

                  } else {
                    this.chat();
                    this.hasHitbefore = 1
                  }
                }
                //  localStorage.setItem('friendlist',JSON.stringify(this.friends));
              } else {
                console.log('else');
                this.friends.push(data.data[i].User);
                console.log(this.friends.length);
                if (this.friends.length > 1) {
                  if (this.hasHitbefore == 1) {

                  } else {
                    this.chat();
                    this.hasHitbefore = 1
                  }
                }
                // localStorage.setItem('friendlist',JSON.stringify(this.friends));

              }
            }
          }
          console.log(this.friends.length);

        })


      }
    })
    // });
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
      //     content: '<div class="bubbles"></div>'
      //   });
      //   Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/receivedinvitationlistfittingroom', serialized, options).map(res => res.json()).subscribe(data => {
        // Loading.dismiss();
        console.log(data)
        if (data.status == 0) {
          if (data.data != null) {
            for (var i = 0; i < data.data.length; i++) {
              var date = data.data[i].Accept.created;
              var d = new Date(date);
              var hh = d.getHours();
              var m = d.getMinutes();
              var s = d.getSeconds();
              console.log('hours:' + hh); console.log("minute:" + m); console.log('seconds:' + s);
              var dd = "AM";
              var h = hh;
              if (h >= 12) {
                h = hh - 12;
                dd = "PM";
              }
              if (h == 0) {
                h = 12;
              }
              console.log(h + ':' + m + ' ' + dd);
              this.time = h + ':' + m + ' ' + dd;
              data.data[i].Accept.time = this.time;
            }
          }
          console.log(data.data.length);
          if (data.data.length > 1) {
            if (this.hasHitbefore == 1) {

            } else {
              this.chat();
              this.hasHitbefore = 1
            }
          }
        }
      })
      // })
    }
  }

  chat() {
    this.navCtrl.push(FittingroomPage);
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
              //alert.dismiss();
              console.log('Cancel clicked');
              console.log(localStorage.getItem('USERID') );
              if(localStorage.getItem('USERID') == null){
                  this.navCtrl.push(TabsPage);
              }
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

/************ function for play audio ********/
playTrack(track) {
  this.bit = true;
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


  socialshares() {
    this.socialSharing.share('Are you not on Fash yet? Get it now!', null, null, "https://itunes.apple.com/us/app/apple-store/id1294432276?mt=8" + "Download android app from google play store: "+"https://play.google.com/store/apps/details?id=io.fash&hl=en")
      .then(() => {
      }).catch(() => {

      });
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }
}
