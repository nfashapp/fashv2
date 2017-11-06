import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Appsetting } from '../../providers/appsetting';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http, Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'page-sportyfy',
  templateUrl: 'sportyfy.html'
})
export class SportyfyPage {

  constructor(
    public navCtrl: NavController,
    public appsetting: Appsetting,
    public inappBrowser: InAppBrowser,
    public http: Http,
  ) {

  }

  /************ function for spotify login ****************/
  logSpotify() {
    if (!localStorage.getItem('code')) {
      var loginurl = 'https://accounts.spotify.com/authorize/?client_id=d1c1031c1b214739a9ba672e90cd2798&response_type=code&redirect_uri=https://rakesh.crystalbiltech.com&scope=';
      var target = '_blank';
      var options = 'location=no';
      var openspotify = this.inappBrowser.create(loginurl, target, options);
      console.log(loginurl);
      console.log(target);
      console.log(openspotify);
      
      openspotify.on('loadstart').subscribe((e) => {
      //  alert(e)
        console.log(e);
        let url = e.url;
        console.log(url);

        var redirect_uri = e.url.split('code=');
        console.log(redirect_uri);
      //  alert(redirect_uri[0]);
        if (redirect_uri[0] == 'https://rakesh.crystalbiltech.com/?') {
          let code = redirect_uri[1];
        //  alert('code--->' + code);
          console.log(code);
          localStorage.setItem('code', code);
          openspotify.close();
        }
      }, err => {
        console.log("InAppBrowser loadstart Event Error: " + err);
       // alert(err)
      });

      openspotify.on('exit').subscribe((e) => {
        var code = localStorage.getItem('code');
        this.getToken(code);
      })
    } else {
     // alert('token found');
      var code = localStorage.getItem('code');
      this.getToken(code);
    }
  }

  /********** function for get token from spotify ***********/
  private getToken(code) {

   // alert('you are here ....');
   // alert(code)
    var url: "https://accounts.spotify.com/api/token";
    this.http.get(this.appsetting.myGlobalVar + 'cities/spotifytoken').map(res => res.json()).subscribe(data => {
     // alert('success');
     // alert(JSON.stringify(data));
      localStorage.setItem('accessToken',data.access_token);
      localStorage.setItem('tokenType',data.token_type);
      // this.response = data.data;
      this.navCtrl.push(TabsPage);
    },
      err => {
       // alert(JSON.stringify(err));
       // alert('err' + JSON.stringify(err))
      })

  }
  tabsPage(){
   this.navCtrl.push(TabsPage);
  }

}
