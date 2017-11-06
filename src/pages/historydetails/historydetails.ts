import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { ChatPage } from '../chat/chat';
import { FittingroomPage } from '../fittingroom/fittingroom';


@Component({
  selector: 'page-historydetails',
  templateUrl: 'historydetails.html'
})
export class HistorydetailsPage {
  public Historydetail;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController,
    public navParams: NavParams

  ) {
    var orderid = this.navParams.get('orderid');
    console.log(orderid);
    this.orderHistoryDetail(orderid);
  }

  orderHistoryDetail(orderid) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");

    var postdata = {
      id: orderid
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userorderdata', serialized, options).map(res => res.json()).subscribe(data => {
        console.log(data);
        Loading.dismiss();
        if (data.status == 0) {

          this.Historydetail = data.data;
        }

      })
    })
  }


  chatPage() {
    this.navCtrl.push(FittingroomPage);
  }

  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }


}
