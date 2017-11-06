import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ProductviewPage } from '../productview/productview';
import { CardswipePage } from '../cardswipe/cardswipe';
import { TutorialPage } from '../tutorial/tutorial';
import 'rxjs/Rx';
import { Appsetting } from '../../providers/appsetting';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-productcard',
  templateUrl: 'productcard.html'
})
export class ProductcardPage {
  res;
  text;
  brand;
  name;orderhistory;


 

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, public loadingCtrl: LoadingController, public appsetting: Appsetting) {
    this.viewlookbook()
  }


  public viewlookbook() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var idd = localStorage.getItem('lookbookid')
    //var url: string = 'http://rakesh.crystalbiltech.com/fash/api/lookbooks/listoflookbook'; 
    var postdata = {
      id: idd
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    // var Loading = this.loadingCtrl.create({
    //         spinner: 'hide',
    //         content: '<img width="32px" src="../assets/images/Loading_icon.gif">'
    //       });
    //       Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'lookbooks/frontpageoflookbook', serialized, options).map(res => res.json()).subscribe(data => {
       // Loading.dismiss();
        console.log(data)
      
        this.res = data.data[0].Lookbook.image;
        this.name = data.data[0].Lookbook.name;
        this.brand = data.data[0].Lookbook.brand;
        this.text = data.data[0].Lookbook.text;
        console.log(this.res)


      }, err => {
       // Loading.dismiss();

      })
   // })


  }



  swipepage() {
    this.navCtrl.push(CardswipePage);
  }







  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  productviewPage() {
    this.navCtrl.push(ProductviewPage);
  }
  tutorialModal() {
    let modal = this.modalCtrl.create(TutorialPage);
    modal.present();
  }



}
