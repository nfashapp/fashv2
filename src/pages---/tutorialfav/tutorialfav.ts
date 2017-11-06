import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';


@Component({
  selector: 'page-tutorialfav',
  templateUrl: 'tutorialfav.html'
})
export class TutorialfavPage {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
  tutorialPage(){
   this.navCtrl.push(TutorialfavPage);
  }

dismiss() {this.viewCtrl.dismiss();}

}

