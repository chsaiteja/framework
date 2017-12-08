/**Angular2 Libraries **/
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Store, Action } from '@ngrx/store';

/**Services **/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Subscription } from 'rxjs/Subscription';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';

import { langData } from '../../shared/constants/assessments-constants';
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'cci-jr-intro',
	templateUrl: './cci-intro.layout.html',
})

export class CCIJrIntroComponent implements OnInit, OnDestroy {
	cciQuesNames; /*Declare for storing questions variable*/
	accountId; /* Declare for Store accountID value */
	ccijrQuesResponses; /*Declare for storing responses*/
	subscription2 = new Subscription;  /** Declare to listen if any change occured.*/
	subscription = new Subscription;  /** Declare to listen if any change occured.*/
	returnedVal; /**Declare for storing the assessmentcommon text from store.*/
	lang; /**Declare for getting the language data.*/
	assessName = ''; /**Declare for getting the assessment name.*/
	responseText; /**Declre for storing the assessment responses.*/
	introVal; /**Declar for hiding the loading smbole and storing the intro text.*/
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat']; /**Declare for storing the icon values.*/

	constructor(private apiJson: ApiCallClass, private trackEvnt: AssessmentsService, private store: Store<AsmntCommonState>,
		private store1: Store<AsmntResponseState>, private activeRoute: ActivatedRoute,
		private eventService: EventDispatchService, private dispatchStore: Store<Action>,
		private commonlang: StoreService, private http: Http, private router: Router,
		private serverApi: ServerApi, private utils: Utilities, private storageService: StorageService) {
		if (langData[this.storageService.sessionStorageGet('langset')] != undefined) {
			langData[this.storageService.sessionStorageGet('langset')] = {};
		}
		this.subscription2 = store.select('AsmntIntroText').subscribe((v) => {
			console.log('in tro subscribe')
			this.introVal = v;
			this.hideLoadingSymbol();
		});
		this.lang = this.storageService.sessionStorageGet('langset');
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'languageChanged') {
				this.utils.showLoading();
				this.lang = this.storageService.sessionStorageGet('langset');
				this.getIntroText();
				this.getCCIjrQuesRes();
			}
		});
		this.returnedVal = store.select('AsmntCommonText');
		this.responseText = store1.select('AsmntQuestionsResponses');
	}
	hideLoadingSymbol() {
		if (this.introVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}

	/**
	 * This method is used to get into Career Cluster Inventory  assessment.
	 */
	ngOnInit() {
		const elmnt = document.getElementById('main-body');
		elmnt.scrollTop = 0;
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.accountId = this.utils.getAccountId();
		this.assessName = this.storageService.sessionStorageGet('assessName');
		this.getIntroText();
		this.getLogID();
		this.getCCIjrQuesRes();
	}

	/**
			 *This method is for getting the intro text 
			 */
	getIntroText() {
		let intoEndUrl;
		if (this.storageService.sessionStorageGet('CCIassessment') == null) {
			this.storageService.sessionStorageSet('CCIassessment', 'CCIJr');
		}
		if (this.storageService.sessionStorageGet('CCIassessment') == 'CCIJr') {
			intoEndUrl = 'pageText/cciJr';
		} else if (this.storageService.sessionStorageGet('CCIassessment') == 'CCIAdult') {
			intoEndUrl = 'pageText/cciAdult';
		}

		// let payloadjson = {
		this.dispatchStore.dispatch({
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: intoEndUrl, setVal: 'commonIntro', text: ''
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	/**
	 * This method is for getting the responses for CCIjr from API
	 */
	getCCIjrQuesRes() {
		try {
			if (this.storageService.sessionStorageGet('CCIassessment') == null) {
				this.storageService.sessionStorageSet('CCIassessment', 'CCIJr');
			}

			// let intropayload = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_RESPONSES", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['responses'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: this.storageService.sessionStorageGet('CCIassessment'), setVal: 'questions', text: ''
				}
			});

			// this.commonlang.commonLanguageChange(this.lang, 'response', intropayload);
		} catch (e) {
			console.log('CCIquestions responses exception-->' + e.message);
		}
	}

	/**
	 * This method is used to get the Career Cluster Inventory junior logid.
	 */
	getLogID() {
		try {
			if (this.storageService.sessionStorageGet('CCIassessment') == null) {
				this.storageService.sessionStorageSet('CCIassessment', 'CCIJr');
			}
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			const data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['start', this.accountId, this.storageService.sessionStorageGet('CCIassessment')]
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
			this.utils.showLoading();
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
			});
		} catch (e) {
			console.log('CCI assessment logid exception-->' + e.message);
		}
	}

	/**
	 * This method is to navigate to CCIjr assessement page
	*/
	startAssessment() {
		if (this.storageService.sessionStorageGet('logID') !== null &&
			this.storageService.sessionStorageGet('logID') !== ''
			&& this.storageService.sessionStorageGet('logID') !== undefined) {
			this.storageService.sessionStorageSet('save_Par_UserNotes', '');
			this.storageService.sessionStorageSet('save_Com_UserNotes', '');
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
		} else {
			this.utils.sessionExpired();
		}
	}

	/**
		 * This ngOnDestroy() function is call after Component destory.
		 */
	ngOnDestroy() {
		this.subscription2.unsubscribe();
		this.subscription.unsubscribe();
	}
}

