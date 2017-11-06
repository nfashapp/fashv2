import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import {BirthdayPage} from '../birthday/birthday';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-gender',
  templateUrl: 'gender.html'
})
export class GenderPage {
data1:any = {};
  constructor(public navCtrl: NavController,
      public toastCtrl: ToastController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting
  ) {

  }


  updateGender(gender) {
    console.log('DATE->', gender);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });

    var user_id = localStorage.getItem('USERID');
    var usedata = JSON.parse(localStorage.getItem('userfbdata'));
    if (usedata == null || usedata == undefined) {
      var user = JSON.parse(localStorage.getItem('USER_DATA'));
      var userdata = user.data.User;
      console.log('here', userdata);
      if(userdata.last_name == null){
        userdata.last_name = '';
      }
      this.data1 = {
        first_name: userdata.first_name,
        last_name: userdata.last_name,
        email: userdata.email,
        phone: '',
        dob: '',
        address: '',
        cards: "",
        state_in: '',
        gender: gender,
        id: user_id,
      }
    } else {
      if(usedata.last_name == null){
        userdata.last_name = '';
      } else if (usedata.gender == null){
        usedata.gender = '';
      }
      this.data1 = {
        first_name: usedata.first_name,
        last_name: usedata.last_name,
        email: usedata.email,
        phone: '',
        dob: '',
        address: '',
        cards: "",
        state_in: '',
        gender: gender,
        id: user_id,
      };
    }

    console.log('postdata', this.data1)
    var serialized = this.serializeObj(this.data1);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'users/editprofile', serialized, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          Loading.dismiss();
          if (data.isSucess == "true") {
            // let toast = this.toastCtrl.create({
            //   message: "Profile is updated",
            //   duration: 2000,
            //   cssClass: 'toastCss',
            //   position: 'middle',

            // });
            // toast.present();
            this.navCtrl.push(BirthdayPage,{gender:gender});
          } else {

          }
        }, err => {
          Loading.dismiss()
        })
    })
  }
    serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  } 
}
