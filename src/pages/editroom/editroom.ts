import { Component } from '@angular/core';
import {NavController, LoadingController, AlertController } from 'ionic-angular';
import { SearchPage } from '../search/search';
import { Appsetting } from '../../providers/appsetting';
import { Http, Headers, RequestOptions } from '@angular/http';
import {ChatPage} from '../chat/chat';

@Component({
  selector: 'page-editroom',
  templateUrl: 'editroom.html'
})
export class EditroomPage {
public friendslist:any = [];time;status;share_id
  constructor(
    public navCtrl: NavController,
    public appsetting:Appsetting,
    private http:Http
  ) {
this.friendlist();
  }

  /************function for getting friends list*********** */
public friendlist() {
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
        this.http.post(this.appsetting.myGlobalVar + 'lookbooks/usersfittingroomfriend', serialized, options).map(res => res.json()).subscribe(data => {
        //  Loading.dismiss();
          console.log(data)
          if(data.data != null){
          for (var i = 0; i < data.data.length; i++) {
            var date = data.data[i].Accept.created;
            var d = new Date(date);
            var hh = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();
            console.log('hours:' + hh); console.log("minute:" + m); console.log('seconds:' + s);
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
              h = hh - 12;
              dd = "PM";
            }
            if (h == 0) {
              h = 12;
            }
            console.log(h + ':' + m + ' ' + dd);
            this.time = h + ':' + m + ' ' + dd;
            data.data[i].Accept.time = this.time;
            console.log(data.data[i].Accept.isgroup);
            if (data.data[i].Accept.isgroup != 0) {
              console.log('if');
             
            
            }else if(data.data[i].Accept.groupid == user_id){
              console.log('else if');
               data.data[i].Users.time = this.time;
              this.friendslist.push(data.data[i].Users);
            
            } else {
              console.log('else');
              data.data[i].User.time = this.time;
              this.friendslist.push(data.data[i].User);
             
            }

          }
          }
          console.log(this.friendslist);

        })
        

  
  // });
  }

  chatPage(id) {
    var shareid = this.share_id;
    this.navCtrl.push(ChatPage, { chat_id: id, share_id: shareid });
  }
  serializeObj(obj) {
    var result = [];
    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

searchPage(){
    this.navCtrl.push(SearchPage);
  }

}
