/**Angular2 Libaries**/
import { Component, OnInit, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/** Services**/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';

import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntResponseState, AsmntQuestionState } from '../../../../state-management/state/main-state';

@Component({
    selector: 'wil-assessment',
    templateUrl: './wil-assessment.layout.html'

})
export class WILAssessmentComponent implements OnInit, OnDestroy {
    browserDom: BrowserDomAdapter;
    isClassVisibleIP = false;
    wil_questions_text = [];
    wil_answers_text;
    presentQuesNum = 0;
    cnt = 0;
    showVal = -1;
    enterEventListener;
    userNote = '';
    remaining = [4, 4, 4, 4, 4];
    wilAnswerSet = [];
    answersArray = [];
    wilreturnedVal;
    introtext;
    boldtext;
    subscription2 = new Subscription;
    eventSub = new Subscription;
    smileys = ['icon-asmnt-strongly-agree', 'icon-asmnt-between-strongly ', 'icon-asmnt-somewhat',
        'icon-asmnt-between-somewhat', 'icon-asmnt-strongly-disagree'];
    lang;
    QuestionText;
    wil_questions;
    introVal;
    constructor(private store: Store<AsmntCommonState>, private store1: Store<AsmntResponseState>, private store2: Store<AsmntQuestionState>, private router: Router, private activeRoute: ActivatedRoute, private assess: AssessmentsService,
        private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass, private serverApi: ServerApi,
        private renderer: Renderer, private dispatchStore: Store<Action>,
        private elementref: ElementRef, private eventService: EventDispatchService, private common: StoreService) {
        this.browserDom = new BrowserDomAdapter();
        this.lang = this.storageService.sessionStorageGet('langset');
        this.eventSub = eventService.listen().subscribe((e) => {
            /** After event listen it will check whether user want to save partially or completely */
            if (e.type == 'save_Partial') {
                /** If user want to save partially, then we call the respective function
                  * and we are setting true to isAssessment to tell that, we are saving from assessment.
                  
                 */
                this.savePartialWIL();
                this.storageService.sessionStorageSet('isAssessment', 'true');
            } else if (e.type == 'saveAnswerSet') {
                this.utils.hideLoading();
            }
            if (e.type === 'languageChanged') {
                this.lang = this.storageService.sessionStorageGet('langset');
                this.ngOnInit();
            }
        });
        // alert('in wilreturnedVal');
        this.wilreturnedVal = store.select('AsmntCommonText');
        this.introtext = store.select('AsmntIntroText').subscribe((v) => {
            this.introVal = v;
        });
        let toptext = this.introVal.commonText.pageText.itemsPage.top.text;
        let boldtag = ['<b>', '</b>'];

        for (let i = 0; i < toptext.length; i++) {
            if (toptext[i] == '*' && toptext[i + 1] == '*') {
                let textstring = toptext[i] + toptext[i + 1];
                for (let j = 0; j < boldtag.length; j++) {
                    toptext = toptext.replace(textstring, boldtag[j]);

                }
                this.boldtext = toptext;
            }
        }
        this.wil_answers_text = this.store1.select('AsmntQuestionsResponses');
    }

