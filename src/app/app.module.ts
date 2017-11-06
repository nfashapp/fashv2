import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { Firebase } from '@ionic-native/firebase';
import { Facebook } from '@ionic-native/facebook'
import { CartPage } from '../pages/cart/cart';
import { ForgetpaswordPage } from '../pages/forgetpasword/forgetpasword';
import { FittingroomPage } from '../pages/fittingroom/fittingroom';
import { MyfavoritesPage } from '../pages/myfavorites/myfavorites';
import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { SportyfyPage } from '../pages/sportyfy/sportyfy';
import { ProductcardPage } from '../pages/productcard/productcard';
import { AngularFireModule } from 'angularfire2';
import { Appsetting } from '../providers/appsetting';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { ProductviewPage } from '../pages/productview/productview';
import { ProductdetailsPage } from '../pages/productdetails/productdetails';
import { EditaddressPage } from '../pages/editaddress/editaddress';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { CartmodelPage } from '../pages/cartmodel/cartmodel';
import { CardswipePage } from '../pages/cardswipe/cardswipe';
import { EditroomPage } from '../pages/editroom/editroom';
import { SearchPage } from '../pages/search/search';
import { ChatPage } from '../pages/chat/chat';
import { ProfilePage } from '../pages/profile/profile';
import { OrderhistoryPage } from '../pages/orderhistory/orderhistory';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { SettingPage } from '../pages/setting/setting';
import { HistorydetailsPage } from '../pages/historydetails/historydetails';
import { HistoryviewPage } from '../pages/historyview/historyview';
import { ShippingPage } from '../pages/shipping/shipping';
import { PaymentPage } from '../pages/payment/payment';
import { ReviewPage } from '../pages/review/review';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { TutorialchatPage } from '../pages/tutorialchat/tutorialchat';
import { SwingModule } from 'angular2-swing'												 
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AddressPage } from '../pages/address/address'; 
import { AddpaymentPage } from '../pages/addpayment/addpayment'; 
import { EditpaymentPage } from '../pages/editpayment/editpayment'; 
import { AddaddressPage } from '../pages/addaddress/addaddress'; 
import { CardPage } from '../pages/card/card'; 
import { CreategroupPage } from '../pages/creategroup/creategroup'; 
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GroupchatPage } from '../pages/groupchat/groupchat'; 
import { BirthdayPage } from '../pages/birthday/birthday'; 
import { TutorialfavPage } from '../pages/tutorialfav/tutorialfav'; 
import { TutorialfitPage } from '../pages/tutorialfit/tutorialfit'; 
import { Stripe } from '@ionic-native/stripe';
import { DatePipe } from '@angular/common';
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { PrivacypolicyPage } from '../pages/privacypolicy/privacypolicy';
import { TermsPage } from '../pages/terms/terms';
import { ReturnsPage } from '../pages/returns/returns';
import { GenderPage } from '../pages/gender/gender';
import { Media } from '@ionic-native/media';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeAudio } from '@ionic-native/native-audio';
import { File } from '@ionic-native/file';
import {CodePush} from '@ionic-native/code-push';

const firebaseConfig = {
  apiKey: "AIzaSyDANkggVOqNi2l2UXAE_Ge9OY2JJlRE5Es",//"AIzaSyAPXo07UYrFu4-2id6_TqnbpLMEw6ZV3d8",
    authDomain: "fash-1586d.firebaseapp.com",//"fash-4ce5a.firebaseapp.com",
    databaseURL: "https://fash-1586d.firebaseapp.com", //"https://fash-4ce5a.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "112979251493" //"1053226265908" 
};
@NgModule({
  declarations: [
    MyApp,
    CartPage,
    MyfavoritesPage,
    FittingroomPage,
    HomePage,
    SigninPage,
    SignupPage,
    SportyfyPage,
    ProductcardPage,
    TabsPage,
    ForgetpaswordPage,
    ChangepasswordPage,
	  ProductviewPage,
    ProductdetailsPage,
    TutorialPage,
    TutorialchatPage,
    CartmodelPage,
    CardswipePage,
    EditroomPage,
    SearchPage,
    ChatPage,
    OrderhistoryPage,
    EditprofilePage,
    SettingPage,
    ProfilePage,
    HistorydetailsPage,
    HistoryviewPage,
    ShippingPage,
    PaymentPage,
    ReviewPage,
    ConfirmationPage,
    EditaddressPage,
    TabsPage,
    AddressPage,
    AddpaymentPage,
    CardPage,
    CreategroupPage,
    AddaddressPage,
    GroupchatPage,
    EditpaymentPage,
    TutorialfavPage,
    TutorialfitPage,
    BirthdayPage,
    PrivacypolicyPage,
    TermsPage,
    ReturnsPage,
    GenderPage

  ],
  imports: [
    BrowserModule,
    SwingModule,
    HttpModule,
    MomentModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CartPage,
    MyfavoritesPage,
    FittingroomPage,
    ForgetpaswordPage,
    HomePage,
    SigninPage,
    SignupPage,
    SportyfyPage,
    ProductcardPage,
    ChangepasswordPage,
    ProductviewPage,
    ProductdetailsPage,
    TutorialPage,
    CartmodelPage,
    CardswipePage,
    EditroomPage,
    SearchPage,
    ChatPage,
    ProfilePage,
    OrderhistoryPage,
    EditprofilePage,
    SettingPage,
    HistorydetailsPage,
    HistoryviewPage,
    ShippingPage,
    PaymentPage,
    ReviewPage,
    TutorialchatPage,
    ConfirmationPage,
    EditaddressPage,
    TabsPage,
    AddressPage,
    AddpaymentPage,
    CardPage,
    CreategroupPage,
    AddaddressPage,
    GroupchatPage,
    EditpaymentPage,
    TutorialfavPage,
    TutorialfitPage,
    BirthdayPage,
    PrivacypolicyPage,
    TermsPage,
    ReturnsPage,
    GenderPage
  ],
  providers: [
    StatusBar,
     Appsetting,
     Camera,
    Firebase,
    Geolocation,
    SocialSharing,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    Network,
    Diagnostic,
    Stripe,
    DatePipe,
    Media,
    InAppBrowser,
    NativeAudio,
    CodePush,
    File
  ]
})
export class AppModule {}
