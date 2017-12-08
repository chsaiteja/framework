/*Import angular core packages*/
import { Injectable, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Store, Action } from '@ngrx/store';

/*Custom imports*/
import { Subscription } from 'rxjs/Subscription';

/*Shared component imports*/
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentModalPopups } from '../../../../shared/modal/shared-modal-component';
import { clusterDetails } from '../constants/assessments-constants';
import { AsmntCommonState } from '../../../../state-management/state/main-state';


@Injectable()
export class AssessmentsService implements OnDestroy {
    options: NgbModalOptions = {
        backdrop: 'static'
    };
    subscription = new Subscription;
    serverApi;
    utilities;
    indexResult;
    langVal;
    commonModelTxt;
    resultEntiQuizvar = 0;
    lang;
    constructor(private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>, servApi: ServerApi, private utils: Utilities, private route: Router,
        private apiJson1: ApiCallClass, private apiJson2: ApiCallClass, private storageService: StorageService,
        private apiJson: ApiCallClass, private eventService: EventDispatchService,
        private modalService: NgbModal, private activeRoute: ActivatedRoute) {
        this.serverApi = servApi;
        this.utilities = utils;
        this.subscription = eventService.listen().subscribe((e) => {
            /** After event listen it will check whether user want to save partially or completely */

            if (e.type == 'DeleteButtonAction') {
                this.utils.showLoading();
                const jsonGlobalObject = JSON.parse(this.storageService.sessionStorageGet('arr'));
                this.serverApi.callApi([jsonGlobalObject]).subscribe((response) => {
                    if (response[0].Result + '' == 'true') {
                        this.storageService.sessionStorageRemove('repeat');
                        const evnt = document.createEvent('CustomEvent');
                        evnt.initEvent('deleteAnswerSet', true, true);
                        this.eventService.dispatch(evnt);
                    }
                });

            }
        });
        const ref = this;
        this.subscription = eventService.listen().subscribe((e) => {
            let jsonSaveObject;
            /** After event listen it will check whether user want to save partially or completely */
            try {
                if (e.type == 'save_Complete') {
                    this.storageService.sessionStorageSet('saveval', 'SaveComplete');
                }
                if (e.type == 'save_Partial') {
                    this.storageService.sessionStorageSet('saveval', 'SavePartial');
                }
                if (e.type == 'SaveButtonAction' && this.storageService.sessionStorageGet('saveval') != null &&
                    this.storageService.sessionStorageGet('saveval') != ' ') {
                    this.utils.showLoading();
                    let valueEq;
                    const savevalue = this.storageService.sessionStorageGet('saveval');
                    const eqTransArr = JSON.parse(this.storageService.sessionStorageGet('eqQues'));
                    const tempObj = this.storageService.sessionStorageGet('jsonSaveObject');
                    if (tempObj != null && tempObj != undefined) {
                        jsonSaveObject = JSON.parse(tempObj);
                    }
                    const dat = JSON.parse(jsonSaveObject.data);
                    // console.log('dat---' + JSON.stringify(dat))
                    if (savevalue == 'SavePartial') {
                        const partialVar = this.storageService.sessionStorageGet('textareaValue');
                        if (partialVar != 'undefined') {
                            dat.input_data[2].params.userNotes = partialVar;
                        } else {
                            dat.input_data[2].params.userNotes = '';
                        }
                    } else if (savevalue == 'SaveComplete') {
                        const completeVar = this.storageService.sessionStorageGet('textareaValue');
                        if (completeVar != 'undefined') {
                            dat.input_data[2].params = completeVar;
                        } else {
                            dat.input_data[2].params = '';
                        }
                    }
                    jsonSaveObject.data = JSON.stringify(dat);
                    valueEq = this.storageService.sessionStorageGet('staticval');
                    let assessvalueSave = this.storageService.sessionStorageGet('assesmentname');
                    if (savevalue == 'SavePartial') {
                        this.storageService.sessionStorageSet('save_Par_UserNotes', dat.input_data[2].params.userNotes);
                    } else if (savevalue == 'SaveComplete') {
                        this.storageService.sessionStorageSet('save_Com_UserNotes', dat.input_data[2].params);
                    }
                    if (assessvalueSave == 'IP' || assessvalueSave == 'EQ' ||
                        assessvalueSave == 'CCI' || assessvalueSave == 'LS' || assessvalueSave == 'IDEAS' || assessvalueSave == 'ae') {
                        if (dat.input_data[2].params.answers != undefined) {
                            dat.input_data[2].params.answers = dat.input_data[2].params.answers.toString();
                            dat.input_data[2].params.userNotes = dat.input_data[2].params.userNotes;
                        }
                    }
                    // console.log('after assessvalueSave')
                    jsonSaveObject.data = JSON.stringify(dat);
                    // console.log('after jsonSaveObject' + JSON.stringify(jsonSaveObject))
                    const modName = assessvalueSave;
                    this.serverApi.callApi([jsonSaveObject]).subscribe((response) => {
                        if (response.Result + '' == 'true') {
                            this.utils.hideLoading();
                            if (savevalue == 'SavePartial') {
                                this.storageService.sessionStorageSet('save_Par_UserNotes',
                                    JSON.parse(jsonSaveObject.data).input_data[2].params.userNotes);
                                this.storageService.sessionStorageSet('save_Com_UserNotes',
                                    JSON.parse(jsonSaveObject.data).input_data[2].params.userNotes);

                            } else if (savevalue == 'SaveComplete') {
                                this.storageService.sessionStorageSet('save_Par_UserNotes',
                                    JSON.parse(jsonSaveObject.data).input_data[2].params);
                                this.storageService.sessionStorageSet('save_Com_UserNotes',
                                    JSON.parse(jsonSaveObject.data).input_data[2].params);
                            }
                            this.storageService.sessionStorageSet('savePartial', 'yes');
                            this.storageService.sessionStorageSet('savedPartialAsmnt', 'true');
                            // console.log('isSSESS--' + this.utils.sessionStorageGet('isAssessment'))
                            if (this.storageService.sessionStorageGet('isAssessment') == 'true') {
                                if (modName !== 'OS' && modName != 'WES') {
                                    // console.log('in modName')
                                    this.settingDataForRefresh(JSON.parse(jsonSaveObject.data).input_data[2].params.answers, modName);

                                } else {
                                    this.settingDataForRefresh(JSON.parse(jsonSaveObject.data), modName);
                                }
                            }
                            const evnt = document.createEvent('CustomEvent');
                            evnt.initEvent('saveAnswerSet', true, true);
                            this.eventService.dispatch(evnt);

                        } else {

                        }
                    }, this.utilities.handleError);
                    this.storageService.sessionStorageRemove('saveval');
                }
            } catch (e) {
                console.log('error----.' + e.message);
            }
        });
    }

