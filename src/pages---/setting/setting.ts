import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { TermsPage } from '../terms/terms';
import { ReturnsPage } from '../returns/returns';
import { SigninPage } from '../signin/signin';
import { Media, MediaObject } from '@ionic-native/media';
import { Appsetting } from '../../providers/appsetting';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
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
  audurl; audio; playsong: any = 0;
  constructor(public navCtrl: NavController, public app: App, public media: Media, public appsetting: Appsetting, ) {
    if (localStorage.getItem('currenttrack')) {
      this.currentTrack = JSON.parse(localStorage.getItem('currenttrack'));
      console.log(this.currentTrack);
    }
  }
  public logout() {
    //alert("Logout")
    localStorage.clear();
    //this.navCtrl.push(SigninPage);
    this.app.getRootNav().setRoot(SigninPage);


  }
  privacypolicy() {
    this.navCtrl.push(PrivacypolicyPage);
  }
  termspolicy() {
    this.navCtrl.push(TermsPage);
  }
  reteturnpolicy() {
    this.navCtrl.push(ReturnsPage);
  }

  playTrack(track) {
    console.log(track);
    this.bit = true;
    var aa = this;
    if (this.appsetting.audio != undefined) {
      this.currentTrack = track;
      this.appsetting.audio.play();
    } else {
      track.playing = true;
      this.currentTrack = track;
      const file: MediaObject = this.media.create(this.currentTrack.music);
      localStorage.setItem('currenttrack', JSON.stringify(this.currentTrack));
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

}