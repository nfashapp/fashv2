import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddressPage } from '../address/address';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';
import { PaymentPage } from '../payment/payment';


@Component({
  selector: 'page-addaddress',
  templateUrl: 'addaddress.html'
})
export class AddaddressPage {
  data: any = {};
  countries; addressList;
  defaultstatus=0;
  default;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
  ) {
    this.countrylist();
    console.log('updated')
  }

  public countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options).map(res => res.json()).subscribe(data => {
        this.countries = data;
        console.log('COUNTRY CODE->', localStorage.getItem('country'))
        if (localStorage.getItem('country')) {
          this.data = {
            country : localStorage.getItem('country'),
          }
        }else{
          this.data = {
            country : 'US',
          }
        }
      })
  }

  public add_address(formdata) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    //  console.log(formdata);
    var apt;
    if(formdata.value.apt){
      apt = formdata.value.apt;
    }else{
      apt = '';
    }
    var postdata = {
      uid: user_id,
      name: formdata.value.name,
      address: formdata.value.address,
      apt: apt,
      defaultstatus : this.defaultstatus,
      country: formdata.value.country,
      city: formdata.value.city,
      state: formdata.value.state,
      zipcode: formdata.value.zip,
      contact_number: formdata.value.contact
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userdeliveryaddress', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          //this.addressList = data.data;
          if(data.status == 0){
            this.showToast(data.msg);
            this.navCtrl.push(AddressPage);
          } else {
            this.showToast(data.msg)
          }
          //this.navCtrl.setRoot(this.navCtrl.getActive().component); // refreshes the controller
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })

  }

  setDefault(value){
      console.log(value)
      if(value == true){
        this.default = true;
        this.defaultstatus = 1
        console.log(this.defaultstatus)
      } else {
        this.defaultstatus = 0
        this.default = false;
      }
  }

  showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      cssClass: 'toastCss',
      position: 'middle',
      // closeButtonText: 'ok'
    });
    toast.present();
  }

contactFormat(number){
  console.log(number);
  if(number.length == 3){
      this.data.contact = number+'-';
  } else if (number.length == 7){
      this.data.contact = number+'-';
  }
}
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }

  addressPage() {
    this.navCtrl.push(AddressPage);
  }

}