    /**  This function is to handle the refresh condition when in middle of assessment.
     *  This is similar to the restore condition
     **/
    settingDataForRefresh(respData, module) {
        // console.log('in settingDataForRefresh---' + JSON.stringify(respData));
        let quesName;
        const restoreQuesArr = [], restorePrevQuesArr = [], answerSetRes = [];
        if (module == 'IP' || module == 'CCI' || module === 'IDEAS' || module === 'ae') {
            const splitQuestions = respData.split(',');
            for (let i = 0; i < splitQuestions.length; i++) {
                if (splitQuestions[i] == 'NR') {
                    restoreQuesArr.push({ 'QuestionValue': splitQuestions[i] });
                } else {
                    restorePrevQuesArr.push({ 'QuestionValue': splitQuestions[i] });
                    answerSetRes.push(splitQuestions[i]);
                }
            }
            this.storageService.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
            this.storageService.sessionStorageSet('restoreQuesArr', JSON.stringify(restoreQuesArr));
            this.storageService.sessionStorageSet('restorePrevQuesArr', JSON.stringify(restorePrevQuesArr));
        } else if (module == 'EQ' || module == 'LS') {
            const splitQuestions = respData.split(',');

            for (let i = 0; i < splitQuestions.length; i++) {
                if (splitQuestions[i] == 0) {

                    restoreQuesArr.push({ 'question': i, 'QuestionValue': splitQuestions[i] });
                } else {

                    restorePrevQuesArr.push({ 'question': i, 'QuestionValue': splitQuestions[i] });
                    answerSetRes.push(splitQuestions[i]);
                }
            }
            this.storageService.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
            this.storageService.sessionStorageSet('restoreQuesArr', JSON.stringify(restoreQuesArr));
            this.storageService.sessionStorageSet('restorePrevQuesArr', JSON.stringify(restorePrevQuesArr));

        } else if (module == 'WES') {
            const splitQuestions = respData.input_data[2].params.answers.split(',');
            const allAnswers = [];
            let resultAns = '';
            for (let i = 0; i < splitQuestions.length; i++) {
                if (splitQuestions[i] != 'NR') {
                    allAnswers.push(parseInt(splitQuestions[i], 10));
                    if (i < (splitQuestions.length - 1)) {
                        resultAns = resultAns + parseInt(splitQuestions[i], 10) + ',';
                    } else {
                        resultAns = resultAns + parseInt(splitQuestions[i], 10);
                    }
                } else {
                    break;
                }
            }
            this.storageService.sessionStorageSet('wesAnswers', JSON.stringify(allAnswers));
            this.storageService.sessionStorageSet('wesallQueLength', JSON.stringify(splitQuestions.length));
        }
        else if (module === "WIL") {
            const splitQuestions = respData.split(',');
            this.storageService.sessionStorageSet('wilAnswers', JSON.stringify(splitQuestions));
        } else {
            this.storageService.sessionStorageSet('occ_factors', JSON.stringify(respData.input_data[2].params.selectedFactors));
            this.storageService.sessionStorageSet('RangeTop', JSON.stringify(respData.input_data[2].params.rangeTop));
            this.storageService.sessionStorageSet('RangeBottom', JSON.stringify(respData.input_data[2].params.rangeBottom));
        }
    }

