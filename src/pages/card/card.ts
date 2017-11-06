import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AddaddressPage } from '../addaddress/addaddress';
import { AddpaymentPage } from '../addpayment/addpayment';
import { EditpaymentPage } from '../editpayment/editpayment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';

@Component({
  selector: 'page-card',
  templateUrl: 'card.html'
})
export class CardPage {
  public card;
  public cards;
  constructor(public navCtrl: NavController, public http: Http, public appsetting: Appsetting, public loadingCtrl: LoadingController, ) {
    this.cardlist();
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
            
          }

        })
    }
  }

  editPayment(cardID){
    this.navCtrl.push(EditpaymentPage, { card_id : cardID });
  }
  addpaymentPage() {
    this.navCtrl.push(AddpaymentPage);
  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }
}
