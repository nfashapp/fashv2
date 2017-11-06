import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';
import { PaymentPage } from '../payment/payment';
import { ReviewPage } from '../review/review';
import { CartPage } from '../cart/cart'; 
import { EditaddressPage } from '../editaddress/editaddress';

@Component({
  selector: 'page-shipping',
  templateUrl: 'shipping.html'
})
export class ShippingPage {
  shownGroup = null;
  data: any = {};
  countries; addressList;
  selected;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
  ) {
    this.countrylist();
    this.AllAddresses();
    console.log('update!!!')
    //alert('ahsdjfahsk');
  }


  public countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        this.countries = data;
        console.log('COUNTRY CODE->', localStorage.getItem('country'))
        if (localStorage.getItem('country')) {
          this.data.country = JSON.parse(localStorage.getItem('country'));
        }else{
          this.data.country = 'US';
        }
      })
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
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userdeliveryaddresslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          this.addressList = data.data;

          //to show default selected shipping address
          let that = this;
          this.addressList.forEach(function (value, key) {
            if (value.Address.defaultstatus == 1) {
              that.selected = value.Address.id;
            }
          });
          this.selected = that.selected;
          console.log('SELECTED ID -> ', this.selected)
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })
  }


  public add_address(formdata) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
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
      country: formdata.value.country,
      defaultstatus: '0',
      city: formdata.value.city,
      state: formdata.value.state,
      zipcode: formdata.value.zip,
      contact_number: formdata.value.contact
    };
    console.log(postdata);




    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userdeliveryaddress', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          this.data = {};
          this.toggleGroup(false) // to close the toggleGroup
          this.selected = undefined; /* forces user to select an address before proceeding */
          this.AllAddresses(); // updates the list
          this.showToast(data.msg);
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })

  }

  goback() {
    this.navCtrl.popTo(CartPage);
  }

  editAddress(addr_id){
    console.log('addrs_id', addr_id);
    this.navCtrl.push(EditaddressPage, {shipping_id : addr_id})
  }
  
  showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      cssClass: 'toastCss',
      position: 'middle'
    });
    toast.present();
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }


  paymentPage(id) {
    console.log(id)
    localStorage.setItem('shipping_id', id);
    this.navCtrl.push(PaymentPage);
  }

  contactFormat(number) {
    console.log(number);
    if (number.length == 3) {
      this.data.contact= number + '-';
    } else if (number.length == 7) {
      this.data.contact = number + '-';
    }
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {

      this.shownGroup = null;

    } else {
      this.shownGroup = group;
    }
  };
  isGroupShown(group) {
    // console.log('COUNTRY CODE->',localStorage.getItem('country'))
        if(localStorage.getItem('country')){
          this.data.country = localStorage.getItem('country');
        }else{
          this.data.country = 'US';
        }
      //  console.log('SELECTED CN',this.data.country)
    return this.shownGroup === group;

  };

}