    /** For showing loading symbol */
    showSaveDialog(arr, assessVal) {
        this.storageService.sessionStorageSet('assesmentname', assessVal);
        this.storageService.sessionStorageSet('jsonSaveObject', JSON.stringify(arr));
        //console.log("assessVal---" + JSON.stringify(assessVal))
        this.callSaveModal(assessVal);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    clustDetails(value) {
        // console.log('value----' + value);
        return clusterDetails['cls_' + value];
    }
    /** For showing loading symbol */
    showDeleteDialog(arr, assessment) {
        this.storageService.sessionStorageRemove('delAnswerSet');
        this.storageService.sessionStorageSet('arr', JSON.stringify(arr));
        this.callDeleteModal(arr, assessment, this);
    }

    showStartOverDialog(navUrl) {
        const rtArr = this.route.url.split('/');
        const rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
        this.route.navigate([rtVal + navUrl], { relativeTo: this.activeRoute });
    }
    hideStartOverDialog() {
    }

    /****************This is for making server calls********************/

    /**Interest Profiler Start*/

    /* This method is for getting the result from the server for the questions answered in assessment.
    *  Here call to SaveAndScoreShortIP takes place which saves the assessment with null UserNotes.
    */
    getIpSfResult(answerSet, textNotes) {
        this.callApiFunction('POST', 'Assessment/v1/', [this.storageService.sessionStorageGet('logID')],
            {}, answerSet, 'users/saveAndScoreShortIP', 'ipResult', textNotes);
    }
    getAbilitiesResult(answerSet, textNotes) {
        let answers = answerSet;
        this.callApiFunction('POST', 'Assessment/v1/', [this.storageService.sessionStorageGet('logID')],
            { 'stateAbbr': 'IC' }, answers, 'users/saveAndScoreAE', 'aeResult', textNotes);
    }

    /**Interest Profiler End*/
    /**lss start */
    /*    This method is for getting the result from the server for the questions answered in assessment.
     Here call to saveAndScoreLearnStyle takes place which saves the assessment with null UserNotes.*/
    learnStyleResultCall(answerSet, textNotes) {
        const logID = this.storageService.sessionStorageGet('logID');
        this.callApiFunction('POST', 'Assessment/v1/', [parseInt(logID, 10)],
            {}, answerSet, 'users/saveAndScoreLearnStyle', 'resultLearnStyle', textNotes);
    }
    /**lss end */
    /**CCIjr Start*/

    /* This method is for getting the result from the server for the questions answered in assessment.
    *  Here call to SaveAndScoreShortIP takes place which saves the assessment with null UserNotes.
    */
    getCCIjrResult(answerSet, textNotes) {
        let cciVar = '';
        const cciUrl = this.storageService.sessionStorageGet('CCIassessment');
        // console.log('cciUrl--->' + cciUrl);
        if (cciUrl.indexOf('CCIJr') != -1) {
            cciVar = 'saveAndScoreCCIJr';

        } else {
            cciVar = 'saveAndScoreCCIAdult';
        }
        const logID = this.storageService.sessionStorageGet('logID');
        this.callApiFunction('POST', 'Assessment/v1/', [cciVar, parseInt(logID, 10)],
            {}, answerSet, 'Users', 'CCIjrResult', textNotes);
    }

    /**CCIjr End*/
    /**CCIQuick Start*/

    /* This method is for getting the result from the server for the questions answered in assessment.
    *  Here call to SaveAndScoreShortIP takes place which saves the assessment with null UserNotes.
    */
    getCCIQuickResult(answerSet, textNotes) {
        const logID = this.storageService.sessionStorageGet('logID');
        this.callApiFunction('POST', 'Assessment/v1/', ['saveAndScoreCCIQuick', parseInt(logID, 10)],
            {}, answerSet, 'Users', 'CCIQuickResult', textNotes);
    }

    /**CCIQuick End*/


    /**OccSort End */
    /**Entrepreneur Quiz start */
    eqResultCall(answerSet, textNotes) {

        const logID = this.storageService.sessionStorageGet('logID');
        this.callApiFunction('POST', 'Assessment/v1/', [parseInt(logID, 10)],
            {}, answerSet, 'users/saveAndScoreEntQuiz', 'resultEntiQuiz', textNotes);
    }

    /*EQ end*/
    callCommonText() {
        this.dispatchStore.dispatch({
            type: "GET_ASMNT_COMMON_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: [], query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
                body_Params: {}, endUrlVal: 'pageText/common', setVal: 'commonResult', text: ''
            }
        });
    }
    wesResultCall(answerSet, textNotes) {
        let answers = '';
        answers = answerSet;
        this.callApiFunction('POST', 'Assessment/v1/', [this.storageService.sessionStorageGet('logID')],
            {}, answers, 'users/saveAndScoreWES', 'resultWES', textNotes);

    }

