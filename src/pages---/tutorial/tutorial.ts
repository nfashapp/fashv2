import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
  tutorialPage(){
   this.navCtrl.push(TutorialPage);
  }

dismiss() {this.viewCtrl.dismiss();}

}

