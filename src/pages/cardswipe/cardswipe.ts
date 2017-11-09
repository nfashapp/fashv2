import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { LoadingController, AlertController } from 'ionic-angular';
import { TutorialPage } from '../tutorial/tutorial';
import { TabsPage } from '../tabs/tabs';
import { SigninPage } from '../signin/signin';
import { ToastController, Platform } from 'ionic-angular';
import { ProductdetailsPage } from '../productdetails/productdetails'; //
import { TutorialfavPage } from '../tutorialfav/tutorialfav';
import { TutorialfitPage } from '../tutorialfit/tutorialfit';
import { SportyfyPage } from '../sportyfy/sportyfy';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { HomePage } from '../home/home';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import 'rxjs/Rx';
import { Events } from 'ionic-angular';
import { Slides } from 'ionic-angular';

// import {
//   StackConfig,
//   Stack,
//   Card,
//   ThrowEvent,
//   DragEvent,
//   SwingStackComponent,
//   SwingCardComponent
// } from 'angular2-swing';

@Component({
  selector: 'page-cardswipe',
  templateUrl: 'cardswipe.html'
})

export class CardswipePage {
  pages: any;
  // @ViewChild('myswing1') swingStack: SwingStackComponent;
  // @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
  @ViewChild(Slides) slides: Slides; // for slide change event
  cards: Array<any>;
  lastItem; artist: any;
  recentCard: string = '';
  resLength: any;
  allcards: any = [];
  allLookbookIDs;
  lastProductofLookbook;
  selectedItem;
  nextLookbook_id;
  alreadyPushed;// check if u need this
  lengthofLoookbook; brandlink;
  res; text; brand; name;
  affiliates;
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