    wilResultCall(answerSet, textNotes) {
        // console.log('in wil result call service')
        // this.utils.sessionStorageSet('personalQty', 'false')
        let answers = "";
        answers = answerSet;
        this.callApiFunction('POST', 'Assessment/v1/', [this.storageService.sessionStorageGet('logID')],
            {}, answers, 'users/saveAndScoreWIL', 'wilResult', textNotes);
    }
    getIdeasResult(answerSet, grade, textNotes) {
        let answers = {
            "answers": answerSet,
            "gradeLevel": grade,
        }
        this.callApiFunction('POST', 'Assessment/v1/', [this.storageService.sessionStorageGet('logID')],
            {}, answers, 'users/saveAndScoreIDEAS', 'ideasResult', textNotes);

    }
    /**OccSort Start */
    getOccSortResult(occSortFields, textNotes) {
        this.utils.showLoading();
        const answers = {
            'selectedFactors': occSortFields[0].selectedFactors,
            'rangeTop': occSortFields[0].rangeTop,
            'rangeBottom': occSortFields[0].rangeBottom,
        };
        try {
            this.callApiFunction('POST', 'Assessment/v1/', [],
                { 'returnOnList': false, 'lang': this.storageService.sessionStorageGet('langset') },
                answers, 'occSort/score', 'OS_whynot', textNotes);

            this.callApiFunction('POST', 'Assessment/v1/', [this.storageService.sessionStorageGet('logID')],
                {}, answers, 'users/saveAndScoreOccSort', 'OS', textNotes);
            // }
        } catch (e) {
            console.log("occ index exception---->" + e.message);
        }
        // });
    }

