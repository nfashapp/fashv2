import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {
content;
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
  public http:Http,
  public appsetting:Appsetting,
  public loadingCtrl:LoadingController,
  public media: Media,

  ) {
    this.setvarNow = "playTrack";
    if (localStorage.getItem('currenttrack')) {
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
    }
this.termscontent();
    
  }

  termscontent(){
        let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
     var Loading = this.loadingCtrl.create({
            spinner: 'bubbles',
          });
          Loading.present().then(() => {
    this.http.get(this.appsetting.myGlobalVar + 'Staticpages/pageslist', options).map(res => res.json()).subscribe(data => {
      console.log(data)
       Loading.dismiss();
      if(data.data){
 for(var i=0;i<data.data.length;i++){
    if(data.data[i].Staticpage.position == "terms"){
      this.content = data.data[i].Staticpage;
    }
  }
      }
 console.log(this.content);
    })
  })
  }
  playTrack(track) {
    console.log(track);
    this.bit = true;
    if (this.appsetting.audio != undefined) {
      this.currentTrack = track;
      this.appsetting.audio.play();
    } else {
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
        localStorage.setItem('currenttrack', this.currentTrack);
        this.nexttTrack();
      }
    }, err => {
    })

  }

  nexttTrack() {
    let index = this.appsetting.tracks.indexOf(this.currentTrack);
    index >= this.appsetting.tracks.length - 1 ? index = 0 : index++;
    this.appsetting.audio = undefined;
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
