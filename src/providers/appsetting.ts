import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Appsetting provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Appsetting {
audio:any;interval:any;
palycyrretn:any;
tracks: any = [];
 myGlobalVar: string = 'http://fashapp.io/api/';//'http://ec2-13-59-151-198.us-east-2.compute.amazonaws.com/api/';//'http://fashapp.io/api/';
  constructor(public http: Http) {
    console.log('Hello Appsetting Provider');
  }
}
