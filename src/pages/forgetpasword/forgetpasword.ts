import { Component } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions, URLSearchParams, QueryEncoder } from '@angular/http';
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SigninPage } from '../signin/signin';
import { Appsetting } from '../../providers/appsetting';
import { SignupPage } from '../signup/signup';
import { Diagnostic } from '@ionic-native/diagnostic';
import { TabsPage } from '../tabs/tabs';
import { Geolocation } from '@ionic-native/geolocation';



@Component({
  selector: 'page-forgetpasword',
  templateUrl: 'forgetpasword.html'
})
export class ForgetpaswordPage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public http: Http,
    public navParams: NavParams,
    public appsetting: Appsetting,
    public diagnostic: Diagnostic,
    public geolocation: Geolocation,
    public toastCtrl: ToastController,


  ) {

  }
  public data = '';
  public Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
    dismissOnPageChange: true
  });
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  forgotPwd(userEmail) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });

    //var url = 'http://rakesh.crystalbiltech.com/fash/api/users/forgetpwd';

    var postdata = {
      username: userEmail.value.email
    };
    var serialized = this.serializeObj(postdata);
    console.log('post data-->' + postdata);

    var Loader = this.loadingCtrl.create({    //createding a custom loader which can be used later
      dismissOnPageChange: true
    });
    Loader.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'users/forgetpwd', serialized, options).map(res => res.json())
        .subscribe(data => {
          Loader.dismiss();
          console.log(" response" + JSON.stringify(data));
          this.data = data;
          console.log(this.data);
          if (data.isSucess == "true") {
            //alert(data.msg)
            this.presentConfirm(data.msg)
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'FASH',
              message: data.msg,
              buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {
                    // console.log('Cancel clicked');
                    //this.navCtrl.push(SigninPage);
                  }
                }
              ]
            });
            alert.present();

          }

        }, err => {

          console.log("Error");

          Loader.dismiss();
          console.log("Error!:");
        });

    })

  }


  presentConfirm(msg) {
    let alert = this.alertCtrl.create({
      title: 'FASH',
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
            this.navCtrl.push(SigninPage);
          }
        }
      ]
    });
    alert.present();
  }

  location() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.diagnostic.switchToLocationSettings();
      this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + resp.coords.latitude + ',' + resp.coords.longitude + '&sensor=true').map(res => res.json()).subscribe(data => {
        var address = data.results[0].formatted_address;
        localStorage.setItem('location', address);
        //alert(address)
        for (var i = 0; i < data.results[0].address_components.length; i++) {
          for (var b = 0; b < data.results[0].address_components[i].types.length; b++) {
            if (data.results[0].address_components[i].types[b] == "country") {
              var country = data.results[0].address_components[i];
              console.log(country.short_name)
              localStorage.setItem('country', country.short_name)
              var autocompleteOptions = {
                componentRestrictions: { country: country.short_name },
                types: ['geocode']
              };
            }
            if (data.results[0].address_components[i].types[b] == "administrative_area_level_1") {
              //this is the object you are looking for
              var country = data.results[0].address_components[i];
              console.log(country.short_name)
              localStorage.setItem('city', country.long_name)
              // alert(localStorage.getItem('city'))
              var autocompleteOptions = {
                componentRestrictions: { country: country.short_name },
                types: ['geocode']
              };
            }
          }
        }
      })
    }).catch((error) => {

      let toast = this.toastCtrl.create({
        message: 'Please enable your location',
        duration: 5000,
        cssClass: 'toastCss',
        position: 'middle',
      });
      toast.present();
      //  this.diagnostic.switchToLocationSettings();
      console.log('Error getting location', error);
    });
  }
  skip() {

    this.navCtrl.push(SigninPage);
  }

  signupPage() {
    this.navCtrl.push(SignupPage);
  }
}
