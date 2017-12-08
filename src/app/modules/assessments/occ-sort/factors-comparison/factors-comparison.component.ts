/** Angular imports */
import { Component, OnInit, Renderer, OnDestroy, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

/** import shared Components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState, AsmntResponseState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';
import { Subscription } from "rxjs/Subscription";


const sysCard = document.getElementsByClassName('sysList');
const usrCard = document.getElementsByClassName('userList');

@Component({
    selector: 'FactorsComparisonComponent',
    templateUrl: './factors-comparison.layout.html',
})
export class FactorsComparison implements OnInit, OnDestroy {
    FactorsList;
    isWhy = '';
    isNotWhy = '';
    SelectedFactors = [];
    UserSelectedRangeTop = [];
    UserSelectedRangeBottom = [];
    SysSelectedFactors = [];
    SysSelectedRangeTop = [];
    SysSelectedRangeBottom = [];
    UserValues;
    OccIdValue;
    inxValue;
    occName = '';
    utilities;
    reducerSub1 = new Subscription;
    reducerSub2 = new Subscription;
    reducerSub3 = new Subscription;
    osHeaderText = '';
    osreturnedVal;
    resValues = [];
    quesValues = [];
    osintroVal;
    moduleNameIs = this.storageService.sessionStorageGet('module');
    constructor(private router: Router, private store: Store<AsmntCommonState>, private store2: Store<AsmntResponseState>, private store1: Store<AsmntQuestionState>, private activeRoute: ActivatedRoute,
        private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass, private commonlang: StoreService,
        private dispatchStore: Store<Action>, private el: ElementRef, private renderer: Renderer, private serverApi: ServerApi) {
        this.osreturnedVal = store.select('AsmntCommonText');
        this.reducerSub1 = this.store.select('AsmntIntroText').subscribe((res) => {
            this.osintroVal = res;


        });

        this.utilities = utils;
    }
    ngOnInit() {

        // let payloadjson = {
        this.dispatchStore.dispatch({
            type: "GET_QUESTION_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: ['questions'], query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
                body_Params: {}, endUrlVal: 'OccSort'
            }
        });
        // this.commonlang.commonLanguageChange(this.storageService.sessionStorageGet('langset'), 'questions', payloadjson);
        this.reducerSub2 = this.store1.select('AsmntQuestionsText').subscribe((res) => {
            let val;
            val = res;
            if (val.commonIntroText.questions != undefined) {
                let ref = this;
                val.commonIntroText.questions.forEach(function (index, val) {
                    ref.quesValues.push(index);
                })
                this.utils.hideLoading();
            }

        });

        // let intropayload = {
        this.dispatchStore.dispatch({
            type: "GET_QUESTION_RESPONSES", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: ['responses'],
                query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
                body_Params: {}, endUrlVal: 'OccSort'
            }
        });

        // this.commonlang.commonLanguageChange(this.storageService.sessionStorageGet('langset'), 'response', intropayload);
        this.reducerSub3 = this.store2.select('AsmntQuestionsResponses').subscribe((res) => {
            let value;
            value = res;
            if (value.commonResponseText.responses != undefined) {
                let ref = this;
                value.commonResponseText.responses.forEach(function (index, val) {
                    ref.resValues.push(index);
                })
            }
        });

        this.UserValues = JSON.parse(this.storageService.sessionStorageGet('whyList'));
        this.activeRoute.queryParams.subscribe((params: Params) => {
            this.OccIdValue = params['occIdValue'];
            this.occName = params['occupationName'];

        });
        let val = '';
        for (let i = 0; i < this.UserValues.input_data[2].params.selectedFactors.length; i++) {
            if (this.UserValues.input_data[2].params.selectedFactors[i] !== ',') {
                val = val + this.UserValues.input_data[2].params.selectedFactors[i];
            } else if (this.UserValues.input_data[2].params.selectedFactors[i] == ',') {
                this.SelectedFactors.push(parseInt(val, 10));
                val = '';
            }
            if (i == (this.UserValues.input_data[2].params.selectedFactors.length - 1)) {
                this.SelectedFactors.push(parseInt(val, 10));
            }
        }
        for (let i = 0; i < this.UserValues.input_data[2].params.rangeTop.length; i++) {
            if (i % 2 == 0) {
                this.UserSelectedRangeTop.push(parseInt(this.UserValues.input_data[2].params.rangeTop[i], 10));
                this.UserSelectedRangeBottom.push(parseInt(this.UserValues.input_data[2].params.rangeBottom[i], 10));
            }
        }
        if (this.storageService.sessionStorageGet('checkNotOccList') == 'true') {
            this.utils.showLoading();
            this.apiJson.method = 'POST';
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = 'Assessment/v1/';
            let WhynotOccListdata = {};
            WhynotOccListdata = {
                input_data: [
                    {
                        'param_type': 'path',
                        'params': [this.OccIdValue]
                    },
                    {
                        'param_type': 'query',
                        'params': {}
                    },
                    {
                        'param_type': 'body',
                        'params': {
                            'selectedFactors': this.UserValues.input_data[2].params.selectedFactors,
                            'rangeTop': this.UserValues.input_data[2].params.rangeTop,
                            'rangeBottom': this.UserValues.input_data[2].params.rangeBottom

                        }
                    }
                ]
            };
            const user = JSON.stringify(WhynotOccListdata);
            this.apiJson.endUrl = 'occSort/whyNotOcc/';
            this.apiJson.data = user;
            this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                if (res.Success + '' == 'true') {
                    this.getWhynotOccListData(res.Result);
                }

            }, this.utilities.handleError);
        } else {
            this.utils.showLoading();
            this.apiJson.method = 'POST';
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = 'Assessment/v1/';
            let WhyOccListdata = {};
            WhyOccListdata = {
                input_data: [

                    {
                        'param_type': 'path',
                        'params': [this.OccIdValue]
                    },
                    {
                        'param_type': 'query',
                        'params': {}
                    },
                    {
                        'param_type': 'body',
                        'params': {
                            'selectedFactors': this.UserValues.input_data[2].params.selectedFactors,
                            'rangeTop': this.UserValues.input_data[2].params.rangeTop,
                            'rangeBottom': this.UserValues.input_data[2].params.rangeBottom

                        }
                    }
                ]
            };
            const user = JSON.stringify(WhyOccListdata);
            this.apiJson.endUrl = 'occSort/whyOcc/';
            this.apiJson.data = user;

            this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                if (res.Success + '' == 'true') {
                    this.getWhyOccListData(res.Result);
                }

            }, this.utilities.handleError);
        }
    }
    ngOnDestroy() {
        this.reducerSub1.unsubscribe();
        this.reducerSub2.unsubscribe();
        this.reducerSub3.unsubscribe();
    }
    getWhyOccListData(data) {
        this.osHeaderText = this.osintroVal.commonText.pageText.comparePage.top.on.text;
        this.storageService.sessionStorageSet('isWhy', 'true');
        this.storageService.sessionStorageSet('isNotWhy', '');
        // this.utils.hideLoading();
        for (let i = 0; i < 5; i++) {
            this.SysSelectedFactors.push(data[i].factorID);
            this.SysSelectedRangeTop.push(data[i].rangeTop);
            this.SysSelectedRangeBottom.push(data[i].rangeBottom);
        }
        for (let val = 0; val < 5; val++) {
            const cardplp = sysCard[val].getElementsByClassName('s_list');
            const sysTop = this.SysSelectedRangeTop[val];
            const sysBtm = this.SysSelectedRangeBottom[val];
            this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius', true);
            this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius-first', true);
            for (let value = sysTop; value <= sysBtm; value++) {
                this.renderer.setElementClass(cardplp[value], 'factor-progress-green', true);
            }
        }
        for (let val = 0; val < 5; val++) {
            const usrcardplp = usrCard[val].getElementsByClassName('u_list');
            const usrTop = this.UserSelectedRangeTop[val];
            const usrBtm = this.UserSelectedRangeBottom[val];
            for (let value = usrTop; value <= usrBtm; value++) {
                this.renderer.setElementClass(usrcardplp[value], 'factor-progress-green-light', true);
            }
        }
    }
    getWhynotOccListData(data) {
        this.storageService.sessionStorageSet('isNotWhy', 'true');
        this.storageService.sessionStorageSet('isWhy', '');
        this.osHeaderText = this.osintroVal.commonText.pageText.comparePage.top.off.text;
        // this.utils.hideLoading();
        const Rangetop = [];
        const Rangebtm = [];
        this.SysSelectedRangeTop = [];
        this.SysSelectedRangeBottom = [];
        for (let i = 0; i < (data.length); i++) {
            this.SysSelectedFactors.push(data[i].factorID);
            Rangetop.push(data[i].rangeTop);
            Rangebtm.push(data[i].rangeBottom);
        }
        const cardVal = document.getElementsByClassName('card');
        for (let val = 0, k = 0; val < 5; val++) {
            for (let j = 0; j < this.SysSelectedFactors.length; j++) {
                if (this.SelectedFactors[val] !== this.SysSelectedFactors[j]) {
                    this.renderer.setElementStyle(cardVal[val], 'display', 'none');
                    if (j == this.SysSelectedFactors.length - 1) {
                        this.SysSelectedRangeTop.push(0);
                        this.SysSelectedRangeBottom.push(0);
                    }
                } else {
                    this.renderer.setElementStyle(cardVal[val], 'display', 'block');
                    this.SysSelectedRangeTop.push(Rangetop[k]);
                    this.SysSelectedRangeBottom.push(Rangebtm[k]);
                    k++;
                    j = this.SysSelectedFactors.length - 1;
                }
            }
        }

        for (let val = 0; val < 5; val++) {
            const cardplp = sysCard[val].getElementsByClassName('s_list');
            const sysTop = this.SysSelectedRangeTop[val];
            const sysBtm = this.SysSelectedRangeBottom[val];
            this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius', true);
            this.renderer.setElementClass(cardplp[0], 'plp-2-progress-radius-first', true);
            if (sysTop !== -1) {
                for (let value = sysTop; value <= sysBtm; value++) {
                    this.renderer.setElementClass(cardplp[value], 'factor-progress-green', true);
                }
            }
        }
        for (let val = 0; val < 5; val++) {

            const usrcardplp = usrCard[val].getElementsByClassName('u_list');
            const usrTop = this.UserSelectedRangeTop[val];
            const usrBtm = this.UserSelectedRangeBottom[val];
            for (let value = usrTop; value <= usrBtm; value++) {
                this.renderer.setElementClass(usrcardplp[value], 'factor-progress-green-light', true);
            }
        }

    }
    goToList() {
        this.router.navigate(['../result'], { relativeTo: this.activeRoute });
    }
}
