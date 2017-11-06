import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ReviewPage } from '../review/review';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { EditpaymentPage } from '../editpayment/editpayment'; 
import { ShippingPage } from '../shipping/shipping'; //
import { CartPage } from '../cart/cart';
import { LoadingController, AlertController ,Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';

import { Stripe } from '@ionic-native/stripe'; // move to PAY NOW page

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {
  data: any = '';apt;
  card: any = {};  //ngmodel
  cards: any = ''   //list of cards
  cvc: any = '';
  card_id;
  hideCVC;
  countries; alldetails;
  shipping_addrs_id;
  billing_addrs_id;
  defaultcardstatus;
  shownGroup = null;
  setDefaultAddress = false;
  showbutton = false;
  selected; ShippingAddr;
  cvv = false;

  //for getting the token
  cardNumber; expMonth; expYear

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
    public navParams: NavParams,
    public stripe: Stripe,
    public platform: Platform,
  ) {
          platform.ready().then(() => {
        var lastTimeBackPress = 0;
        var timePeriodToExit  = 2000;
        platform.registerBackButtonAction(() => {
            // get current active page
            let view = this.navCtrl.getActive();
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                    this.platform.exitApp(); //Exit from app
                } else {
                 // alert('Press back again to exit App?');
                    let toast = this.toastCtrl.create({
                        message:  'Press back again to exit from app?',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                    lastTimeBackPress = new Date().getTime();
                }
        });
    });
    this.ionViewDidEnter(); 
    this.countrylist();
    this.cardlist();
    this.cvc = ''; // otherwise input come as null
    this.shipping_addrs_id = localStorage.getItem('shipping_id');
    this.addressDetail(this.shipping_addrs_id);

  }


  addressCardDetail(address_id) {

  }


  myCard(id) {
    console.log(id);

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var postdata = {
      cardid: id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    this.cvc = '';
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/infocardsandbillingaddress', serialized, options) //billingaddressinfo
        .map(res => res.json()).subscribe(data => {
          this.cvv = true;
          Loading.dismiss()
          console.log('mycard' + JSON.stringify(data));
          if (data.data.length == 0) {
            this.hideCVC = 1;
          } else {
            this.billing_addrs_id = data.data.Billing[0].id;
            this.card_id = data.data.Card.id;
            var response = data.data.Card;
            var split = response.mmyy.split('/')
            var mm = split[0];
            var yy = split[1];
            this.cardNumber = response.cardnumber;
            this.expMonth = mm;
            this.expYear = yy;
            this.hideCVC = 0;

          }
        }, err => {
          Loading.dismiss()
        })
    })
  }

  getToken() {
    this.stripe.setPublishableKey('pk_test_gGw0nKJtPn2n9zGD1JuR7iV6');

    let card = {
      number: this.cardNumber,
      expMonth: this.expMonth,
      expYear: this.expYear,
      cvc: this.cvc
    };
    console.log(card)
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.stripe.createCardToken(card)
        .then(token => {
          Loading.dismiss()
          console.log(JSON.stringify(token));
          var token1: any = token;
          this.navCtrl.push(ReviewPage, {
            ship_id: this.shipping_addrs_id,
            token: token1.id, //'xxxx' ,//
            bill_id: this.billing_addrs_id,
            card_id: this.card_id
          });
        })
        .catch(error => {
          console.error(error)
          Loading.dismiss()
          this.showToast('Invalid card information');
        });

    })
  }

  setDefault(value) {
    console.log(value)
    if (value == true) {
      this.setDefaultAddress = true;
      this.shipping_addrs_id = localStorage.getItem('shipping_id')
      console.log(this.shipping_addrs_id)
    } else {
      // this.defaultcardstatus = 0
      this.setDefaultAddress = false;
      this.shipping_addrs_id = null;
      console.log(this.shipping_addrs_id)
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
        console.log('COUNTRY CODE->', localStorage.getItem('country'))
        if (localStorage.getItem('country')) {
          this.card.country = localStorage.getItem('country');
        }else{
          this.card.country = 'US';
        }
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

  public add_card(formdata) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    console.log(this.card);
    var cardno = formdata.value.cardnumber.split('-');
    cardno = cardno[0]+cardno[1]+cardno[2]+cardno[3];
    console.log(cardno);
    if(formdata.value.apt){
      this.apt = formdata.value.apt;
    }else{
      this.apt = '';
    }
    //return false;
    if (this.setDefaultAddress == true) {
      var postdata: any = {
        uid: user_id,
        name: formdata.value.name,
        cardnumber: cardno, //formdata.value.cardnumber,
        mmyy: formdata.value.mmyy,
        cvc: '',
        username: '',
        address: '',
        apt: '',
        status: 1,
        defaultcardstatus: '',
        deliveredid: this.shipping_addrs_id,
        country: '',
        city: '',
        state: '',
        zipcode: '',
        contact_number: ''
      };
    } else {

      var postdata: any = {
        uid: user_id,
        name: formdata.value.name,
        cardnumber: cardno,
        mmyy: formdata.value.mmyy,
        cvc: '',
        username: formdata.value.username,
        address: formdata.value.address,
        apt: formdata.value.apt,
        status: 0,
        defaultcardstatus: '',
        addressid: '',
        country: formdata.value.country,
        city: formdata.value.city,
        state: formdata.value.state,
        zipcode: formdata.value.zip,
        contact_number: formdata.value.contact
      };

    }
    //alert(JSON.stringify(postdata));
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    console.log(serialized);

    //  return false;
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
          
        
    
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcards', serialized, options)
        .map(res => res.json()).subscribe(data => {
          console.log(JSON.stringify(data));
           this.card = { }; // empty the form
           this.cardlist()
           this.showToast(data.msg);
           this.toggleGroup(false); // closes the toggleGroup
          Loading.dismiss();
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })

  }

  public cardlist() {
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    if (localStorage.getItem("USERID")) {
      var user_id = localStorage.getItem("USERID");
      var postData = {
        id: user_id
      }
      var serialized = this.serializeObj(postData);
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcardslist', serialized, options)
        .map(res => res.json())
        .subscribe(data => {
          Loading.dismiss();
          console.log(data);
          this.cards = data.data;
          console.log(this.cards)
          if (data.data.length == 0) {

          } else {
            let that = this;
            var i = 0;
            this.cards.forEach(function (value, key) {
              if (value.Card.defaultcardstatus == 1) {
                that.selected = value.Card.id;
                console.log(that.selected);
              }
              var num = value.Card.cardnumber;
              var last4 = num.slice(-4);
              var firstdigits = ' ';
              for (i = 0; i < (num.length - 4); i++) {
                firstdigits = firstdigits + 'x';
              }

              var final = firstdigits + last4
              console.log(final);
              value.Card.cardnumber = final;

            })
            this.selected = that.selected;
            if (this.selected != undefined) {
              this.myCard(this.selected);
            }
            console.log(this.cards)
          }

        })
    }
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

  back() {
    this.navCtrl.popTo(this.navCtrl.getByIndex(1));   // cuz default back doesn't work after component refreshes
    console.log('back')
  }

  editCard(id){
    this.navCtrl.push(EditpaymentPage, { payment_id : id })
  }

  cancelCheckout() {
    this.navCtrl.popTo(this.navCtrl.getByIndex(0));
    console.log('popped to 0')
    //this.navCtrl.popTo(CartPage);
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
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/shippingaddressinfo', serialized, options) //billingaddressinfo
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('address : ', data);
          if (data.status == 0) {
            this.ShippingAddr = data.data.Address;
          }

        }, err => {
          Loading.dismiss();

        })
    })
  }
  isnumber(cvc) {
    console.log(cvc)

  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
      this.showbutton = false;
    } else {
      this.shownGroup = group;
      console.log(true) //to show/hide review button
      this.showbutton = true;
    }
  };
  isGroupShown(group) {
    //console.log('COUNTRY CODE->',localStorage.getItem('country'))
        if(localStorage.getItem('country')){
          this.card.country = localStorage.getItem('country');
        }else{
          this.card.country = 'US';
        }
        //console.log('SELECTED CN',this.data.country)
    return this.shownGroup === group;
  };

  reviewPage() {
    //this.payNow();
    var id = this.shipping_addrs_id;
    console.log(id)
    this.navCtrl.push(ReviewPage, { ship_id: id });
  }
  ionViewDidEnter() {
    console.log('rahul');
    console.log(window.navigator.onLine);
    if (window.navigator.onLine == true) {
    } else {
      let toast = this.toastCtrl.create({
        message: 'Network connection failed',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    }

  }
}
