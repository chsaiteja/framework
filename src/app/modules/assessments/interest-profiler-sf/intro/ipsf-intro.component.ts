/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';

/**Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Subscription } from 'rxjs/Subscription';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'ipsf-into',
	templateUrl: './ipsf-intro.layout.html',
})
export class IPSFIntroComponent implements OnInit, OnDestroy {

	ipQuesResponses; /*Declare for storing responses variable*/
	accountId; /* Declare for Store accountID value */
	ipResponsesArr = []; /**Declare for pushing the responses text */
	ipreturnedVal; /**Declare for storing assessment commontext from store.*/
	introVal; /**Declare for storing the intro values from the store.*/
	lang; /**Declare for getting the langset values.*/
	assessName = ''; /**Declare for getting the assessment name.*/
	responseText; /**Declare for storing the response text.*/
	reducerSub1 = new Subscription;  /** Declare to listen if any change occured.*/
	subscription = new Subscription;  /** Declare to listen if any change occured.*/
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree'];
	/**Declare for storing the icon array names.*/

	constructor(private http: Http, private router: Router, private activatedroute: ActivatedRoute, private trackEvnt: AssessmentsService,
		private utils: Utilities, private storageService: StorageService, private store: Store<AsmntCommonState>,
		private store2: Store<AsmntResponseState>, private dispatchStore: Store<Action>,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private commonlang: StoreService,
		private eventService: EventDispatchService) {
		this.lang = this.storageService.sessionStorageGet('langset');
		this.storageService.sessionStorageSet('inTab', 'Assess');
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'languageChanged') {
				this.utils.showLoading();
				this.lang = this.storageService.sessionStorageGet('langset');
				this.getIntroText();
			}
		});

		this.ipreturnedVal = store.select('AsmntCommonText');
		this.reducerSub1 = store.select('AsmntIntroText').subscribe((v) => {
			this.introVal = v;
			this.hideLoadingSymbol();

		});
		this.responseText = store2.select('AsmntQuestionsResponses');

	}

	/**This method is for hiding the loading symbole when data gets loaded.*/
	hideLoadingSymbol() {
		if (this.introVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}

	/**
	 * This method is used to get the Interest-profiler assessment.
	 */
	ngOnInit() {
		const elmnt = document.getElementById('main-body');
		elmnt.scrollTop = 0;
		this.utils.showLoading();
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.storageService.sessionStorageSet('module', 'ip');
		this.storageService.sessionStorageSet('twoTitleVal', '');
		this.dispatchStore.dispatch({ type: 'RESET_RESULT' });
		this.accountId = this.utils.getAccountId();
		this.assessName = this.storageService.sessionStorageGet('assessName');
		this.getIntroText();
		this.getIPQuesRes();
		this.getLogID();
	}

	/**
			 *This method is for getting the intro text 
			 */
	getIntroText() {
		// let payloadjson = {
		this.dispatchStore.dispatch({
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'pageText/shortIP', setVal: 'commonIntro', text: ''
			}
		});
		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	/**
	 * This method is for getting the ip responses
	 */
	getIPQuesRes() {
		try {
			// let intropayload = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_RESPONSES", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['responses'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'ShortIP', setVal: 'questions', text: ''
				}
			});

			// this.commonlang.commonLanguageChange(this.lang, 'response', intropayload);
		} catch (e) {
			console.log('IP responses exception-->' + e.message);
		}
	}

	/**
	 * This method is used to get the Interest-profiler logid.
	 */
	getLogID() {
		try {
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			const data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['start', this.accountId, 'ShortIP']
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
		} catch (e) {
			console.log('IP logid exception-->' + e.message);
		}
	}

	/**
	 * This method is used to navigate to assessement page
	 */
	startAssessment() {
		if (this.storageService.sessionStorageGet('logID') != null &&
			this.storageService.sessionStorageGet('logID') !== '' && this.storageService.sessionStorageGet('logID') !== undefined) {
			this.storageService.sessionStorageSet('save_Par_UserNotes', '');
			this.storageService.sessionStorageSet('save_Com_UserNotes', '');
			this.router.navigate(['../assessment'], { relativeTo: this.activatedroute });
		} else {
			this.utils.sessionExpired();
		}
	}
	/** This ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.reducerSub1.unsubscribe();
		this.subscription.unsubscribe();
	}
}


