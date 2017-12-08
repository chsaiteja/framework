/** Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';
/** import shared Components */
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Store } from '@ngrx/store';
import { AsmntCommonState } from '../../../../state-management/state/main-state';



@Component({
    selector: 'wil-restore',
    templateUrl: './wil-restore.layout.html',
})
export class WILRestoreComponent implements OnInit, OnDestroy {
    restoreAnswerSet = []; /**restoreAnswerSet variable storing the result of answerSets */
    resLength = -1; /**Declare for storing the value of answersets length */
    deleteVal = ''; /**Declare for storing the delete answersets */
    wilreturnedVal; /**Declare for storing the assessment common text.*/
    eventsub = new Subscription();
    constructor(private store: Store<AsmntCommonState>, private trackEvnt: AssessmentsService, private eventService: EventDispatchService,
        private router: Router, private utils: Utilities, private storageService: StorageService,
        private apiJson: ApiCallClass, private serverApi: ServerApi, private activeRoute: ActivatedRoute) {
        /** Below code block subscribe event and
        * calls respective functionality for this assessment */
        this.eventsub = eventService.listen().subscribe((e) => {
            if (e.type == 'deleteAnswerSet') {
                this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
                this.getWILAnswerSet();
            }
        });
        this.wilreturnedVal = store.select('AsmntCommonText');

    }

    ngOnInit() {
        this.storageService.sessionStorageSet('isFrom', 'restore');
        this.storageService.sessionStorageSet('mainPath', 'restore');
        this.storageService.sessionStorageSet('hashFrom', 'restore');
        this.getWILAnswerSet();
    }

    // Get all answer set and display in restore
    getWILAnswerSet() {
        this.utils.showLoading();
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

    // Get the answers for the required answer set and check whether it goes to result page or assessment page
    restoreQuestionsWil(answerSet, userNotes) {
        this.utils.showLoading();
        this.apiJson.endUrl = 'users/answerSets';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        const data = {
            input_data: [

                {
                    'param_type': 'path',
                    'params': [this.storageService.sessionStorageGet('logID'), 'restoreWIL', answerSet]
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
            const answ = (response[0].Result.answers).split(',');
            if (answ.indexOf('0') != -1) {
                this.storageService.sessionStorageSet('save_Par_UserNotes', userNotes);
                this.storageService.sessionStorageSet('wilAnswers', JSON.stringify(answ));
                this.router.navigate(['../assessment'], {
                    relativeTo: this.activeRoute,
                    queryParams: { wilAnswerSet: answerSet, usrNotes: userNotes }
                });
            } else {
                this.trackEvnt.wilResultCall(response[0].Result.answers, userNotes);
            }
        }, this.utils.handleError);
    }

    // Dispatch the answer set number when user click on delete to delete that answer set
    DeleteWILAnswerSet(answerSet) {
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
        this.trackEvnt.showDeleteDialog(this.apiJson, 'WIL');
    }
    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        this.eventsub.unsubscribe();
    }
}
