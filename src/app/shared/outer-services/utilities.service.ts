import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { NgbdModalContent, NgbdModalLoaderContent } from '../modal/shared-modal-component';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from "rxjs/Subscription";

import { EventDispatchService } from './event-dispatch.service';

import { Http, Response } from '@angular/http';
import { routeObj, returnUrl } from '../constants/app.constants';
import { messages } from '../constants/messages';

import { TilesDynamicComponent } from '../../modules/framework/layouts/tiles.component';
import { WidgetDynamicComponent } from '../../modules/framework/layouts/widget.component';
import { ListDynamicComponent } from '../../modules/framework/layouts/list.component';
import { Store } from '@ngrx/store';
import { AsmntCommonState, defaultCommonText } from '../../state-management/state/main-state';
import { StorageService } from '../outer-services/storage.service';

let errCall;
/* dialog is reference of loading model template.*/

@Injectable()
export class Utilities {

    subscription = new Subscription;
    options: NgbModalOptions = {
        backdrop: 'static',
    };
    timeoutVariable;
    modalRef1;
    commonModelText;
    frameworkConfig;
    /** This function is for logging out of the modules. */
    handleError = function (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // alert("error in outer---->" + JSON.stringify(error))
        // window.localStorage.removeItem("error");
        window.sessionStorage.removeItem("error");
        clearTimeout(errCall);
        errCall = setTimeout(function () {
            try {
                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                // console.error("errMsg--->" + errMsg + "----error----->" + JSON.stringify(error)); // log to console instead
                // console.error("handle error error.name:" + error.name + "error.status:" + error.status);
                if (error.name === "TokenExpiredError") {
                    this.activeModel.close(true);
                    // this.callsave();
                    // this.showModal("Sorry an error occurred");
                    this.sessionExpired();
                }
                else if (error.status + "" === "401") {
                    // this.showModal("Sorry an error occurred");
                    // this.callsave();
                    this.activeModel.close(true);
                    // this.modalServic
                    this.sessionExpired();
                } else {
                    // this.showModal("Sorry an error occurred");
                    this.callsave();
                }
            } catch (e) {
                console.log('Handle error exception:' + e.message);
            }
            //alert("error is:"+errMsg);
        }.bind(this), 0);
    }.bind(this);
    constructor(private store: Store<AsmntCommonState>, private router: Router, private http: Http,
        private modalService: NgbModal, private activeModel: NgbActiveModal, private eventService: EventDispatchService,
        private loaderContent: NgbdModalLoaderContent, private storageService: StorageService) {
        this.commonModelText = store.select('AsmntCommonText');
        /* this.subscription = eventService.listen().subscribe((e) => {
             // After event listen it will check whether user want to save partially or completely 
             console.log("Utilities Subscription event called:" + e.type);
         });*/

        this.store.select('FrameworkConfigReducer').subscribe((v) => {
            this.frameworkConfig = v;
        });
    }



    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getFrameworkComponent(moduleName) {
        let frame;
        // console.log('inside getFrameworkComponent:' + JSON.stringify(this.frameworkConfig));
        // let framework = JSON.parse(this.sessionStorageGet('loginFrameworkConfiguration'));
        this.frameworkConfig.config.Result.tabItems.forEach(function (obj, inx) {
            // console.log('getFrameworkComponent module is:' + JSON.stringify(obj));
            //  console.log('inside getFrameworkComponent obj.tabId === moduleName:' + (obj.tabId + '' === moduleName + '') + ':moduleName:' + moduleName);
            if (obj.tabId + '' === moduleName + '') {
                frame = obj;
                if (obj.layout === 'widget') {
                    frame['component'] = WidgetDynamicComponent;
                } else if (obj.layout === 'tiles') {
                    frame['component'] = TilesDynamicComponent;
                } else if (obj.layout === 'dashboard') {
                    frame['component'] = ListDynamicComponent;
                }
            }
        });
        return frame;
    }

    dispatchSectionLoad(name) {
        // this.ItemName = 'plpWidget&' + name;

        var evnt = document.createEvent("CustomEvent");
        evnt.initEvent(name, true, true);
        this.eventService.dispatch(evnt);
        //  alert("In utilities dispatchSectionLoad name:" + name);
    }

