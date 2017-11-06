import { Component } from '@angular/core';
import { NavController,ViewController } from 'ionic-angular';



@Component({
  selector: 'page-tutorialchat',
  templateUrl: 'tutorialchat.html'
})
export class TutorialchatPage {

  constructor(public navCtrl: NavController,private viewCtrl: ViewController) {

  }
 

dismiss() {this.viewCtrl.dismiss();}

}

