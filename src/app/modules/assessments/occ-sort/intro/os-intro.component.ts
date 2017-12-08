/** Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

/** import shared Components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service'

@Component({
    selector: 'os-into',
    templateUrl: './os-intro.layout.html',
})
export class OSIntroComponent implements OnInit, OnDestroy {


    FactorsList;
    osreturnedVal;
    osintroVal;
    lang
    assessName = '';
    subscription = new Subscription;
    reducerSub1 = new Subscription;
    constructor(private router: Router, private activeRoute: ActivatedRoute, private store: Store<AsmntCommonState>,
        private utils: Utilities, private storageService: StorageService, private eventService: EventDispatchService,
        private apiJson: ApiCallClass, private serverApi: ServerApi, private trackEvnt: AssessmentsService,
        private dispatchStore: Store<Action>, private commonlang: StoreService) {
        // this.utils.dispatchSectionLoad("intro");
        this.lang = this.storageService.sessionStorageGet('langset');
        // this.osintroVal = store.select('AsmntIntroText');
        this.reducerSub1 = store.select('AsmntIntroText').subscribe((v) => {
            this.osintroVal = v;
            this.hideLoadingSymbol();

        });
        this.assessName = this.storageService.sessionStorageGet('assessName');
        this.subscription = eventService.listen().subscribe((e) => {
            if (e.type === 'languageChanged') {
                this.lang = this.storageService.sessionStorageGet('langset');
                //alert("comming in subscribe");
                // this.getIntroText();
                // this.getCCIjrQuesRes();
            }
        });
        //this.getFactors();

        this.osreturnedVal = store.select('AsmntCommonText');

    }

    hideLoadingSymbol() {
        if (this.osintroVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
            this.utils.hideLoading();
        }
    }
    /*This method is used to get into Occ-sort assessment.*/
    ngOnInit() {
        const elmnt = document.getElementById('main-body');
        elmnt.scrollTop = 0;
        this.utils.showLoading();
        this.storageService.sessionStorageSet('isAssessment', '');
        this.storageService.sessionStorageSet('module', 'os');
        this.storageService.sessionStorageSet('savedPartialAsmnt', '');
        this.storageService.sessionStorageSet('isFrom', 'intro');
        this.storageService.sessionStorageSet('mainPath', 'intro');
        this.apiJson.method = 'GET';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        let pageOCC = {};
        pageOCC = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': [this.utils.getAccountId(), 'OccSort']
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
        const user = JSON.stringify(pageOCC);
        this.apiJson.endUrl = 'users/start';
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            this.storageService.sessionStorageSet('logID', response[0].Result.logID);
            if (response[0].Result.showRestore == true) {
                const evnt = document.createEvent('CustomEvent');
                evnt.initEvent('restore_btn_true', true, true);
                this.eventService.dispatch(evnt);
            } else {
                const evnt = document.createEvent('CustomEvent');
                evnt.initEvent('restore_btn_false', true, true);
                this.eventService.dispatch(evnt);
            }
            this.hideLoadingSymbol();
        }, this.utils.handleError);

        this.getIntroText();



    }
    getIntroText() {
        // let payloadjson = {
        this.dispatchStore.dispatch({
            type: "GET_INTRO_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: [], query_params: { 'lang': this.lang },
                body_Params: {}, endUrlVal: 'pageText/occSort', setVal: 'commonIntro', text: ''
            }
        });
        // this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);

    }

    /**This makes to navigate to assessement page */
    startAssessment() {
        const sessionVar = this.storageService.sessionStorageGet('logID');
        if (sessionVar !== null && sessionVar !== '' && sessionVar !== undefined) {
            this.storageService.sessionStorageSet('save_Par_UserNotes', '');
            this.storageService.sessionStorageSet('save_Com_UserNotes', '');
            this.router.navigate(['../factors'], { relativeTo: this.activeRoute });
        } else {
            this.utils.sessionExpired();
        }
    }
    logError(error: any) {
    }
    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        this.reducerSub1.unsubscribe();
        this.subscription.unsubscribe();
    }
}