    /**
     * Common api call method 
     * @param methodVal contains either get or post method name 
     * @param module_Name contains name of the Api call
     * @param path_params contains parameter(s) of param_type path 
     * @param query_params contains parameter(s) of param_type query
     * @param body_Params contains parameter(s) of param_type body 
     * @param endUrlVal contains endurl of Api call
     * @param setVal contains result of the Api call
     * @param text contains text notes
     */
    callApiFunction(methodVal, module_Name, path_params, query_params, body_Params, endUrlVal, setVal, text) {
        this.apiJson.method = methodVal;
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = module_Name;
        const asess_Variable = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': path_params
                },
                {
                    'param_type': 'query',
                    'params': query_params
                },
                {
                    'param_type': 'body',
                    'params': body_Params
                }
            ]
        };
        const user = JSON.stringify(asess_Variable);
        this.apiJson.endUrl = endUrlVal;
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((res) => {
            if (res.Success + '' == 'true') {
                if (setVal != 'OS_whynot' && setVal != 'OS_why' && setVal != 'OS') {
                    // console.log(setVal + ' setVal : this.apiJson in service --- ' + JSON.stringify(this.apiJson))
                    this.resultCall(res, setVal, text);
                } else {
                    this.storageService.sessionStorageRemove('OSOnMyList');
                    this.storageService.sessionStorageRemove('OSNotOnMyList');
                    // console.log((setVal == 'OS_why') + ' :  in api setVal : ' + (setVal == 'OS_whynot'))
                    if (setVal == 'OS_whynot') {
                        this.storageService.sessionStorageSet('NotOccList', JSON.stringify(res.Result));
                        this.callApiFunction('POST', 'Assessment/v1/', [],
                            { 'returnOnList': true, 'lang': this.storageService.sessionStorageGet('langset') },
                            body_Params, 'occSort/score', 'OS_why', text);

                        // this.occSortList('whynot', res.Result, this.indexResult);
                    } else if (setVal == 'OS_why') {
                        // console.log('in os_why')
                        this.storageService.sessionStorageSet('whyList', '');
                        this.storageService.sessionStorageSet('whyList', JSON.stringify(asess_Variable));
                        this.storageService.sessionStorageSet('OccList', JSON.stringify(res.Result));
                        // console.log('OccList : ' + JSON.stringify(res.Result))
                        const rtArr = this.route.url.split('/');
                        const rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
                        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });
                        // this.occSortList('why', res.Result, this.indexResult);
                    }
                    if (text != null) {
                        this.storageService.sessionStorageSet('save_Com_UserNotes', text);
                    }
                }
            }


        }, this.utilities.handleError);
    }
    resultCall(res, setval, textNotes) {
        // console.log(setval + ' : in result call setval-----> ' + JSON.stringify(res.Result));
        if (textNotes != null) {
            this.storageService.sessionStorageSet('save_Com_UserNotes', textNotes);
        }
        this.storageService.sessionStorageSet(setval, JSON.stringify(res.Result));
        const rtArr = this.route.url.split('/');
        const rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
        this.route.navigate([rtVal + '/result'], { relativeTo: this.activeRoute });
    }
    callSaveModal(assessVal) {
        try {
            const parVal = this.storageService.sessionStorageGet('save_Par_UserNotes');
            const comVal = this.storageService.sessionStorageGet('save_Com_UserNotes');
            const modalRef = this.modalService.open(AssessmentModalPopups, this.options);
            if (this.storageService.sessionStorageGet('isFrom') == 'result' && comVal != 'null') {
                modalRef.componentInstance.textarea_txt = this.storageService.sessionStorageGet('save_Com_UserNotes');
            } else if ((parVal !== '') &&
                (parVal != null && parVal != 'null')) {
                modalRef.componentInstance.textarea_txt = parVal;
            }
            modalRef.componentInstance.commonButtons = {
                yesbtn: 'save', nobtn: 'cancel', headsection: 'saveThoughts',
                enter_thought_txt: 'saveLabel'
            };

            modalRef.componentInstance.showvalue = 2;
        } catch (e) {
            console.log('modal comming  ' + e.message);
        }
    }

    callDeleteModal(arr, assessment, ref) {

        this.commonModelTxt = this.store.select('AsmntCommonText');
        const dat = JSON.parse(arr.data);
        this.storageService.sessionStorageSet('delAnswerSet', dat.input_data[0].params[2]);
        const modalRef = this.modalService.open(AssessmentModalPopups, this.options);
        modalRef.componentInstance.headsection = 'Delete Answer Set';
        modalRef.componentInstance.delete_sure_txt = 'Are you sure you want to delete?';
        modalRef.componentInstance.action_undone_txt = 'This action cannot be undone.';
        modalRef.componentInstance.answerSet_txt = dat.input_data[0].params[2];
        //need to get data from api 'headsection'
        modalRef.componentInstance.commonButtons = { yesbtn: 'delete', nobtn: 'cancel', headsection: '' };
        modalRef.componentInstance.showvalue = 1;
        modalRef.componentInstance.Deletebtnvalue = 1;
    }
}
