/** Angualr2 Libaries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Action } from '@ngrx/store';

/** Services**/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { StoreService } from '../../../../state-management/services/store-service';
import { Subscription } from "rxjs/Subscription";
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';



@Component({
    selector: 'wil-intro',
    templateUrl: './wil-intro.layout.html',
})
export class WILIntroComponent implements OnInit, OnDestroy {
    smileys = ['icon-asmnt-strongly-agree', 'icon-asmnt-between-strongly ', 'icon-asmnt-somewhat',
        'icon-asmnt-between-somewhat', 'icon-asmnt-strongly-disagree'];
    wil_answers_arr = []; /**Declare for pushing the responses text */
    wilreturnedVal; /**Declare for storing assessment commontext from store.*/
    subscription2 = new Subscription;  /** Declare to listen if any change occured.*/
    assessName = ''; /**Declare for getting the assessment name.*/
    lang /**Declare for getting the langset values.*/
    introVal; /**Declare for storing the intro values from the store.*/
    responseText; /**Declare for storing the response text.*/

    constructor(private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>, private store1: Store<AsmntResponseState>, private router: Router, private activeRoute: ActivatedRoute,
        private utils: Utilities, private eventService: EventDispatchService, private storageService: StorageService, private apiJson: ApiCallClass, private commonlang: StoreService, private serverApi: ServerApi) {
        this.lang = this.storageService.sessionStorageGet('langset');
        this.storageService.sessionStorageSet('inTab', 'Assess');

        this.wilreturnedVal = store.select('AsmntCommonText');
        // this.introVal = store.select('AsmntIntroText');
        this.subscription2 = store.select('AsmntIntroText').subscribe((v) => {
            this.introVal = v;
            this.hideLoadingSymbol();

        });
        this.responseText = store1.select('AsmntQuestionsResponses');
    }
    hideLoadingSymbol() {
        if (this.introVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
            this.utils.hideLoading();
        }
    }

    ngOnInit() {
        const elmnt = document.getElementById('main-body');
        elmnt.scrollTop = 0;
        this.utils.showLoading();
        this.storageService.sessionStorageSet('isFrom', 'intro');
        this.storageService.sessionStorageSet('mainPath', 'intro');
        this.storageService.sessionStorageSet('hashFrom', 'intro');
        this.storageService.sessionStorageSet('module', 'wil');
        this.dispatchStore.dispatch({ type: 'RESET_RESULT' });
        this.storageService.sessionStorageSet('savedPartialAsmnt', '');
        this.storageService.sessionStorageSet('save_Par_UserNotes', '');
        this.storageService.sessionStorageSet('save_Com_UserNotes', '');
        this.assessName = this.storageService.sessionStorageGet('assessName');
        this.getIntroText();
        this.getWilQuesRes();
        this.getlogID();

    }
    ngOnDestroy() {
        this.subscription2.unsubscribe();
    }
    getIntroText() {

        // let payloadjson = {
        this.dispatchStore.dispatch({
            type: "GET_INTRO_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: [], query_params: { 'lang': this.lang },
                body_Params: {}, endUrlVal: 'pageText/wil'
            }
        });

        // this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
    }
    getWilQuesRes() {
        try {
            // let intropayload = {
            this.dispatchStore.dispatch({
                type: "GET_QUESTION_RESPONSES", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['responses'],
                    query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'WIL'
                }
            });

            // this.commonlang.commonLanguageChange(this.lang, 'response', intropayload);




        } catch (e) {
            console.log('IP responses exception-->' + e.message);
        }
    }
    startAssessment() {
        this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
    }

    /** Get all logid of wil from api */
    getlogID() {
        const wilIntro = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': [this.utils.getAccountId(), 'WIL']
                },
                {
                    'param_type': 'query',
                    'params': {}
                },
                {
                    'param_type': 'body',
                    'params': {

                    }
                }
            ]
        };
        this.apiJson.method = 'GET';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        this.apiJson.endUrl = 'users/start';
        this.apiJson.data = JSON.stringify(wilIntro);
        this.serverApi.callApi([this.apiJson]).subscribe((res) => {
            if (res[0].Success + '' === 'true') {
                //this.getWILQuestion();
                this.storageService.sessionStorageSet('logID', res[0].Result.logID);
                if (res[0].Result.showRestore == true) {
                    const evnt = document.createEvent('CustomEvent');
                    evnt.initEvent('restore_btn_true', true, true);
                    this.eventService.dispatch(evnt);
                } else {
                    const evnt = document.createEvent('CustomEvent');
                    evnt.initEvent('restore_btn_false', true, true);
                    this.eventService.dispatch(evnt);
                }
            } else {
                // alert("error occured");
            }
            this.hideLoadingSymbol();
        }, this.utils.handleError);
    }

    /** Get all the questions from api */
    getWILQuestion() {
        const wil_questions_arr = [];
        this.apiJson.method = 'GET';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        this.apiJson.endUrl = 'wil/questions';
        const wilAssess = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': []
                },
                {
                    'param_type': 'query',
                    'params': { 'lang': 'en' }
                },
                {
                    'param_type': 'body',
                    'params': {

                    }
                }
            ]
        };
        this.apiJson.data = JSON.stringify(wilAssess);
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            if (response[0].Success == true) {
                if (response[0].Result.length != 0) {
                    for (let i = 0; i < response[0].Result.questions.length; i++) {
                        wil_questions_arr.push(response[0].Result.questions[i].text);
                    }
                    this.storageService.sessionStorageSet('wil_Questions', JSON.stringify(wil_questions_arr));
                }
                // this.getWilAnswers();
            }
        }, this.utils.handleError);
    }

    /** Get all options from api */
    getWilAnswers() {
        this.apiJson.method = 'GET';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        this.apiJson.endUrl = 'wil/responses';
        let wilAnswer = {};
        wilAnswer = {

            input_data: [
                {
                    'param_type': 'path',
                    'params': []
                },
                {
                    'param_type': 'query',
                    'params': { 'lang': 'en' }
                },
                {
                    'param_type': 'body',
                    'params': {
                    }
                }
            ]
        };
        this.apiJson.data = JSON.stringify(wilAnswer);
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            if (response[0].Result.length != 0) {
                for (let i = 0; i < response[0].Result.responses.length; i++) {
                    if (response[0].Result.responses[i].value !== 0) {
                        this.wil_answers_arr.push({
                            'text': response[0].Result.responses[i].text,
                            'value': response[0].Result.responses[i].value,
                            'icon': this.smileys[i]
                        });
                    }

                }
                this.storageService.sessionStorageSet('wil_Answers', JSON.stringify(this.wil_answers_arr));
            }

        }, this.utils.handleError);
    }
}
