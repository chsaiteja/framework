import { Component, Input, Renderer, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { StoreSharedService } from "../../../../shared/outer-services/store-shared.service";
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { AssessmentHeaderComponent } from '../../shared/assessment-header/assessment-header.component';
import { clusterDetails } from '../constants/assessments-constants';
import { AssessmentsService } from '../services/assessments.service';
import { Store, Action } from '@ngrx/store';
import { StoreService } from '../../../../state-management/services/store-service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Subscription } from 'rxjs/Subscription';
import { WILOccListComponent } from "../../work-importance-locator/occlist/wil-occ-list.component";
import { AsmntCommonState, OccIndexCommonState } from '../../../../state-management/state/main-state';

@Component({
    selector: 'occupation-list',
    templateUrl: './occupation-list.layout.html',
})

export class OccupationListComponent implements OnInit, OnDestroy {
    @Input() occListData = [];
    @ViewChild('inner') dataContainer: ElementRef;
    /**   variable comment */
    why = 'false';
    whynot = 'true';
    titlelist = [];
    buttonData: Object;
    liTag;
    titleVal = [];
    titlesum = 20;
    alphaStyle;
    occName;
    clusterhide = true;
    titlehide = false;
    imghide = true;
    selectTostVal = '';
    compareImg = false;
    langChange = false;
    hidenav = false;
    compareOccupation = false;
    dom: BrowserDomAdapter;
    occID = '';
    Occname = '';
    ClusName = [];
    indexOccId = [];
    indexTitleName = [];
    clusIconValue = [];
    filterSearch = 'false';
    cluBgColor = [];
    filter = 999;
    isActiveprime = false;
    isActive = true;
    occIdValues = [];
    occClusValues = [];
    moduleNameIs = this.storageService.sessionStorageGet('module');
    search = { text: '', rating: [], wages: [], edu: [] };
    filtersearch = { text: '', rating: [], wages: [], edu: [] };
    careerheader;
    educationheader;
    wageheader;
    ratingoptions: any = [];
    eduoptions = [];
    wageoptions = [];
    countvalue = -1;
    showBtn = 0;
    showImg = -1;
    show = 1;
    iconInxVal = 0;
    filtericon = ['fa fa-filter', 'fa fa-times'];
    // headerValue: any = { headers: [] };
    FilterName;
    indexValue: any = { buttons: [] };
    searchBox = true;
    accountId;
    langVal;
    clusterValues;
    occIndexReduTxt;
    parentCnt = -1;
    occTxtVal;
    osintroVal;
    resultChart = [];
    graphVal;
    // headingForTwo = '';
    occIndexListText;
    subscription = new Subscription;
    occTextSub = new Subscription;
    occIndexReducerSub = new Subscription;
    listNameTextSub = new Subscription;
    allOcclistSub = new Subscription;
    constructor(private router: Router, private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>, private commonlang: StoreService, private activatedRoute: ActivatedRoute, private utils: Utilities, private trackEnt: AssessmentsService,
        private apiJson1: ApiCallClass, private apiJson: ApiCallClass, private storeService: StoreSharedService, private serverApi: ServerApi, private renderer: Renderer, private storageService: StorageService,
        private assessOccFunction: AssessmentHeaderComponent, private occStore: Store<OccIndexCommonState>, private elementref: ElementRef, private eventService: EventDispatchService) {
        this.dom = new BrowserDomAdapter();
        this.langVal = this.storageService.sessionStorageGet('langset');
        // this.store.select('AsmntIntroText').subscribe((v) => {
        //     this.graphVal = v
        // });
        /* The below subscribe is when title list is return 0 it can catch the event from filter-searchpipe.ts. event name is 'keycount'*/
        this.subscription = eventService.listen().subscribe((e) => {
            if (e.type == 'keycount') {
                this.countvalue = 0;
            } else if (e.type == 'itemcount') {
                this.countvalue = 1;
            }
            if (e.type == 'languageChanged') {
                this.ClusName = [];
                this.titlelist = [];
                this.langVal = this.storageService.sessionStorageGet('langset');
                this.utils.showLoading();
                this.langChange = true;
                // let Arr = this.router.url.split('?');
                let routArr = this.router.url.split('/');
                // if (routArr.indexOf('assessment') != -1) {
                this.ngOnInit()
                // }
            }
        });
        this.occTextSub = store.select('OccText').subscribe((v) => {
            if (this.langChange == true) {
                this.occIndexListText = v;
            }

        });
        this.osintroVal = store.select('AsmntIntroText');
        this.allOcclistSub = store.select('GetAllOccList').subscribe((v) => {
            let val: any = v;
            if (val != undefined) {
                this.occIndexReduTxt = v
                if (this.storageService.sessionStorageGet('parentCnt') == '') {
                    this.showImg = -1;
                } else if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
                    this.showImg = 1;
                    // console.log('this.occIndexReduTxt in oc list : ' + JSON.stringify(this.occIndexReduTxt))
                } else if (this.storageService.sessionStorageGet('parentCnt') == 'false') {
                    this.showImg = 0;
                }
                this.utils.hideLoading();
            }
        });
        this.occIndexReducerSub = occStore.select('OccIndexReducerText').subscribe((v) => {
            if (this.langChange == true) {
                if (this.storageService.sessionStorageGet('parentCnt') == '') {
                    this.showImg = -1;
                } else if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
                    let data = JSON.parse(this.storageService.sessionStorageGet('resDataVal'))
                    this.getOccListData(data);

                } else if (this.storageService.sessionStorageGet('parentCnt') == 'false') {
                    this.showImg = 0;
                }
            }
        });

    }

    ngOnInit() {
        this.storageService.sessionStorageRemove('occId');
        this.storageService.sessionStorageRemove('getListForAll');
        this.compareOccupation = false;
        this.storageService.sessionStorageSet('checkNotOccList', 'false');
        if (this.storageService.sessionStorageGet('module') != 'os') {
            this.compareImg = true;
            this.why = 'false';
            this.whynot = 'false';
        } else {
            this.compareImg = false;
            this.why = 'true';
            this.whynot = 'false';
        }
        this.clusterValues = clusterDetails;
        let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
        if (val.commonText.common != undefined) {
            this.occIndexListText = val;
        }

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.occTextSub.unsubscribe();
        this.allOcclistSub.unsubscribe();
        this.listNameTextSub.unsubscribe();
    }
    setFilterVal(filtername, val) {
        let isAvailable = false;
        let inx1 = -1;
        for (let i = 0; i < this.search[filtername].length; i++) {

            if (val == this.search[filtername][i]) {
                isAvailable = true;
                inx1 = i;
                break;
            }
            else {
                isAvailable = false;
            }
        }
        if (isAvailable == false) {
            this.search[filtername].push(val);
            // this.indexTitleName.push(name);
            isAvailable = true;
        }
        else {
            this.search[filtername].splice(inx1, 1);
        }

    }
    changeText() {
        this.occIndexReduTxt = this.storeService.filterListData({
            text: this.search.text, edu: this.search.edu,
            rating: this.search.rating, wages: this.search.wages,
            module: 'occ_list'
        }, 'occ');
        if (this.occIndexReduTxt.commonText.occList.length == 0) {
            this.showImg = 0;
        } else {
            this.showImg = 1;
        }
        this.iconInxVal = 0;
        this.searchBox = true;
    }
    /* Code for based on child title count display message 'There is no cluster list avaiable'*/
    incrementCount(val: Number) {
        this.parentCnt = this.parentCnt.valueOf() + val.valueOf();
    }
    clearParentVal() {
        this.parentCnt = 0;
    }
    /** Used to display the list from where user compared occupation */
    inListOcc(checklist) {
        this.search = { text: '', rating: [], wages: [], edu: [] };
        this.filtersearch = { text: '', rating: [], wages: [], edu: [] };
        this.ClusName = [];
        this.titlelist = [];
        this.clusIconValue = [];
        this.cluBgColor = [];
        this.alphaStyle = this.storageService.sessionStorageGet('module');
        if (this.storageService.sessionStorageGet('returnName') == 'clus') {
            this.clusterListFun('cluster');
        } else {
            this.clusterListFun('title');
        }
        this.storageService.sessionStorageSet('isWhy', '');
        this.storageService.sessionStorageSet('isNotWhy', '');
        const ref = this;
        const whyList = JSON.parse(this.storageService.sessionStorageGet('osOccList'));
        if (checklist == 'true' && whyList != null) {
            this.whynot = 'true';
            this.why = 'false';
            this.storageService.sessionStorageSet('checkNotOccList', 'false');
            // this.ClusName = JSON.parse(this.utils.sessionStorageGet('yOccListclus'));
            // this.titlelist = JSON.parse(this.utils.sessionStorageGet('yOccListtitle'));
            let osVal = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList'));
            if (JSON.stringify(osVal) != 'null') {
                let val = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList')).commonText;
                if (val.clusList.length == 0 || val.occList.length == 0) {
                    this.storageService.sessionStorageSet('parentCnt', 'false');
                }
                this.dispatchStore.dispatch({ type: "OCC_LIST_WHY_EFFECT", payload: val });
            }
            else {
                this.dispatchNull('OCC_LIST_WHY_EFFECT')
            }
            this.show = 1;
            this.why = 'true';
            this.getClusterValues(ref.ClusName);
            this.isActive = true;
        } else if (checklist != 'true') {
            this.why = 'true';
            this.whynot = 'false';
            this.storageService.sessionStorageSet('checkNotOccList', 'true');
            // this.ClusName = JSON.parse(this.utils.sessionStorageGet('ynOccListclus'));
            // this.titlelist = JSON.parse(this.utils.sessionStorageGet('ynOccListtitle'));
            let osVal = JSON.parse(this.storageService.sessionStorageGet('OSNotOnMyList'));
            if (JSON.stringify(osVal) != 'null') {

                let val = JSON.parse(this.storageService.sessionStorageGet('OSNotOnMyList')).commonText;
                if (val.clusList.length == 0 || val.occList.length == 0) {
                    this.storageService.sessionStorageSet('parentCnt', 'false');
                }
                // if (val.clusList.length != 0 || val.occList.length != 0) {
                this.dispatchStore.dispatch({ type: "OCC_LIST_WHYNOT_EFFECT", payload: val });
            }
            else {
                this.dispatchNull('OCC_LIST_WHYNOT_EFFECT')
            }
            this.show = 0;
            this.why = 'false';
            this.getClusterValues(ref.ClusName);
            this.isActive = false;
        } else {
            this.whyOccList();
        }
    }

    /** Code commented starts why and whtnot */
    callOccDetail(occID, occName, clusterId) {
        if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
            && this.indexOccId.indexOf(occID) != -1)) {
            const twoDigit = occID.toString().substr(0, 2);
            let clusterIcon;
            let backGroundClr;
            let value = this.trackEnt.clustDetails(clusterId);
            clusterIcon = value.clusterIconValue;
            backGroundClr = value.clusterBgColor;
            if (this.storageService.sessionStorageGet('module') != 'os') {
                this.storageService.sessionStorageSet('inTab', 'Assess');
            } else {
                this.storageService.sessionStorageSet('inTab', 'osAssess');

            }
            if (twoDigit == 14) {
                this.router.navigate(['../occEmergCareer'], {
                    relativeTo: this.activatedRoute,
                    queryParams: { occid: occID, occname: occName, clusIcon: clusterIcon, clusColor: backGroundClr }
                });
            } else {
                this.router.navigate(['../occCareer'], {
                    relativeTo: this.activatedRoute,
                    queryParams: { occid: occID, occname: occName }
                });
            }
        }
    }

    callOccDetailCluster(clusterId, ClusterName, clusterIcon) {
        if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
            && this.indexOccId.indexOf(clusterId) != -1)) {
            this.utils.showLoading();
            let clusterIcon;
            let backGroundClr;
            let value = this.trackEnt.clustDetails(clusterId);
            clusterIcon = value.clusterIconValue;
            backGroundClr = value.clusterBgColor;
            if (this.storageService.sessionStorageGet('module') != 'os') {
                this.storageService.sessionStorageSet('inTab', 'Assess');
            } else {
                this.storageService.sessionStorageSet('inTab', 'osAssess');
            }
            this.router.navigate(['../occCluster'], {
                relativeTo: this.activatedRoute,
                queryParams: { clusId: clusterId, clusName: ClusterName, clusIcon: clusterIcon, clusColor: backGroundClr }
            });
        }
    }


    clusterListFun(hide) {
        if (hide == 'cluster' && (this.showBtn != 1)) {
            this.showBtn = 1;
            this.titlehide = true;
            this.clusterhide = false;
            this.isActiveprime = true;
        } else if (hide == 'title' && (this.showBtn != 0)) {
            this.showBtn = 0;
            this.titlehide = false;
            this.clusterhide = true;
            this.isActiveprime = false;
        }
    }
    getOccListData(resData) {
        try {
            // console.log('resData :' + JSON.stringify(resData));
            this.parentCnt = -1;
            this.alphaStyle = this.storageService.sessionStorageGet('module');
            if (resData.length == 0 && this.why == 'true') {
                resData = JSON.parse(this.storageService.sessionStorageGet('OccList'));
            }
            if (this.langChange == false) {
                this.storageService.sessionStorageSet('resDataVal', JSON.stringify(resData));
            }
            const commonClusterIds = [];
            this.occListData = [];
            this.ClusName = [];
            this.titlelist = [];
            this.clusIconValue = [];
            this.cluBgColor = [];
            this.occListData = resData;
            if (this.storageService.sessionStorageGet('module') != 'os') {
                // console.log('in not os if')
                this.why = 'false';
                this.whynot = 'false';
                this.occIdValues = [];
                let listVal = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText')).commonText;
                // console.log('in not os if' + listVal.clusList.length)
                if (listVal.clusList.length != 0 || listVal.occList.length != 0) {
                    this.storeService.convertOCCListTextJson(listVal, resData, '');
                }
            }
            if (this.alphaStyle == 'os') {
                let osVal = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList'));
                // console.log('this.alphaStyle :' + this.alphaStyle);
                // console.log('this.osVal :' + JSON.stringify(osVal));
                const ref = this;
                if (JSON.stringify(osVal) == 'null') {
                    let listVal = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText')).commonText;
                    if (listVal.clusList.length != 0 || listVal.occList.length != 0) {
                        this.storeService.convertOCCListTextJson(listVal, resData, 'OSOnMyList');
                    }
                }
                else {
                    let osVal = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList')).commonText;
                    if (JSON.stringify(osVal) != 'null') {
                        let val = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList')).commonText;
                        if (val.clusList.length == 0 || val.occList.length == 0) {
                            this.storageService.sessionStorageSet('parentCnt', 'false');
                        }
                        this.dispatchStore.dispatch({ type: "OCC_LIST_WHY_EFFECT", payload: val });
                    }
                    else {
                        this.dispatchNull('OCC_LIST_WHY_EFFECT')
                    }
                }
                this.getClusterValues(ref.ClusName);
            }
        } catch (e) {
            console.log('Occlist getOccListData exception:' + e.message);
        }
    }
    checkCareer(id, name, e) {
        if ((e == 'click') && this.indexTitleName.length <= 2) {
            let isAvailable = false;
            let inx1 = -1;
            for (let i = 0; i < this.indexOccId.length; i++) {

                if (id == this.indexOccId[i]) {
                    isAvailable = true;
                    inx1 = i;
                    break;
                } else {
                    isAvailable = false;
                }
            }
            if (isAvailable == false) {
                this.indexOccId.push(id);
                this.indexTitleName.push(name);
                isAvailable = true;
            } else {
                this.indexOccId.splice(inx1, 1);
                this.indexTitleName.splice(inx1, 1);
            }
        }
    }

    occListClick(occId, occName, name) {
        if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
            && this.indexOccId.indexOf(occId) != -1)) {
            this.storageService.sessionStorageSet('returnName', name);
            this.router.navigate(['../comparison'], {
                relativeTo: this.activatedRoute,
                queryParams: {
                    occIdValue: occId,
                    occupationName: occName
                }
            });
        }
    }
    aeListIconClick(occId) {

        try {
            this.utils.showLoading();
            this.resultChart = [];
            this.apiJson.endUrl = 'ae/abilities';
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = 'Assessment/v1/';
            const data = {
                input_data: [

                    {
                        'param_type': 'path',
                        'params': [occId]
                    },
                    {
                        'param_type': 'query',
                        'params': { 'lang': 'en', 'stateAbbr': 'IC' }
                    },
                    {
                        'param_type': 'body',
                        'params': {

                        }
                    }
                ]
            };
            this.apiJson.method = 'GET';
            const dat = JSON.stringify(data);

            this.apiJson.data = dat;

            this.serverApi.callApi([this.apiJson]).subscribe((response) => {
                if (response[0].Success + '' === 'true') {
                    let ref = this;
                    let keys = Object.keys(response[0].Result);
                    keys.forEach(function (obj, inx) {
                        ref.resultChart.push(response[0].Result[obj]);
                        ref.utils.hideLoading();
                    })
                }
            }, this.utils.handleError);
        } catch (e) {
            console.log('ae top three ability exception-->' + e.message);
        }
    }
    whyOccList() {
        this.search = { text: '', rating: [], wages: [], edu: [] };
        this.filtersearch = { text: '', rating: [], wages: [], edu: [] };
        this.clusIconValue = [];
        this.cluBgColor = [];

        this.ClusName = [];
        this.titlelist = [];
        this.compareImg = false;
        this.storageService.sessionStorageSet('checkNotOccList', 'false');
        this.whynot = 'false';
        this.why = 'true';
        this.show = 1;
        this.hidenav = false;
        this.imghide = true;
        let osVal = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList'));
        // console.log('osVal OSOnMyList :' + JSON.stringify(osVal));
        if (JSON.stringify(osVal) != 'null') {
            let val = JSON.parse(this.storageService.sessionStorageGet('OSOnMyList')).commonText;
            if (val.clusList.length == 0 || val.occList.length == 0) {
                this.storageService.sessionStorageSet('parentCnt', 'false');
            }
            this.dispatchStore.dispatch({ type: "OCC_LIST_WHY_EFFECT", payload: val });
        }
        else {
            this.dispatchNull('OCC_LIST_WHY_EFFECT')
        }
        const ref = this;
        this.getClusterValues(ref.ClusName);
    }
    whyNotOccList() {
        this.search = { text: '', rating: [], wages: [], edu: [] };
        this.filtersearch = { text: '', rating: [], wages: [], edu: [] };
        this.ClusName = [];
        this.titlelist = [];
        this.clusIconValue = [];
        this.cluBgColor = [];
        this.storageService.sessionStorageSet('checkNotOccList', 'true');
        this.why = 'false';
        this.whynot = 'true';
        this.show = 0;
        this.hidenav = false;
        this.imghide = true;
        let osVal = JSON.parse(this.storageService.sessionStorageGet('OSNotOnMyList'));
        // console.log('osVal OSNotOnMyList :' + JSON.stringify(osVal));
        if (JSON.stringify(osVal) != 'null') {
            let val = JSON.parse(this.storageService.sessionStorageGet('OSNotOnMyList')).commonText;
            if (val.clusList.length == 0 || val.occList.length == 0) {
                this.storageService.sessionStorageSet('parentCnt', 'false');
            }
            this.dispatchStore.dispatch({ type: "OCC_LIST_WHYNOT_EFFECT", payload: val });
        }
        else {
            this.dispatchNull('OCC_LIST_WHYNOT_EFFECT')
        }
        const ref = this;
        this.getClusterValues(ref.ClusName);
    }
    dispatchNull(type) {
        let temp1 = {
            'clusList': [],
            'occList': []
        };
        this.dispatchStore.dispatch({ type: type, payload: temp1 });
    }
    getClusterValues(name) {
        for (let k = 0; k < name.length; k++) {
            let value = this.trackEnt.clustDetails(name[k].clusterId);
            this.clusIconValue.push(value.clusterIconValue);
            this.cluBgColor.push(value.clusterBgColor);
        }
    }

    compareOccupations() {
        try {
            this.utils.showLoading();
            this.router.navigate(['../compare'], {
                relativeTo: this.activatedRoute,
                queryParams: {
                    occId: this.indexOccId[0] + '&' + this.indexOccId[1],
                    occName: this.indexTitleName[0] + '&' + this.indexTitleName[1]
                }
            });
        } catch (e) {
            alert('error--->' + e.message);
        }

    }

    /* This method is for filter data when ever user check checkbox like 'career interest,
    educational level,wages' in occupation-list.layout.html */


    getResultFilter() {
        this.filtersearch = { text: '', rating: [], wages: [], edu: [] };
        this.filtersearch.text = this.search.text;
        if (this.search.rating.length > 0) {
            this.search.rating.forEach(function (obj, inx) {
                this.filtersearch.rating.push(obj);
            }.bind(this));
        }
        if (this.search.wages.length > 0) {
            this.search.wages.forEach(function (obj, inx) {
                this.filtersearch.wages.push(obj);
            }.bind(this));
        }
        if (this.search.edu.length > 0) {
            this.search.edu.forEach(function (obj, inx) {
                this.filtersearch.edu.push(obj);
            }.bind(this));
        }
        this.occIndexReduTxt = this.storeService.filterListData({
            text: this.search.text, edu: this.search.edu,
            rating: this.search.rating, wages: this.search.wages,
            module: 'occ_list'
        }, 'occ');
        if (this.occIndexReduTxt.commonText.occList.length == 0) {
            this.showImg = 0;
        } else {
            this.showImg = 1;
        }
        this.iconInxVal = 0;
        this.searchBox = true;
    }
    resetCheckBoxes() {
        this.search = { text: this.search.text, rating: [], wages: [], edu: [] };

    }
    showHideIcon() {
        if (this.iconInxVal == 0) {
            this.iconInxVal = 1;
            this.searchBox = false;
        } else {
            this.iconInxVal = 0;
            this.searchBox = true;
        }
    }

    methodfilter(valfil) {
        if (this.filter != valfil) {
            this.filter = valfil;
        } else {
            this.filter = 999;
        }
    }
    cancelButton() {
        this.search = { text: '', rating: [], wages: [], edu: [] };
        this.search.text = this.filtersearch.text;
        if (this.filtersearch.rating.length > 0) {
            this.filtersearch.rating.forEach(function (obj, inx) {
                this.search.rating.push(obj);
            }.bind(this));
        }
        if (this.filtersearch.wages.length > 0) {
            this.filtersearch.wages.forEach(function (obj, inx) {
                this.search.wages.push(obj);
            }.bind(this));
        }
        if (this.filtersearch.edu.length > 0) {
            this.filtersearch.edu.forEach(function (obj, inx) {
                this.search.edu.push(obj);
            }.bind(this));
        }
        this.iconInxVal = 0;
        this.searchBox = true;
    }
}