    getItemsList(frameworkObj, status) {
        let list = [], result = {};

        frameworkObj.compList.forEach(function (obj, inx) {
            // console.log('getItemsList obj:' + JSON.stringify(obj) + ':routeObj:' + JSON.stringify(routeObj[obj.compId]));
            if (routeObj[obj.compId] !== undefined) {
                let result = Object.assign({}, routeObj[obj.compId].itemConfig, obj);
                //console.log('getItemsList inside after join:' + JSON.stringify(result));
                // list.push(result);
                frameworkObj.compList[inx] = result;
            }
        });

        frameworkObj['menuHighlightStatus'] = status;
        //    'menuItems': list

        // console.log('getItemsList final Obj:' + JSON.stringify(frameworkObj));
        return frameworkObj;
    }




    /** For showing loading symbol */
    showLoading() {
        // this.waitingDialog.show('', { dialogSize: 'sm', progressType: 'warning' });
        //console.log('Show loading called.');
        this.loaderContent.showLoading();
    }

    /** For hiding loading symbol */
    hideLoading() {
        // this.waitingDialog.hide();
        //console.log('Hide loading called.');
        this.loaderContent.hideLoading();
    }



    hideModal() {
        //this.waitingDialog.hide();
    }


    // open(text) {
    //     // console.log('open')
    //     //console.log("testing text-->"+text);
    //     const modalRef = this.modalService.open(NgbdModalContent);
    //     modalRef.componentInstance.name = 'World';
    //     modalRef.componentInstance.transVal = text;
    // }
    //Call error modalpopup
    //Call error modalpopup
    callsave() {
        // console.log('callsave')
        // this.sessionStorageSet("action", "close");
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        modalRef.componentInstance.trans_error = 'Error'; //this.commonModelText.error; 
        modalRef.componentInstance.close = 'Close';
        modalRef.componentInstance.err_occ = 'Sorry an error occured';
        modalRef.componentInstance.Closebtnvalue = '1';

    }
    //call testScore "are you sure to delete" modalpopup
    callAlertSure(inx, testarray, testMobArray) {
        // console.log('callAlertSure')
        // this.commonModelText = this.store.select('AsmntCommonText');
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        modalRef.componentInstance.deletevalue = inx;
        modalRef.componentInstance.arrayValue = testarray;
        modalRef.componentInstance.arrayMobValue = testMobArray;
        modalRef.componentInstance.commonButtons = { headsection: 'alert', yesbtn: 'yes', nobtn: 'no' };
        // modalRef.componentInstance.headsection = this.commonModelText.commonText.alert;
        // modalRef.componentInstance.yesbtn = this.commonModelText.commonText.yes;
        // modalRef.componentInstance.nobtn = this.commonModelText.commonText.no;
        modalRef.componentInstance.err_occ = 'Are you sure you want to delete?';
        //modalRef.dismiss();

    }
    //call when session expired modalpopup
    openModalForSession() {
        // console.log('openModalForSession')
        // this.commonModelText = this.store.select('AsmntCommonText');
        this.modalRef1 = this.modalService.open(NgbdModalContent, this.options);
        this.modalRef1.componentInstance.commonButtons = { yesbtn: 'yes', nobtn: 'no', headerText: 'Session Expired' };
        // this.modalRef1.componentInstance.headerText = 'Session Expired';
        this.modalRef1.componentInstance.session_exp_txt = 'Your session will expire in 2 minutes. Do you wish to continue?';
        this.modalRef1.componentInstance.sessionName = "sessioncheck";
        this.setClearTime();
    }
    setClearTime() {
        clearTimeout(this.timeoutVariable);
        this.timeoutVariable = setTimeout(function () {
            this.modalRef1.close();
            this.sessionExpired();

        }.bind(this), 2 * 60 * 1000);
    }

    clearTimeoutVariable() {
        // alert("clearTimeoutVariable");
        //  this.modalRef1.close();
        clearTimeout(this.timeoutVariable);
    }
    sessionExpired() {

        this.storageService.sessionStorageSet('sessionExpired', 'true');
        this.storageService.exitApp('expired');

    }
    getFramework() {
        //framework = [];
        this.http.get('/assets/frameworkJSON.json').map((res: Response) => res.json())
            .subscribe(
            data => { this.storageService.sessionStorageSet('loginFrameworkConfiguration', JSON.stringify(data)); },
            err => console.error(err)
            );
        // return framework;
    }


    setAccountId(id) {
        return this.storageService.sessionStorageSet('accountID', id);
    }
    getAccountId() {
        return this.storageService.sessionStorageGet('accountID');
    }

    setAuthKey(key) {
        return this.storageService.sessionStorageSet('auth_key', key);
    }
    getAuthKey() {
        return this.storageService.sessionStorageGet('auth_key');
    }


    getReturnUrl() {
        return returnUrl.url;
    }

    getMessages() {
        //  alert("all messages:"+JSON.stringify(this.messages));
        return messages;
    }


}



