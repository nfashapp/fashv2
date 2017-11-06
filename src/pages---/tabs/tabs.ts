import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { MyfavoritesPage } from '../myfavorites/myfavorites';
import { HomePage } from '../home/home';
import { Events } from 'ionic-angular';
import { AfterViewInit, OnInit } from '@angular/core';
import { SearchPage } from '../search/search';

@Component({
  templateUrl: 'tabs.html'
})


export class TabsPage {


  tab1Root = HomePage;
  tab2Root = MyfavoritesPage;
  tab3Root = FittingroomPage;
  // tab4Root = CartPage;
  count: any;
  Tab: any;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
  ) {

    var notification = this.navParams.get('message');
    console.log('updat2')
    this.events.subscribe('Liked', (status) => {
      if (status == 0) {
        this.count = '0'; // added to favs
      } else if (status == 2) {
        this.count = '0'; // added to favs, from the stack cards
      }
      else {
        this.count = ''; // deleted from favs
      }
    })


    this.events.subscribe('haveSeen', (bit) => {
      this.count = '';
    }) // event called as soon as user visits the Favorite page

  }



  tabIndex(event) {
     console.log('calling----');

    var domevent = event.srcElement.parentNode.id || event.path[1].id;
    console.log(domevent)
    var split = domevent.split('-');
    var target = split[2];
    console.log(target)
    if (target == '1') {
      this.events.publish('page', 'myFav');     // event updates the list in the Fav page
    } else if (target == '2') {
      this.events.publish('page2', 'fitting');  // event updates the list in the FittingRoom page
    } 
  }

  favs() {
    console.log('called the first time')
    this.events.publish('page', 'myFav');  // event updates the list in the Fav page
  }
 fitting() {
    console.log('called the first time')
    this.events.publish('page2', 'fitting');  // event updates the list in the Fav page
  }
}
