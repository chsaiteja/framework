/** Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** import shared Components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Subscription } from "rxjs/Subscription";
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';


let TRes = [], BRes = [];
@Component({
    selector: 'os-assessment-restore',
    templateUrl: './os-restore-layout.html',
    providers: [ApiCallClass, ServerApi, Utilities],
})

export class OSRestoreComponent implements OnInit, OnDestroy {
    restoreAnswerSet = [];
    successDelete = false;
    deleteVal = '';
    resLength = -1;
    QuestionText
    osreturnedVal;
    reducerSub2 = new Subscription();
    subscription = new Subscription();
    constructor(private assess: AssessmentsService, private store1: Store<AsmntQuestionState>,
        private router: Router, private activatedRoute: ActivatedRoute, private dispatchStore: Store<Action>,
        private utils: Utilities, private storageService: StorageService, private store: Store<AsmntCommonState>,
        private apiJson: ApiCallClass, private serverApi: ServerApi,
        private eventService: EventDispatchService, private common: StoreService) {
        this.subscription = eventService.listen().subscribe((e) => {
            if (e.type == 'deleteAnswerSet') {
                this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
                this.geteqAnswerSet();

            }
        });
        this.osreturnedVal = store.select('AsmntCommonText');
    }

    // This method is used to get the saved answer sets form the server
    ngOnInit() {
        this.utils.showLoading();
        this.storageService.sessionStorageSet('isFrom', 'restore');
        this.storageService.sessionStorageSet('mainPath', 'restore');
        if ((this.storageService.sessionStorageGet('osques') != null) && (this.storageService.sessionStorageGet('osques') != undefined)) {
            this.geteqAnswerSet();
        } else {
            // let payloadjson = {
            this.dispatchStore.dispatch({
                type: "GET_QUESTION_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['questions'], query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
                    body_Params: {}, endUrlVal: 'OccSort'
                }
            });
            // this.common.commonLanguageChange(this.storageService.sessionStorageGet('langset'), 'questions', payloadjson);
            this.reducerSub2 = this.store1.select('AsmntQuestionsText').subscribe((res) => {
                this.QuestionText = res;
                if (this.QuestionText.commonIntroText.questions != undefined) {
                    this.storageService.sessionStorageSet('osques', JSON.stringify(this.QuestionText.commonIntroText.questions));
                    this.geteqAnswerSet();
                }
            });
        }
    }

    geteqAnswerSet() {
        this.apiJson.endUrl = 'users/answerSets';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        const data = {
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

                    }
                }
            ]
        };
        this.apiJson.method = 'GET';
        this.apiJson.data = JSON.stringify(data);
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            this.restoreAnswerSet = response[0].Result;
            this.resLength = this.restoreAnswerSet.length;
            this.utils.hideLoading();
        }, this.utils.handleError);
    }

    // This method is used to restore the answer set and display the questions
    restoreQuestionsOS(answerSet, userNotes) {
        this.utils.showLoading();
        this.storageService.sessionStorageSet('eqAnswerSet', answerSet);
        this.apiJson.endUrl = 'users/answerSets';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        const data = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': [this.storageService.sessionStorageGet('logID'), 'restoreOccSort', answerSet]
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
        const dat = JSON.stringify(data);
        this.apiJson.data = dat;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            TRes = response[0].Result.rangeTop.split(',');
            BRes = response[0].Result.rangeBottom.split(',');
            let ResLength = 0;
            for (ResLength = 0; ResLength < TRes.length; ResLength++) {
                if (TRes[ResLength] == -1) {
                    break;
                }
            }
            if (ResLength < 5) {
                this.storageService.sessionStorageSet('save_Par_UserNotes', userNotes);
                this.storageService.sessionStorageSet('occ_factors', (JSON.stringify(response[0].Result.selectedFactors)));
                this.storageService.sessionStorageSet('RangeTop', (JSON.stringify(response[0].Result.rangeTop)));
                this.storageService.sessionStorageSet('RangeBottom', (JSON.stringify(response[0].Result.rangeBottom)));
                this.router.navigate(['../assessment'], {
                    relativeTo: this.activatedRoute,
                    queryParams: { eqAnswerSet: answerSet }
                });
            }
            if (ResLength == 5) {
                const occArray = [];
                occArray.push(response[0].Result);
                this.storageService.sessionStorageSet('occsort', JSON.stringify(occArray));
                this.assess.getOccSortResult(occArray, userNotes);
            }
        }, this.utils.handleError);
    }

    // This method is used to delete the answerset for OS
    deleteOsAnswerSet(answerSet) {
        this.apiJson.endUrl = 'users/answerSets';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        const data = {
            input_data: [

                {
                    'param_type': 'path',
                    'params': [this.storageService.sessionStorageGet('logID'), 'delete', answerSet]
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
        const dat = JSON.stringify(data);
        this.apiJson.data = dat;
        this.assess.showDeleteDialog(this.apiJson, 'OS');
    }
    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
