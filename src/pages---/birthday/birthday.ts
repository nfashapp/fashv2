import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';

@Component({
  selector: 'page-birthday',
  templateUrl: 'birthday.html'
})

export class BirthdayPage {
  data1:any = {};gender;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public appsetting: Appsetting,
     public navParams: NavParams,
  ) {
   
  }

  skip() {
    this.navCtrl.push(TabsPage);
  }

  updateAge(dob) {
    console.log('DATE->', dob);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
      this.data1 = {
        dob: dob,
        id: user_id,
      };
    
    console.log('postdata', this.data1)
    var serialized = this.serializeObj(this.data1);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'users/editdob', serialized, options)
        .map(res => res.json())
        .subscribe(data => {
          console.log(data)
          Loading.dismiss();
          if (data.isSucess == "true") {
            this.navCtrl.push(TabsPage);
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