  checkall: any = 1;
  constructor(
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public events: Events,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public media: Media,
    public file: File,
    public platform: Platform,
    public inappBrowser: InAppBrowser
  ) {
    this.setvarNow = "playTrack";
    platform.ready().then(() => {
      var lastTimeBackPress = 0;
      var timePeriodToExit = 2000;
      platform.registerBackButtonAction(() => {
        // get current active page
        let view = this.navCtrl.getActive();
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          this.platform.exitApp(); //Exit from app
        } else {
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
    var swipe_status = JSON.parse(localStorage.getItem('swipe_status'));
    console.log('firsttime swipe', swipe_status);
    var idd: any = localStorage.getItem('lookbookid');
    var aff: any = localStorage.getItem('lookbookaffid');
    this.viewfrontPage(idd);
    this.viewlookbook();
    this.lookbooklist();
  }

  public lookbooklist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    this.http.get(this.appsetting.myGlobalVar + 'lookbooks/lookbooksid', options)
      .map(res => res.json()).subscribe(data => {
        console.log('allLookbookids', data)
        this.allLookbookIDs = data.data;
      }, err => {
      })
  }


  ondrag() {
    var length = this.slides.length();
    console.log(length);
    console.log('ONdrag currentLookbook', this.nextLookbook_id);
    if (this.nextLookbook_id == undefined) {
      var currentLookbook_id: any = localStorage.getItem('lookbookid');
    } else {
      var currentLookbook_id: any = this.nextLookbook_id;
    }
    let aa = this;
    let data = this.allLookbookIDs;

    var first = this.slides.isBeginning()
    var last = this.slides.isEnd()
    console.log('Is Last', last);
    if (last == true) {
      var pages = this.pages;
      console.log(this.checkall + 'first');
      console.log(this.pages + 'second');
      if (this.checkall < this.pages) {
        console.log('check all :'+this.checkall);
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        let options = new RequestOptions({ headers: headers });
        var idd = localStorage.getItem('lookbookid');
        var uid = localStorage.getItem('USERID');
        var Loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          showBackdrop: false,
          cssClass: 'loader'
        });

        console.log(idd);
        Loading.present().then(() => {
          console.log(this.pages);
          this.checkall++;
          var j = this.checkall;
          console.log(j);
          var uid = localStorage.getItem('USERID');
          var aff: any = localStorage.getItem('lookbookaffid');
          var postdata = {
            lookbookid: idd,
            pages: j,
            userid: uid,
            affiliates:aff
          };
          console.log(postdata);
          var serialized = this.serializeObj(postdata);
          this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productoflookbook', serialized, options)
            .map(res => res.json()).subscribe(data => {
              Loading.dismiss();
              console.log(data);
              if (data.status == 0) {
                let allcards = this.allcards;
                data.data.forEach(function (value, key) {
                    /*********************** */
          if (value.Product.image != null) {
            console.log(value.Product.image);
            var search = value.Product.image.search('http://');
            var searchhttps = value.Product.image.search('https://');
            if (search >= 0 || searchhttps >= 0) {
              //value.Lookbook.brandlink = 1;
            } else {
              value.Product.image = 'https:'+value.Product.image;
            }
          }

          /*********************** */
                  allcards.push(value);
                })
                this.allcards = allcards;
                console.log('VIEW LOOK BOOK', this.allcards);
                this.lastItem = this.allcards[this.allcards.length - 1];
                this.lengthofLoookbook = this.lastItem;
                this.lastProductofLookbook = this.lastItem.Product.id;
              } else {
                this.showToast("End of lookbook, let's shop the next one from our homepage!");
              }
            }, err => {
              Loading.dismiss();
            })
        });
      }else {
        aa.showToast("End of lookbook, let's shop the next one from our homepage!")
        // this.allLookbookIDs.forEach(function (value, $index) {
        //   console.log('index:'+$index);
        //   if (value.Lookbook.id == currentLookbook_id) {
        //     var next_lookbook_INDEX = $index + 1;
        //     console.log('currentLookbook_id', currentLookbook_id);
        //     if (data[next_lookbook_INDEX].Lookbook != undefined) {
        //       aa.checkall = 0;
        //       aa.nextLookbook_id = data[next_lookbook_INDEX].Lookbook.id;
        //       localStorage.setItem('lookbookaffid',data[next_lookbook_INDEX].Lookbook.affiliates);
              
        //     } else {
        //       aa.showToast("End of lookbook, let's shop the next one from our homepage!")
        //     }
        //   }
        // });
        // this.nextLookbook_id = aa.nextLookbook_id;
        // console.log('nextLookbook_id', this.nextLookbook_id);
        // localStorage.setItem('lookbookid',this.nextLookbook_id);
        // this.viewNextfrontPage(this.nextLookbook_id);
      }
    }
  }

  voteUp(like: boolean, index: number) {
    let removedCard = this.allcards.pop();
    console.log(this.allcards);
  }

  public viewfrontPage(idd) {
    var aa = this;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var postdata = {
      id: idd
    };
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/frontpageofaffiliates', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();
        let allcards: any = this.allcards;
        console.log(data);
        data.data.forEach(function (value, key) {
          if (aa.appsetting.palycyrretn == 1) {
            if (value.Playlist.Music) {
              aa.appsetting.audio.stop();
              aa.appsetting.audio.release();
              aa.appsetting.audio = undefined;
              aa.appsetting.tracks = value.Playlist.Music;
              aa.playTrack(aa.appsetting.tracks[0]);
            }
          } else if (value.Playlist.Music) {
            aa.playsong = 1;
            aa.appsetting.palycyrretn = 1;
            aa.appsetting.tracks = value.Playlist.Music;
            aa.playTrack(aa.appsetting.tracks[0]);
          } else {
            localStorage.removeItem('currenttrack');
          }
          if (value.Lookbook.brand != null) {
            var search = value.Lookbook.brand.search('http://');
            var searchhttps = value.Lookbook.brand.search('https://');
            if (search >= 0 || searchhttps >= 0) {
              value.Lookbook.brandlink = 1;
            } else {
              value.Lookbook.brandlink = 0;
            }
          }
        
          allcards.push(value)
        })
        this.allcards = allcards;
        console.log(this.allcards);
      }, err => {
        Loading.dismiss();
      })
    })
  }

  public viewNextfrontPage(id) {
    var aa = this;
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    console.log(id);
    console.log(this.nextLookbook_id);
    console.log("hello");
    var idd: any = this.nextLookbook_id;
    var postdata = {
      id: id
    };
    var serialized = this.serializeObj(postdata);
    this.http.post(this.appsetting.myGlobalVar + 'lookbooks/frontpageofaffiliates', serialized, options).map(res => res.json()).subscribe(data => {
      console.log(data);
      console.log("New darte");
      let allcards: any = this.allcards;
      console.log(data);
      
      if (data.status != 1) {
        data.data.forEach(function (value, key) {
          aa.affiliates = value.Lookbook.affiliates;
          if (value.Playlist.Music) {
            console.log(value.Playlist.Music);
            aa.appsetting.audio.stop();
            aa.appsetting.audio.release();
            aa.appsetting.audio = undefined;
            aa.appsetting.tracks = value.Playlist.Music;
            aa.playTrack(aa.appsetting.tracks[0]);
          } else {
            localStorage.removeItem('currenttrack');
          }
          if (value.Lookbook.brand != null) {
            var search = value.Lookbook.brand.search('http://');
            var searchhttps = value.Lookbook.brand.search('https://');
            if (search >= 0 || searchhttps >= 0) {
              value.Lookbook.brandlink = 1;
            } else {
              value.Lookbook.brandlink = 0;
            }
          }
          allcards.push(value)
        })
        this.allcards = allcards;
        console.log('NEXT COVER', this.allcards);
        localStorage.setItem('lookbookaffid',aa.affiliates);
        this.Nextlookbook(this.nextLookbook_id);
      }
    }, err => {
    })
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


  public viewlookbook() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var idd = localStorage.getItem('lookbookid');
    var uid = localStorage.getItem('USERID');
    var aff = localStorage.getItem('lookbookaffid');
    var postdata = {
      lookbookid: idd,
      userid: uid,
      affiliates: aff
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    console.log("Loadderrr");
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/firstproductoflookbook', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log(data);
          if (data.status == 0) {
            let allcards = this.allcards;
            data.data.forEach(function (value, key) {
                 /*********************** */
          if (value.Product.image != null) {
            console.log(value.Product.image);
            var search = value.Product.image.search('http://');
            var searchhttps = value.Product.image.search('https://');
            if (search >= 0 || searchhttps >= 0) {
              //value.Lookbook.brandlink = 1;
            } else {
              value.Product.image = 'https:'+value.Product.image;
            }
          }

          /*********************** */
              allcards.push(value);
            })
            this.allcards = allcards;
            this.pages = data.pages;// total number of pages...
            console.log('VIEW LOOK BOOK', this.allcards);
            console.log(this.allcards);
            this.lastItem = this.allcards[this.allcards.length - 1];
            this.lengthofLoookbook = this.lastItem;
            this.lastProductofLookbook = this.lastItem.Product.id;
          } else {
            this.showToast("End of lookbook, let's shop the next one from our homepage!")
          }
        }, err => {
          Loading.dismiss();
        })
    });
  }

  public Nextlookbook(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var uid = localStorage.getItem('USERID');
    var aff = localStorage.getItem('lookbookaffid');
    var postdata = {
      lookbookid: id,
      userid: uid,
      affiliates: aff
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      // content: 'Loading new affiliates...',
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();
        if (data.status == 0) {
          console.log('old', this.allcards)
          let allcards = this.allcards
          data.data.forEach(function (value, key) {
                
            allcards.push(value);
          });
          this.allcards = allcards;
          console.log('updated', this.allcards);
        } else {
          this.showToast("End of lookbook, let's shop the next one from our homepage!")
        }
      }, err => {
        Loading.dismiss();
      })
    });
  }


  public Lastlookbook(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var uid = localStorage.getItem('USERID');
    var aff = localStorage.getItem('lookbookaffid');
    var postdata = {
      lookbookid: id,
      userid: uid,
      affiliates: aff
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      // content: 'Loading previous affiliates...'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/productoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();
        console.log('our data : ', data);
        if (data.status == 0) {
          console.log('old', this.allcards)
          let allcards = this.allcards
          data.data.forEach(function (value, key) {
            allcards.push(value);
          });
          this.allcards = allcards;
          console.log('updated', this.allcards);
        } else {
          this.showToast("End of lookbook, let's shop the next one from our homepage!")
        }
      }, err => {
        Loading.dismiss();
      })
    });
  }


  tutorialModal() {
    let modal = this.modalCtrl.create(TutorialPage);
    modal.present();
  }



  myFavs(id, fav, url) {
    var user_id = localStorage.getItem('USERID');
    var aff = localStorage.getItem('lookbookaffid');
    if (user_id == null || undefined) {
      this.ConfirmUser();
    } else {
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      let options = new RequestOptions({ headers: headers });
      if (fav == 1) {
        var status = 0
        console.log('UNFAV')
      } else {
        var status = 1
        console.log('FAV')
      }
      var postdata = {
        productid: id,
        userid: user_id,
        status: status,
        link: url,
        affiliate: parseInt(aff)
      };
      console.log(postdata);
      var serialized = this.serializeObj(postdata);

      var Loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        showBackdrop: false,
        cssClass: 'loader'
      });

      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/addtofavourite', serialized, options).map(res => res.json()).subscribe(data => {
        Loading.dismiss();
        console.log(data)
        if (data.status == 0) {
          this.showToast(data.msg);
          console.log(data.bit)
          if (data.bit == 1) {
            this.events.publish('Liked', '2');  // only for the stacks, so that Red dot remains in the next card
          } else {
            this.events.publish('Liked', '0');
          }
        } else {
          this.showToast(data.msg);
        }


      })
    }
  }
  back() {
    this.navCtrl.push(HomePage);
  }

  share(id) {
    var user_id = localStorage.getItem('USERID');
    if (user_id == null || undefined) {
      this.ConfirmUser();
    } else {
      console.log(id);
      var fit: any = JSON.parse(localStorage.getItem('fitting_status'));
      console.log('statata', fit)
      this.navCtrl.push(FittingroomPage, { share_id: id, sharebit: 1 })
    }
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
          }
        },
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.push(SigninPage);
          }
        }
      ]
    });
    alert.present();
  }

  productDetails(i) {
    var id = i;
    console.log(id);
    this.navCtrl.push(ProductdetailsPage, { prod_id: id })
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
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
      localStorage.setItem('currenttrack', JSON.stringify(this.currentTrack));
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

  stopaudio() {
    if (this.appsetting.audio) {
      this.tracknow = false;
      this.appsetting.audio.stop();
      this.appsetting.audio.release();
    } else {

    }

  }

  /*************** In App purchase for brands *********************/
  InAppPurchage(link) {
    if (link != null && link != '') {
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
    } else {

    }


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