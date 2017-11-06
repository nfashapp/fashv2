import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CardPage } from '../card/card';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProfilePage } from '../profile/profile';
import { LoadingController, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Appsetting } from '../../providers/appsetting';
import { ToastController } from 'ionic-angular';



@Component({
  selector: 'page-addpayment',
  templateUrl: 'addpayment.html'
})
export class AddpaymentPage {
  card: any = {};
  defaultcardstatus=0;
  default;
  countries; 

  constructor(  public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public appsetting: Appsetting,
  ) {
  // alert('now updated');
    this.countrylist();
  }

countrylist() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    var options = new RequestOptions({ headers: headers });
    this.http.post(this.appsetting.myGlobalVar + 'users/countryall', options)
      .map(res => res.json())
      .subscribe(data => {
        this.countries = data;
        console.log('COUNTRY CODE->', localStorage.getItem('country'))
        if (localStorage.getItem('country')) {
          this.card.country = localStorage.getItem('country')
        }else{
          this.card.country = 'US';
        }
      })
}

dateFormat(date){
  console.log(date);
  if(date.length == 2){
      this.card.mmyy = date+'/';
    }
}
   cardFormat(number) {
    console.log(number);
    if (number.length == 4) {
      this.card.cardnumber = number + '-';

    } else if (number.length == 9) {
      this.card.cardnumber = number + '-';
    }else if (number.length == 14) {
      this.card.cardnumber = number + '-';
    }
  }
contactFormat(number){
  console.log(number);
  if(number.length == 3){
      this.card.contact = number+'-'
  } else if (number.length == 7){
      this.card.contact = number+'-';
  }
}

showToast(msg){ 
    var toast = this.toastCtrl.create({
              message: msg,
              duration: 2000,
              cssClass: 'toastCss',
              position: 'middle',
              // closeButtonText: 'ok'
    });
    toast.present();
}


public add_card(formdata) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem('USERID');
    var apt;
    if(formdata.value.apt != null){
      apt = formdata.value.apt;
    }else{
      apt = '';
    }
    var cardno = formdata.value.cardnumber.split('-');
  
    cardno = cardno[0]+cardno[1]+cardno[2]+cardno[3];
    var postdata = {
      uid: user_id,
      name: formdata.value.name,
      cardnumber: cardno,
      mmyy: formdata.value.mmyy,
      cvc:'', //formdata.value.cvc,
      username: formdata.value.username,
      address: formdata.value.address,
      apt: apt,
      status : 0,
      defaultcardstatus : this.defaultcardstatus,
      country: formdata.value.country,
      city: formdata.value.city,
      state: formdata.value.state,
      zipcode: formdata.value.zip,
      contact_number: formdata.value.contact
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);

    console.log(serialized);

   // return false;
    var Loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    Loading.present().then(()=>{
      this.http.post(this.appsetting.myGlobalVar + 'shop/useraddcards', serialized, options)
        .map(res => res.json()).subscribe(data => {
          Loading.dismiss();
          console.log('addresses : ', data);
          // this.addressList = data.data;
          this.navCtrl.push(CardPage); 
        }, err=>{
           Loading.dismiss();
           this.showToast('Oops. Something went wrong.');
        })
      })
 
}

// http://rakesh.crystalbiltech.com/fash/api/shop/useraddcards
  setDefault(value){
      console.log(value)
      if(value == true){
        this.default = true;
        this.defaultcardstatus = 1
        console.log(this.defaultcardstatus)
      } else {
        this.defaultcardstatus = 0
        this.default = false;
      }
  }

serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    return result.join("&");
}


 cardPage(){
    this.navCtrl.push(CardPage);
  }

}
