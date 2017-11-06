import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { TabsPage } from '../pages/tabs/tabs';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { SportyfyPage } from '../pages/sportyfy/sportyfy';
import { HomePage } from '../pages/home/home';
import { ForgetpaswordPage } from '../pages/forgetpasword/forgetpasword';
import { EditroomPage } from '../pages/editroom/editroom';
import { SearchPage } from '../pages/search/search';
import { Camera} from '@ionic-native/camera';

import { MyfavoritesPage } from '../pages/myfavorites/myfavorites';
import { ChatPage } from '../pages/chat/chat';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Geolocation } from '@ionic-native/geolocation';
import { TutorialchatPage } from '../pages/tutorialchat/tutorialchat';
import { EditaddressPage } from '../pages/editaddress/editaddress';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SignupPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.rootPage= localStorage.getItem("USERID")!=null ?  TabsPage:SignupPage;
    });
  }

  
}
