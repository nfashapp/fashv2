import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductdetailsPage } from '../productdetails/productdetails';



@Component({
  selector: 'page-productview',
  templateUrl: 'productview.html'
})



export class ProductviewPage {

  constructor(public navCtrl: NavController) {

  }

   productdetailsPage(){
   this.navCtrl.push(ProductdetailsPage);
  }

}


