import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AddressPage } from '../address/address'; //
import { ShippingPage } from '../shipping/shipping';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';


@Component({
  selector: 'page-editaddress',
  templateUrl: 'editaddress.html'
})
export class EditaddressPage {
  address_id; addressInfo;apt;
  data: any = {}; countries;
  default:boolean= false;
  defaultstatus;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {

    this.countrylist()
    //defaultstatus api
   
    var address_id = this.navParams.get('address_id'); // when edits from the Profile page
    if(address_id != undefined){
      this.address_id = address_id;
      this.addressDetail(address_id)
      console.log('address_id ->',this.address_id)
    }else {
      var shipping_id = this.navParams.get('shipping_id'); // when edits from the checkoutprocess
      this.address_id = shipping_id;
      this.addressDetail(shipping_id)
      console.log('shipping_id ->',this.address_id)
    }
  

  }

  public countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data;
      })
  }

  public addressDetail(address_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var postdata = {
      id: address_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/shippingaddressinfo', serialized, options) //billingaddressinfo
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('address : ', data);
          if (data.status == 0) {
            this.data = data.data.Address;
            this.defaultstatus = this.data.defaultstatus;
            console.log(this.defaultstatus);
            if(this.defaultstatus == 1){
              this.default = true;
            }else{
              this.default = false;
            }
          }

        }, err => {
          Loading.dismiss();

        })
    })
  }

  //edituserbillingaddress

  //SHIPPING/ DELIVERY ADDRESS
  public edit_address(formdata) {
    
    console.log(formdata.value.contact_number)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    if(this.navParams.get('shipping_id') != undefined){
       var address_id = this.navParams.get('shipping_id');
    } else {
       var address_id = this.navParams.get('address_id')
    }; 
      if(formdata.value.apt){
        this.apt = formdata.value.apt;
      }else{
        this.apt = '';
      }
    var postdata = {
      uid: user_id,
      name: formdata.value.name,
      addressid : address_id,
      address: formdata.value.address,
      apt: this.apt,
      country: formdata.value.country,
      defaultstatus : this.defaultstatus,
      city: formdata.value.city,
      state: formdata.value.state,
      zipcode: formdata.value.zipcode,
      contact_number: formdata.value.contact_number
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

   // return false;
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/edituserdeliveryaddress', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          if(data.status == 0){
              this.showToast(data.msg);
              if(this.navParams.get('shipping_id') != undefined){
                  this.navCtrl.push(ShippingPage);
              } else{
                  this.navCtrl.push(AddressPage);
              }
          } {
            this.showToast(data.msg);
          }
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })

  }

  delete_address(){
      let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var postdata = {
      id: this.address_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/removedeliveryaddress', serialized, options) 
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('deleted : ', data);
           if(data.status == 0){
              this.showToast(data.data);
              if(this.navParams.get('shipping_id') != undefined){
                    this.navCtrl.push(ShippingPage);
                } else{
                    this.navCtrl.push(AddressPage);
                }
          } {
            this.showToast(data.data);
          }

        }, err => {
          Loading.dismiss();

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

contactFormat(number){
  console.log(number);
  if(number.length == 3){
   
        this.data.contact_number = number+'-';
    
  } else if (number.length == 7){
      this.data.contact_number = number+'-';
      
  }
}

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
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

  addressPage() {
    this.navCtrl.push(AddressPage);
  }

}