    ngOnInit() {
        this.utils.showLoading();
        this.getWilQuestions();
        this.dynamicStyle();
    }
    getWilQuestions() {

        try {

            // let payloadjson = {
            this.dispatchStore.dispatch({
                type: "GET_QUESTION_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['questions'], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'WIL'
                }
            });
            // this.common.commonLanguageChange(this.lang, 'questions', payloadjson);


            this.subscription2 = this.store2.select('AsmntQuestionsText').subscribe((v) => {
                this.QuestionText = v;
                // console.log("response store----> " + JSON.stringify(this.QuestionText));
                if (this.QuestionText.commonIntroText.questions != undefined) {
                    this.storageService.sessionStorageSet('wil_Questions', JSON.stringify(this.QuestionText.commonIntroText));
                    this.wil_Func();
                }
            });

        } catch (e) {
            console.log('WIL Questions exception-->' + e.message);
        }
    }
    wil_Func() {
        try {
            this.wil_questions = [];
            this.answersArray = [];
            this.wil_questions_text = [];
            this.wil_questions = JSON.parse(this.storageService.sessionStorageGet('wil_Questions'));

            for (let i = 0; i < this.wil_questions.questions.length; i++) {
                this.wil_questions_text.push(this.wil_questions.questions[i].text);
            }
            let wilAnswerSet: any;
            this.activeRoute.queryParams.subscribe((params: Params) => {
                wilAnswerSet = params['wilAnswerSet'];
                this.userNote = params['usrNotes'];
            });
            // Check whether the assessment coming from restore or reloading
            const assess = this.storageService.sessionStorageGet('savedPartialAsmnt');
            // console.log("assess---->" + assess);
            if ((assess !== '') && (assess != null)) {
                this.utils.hideLoading();
                this.RestoreAnswerSets();
            } else if (wilAnswerSet !== 0 && wilAnswerSet !== '' && wilAnswerSet != null) {
                this.utils.hideLoading();
                this.RestoreAnswerSets();
            } else {
                this.utils.hideLoading();
                this.storageService.sessionStorageRemove('savePartial');
                this.storageService.sessionStorageRemove('restoreAnsers');
                for (let i = 0; i < this.wil_questions_text.length; i++) {
                    this.answersArray.push(0);
                }
            }
        } catch (e) {
            console.log("wil assessment exception---->" + e.message);

        }
    }
    dynamicStyle() {
        let ref = this;
        this.enterEventListener = function (event) {
            try {

                if (document.getElementById('headerMobAssess') != null) {
                    const heightVal = document.getElementById('headerMobAssess').offsetHeight;
                    const htValue = document.getElementById('wil_para_id').offsetHeight;
                    const elmnt = document.getElementById('main-body');
                    if ((elmnt.scrollTop) <= (heightVal + htValue)) {
                        ref.browserDom.removeStyle(ref.browserDom.query('.sticky-smile-box'), 'position');
                        ref.browserDom.removeStyle(ref.browserDom.query('.sticky-smile-box'), 'top');
                    } else {
                        ref.browserDom.setStyle(ref.browserDom.query('.sticky-smile-box'), 'position', 'fixed');
                        ref.browserDom.setStyle(ref.browserDom.query('.sticky-smile-box'), 'top', '91px');

                    }
                }
            } catch (e) {
                console.log('error in factor tru block--->' + e.message);
            }
        };
        document.addEventListener('scroll', this.enterEventListener, true);

    }
    ngOnDestroy() {
        //console.log('on destroy')
        document.removeEventListener('scroll', this.enterEventListener, true);
        window.location.href.replace(location.hash, '');
        this.subscription2.unsubscribe();
        this.eventSub.unsubscribe();
    }
    RestoreAnswerSets() {
        this.storageService.sessionStorageRemove('savePartial');
        // console.log("comming restore--->");
        this.answersArray = [];
        this.answersArray = JSON.parse(this.storageService.sessionStorageGet('wilAnswers'));

        // console.log("comming restore answers--->" + this.answersArray);
        this.presentQuesNum = 0;
        this.remaining = [4, 4, 4, 4, 4];
        for (let i = 0; i < this.answersArray.length; i++) {
            if (this.answersArray[i] != 0) {
                this.presentQuesNum++;
                this.remaining[(this.answersArray[i] - 1)]--;
            }
        }
        this.utils.hideLoading();
    }
    // When user click on save button in assessment we save the answer for that particular answer set
    savePartialWIL() {
        this.apiJson.method = 'POST';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';

        let SavePartialPost = {};
        SavePartialPost = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': [this.storageService.sessionStorageGet('logID')]
                },
                {
                    'param_type': 'query',
                    'params': {}
                },
                {
                    'param_type': 'body',
                    'params': {
                        'answers': this.answersArray.toString(),
                        'userNotes': this.userNote
                    }
                }
            ]
        };
        const user = JSON.stringify(SavePartialPost);
        this.apiJson.endUrl = 'users/savePartial/';
        this.apiJson.data = user;
        this.assess.showSaveDialog(this.apiJson, 'WIL');
    }
    showCards(inx) {
        if (this.remaining[inx] != 4) {
            this.showVal = inx + 1;
        }
    }
    callQuestion(val, inx) {
        if ((this.presentQuesNum < (this.wil_questions_text.length)) && this.remaining[val] != 0) {
            // console.log('in callQuestion val--' + val);
            if (this.answersArray[inx] == 0) {
                this.remaining[val]--;
                this.presentQuesNum++;
                this.answersArray[inx] = (val + 1);
            } else if (this.answersArray[inx] != 0) {
                if (this.answersArray[inx] == (val + 1)) {
                    this.remaining[val]++;
                    this.presentQuesNum--;
                    this.answersArray[inx] = (0);
                } else {
                    const variable = this.answersArray[inx];
                    this.remaining[variable - 1]++;
                    this.remaining[val]--;
                    this.answersArray[inx] = (val + 1);
                }
            }
            // console.log(inx + '<--inx---this.answersArray is---->' + this.answersArray);
        } else if (this.answersArray[inx] == (val + 1)) {
            this.remaining[val]++;
            this.presentQuesNum--;
            this.answersArray[inx] = (0);
        }
        let remVal = 0;
        for (let i = 0; i < this.remaining.length; i++) {
            if (this.remaining[i] == 4) {
                remVal = 1;
            }
            else {
                remVal = 0;
            }
        }
        if (remVal == 1) {
            this.showAll();
        }

    }

    callResult() {
        // console.log("presentQuesNum--->" + this.presentQuesNum);
        // console.log("wil_questions_text--->" + this.wil_questions_text.length);
        // console.log("this.answersArray.toString()--->" + this.answersArray.toString());

        if (this.presentQuesNum == (this.wil_questions_text.length)) {
            this.utils.showLoading();
            // console.log('callResult')
            let answersArr = [];
            for (let i = 0; i < this.answersArray.length; i++) {
                answersArr.push(6 - this.answersArray[i]);
            }
            this.assess.wilResultCall(answersArr.toString(), this.storageService.sessionStorageGet('save_Par_UserNotes'));
        }
    }

    saveChanges() {
        let wilchanges = true;
        if ((this.wil_questions_text.length - (this.presentQuesNum)) == 0) {
            // console.log('wil changes- in if condition');
            wilchanges = false;
        }
        // console.log('wil changes-after if' + wilchanges);
        return wilchanges;
    }
    showAll() {
        this.showVal = -1;
    }
}
