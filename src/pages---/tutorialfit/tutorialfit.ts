import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorialfit',
  templateUrl: 'tutorialfit.html'
})
export class TutorialfitPage {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
  tutorialfitPage(){
   this.navCtrl.push(TutorialfitPage);
  }

dismiss() {this.viewCtrl.dismiss();}

}

