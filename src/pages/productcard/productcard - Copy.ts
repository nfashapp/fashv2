import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import 'rxjs/Rx';
import { Appsetting } from '../../providers/appsetting';
import {Http, Headers, RequestOptions} from '@angular/http';
import { LoadingController, AlertController } from 'ionic-angular';


import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

import { ProductviewPage } from '../productview/productview';
import { TutorialPage } from '../tutorial/tutorial';

@Component({
  selector: 'page-productcard',
  templateUrl: 'productcard.html'
})



export class ProductcardPage {
  idd;
  res;

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
  
  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '';
  // Called whenever we drag an element
onItemMove(element, x, y, r) {
  var color = '';
  var abs = Math.abs(x);
  let min = Math.trunc(Math.min(16*16 - abs, 16*16));
  let hexCode = this.decimalToHex(min, 2);
  
  if (x < 0) {
    color = '#FF' + hexCode + hexCode;
  } else {
    color = '#' + hexCode + 'FF' + hexCode;
  }
  
  element.style.background = color;
  element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
}
 
// Connected through HTML
voteUp(like: boolean) {
  let removedCard = this.cards.pop();
  this.addNewCards(1);
  if (like) {
    this.recentCard = 'You liked: ' + removedCard.email;
  } else {
    this.recentCard = 'You disliked: ' + removedCard.email;
  }
}
 
// Add new cards to our array
addNewCards(count: number) {
  this.http.get('https://randomuser.me/api/?results=' + count)
  .map(data => data.json().results)
  .subscribe(result => {
    for (let val of result) {
      this.cards.push(val);
    }
  })
}
 
// http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  
  return hex;
}
public Loading=this.loadingCtrl.create({
    content: 'Please wait...'
  });

  constructor(public navCtrl: NavController,public loadingCtrl:LoadingController,public appsetting: Appsetting,public modalCtrl: ModalController,private http: Http) {
    this.viewlookbook()

    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };

  }
  ngAfterViewInit() {
    
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#f8f8f8';
    });
    
    this.cards = [{email: ''}];
    this.addNewCards(1);
  }



  public viewlookbook(){
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

  this.http.post(this.appsetting.myGlobalVar+'lookbooks/frontpageoflookbook',serialized, options).map(res => res.json()).subscribe(data => {
     this.Loading.dismiss();

        console.log(data)
       this.res  = data.data[0].Lookbook.image;
       console.log(this.res)
      
        
   })
}
serializeObj(obj) {
		var result = [];
		for (var property in obj)
			result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

		return result.join("&");
	}
   productviewPage(){
   this.navCtrl.push(ProductviewPage);
  }
  tutorialModal() {
    let modal = this.modalCtrl.create(TutorialPage);
    modal.present();
  }

}
