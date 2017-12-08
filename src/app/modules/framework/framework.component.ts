import { Component, OnInit, OnDestroy, Output, Input, HostListener } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../shared/outer-services/storage.service';
import { Utilities } from '../../shared/outer-services/utilities.service';
import { FrameworkConfigState } from "../../state-management/state/main-state";

import { getRouteConfig } from '../../route.config';
import { routeObj } from '../../shared/constants/app.constants';
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from '../../shared/outer-services/event-dispatch.service';

import { Store, Action } from '@ngrx/store';

// import { FETCHDATA, LangState } from '../../ngrx/counter';


import { StoreService } from '../../state-management/services/store-service';

@Component({
    selector: 'PLP-framework',
    templateUrl: './framework.layout.html'
})
export class FrameworkComponent implements OnInit, OnDestroy {

    componentTypes: any[];
    initPLPContent = 'personalInfo';
    initAssessmentContent = 'tiles';
    initOccContent = 'occIndex';
    menuItems = [];
    accountId = '';
    appTitle = '';
    hideFilter = true;
    clickBtn = false;
    selectedLang = "";
    changedLang = ''
    userName = "";
    userObj;
    headerFooterObj;
    subscription = new Subscription();
    subscription1 = new Subscription();
    //public supportedLanguages: any[];
    constructor(private store: Store<FrameworkConfigState>, private commonlang: StoreService, private utils: Utilities,
        private router: Router, private storageService: StorageService, private dispatchStore: Store<Action>,
        private activatedRoute: ActivatedRoute, private eventService: EventDispatchService) {
        // Default data initialization


        this.subscription = this.eventService.listen().subscribe((e) => {
            if (e.type.indexOf('&PLPSectionName') != -1) {
                let name = e.type.split('&');
                this.userName = name[0];
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription1.unsubscribe();
    }
    ngOnInit(): void {
        this.accountId = this.utils.getAccountId();
        // this.subscribeToLangChanged(); // subscribe to language changes
        // let frameConfig = this.store.select('FrameworkConfigReducer');//this.utils.sessionStorageGet('loginFrameworkConfiguration');
        this.subscription1 = this.store.select('FrameworkConfigReducer').subscribe((v) => {
            // console.log("framework subscribed data--->" + JSON.stringify(v));
            let frameConfig = v['config']['Result'];
            if (frameConfig !== undefined && frameConfig !== null) {
                // console.log("framework component frameConfig is:" + JSON.stringify(frameConfig));
                // const newtemproute = getRouteConfig(JSON.parse(frameConfig));
                // this.router.resetConfig(newtemproute);
                // let framework = (frameConfig);
                let res = frameConfig;
                this.menuItems = [];
                this.headerFooterObj = res.headerFooter;

                document.title = this.headerFooterObj.appName;
                this.appTitle = this.headerFooterObj.appName;
                this.userObj = res.user;

                // this.userObj.supportedLanguages = res.user.langList;
                let langArr = [];
                /*  this.supportedLanguages = [
                      { display: 'English', value: 'en' },
                      { display: 'Español', value: 'es' },
                      { display: 'Chinese', value: 'zh' }
                  ];*/
                langArr = JSON.parse(this.storageService.sessionStorageGet("langAssArr"));
                let langSet = this.storageService.sessionStorageGet("langset");
                if (langSet == null || langSet + '' == 'undefined') {
                    let tmpObj = this.userObj.langList.find((val, inx) => {
                        return (val.lang == res.user.prefLang);
                    })
                    {
                        this.changedLang = tmpObj.name;
                        this.storageService.sessionStorageSet("langset", tmpObj.lang);
                    }
                }
                else {
                    // console.log("coming in else----");
                    let ref = this;
                    this.userObj.langList.forEach(function (index, val) {
                        if (index.lang == langSet) {
                            ref.changedLang = index.name;
                        }
                    })
                }


                res.tabItems.forEach(function (obj, inx) {
                    let tmpobj = {};
                    //alert("obj.moduleId--->" + JSON.stringify(obj));
                    if (obj.tabId != undefined) {

                        tmpobj['title'] = this.headerFooterObj.tabs[inx].tabName;

                        if (obj.layout == 'tiles' || obj.defaultComp == 'landing') {
                            tmpobj['subroute'] = 'tiles';
                        }
                        else if (obj.defaultComp != "") {
                            tmpobj['subroute'] = routeObj[obj.defaultComp].itemConfig.url;
                        }
                        else {
                            tmpobj['subroute'] = routeObj[obj.compList[0].moduleId].itemConfig.url;
                        }

                        tmpobj['root'] = obj.tabId;
                        this.menuItems.push(tmpobj);
                        // console.log('menuItem inside framework:' + JSON.stringify(this.menuItems));
                    }

                }.bind(this))
            }

        });


        // alert("this.menuItems---->"+this.menuItems[0].root);
    }

    @HostListener('window:mousedown', ['$event'])
    onmousedown(event) {
        // console.log("coming in onmousedown evnts");
        const currentDate = new Date();
        const currentSeconds = currentDate.getTime();
        this.storageService.sessionStorageSet('currentSec', currentSeconds + '');

    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: any) {
        // console.log("coming in keyboardInput evnts");
        this.onmousedown(event);
    }

    hideFil(val) {
        this.storageService.sessionStorageSet('careerShow', '0');
        if (window.innerWidth < 767) {
            this.clickBtn = true;
            if (val == 'btn') {
                if (this.hideFilter == true) {
                    this.hideFilter = false;
                    this.clickBtn = true;
                } else if (this.hideFilter == false) {
                    this.hideFilter = true;
                    this.clickBtn = false;
                }
            }
            else if (val == 'bar') {
                if (this.hideFilter == false && window.innerWidth < 767) {
                    this.hideFilter = true;
                    this.clickBtn = false;
                }
            }
        }
    }
    logout() {
        this.storageService.mainLogOut();
    }

    isActive(instruction: any[]): boolean {
        let v1 = this.router.isActive(this.router.createUrlTree(['framework/' + instruction]), true);
        let v2 = this.router.isActive(this.router.createUrlTree(['framework/' + instruction]), false);
        //console.log('createUrltree :' + this.router.createUrlTree(instruction) + ' isactive true:' + v1 + ' isactive false:' + v2 + ' instruction:' + instruction);
        return v2;
    }
    userDataChanged(evnt) {
        // this.username=  this.utils.sessionStorageGet("userName");
        // this.username = evnt.username;
        //  alert("this.username----->"+this.username);
    }

    loadModules(item) {

        document.title = this.appTitle;
        //  console.log('document.title:' + document.title);
        //  console.log('framework component called root url:' + item.root + ' subroute:' + item.subroute);
        this.router.navigate(['./' + item.root + '/' + item.subroute], { relativeTo: this.activatedRoute });
    }

    selectLang(langObj) {

        var ref = this;
        if (ref.changedLang != langObj.name) {

            setTimeout(function () {
                let evnt = document.createEvent("CustomEvent");
                evnt.initEvent("languageChanged", true, true);
                ref.eventService.dispatch(evnt);
            }.bind(this), 100);

            ref.changedLang = langObj.name;
            ref.storageService.sessionStorageSet('langset', langObj.lang);
            // console.log('in selectLang');

            let payloajson = {
                type: "OCC_INDEX_STORE_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Occ/v1/',
                    path_params: ['index', this.utils.getAccountId()], query_params: { "lang": langObj.lang },
                    body_Params: {}, endUrlVal: 'pages'
                }
            }
            this.commonlang.commonLanguageChange(langObj.lang, 'OCC_index_list', payloajson);

            this.dispatchStore.dispatch({
                type: "OCC_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Occ/v1/',
                    path_params: ["text"], query_params: { "lang": langObj.lang },
                    body_Params: {}, endUrlVal: 'pages'
                }
            });
            // this.commonlang.commonLanguageChange(langObj.lang, 'occText', payloajson);


            this.dispatchStore.dispatch({
                type: "GET_HEADERFOOTER_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Settings/v1/',
                    path_params: ['headerFooter', this.accountId], query_params: { 'lang': langObj.lang },
                    body_Params: {}, endUrlVal: 'framework',
                }
            });
            // this.commonlang.commonLanguageChange(langObj.lang, 'headerfooter', payloadjson);

            this.dispatchStore.dispatch({
                type: "GET_TABITEMS_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Settings/v1/',
                    path_params: ['tabItems', this.accountId], query_params: { 'lang': langObj.lang },
                    body_Params: {}, endUrlVal: 'framework',
                }
            });
            // this.commonlang.commonLanguageChange(langObj.lang, 'tabitems', payloadjson1);




            //   }
            //})
            //  console.log("select lang----->" + this.utils.sessionStorageGet("langset"));
            let factorArr = {};
            factorArr = JSON.parse(this.storageService.sessionStorageGet("testArr"));
        }
    }

}