import { Component } from '@angular/core';
import { NavController,ViewController, NavParams } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-cartmodel',
  templateUrl: 'cartmodel.html'
})
export class CartmodelPage {
  name;price;size;image;color;count;retailer;
  constructor(public navCtrl: NavController,
  private viewCtrl : ViewController,
  public navParam : NavParams,
  public events : Events) {

     this.name = this.navParam.get('name');
     this.price = this.navParam.get('price');
     this.size = this.navParam.get('size');
     this.image = this.navParam.get('image');
     this.color = this.navParam.get('color');
     this.count = this.navParam.get('count');
     this.retailer = this.navParam.get('retailername');

  }
  cartmodelPage(){
   this.navCtrl.push(CartmodelPage);
  }

  cartPage(){
    this.dismiss()
    this.events.publish('CartPage', 'cartPage');
    //this.navCtrl.push(CartPage) // call on dismiss function
  }

dismiss() {this.viewCtrl.dismiss();}

}

