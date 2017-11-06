import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShippingPage } from '../shipping/shipping';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
    cartItems;subtotal;
    tax; total;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
  ) {
//alert('sdfsd');
 clearInterval(this.appsetting.interval);
      this.ViewCart();

   }

   doRefresh(refresher) {
    console.log('Begin async operation', refresher);
     this.ViewCart();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }



  public ViewCart() {
    clearInterval(this.appsetting.interval);
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
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcartslist', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          console.log('Cartdata : ', data);
          this.cartItems = data.data;
          
          // find the subtotal
          var total = 0;
          for(var i = 0; i < this.cartItems.length; i++){
                var product = this.cartItems[i].Cart;
                total += (parseFloat(product.price) * (product.quantity) );
          }
          console.log(total)
          this.subtotal = total;
          this.tax = ((8.9/100)*this.subtotal); ////tax 8.9%
          this.total = this.subtotal+ this.tax;

        }, err=>{
          Loading.dismiss();
           this.showToast('Oops. Something went wrong.');
        })
      })
  }

  removeItem(cart_id){
    console.log(cart_id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
 
    var postdata = {
      id: cart_id,
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
         spinner: 'bubbles',
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/removecartproducts', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          if(data.status == 0){
             console.log('Decreased : ', data);
             this.ViewCart();
             this.showToast(data.msg);
          } else {
            this.showToast(data.msg);
          }

        }, err=>{
           Loading.dismiss();
           this.showToast('Oops! Something went wrong.');
        })
      })
  }


  Increase(qty, id){
    console.log(qty, id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
 
    var postdata = {
      cartid: id,
      status: 1, //for increase, 0 for decrease
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
         spinner: 'bubbles',
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/increasedecreasequantity', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

          if(data.status == 0){
             console.log('Increased : ', data);
             this.ViewCart();
             this.showToast(data.msg);
          } else {
            this.showToast(data.msg);
          }
        

        }, err=>{
           Loading.dismiss();
           this.showToast('Oops! Something went wrong.');
        })
      })
  }


  Decrease(qty, id){
    console.log(qty, id)
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
 
    var postdata = {
      cartid: id,
      status: 0, //for increase, 0 for decrease
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    var Loading = this.loadingCtrl.create({
         spinner: 'bubbles',
       showBackdrop:false,
       cssClass:'loader'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/increasedecreasequantity', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();

      
          if(data.status == 0){
             console.log('Decreased : ', data);
             this.ViewCart();
             this.showToast(data.msg);
          } else {
            this.showToast('Please remove product by clicking the remove button on the product image.');
          }

        }, err=>{
           Loading.dismiss();
           this.showToast('Oops! Something went wrong.');
        })
      })
  }

  showToast(msg){ 
    var toast = this.toastCtrl.create({
              message: msg,
              duration: 2500,
              cssClass: 'toastCss',
              position: 'middle',
              // closeButtonText: 'ok'
    });
    toast.present();
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
  }


  shippingPage(){
    this.navCtrl.push(ShippingPage);
  }

}
