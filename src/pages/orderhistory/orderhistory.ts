import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { HistorydetailsPage } from '../historydetails/historydetails';
import { HistoryviewPage } from '../historyview/historyview';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Appsetting } from '../../providers/appsetting';
import { ChatPage } from '../chat/chat';
import { FittingroomPage } from '../fittingroom/fittingroom';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'page-orderhistory',
  templateUrl: 'orderhistory.html'
})
export class OrderhistoryPage {
  public History; length;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public appsetting: Appsetting,
    public loadingCtrl: LoadingController

  ) {
    this.orderHistory();
  }

  orderHistory() {
    // alert("start")
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    let options = new RequestOptions({ headers: headers });
    var user_id = localStorage.getItem("USERID");
    var postdata = {
      userid: user_id
    };
    console.log(postdata);
    var serialized = this.serializeObj(postdata);
    var Loading = this.loadingCtrl.create({
      spinner: 'bubbles',
    });
    Loading.present().then(() => {
      this.http.post(this.appsetting.myGlobalVar + 'shop/userneworder', serialized, options).map(res => res.json()).subscribe(data => {
        console.log(data);
        Loading.dismiss();
        if (data.status == 0) {
          this.History = data.data;
          this.length = this.History.length;
          console.log(this.History.length);
        }

      })
    })
  }


  historydetailsPage(id) {
    console.log(id);
    this.navCtrl.push(HistorydetailsPage, { orderid: id });
  }
  historyviewPage() {
    this.navCtrl.push(HistoryviewPage);
  }
  chatPage() {
    this.navCtrl.push(FittingroomPage,{support:'true'});
  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }
}
