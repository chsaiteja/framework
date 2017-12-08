/**Angular imports */
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs/Subscription";

/**Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AsmntCommonState, defaultCommonText } from '../../../../state-management/state/main-state';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StoreService } from '../../../../state-management/services/store-service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';


@Component({
    selector: 'ae-assessment',
    templateUrl: './ae-assessment.layout.html',
})
export class AbilityExplorerAssessmentComponent {

    isClassVisibleAbility = false; /**Declare for storing the boolean value for highlighting the icons.*/
    showNxtAbility = false; /**Declare for storing the boolean value for showing the next response.*/
    rem = 0; /**Declare for storing the remaining questions.*/
    logId; /**Declare for storing the logid.*/
    cnt = 1;
    responseText; /**Declare for storing the reponse text.*/
    returnedVal;
    remaining = 0;
    currentValue = 0;
    prevLength = 0;
    valCheck = 0;
    staticVal = 1;
    btnHighLight = -1;
    cntVal = 0;
    answerSet = [];

    prevQuestion = [];
    savePartialData = [];
    restoreQuesArr1 = [];
    restorePrevQuesArr1 = [];
    abilitiesQuestionName = 0;
    lang;
    aeQuesNames: any;
    aequesArr = [];
    aeResponses;
    aeQuestionText;
    subscription = new Subscription;
    iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
        'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree', 'fa icon-verry-poor'];

    constructor(private activeRoute: ActivatedRoute, private storageService: StorageService, private store: Store<AsmntCommonState>, private commonlang: StoreService,
        private router: Router, private trackEvnt: AssessmentsService, private eventService: EventDispatchService, private utils: Utilities, private apiJson: ApiCallClass, private serverApi: ServerApi) {
        this.lang = this.storageService.sessionStorageGet('langset');
        this.responseText = this.store.select('AsmntQuestionsResponses');

        /** here listening the save partial event */
        this.subscription = eventService.listen().subscribe((e) => {
            if (e.type === 'save_Partial') {
                this.saveParitalAssesment();
            }
        });

        this.returnedVal = store.select('AsmntCommonText');
    }
    /*This method is for getting abilityexplorer questions*/
    ngOnInit() {

        this.utils.showLoading();
        try {
            let questionPayload = {
                type: "GET_QUESTION_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['questions'],
                    query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'AE'
                }
            }

            this.commonlang.commonLanguageChange(this.lang, 'questions', questionPayload);
            this.store.select('AsmntQuestionsText').subscribe((v) => {
                this.aeQuestionText = v;
                if (this.aeQuestionText.commonIntroText.questions + '' != 'undefined') {

                    this.storageService.sessionStorageSet('ques', JSON.stringify(this.aeQuestionText));
                    this.abilityFunc();
                }

            });

        } catch (e) {
            console.log("getting questions exception:" + e.message);
        }
    }
    abilityFunc() {

        this.logId = this.storageService.sessionStorageGet('logID');
        this.aeQuesNames = [];
        this.aequesArr = [];
        this.aeQuesNames = JSON.parse(this.storageService.sessionStorageGet('ques'));

        this.aeResponses = this.responseText;

        /**Pushing the questions and responses text into quesArr and responsesArr arrays */
        for (let i = 0; i < this.aeQuesNames.commonIntroText.questions.length; i++) {
            this.aequesArr.push(this.aeQuesNames.commonIntroText.questions[i].text);
        }
        let aeAnswerSet: any;
        // this.activeRoute.queryParams.subscribe((params: Params) => {
        //     aeAnswerSet = params['aeAnswerSet'];

        // });
        let routArr = -1;
        if (this.router.url.indexOf('?') != -1) {
            let Arr = this.router.url.split('?');

            if (Arr[1] != '' || Arr[1] != undefined) {
                routArr = parseInt(Arr[1].split('=')[1])
            }
        }
        this.utils.hideLoading();
        if ((this.storageService.sessionStorageGet('savedPartialAsmnt') != '') && (this.storageService.sessionStorageGet('savedPartialAsmnt') != null)) {
            this.utils.hideLoading();
            this.RestoreAnswerSets();
        } else if (routArr != -1) {
            this.utils.hideLoading();
            this.RestoreAnswerSets();
        }
        else {

            this.storageService.sessionStorageRemove('restoreAnsers');
            this.storageService.sessionStorageRemove('savePartial');
            this.startAbilityPreExam();
        }
    }

    /** this startEntrePreExam() function is to start the assessment */
    startAbilityPreExam() {
        try {

            if (this.storageService.sessionStorageGet('restoreAnsers') == 'yes') {
                this.rem = this.aeQuesNames.commonIntroText.questions.length - this.restoreQuesArr1.length;

                this.remaining = this.restoreQuesArr1.length - 1;

                this.abilitiesQuestionName = (this.rem);

                let value = 100 / this.aeQuesNames.commonIntroText.questions.length;
                this.currentValue = this.rem * value;
                this.cnt = this.rem + 1;
                this.prevLength = this.rem;
                this.staticVal = this.cnt;
                this.btnHighLight = -1;
                this.answerSet = JSON.parse(this.storageService.sessionStorageGet('restoreAnswerSet'));
                for (let i = 0; i < this.cnt; i++) {
                    this.prevQuestion.push({ "QuestionValue": this.answerSet[i] });
                }
            }
            else {
                this.isClassVisibleAbility = true;
                this.abilitiesQuestionName = 0;
                this.remaining = this.aeQuesNames.commonIntroText.questions.length - 1;
                this.answerSet = [];
                this.storageService.sessionStorageRemove('restoreAnswerSet');
                this.storageService.sessionStorageRemove('restoreQuesArr');
                this.storageService.sessionStorageRemove('restorePrevQuesArr');
            }

        } catch (e) {
            console.log("start assessment exception:" + e.message);
        }
    }
    /**this  nextAbilityArrow(cnt) function is for call the next question*/
    nextAbilityArrow(cnt) {
        try {
            this.remaining = this.remaining - 1;
            this.isClassVisibleAbility = false;
            //show or hide next Arrow based on the length of next array
            if ((this.cnt + 1) == this.staticVal) {
                this.showNxtAbility = false;
            }
            else {
                this.showNxtAbility = true;
            }
            this.prevLength = this.cnt;
            this.abilitiesQuestionName = this.cnt
            this.cnt++;
            if ((this.cnt) == this.staticVal) {
                this.btnHighLight = -1;
            }
            else {
                this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
            }
        } catch (e) {
            console.log("calling next question exception :" + e.message);
        }
    }

    /**this  previousQuestion() function is for call the previous question*/
    previousQuestion() {
        try {
            // checking whether it is in restore state or not
            if (this.cnt > 1) {
                this.remaining = this.remaining + 1;
                this.prevLength = this.prevLength - 1;
                this.cnt = this.cnt - 1;
                this.abilitiesQuestionName = this.cnt - 1;
                if (this.cnt == 1) {
                    this.isClassVisibleAbility = true;
                }
                this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
                if (this.cnt == this.staticVal) {
                    // Hide the next arrow when the current question is new
                    this.showNxtAbility = false;
                }
                else {
                    // show the next arrow when previous clicked
                    this.showNxtAbility = true;
                }
            }
        } catch (e) {
            console.log("getting previous questions exception :" + e.message);
        }
    }

    /**this  callQuestion(quesAnswered) function is for moving answered questions */
    callQuestion(quesAnswered) {
        try {
            if (this.cnt <= this.aeQuesNames.commonIntroText.questions.length && this.cntVal == 0) {

                this.remaining = this.remaining - 1;

                this.isClassVisibleAbility = false;
                let value = 100 / this.aeQuesNames.commonIntroText.questions.length;
                // Filling the bar based on the value
                if (this.staticVal === this.cnt) {
                    this.valCheck = 0;
                    this.currentValue = value * this.cnt;
                }
                this.abilitiesQuestionName = this.cnt;
                let quesName = 'shortip_ques_q' + (this.cnt - 1);
                if (this.storageService.sessionStorageGet('savePartial') == 'yes') {
                    this.answerSet = [];
                    this.answerSet = this.savePartialData;
                    this.savePartialData = [];
                    this.storageService.sessionStorageRemove('savePartial');
                }
                if (this.cnt === this.staticVal) {
                    this.answerSet.push(quesAnswered);
                    this.prevQuestion.push({ "QuestionValue": quesAnswered });
                }
                else {
                    this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
                    this.answerSet[this.cnt - 1] = quesAnswered;

                }
                this.prevLength = this.cnt;
                if (this.cnt === this.aeQuesNames.commonIntroText.questions.length) {
                    // if current question is the last question then set answer set
                    this.remaining = 0;
                    this.storageService.sessionStorageSet('answerSetAE', this.answerSet.toString());


                    this.utils.showLoading();
                    this.cntVal = 1;
                    this.trackEvnt.getAbilitiesResult(this.answerSet.toString(), this.storageService.sessionStorageGet('save_Par_UserNotes'));

                }
                if (this.cnt === this.staticVal) {
                    //  Hide the next arrow when the current question is new
                    this.staticVal++;
                }
                if (this.cnt + 1 === this.staticVal) {
                    this.showNxtAbility = false;
                    this.btnHighLight = -1;

                }
                else {
                    this.btnHighLight = this.answerSet[this.cnt];
                }
                if (this.cnt != this.aeQuesNames.commonIntroText.questions.length) {
                    // increase the count value
                    this.cnt = this.cnt + 1;
                }
            }


        } catch (e) {
            console.log("getting call question exception :" + e.message);
        }
    }

    /** this saveChanges() function is for unsaved changes*/
    saveChanges() {
        try {
            let ideaschanges = true;
            if (this.remaining === 0) {
                ideaschanges = false;
            }
            return ideaschanges;
        } catch (e) {
            console.log("save changes exception :" + e.message);
        }
    }

    saveParitalAssesment() {

        this.logId = this.storageService.sessionStorageGet('logID');
        this.storageService.sessionStorageSet('isAssessment', 'true');
        let answ = [];
        const lastarray = [];
        this.apiJson.method = 'POST';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.endUrl = 'Users';
        this.apiJson.moduleName = 'Assessment/v1/';
        const data = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': ['savePartial', this.logId]
                },
                {
                    'param_type': 'query',
                    'params': {}
                },
                {
                    'param_type': 'body',
                    'params': {
                        'answers': lastarray,
                        'userNotes': 'added'
                    }
                }
            ]

        };


        try {
            this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));

        } catch (e) {
            console.log('json exception--->' + e.message);
        }
        this.storageService.sessionStorageSet('staticval', this.staticVal - 1);

        try {
            const s = [];
            answ = this.answerSet;

            const last = answ.toString().split(',');

            let i;
            for (i = 0; i < this.staticVal - 1; i++) {
                lastarray.push(last[i]);
            }
            for (i = this.staticVal - 1; i < this.aeQuesNames.commonIntroText.questions.length; i++) {
                lastarray.push('NR');
            }
        } catch (e) {
            console.log('Exception----' + e.message);
        }
        const dat = JSON.stringify(data);
        this.apiJson.data = dat;
        this.trackEvnt.showSaveDialog(this.apiJson, 'ae');
    }

    /**This is for restoring the set of answers */
    RestoreAnswerSets() {
        try {
            this.storageService.sessionStorageSet('restoreAnsers', 'yes');
            this.storageService.sessionStorageRemove('savePartial');
            this.restoreQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restoreQuesArr'));
            this.restorePrevQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restorePrevQuesArr'));
            this.startAbilityPreExam();
        } catch (e) {
            console.log("restoreAnswerSet exception :" + e.message);
        }
    }

    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        window.location.href.replace(location.hash, '');
        this.subscription.unsubscribe();
    }

}

