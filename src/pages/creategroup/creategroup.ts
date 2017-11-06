import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController, LoadingController, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { Appsetting } from '../../providers/appsetting';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-creategroup',
  templateUrl: 'creategroup.html'
})
export class CreategroupPage {
  user_data: any;
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
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public media: Media,
  ) {
    if(localStorage.getItem('currenttrack')){
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
      }
      this.setvarNow="playTrack";
    if (localStorage.getItem("USER_DATA")) {
      this.user_data = JSON.parse(localStorage.getItem("USER_DATA")).data;
      console.log(this.user_data.User.first_name);
    }

  }

  selecteduser: any = [];

  userimage: any = []; status; slug; data; share_id; accepteduser; time; groupname; image; baseImage; userchat;

  public SearchPage(ddd, text) {
    console.log(ddd);
    console.log(ddd.length);
    if (ddd.length >= 3) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      let options = new RequestOptions({ headers: headers });
      var user_id = localStorage.getItem("USERID")
      var postdata = {
        slug: ddd,
        id: user_id
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/searchuserfriends', serialized, options).map(res => res.json()).subscribe(data => {

        console.log(data)
        this.userimage = data.data;
        console.log(this.userimage)

      }, err => {

      })

    } else if (ddd.length == 0) {
      this.userimage = null;
    }
  }

  public showuserlist() {
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
      spinner: 'bubbles',
    });
    Loading.present();
    this.http.post(this.appsetting.myGlobalVar + 'users/user', serialized, options).map(res => res.json()).subscribe(data => {
      Loading.dismiss();
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
        Loading.present();
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/userslist', serialized, options).map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log(data)
          this.userimage = data.data;
          console.log(this.userimage);


        })

      } else {

        var postdata = {
          userid: user_id
        };
        console.log(postdata);
        var serialized = this.serializeObj(postdata);

        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/userslist', serialized, options).map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log(data)
          this.userimage = data.data;
          console.log(this.userimage)
        })

      }


    })

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose group photo',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.getimage(1);
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            console.log('Archive clicked');
            this.getimage(0);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


  public getimage(type) {
    const options: CameraOptions = {
      quality: 10,
      sourceType: type,
      targetWidth: 800,
      allowEdit: true,
      targetHeight: 800,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageUri) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageUri;
      this.image = base64Image;
      this.baseImage = imageUri;
      // alert(this.baseImage);
      // alert('image');
      // alert(this.image);
    }, (err) => {

      // alert(err);
    });
  }


  addgroupmember(user) {
    this.data = null;
    this.userimage = null;
    console.log("array is .. " + this.selecteduser);
    console.log("user id is .. " + user.id);
    if (user.id != localStorage.getItem("USERID")) {
      if (this.selecteduser.length == 0) {
        this.selecteduser.push(user);
      } else {
        var isAdded = false;
        for (var i = 0; i < this.selecteduser.length; i++) {
          console.log("user id in array is .. " + this.selecteduser[i]['id']);
          if (this.selecteduser[i]['id'] == user.id) {
            isAdded = true;
          } else {
            isAdded = false;
          }
        }

        if (isAdded) {
         
          let alert = this.alertCtrl.create({
            subTitle: 'Member already added',
            buttons: ['Dismiss']
          });
          alert.present();
        } else {
         
          this.selecteduser.push(user);
        }

      }
    } else {
      
      let toast = this.toastCtrl.create({
        message: "Oops! it's you",
        duration: 3000
      });
      toast.present();
    }

    console.log(this.selecteduser);
  }


  removemember(index) {
    console.log(index);
    // var isAdded=false;
    for (var i = 0; i < this.selecteduser.length; i++) {
      console.log("user id in array is .. " + this.selecteduser[i]['id']);
      if (this.selecteduser[i]['id'] == index) {
        this.selecteduser.pop(this.selecteduser[i]);

        // isAdded=true;
      } else {
        // isAdded=false;
      }
    }
    console.log(this.selecteduser);

  }

  groupnm(tttt) {
    console.log(tttt);
    this.groupname = tttt;
  }

  addgroup() {
    let Loading = this.loadingCtrl.create({ content: 'Please wait...' });
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var bit;
    if (localStorage.getItem("USERID")) {
      for (var i = 0; i < this.selecteduser.length; i++) {
        var ids = '';
        var firstname = '';
        for (var i = 0; i < this.selecteduser.length; i++) {
          if (ids == '' && firstname == '') {
            bit = 0
            ids = this.selecteduser[i].id;
            firstname = this.selecteduser[i].first_name;
          }
          else {
            bit = 1
            ids = ids + ',' + this.selecteduser[i].id;
            firstname = firstname + ', ' + this.selecteduser[i].first_name;
          }
        }

      }
      console.log(ids.length);
      console.log(firstname);
      var user_id = localStorage.getItem("USERID");

      var postdata = {
        userid: user_id,
        name: this.groupname,
        groupid: ids,
        username: this.user_data.User.first_name + ', ' + firstname,
        image: this.baseImage,
        bit: bit
      }

      console.log(postdata);
      // alert(JSON.stringify(postdata));
      Loading.present().then(() => {
        var serialized = this.serializeObj(postdata);
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/creategroup', serialized, options).map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log(data.data);
          if (data.status == 0) {
            this.navCtrl.push(FittingroomPage,{support:'true'});
          }

          console.log(data);

        }, error => {
          // alert('error');
          Loading.dismiss();
          // alert(error);
        })
      })

    }

  }



  /**********function for group chat friendid=groupid and id=logged userid */
  public onetoone(message, groupid) {
    // alert(message)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/onetoonechat'; 
    var postdata = {
      friendid: groupid,
      message: message,
      status: 1,
      userid: user_id,
      productid: ""
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);


    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/onetoonechat', serialized, options).map(res => res.json()).subscribe(data => {

      console.log(data)
      this.chatshow(groupid);
      this.data = '';



    })
  }



  public chatshow(groupid) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/chatlist'; 
    var ddata = {
      friendid: groupid,
      userid: user_id
    };
    console.log(ddata);
    var serialized = this.serializeObj(ddata);

    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/chatlist', serialized, options).map(res => res.json()).subscribe(data => {

      console.log(data)
      if (data.data != null) {
        for (var i = 0; i < data.data.length; i++) {
          var date = data.data[i].Chat.created;
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
          data.data[i].Chat.time = this.time;

        }
      }
      this.userchat = data.data;
    })
  }
  /********************************************************* */

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




  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }
}
