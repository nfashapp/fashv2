import { Component } from '@angular/core';
import { NavController, Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html'
})
export class ConfirmationPage {

  // variables
  order_Id; cartItems; subtotal;
  tax;total;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public http : Http,
    public toastCtrl : ToastController,
    public appsetting : Appsetting,
    public loadingCtrl : LoadingController,
    public nav : Nav
  ) {
        this.order_Id = this.navParams.get('order_id');
        this.Confirmation();
  }

 homePage(){
      this.emptyCart();
  };

emptyCart(){

// http://rakesh.crystalbiltech.com/fash/api/shop/emptycart
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    var postdata = {
      userid: user_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      showBackdrop: false,
      cssClass: 'loader'
    });

    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/emptycart', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
           this.nav.setRoot(TabsPage);
           this.nav.popToRoot()     
        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })
}



public Confirmation() {
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
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcartslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
         console.log(data);
          console.log('Cartdata : ', data);
          this.cartItems = data.data;
          // find the subtotal
          var total = 0;
          for (var i = 0; i < this.cartItems.length; i++) {
            var product = this.cartItems[i].Cart;
            total += (parseFloat(product.price) * (product.quantity));
          }
          console.log(total)
          this.subtotal = total;
           this.tax = ((8.9/100)*this.subtotal); ////tax 8.9%
          this.total = this.subtotal + this.tax;

        }, err => {
          Loading.dismiss();
          this.showToast('Oops. Something went wrong.');
        })
    })
};



showToast(msg) {
    var toast = this.toastCtrl.create({
      message: msg,
      duration: 2500,
      cssClass: 'toastCss',
      position: 'middle',
    });
    toast.present();
};
  
serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
};

}
