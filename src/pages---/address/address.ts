import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AddaddressPage } from '../addaddress/addaddress';
import { EditaddressPage } from '../editaddress/editaddress';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html'
})
export class AddressPage {
  public addressList;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController,
   // public toastCtrl: ToastController
  ) {
    this.AllAddresses();
  }
  public AllAddresses() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    var postdata = {
      id: user_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userdeliveryaddresslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          this.addressList = data.data;
        }, err => {
          Loading.dismiss();

        })
    })
  }
    doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    delete this.addressList;
    this.AllAddresses();
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


  editAddress(id){

    this.navCtrl.push(EditaddressPage, { address_id : id});

  }
  addaddressPage() {
    this.navCtrl.push(AddaddressPage);
  }

}
