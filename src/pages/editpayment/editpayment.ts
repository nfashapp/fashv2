import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CardPage } from '../card/card';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { PaymentPage } from '../payment/payment';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';



@Component({
  selector: 'page-editpayment',
  templateUrl: 'editpayment.html'
})
export class EditpaymentPage {
  card: any = '';
  defaultcardstatus = 0;
  default;
  defaultstatus;
  data: any = '';
  countries;
  carid;
  addressid;

  constructor(public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
    public navParams: NavParams,
  ) {
    console.log('now updated')
    this.countrylist();
    var id = this.navParams.get('card_id');  // when user edits from the Profile page
    if (id != undefined) {
      this.carid = id;
      console.log('cardid', id);
      this.addressCardDetail(id)
    } else {
      this.carid = this.navParams.get('payment_id');  //when user edits from the Payment page(checkout)
      console.log('paymentid', this.carid);
      this.addressCardDetail(this.carid)
    }

  }

  countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data;
      })
  }


  addressCardDetail(address_id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var postdata = {
      cardid: address_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/infocardsandbillingaddress', serialized, options) //billingaddressinfo
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('address : ', data);
          if (data.status == 0) {
            this.card = data.data.Billing[0];
            this.addressid = this.card.id;
            if(data.data.Card.cardnumber){
               var card = data.data.Card.cardnumber;
               console.log(card.substr(0,4));
               var a = card.substring(0,4);
               var b = card.substring(4,8);
               var c = card.substring(8,12);
               var d = card.substring(12,16);
               var carnNo = a+'-'+b+'-'+c+'-'+d;
                console.log('first:'+a+'second:'+b+'third'+c+'fourth:'+d);
                console.log(carnNo);
              
            }
            this.card = {
              address: data.data.Billing[0].address,
              apt: data.data.Billing[0].apt,
              city: data.data.Billing[0].city,
              contact: data.data.Billing[0].contact_number,
              country: data.data.Billing[0].country,
              defaultstatus: data.data.Billing[0].defaultstatus,
              username: data.data.Billing[0].name,
              state: data.data.Billing[0].state,
              zip: data.data.Billing[0].zipcode,
              cardnumber: carnNo,
              cvc: data.data.Card.cvc,
              defaultcardstatus: data.data.Card.defaultcardstatus,
              mmyy: data.data.Card.mmyy,
              name: data.data.Card.name,
            }

            this.defaultcardstatus = this.card.defaultcardstatus;
            console.log(this.defaultcardstatus);
            if (this.defaultcardstatus == 1) {
              this.default = true;
            } else {
              this.default = false;
            }
          }

        }, err => {
          Loading.dismiss();

        })
    })
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


  dateFormat(date) {
    console.log(date);
    if (date.length == 2) {
      this.card.mmyy = date + '/';

    }
  }
    cardFormat(number) {
    console.log(number);
    if (number.length == 4) {
      this.card.cardnumber = number + '-';

    } else if (number.length == 9) {
      this.card.cardnumber = number + '-';
    }else if (number.length == 14) {
      this.card.cardnumber = number + '-';
    }
  }
  contactFormat(number) {
    console.log(number);
    if (number.length == 3) {
      this.card.contact = number + '-';
    } else if (number.length == 7) {
      this.card.contact = number + '-';
    }

  }

  //infocardsandbillingaddress
  public add_card(formdata) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
     var cardno = formdata.value.cardnumber.split('-');
  
    cardno = cardno[0]+cardno[1]+cardno[2]+cardno[3];
    var postdata = {
      uid: user_id,
      cardname: formdata.value.name,
      cardnumber: cardno,
      mmyy: formdata.value.mmyy,
      cvc: '',
      name: formdata.value.username,
      address: formdata.value.address,
      apt: formdata.value.apt,
      // status : 0,
      addressid: this.addressid,
      defaultcardstatus: this.defaultcardstatus,
      country: formdata.value.country,
      city: formdata.value.city,
      state: formdata.value.state,
      zipcode: formdata.value.zip,
      contact_number: formdata.value.contact,
      cardid: this.carid
    };

    var serialized = this.serializeObj(postdata);

    console.log(serialized);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/edituserbillingaddress', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          // this.addressList = data.data;

          if (this.navParams.get('payment_id') != undefined) {
            this.navCtrl.push(PaymentPage);
          } else {
            this.navCtrl.push(CardPage);
          }

        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })

  }

  // http://rakesh.crystalbiltech.com/fash/api/shop/removecards
  delete_card() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var postdata = {
      id: this.carid,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/removecards', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('deleted : ', data);
          if (data.status == 0) {
            this.showToast(data.data);

            if (this.navParams.get('payment_id') != undefined) {
              this.navCtrl.push(PaymentPage);
            } else {
              this.navCtrl.push(CardPage);
            }
          } {
            this.showToast(data.data);
          }

        }, err => {
          Loading.dismiss();
        })
    })
  }



  setDefault(value) {
    console.log(value)
    if (value == true) {
      this.default = true;
      this.defaultcardstatus = 1
      console.log(this.defaultcardstatus)
    } else {
      this.defaultcardstatus = 0
      this.default = false;
    }
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }


  cardPage() {
    this.navCtrl.push(CardPage);
  }

}
