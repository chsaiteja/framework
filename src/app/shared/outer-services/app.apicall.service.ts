
/** Angular imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

/** rxjs imports */
// import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';


/** Third party imports  */

import { ApiCallClass } from '../modal/apicall.modal';
import { StorageService } from '../outer-services/storage.service';
import { Utilities } from './utilities.service';
import { EventDispatchService } from './event-dispatch.service';


let expiredTime, eventTime;

@Injectable()
export class ServerApi {

    newSessionId;
    sessionOutTime;
    transText = {};
    subscription = new Subscription;
    constructor(private http: Http, private router: Router,
        private utils: Utilities, private storageService: StorageService, private eventService: EventDispatchService) {
        this.subscription = eventService.listen().subscribe((e) => {
            /** After event listen it will check whether user want to save partially or completely */
            if (e.type == 'sessionExtend') {

                this.extendTime(eventTime);
                this.utils.clearTimeoutVariable();
                // console.log('event time in if block  :'+eventTime);
            }
            // console.log('Utilities Subscription event called:' + e.type);
        });
    }



    callAuthApi(data): Observable<any> {


        if (data[0].method == 'POST') {
            let headers = new Headers({ 'Content-Type': 'application/json' });

            let options = new RequestOptions({ headers: headers });
            try {
                return this.http.post('/auth/authPost', { data: data[0] }, options)
                    .map(this.extractAuthData);
            }
            catch (e) {
                alert('post exception:' + e.message);
            }
        }
        else {

            let observableBatch = [];
            try {
                let headers = new Headers({ 'Cache-Control': 'no-cache' });

                let options = new RequestOptions({ headers: headers });
                data.forEach((componentarray, inx) => {

                    let str = Object.keys(componentarray).map(function (key) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(componentarray[key]);
                    }).join('&');
                    observableBatch.push(this.http.get('/auth/authGet?' + str).map(this.extractAuthData));
                });
            } catch (e) {
                alert('callAuthApi exception:' + e.message);
            }
            return Observable.forkJoin<any>(observableBatch);
        }

    }

    extractAuthData(res: Response) {
        let body = res.json();
        return body || {};
    }

    callLogin(data): Observable<any> {
        // try {
        let str = Object.keys(data).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return this.http.get('/loginApi/' + data.endUrl + '?' + str).map(this.extractData);
        //   }

    }

    //This service is called each time the client tries to hit the server api after login
    callApi(data): Observable<any> {

        // alert('call with data:' + JSON.stringify(data));

        if (data[0].method == 'POST') {
            let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.utils.getAuthKey() });

            let options = new RequestOptions({ headers: headers });
            try {
                return this.http.post('/api/postCall', { data: data[0] }, options)
                    .map(this.extractData);
            }
            catch (e) {
                alert('post exception:' + e.message);
            }
        }
        else {
            let observableBatch = [];
            try {
                let headers = new Headers({ 'Cache-Control': 'no-cache', 'Authorization': 'Bearer ' + this.utils.getAuthKey() });
                let options = new RequestOptions({ headers: headers });
                data.forEach((componentarray, inx) => {

                    let str = Object.keys(componentarray).map(function (key) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(componentarray[key]);
                    }).join('&');
                    // console.log('str--->'+str+'----componentarray---->'+componentarray);
                    observableBatch.push(this.http.get('/api/getCall?' + str, options).map(this.extractData));
                    //.subscribe(data => { alert(data);},  this.handleError,  () => console.log('done'))
                });
            }
            catch (e) {
                alert('post exception:' + e.message);
            }
            return Observable.forkJoin<any>(observableBatch);
        }

    }
    public extractData = function (res: Response) {
        let body = res.json();
        //console.log('succes bodey-->'+JSON.stringify(body));
        eventTime = body.eventTime;
        this.storageService.sessionStorageSet('auth_key', body.sessionID);
        try {
            this.extendExpiration(body, eventTime, this);
        } catch (e) {
            console.log('exc==>' + e.message);
        }


        return body || {};
    }.bind(this);

    sessionExpiry() {
        this.sessionExpired();
    }


    extendExpiration = function (body, sec, ref) {
        if (body.Success + '' == 'true') {
            //console.log("new session--->" + this.storageService.sessionStorageGet('auth_key'));
            clearTimeout(expiredTime);
            expiredTime = setTimeout(function () {
                let authkey = this.utils.getAuthKey();
                // console.log("authkey-->" + authkey);
                if (authkey != "" && authkey != undefined && authkey != null) {
                    let newtime = new Date().getTime();
                    let oldtime = parseInt(this.storageService.sessionStorageGet('currentSec'));
                    let diff = newtime - oldtime;
                    //  console.log("newtime-->" + newtime + "     oldtime-->" + oldtime + "  diff-->" + diff);

                    // console.log('called setTimeot()');
                    if (diff >= eventTime) {

                        //  ref.popUpDialog.show(ref);
                        this.utils.openModalForSession();
                    }
                    else {
                        //  console.log("called else");

                        this.extendTime(eventTime - diff);
                    }
                }

            }.bind(this), parseInt(sec));
        }
        return body;
    }.bind(this);

    extendTime = function (sec) {
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', '/api/extendTime', true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + this.storageService.sessionStorageGet('auth_key'))

        // xhttp.open('GET', '/api/extendTime?sessionID=' + this.storageService.sessionStorageGet('auth_key'), true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var newSessionId = JSON.parse(xhttp.responseText);
                newSessionId.Success = 'true';
                this.storageService.sessionStorageRemove('auth_key');
                this.storageService.sessionStorageSet('auth_key', newSessionId.sessionID);
                this.extendExpiration(newSessionId, sec, this);
            } else if (xhttp.status == 400) {
                this.sessionExpired();
            }
        }.bind(this);
    }.bind(this);

    sessionExpired = function () {
        this.utils.sessionExpired();
        /*this.utils.sessionStorageSet('sessionExp', 'true');

        let logoutURL = this.utils.sessionStorageGet('LogoutURL');
        if (logoutURL != '' && logoutURL != null && logoutURL != undefined) {
            this.router.navigateByUrl(logoutURL);
        }
        else {
            this.router.navigateByUrl('login/loginForm?status=expired');// window.location.href = 'login/loginForm?status=expired';
        }*/

    }.bind(this);

    ngOnDestroy() {
        //window.location.href.replace(location.hash, "");
        this.subscription.unsubscribe();
    }
}


