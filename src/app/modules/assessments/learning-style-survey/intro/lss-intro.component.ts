/**Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/**Import shared service components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store, Action } from '@ngrx/store';
import { langData } from '../../shared/constants/assessments-constants';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'lss-intro',
	templateUrl: './lss-intro.layout.html',
})
export class LSSIntroComponent implements OnInit, OnDestroy {

	learnStyleQuestions: any;/*Declare for storing questions variable*/
	learnStyleResponses: any;/*Declare for storing responses variable*/
	sortName: any;/*Declare for Store sortName value*/
	accountID: any;/* Declare for Store accountID value */
	lssreturnedVal;/**Variable for stroing the assessment common text */
	assessIntro = new Subscription;/**For Assessment Intro text subscription */
	lssintroVal;/**For storing the value of assessIntro variable */
	assessName = '';/**For storing the assessmentName */
	lang;/**Variable for storing the value of changed language */
	lssresponseText;/**Variable for assessment response text */
	lssIconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-somewhat', 'fa icon-asmnt-strongly-disagree'];


	constructor(private store: Store<AsmntCommonState>, private store1: Store<AsmntQuestionState>, private dispatchStore: Store<Action>,
		private commonlang: StoreService, private eventService: EventDispatchService, private router: Router, private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass, private serverApi: ServerApi, private activeRoute: ActivatedRoute) {
		this.lang = this.storageService.sessionStorageGet('langset');
		if (langData[this.storageService.sessionStorageGet('langset')] != undefined) {
			langData[this.storageService.sessionStorageGet('langset')] = {};
		}
		this.getIntroText();

		this.getLearnStyleResponses();
		// this.lssintroVal = store.select('AsmntIntroText');
		this.assessIntro = this.store.select('AsmntIntroText').subscribe((v) => {
			this.lssintroVal = v;
			this.hideLoadingSymbol();

		});
		this.lssreturnedVal = store.select('AsmntCommonText');
		this.lssresponseText = this.store1.select('AsmntQuestionsResponses');
	}

	/**hideLoadingSymbol method for hiding the loading symbol after the text appeared in the screen */
	hideLoadingSymbol() {
		if (this.lssintroVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}

	/*This method start when it come from Learning Style Survey assessment*/
	ngOnInit() {
		const elmnt = document.getElementById('main-body');
		elmnt.scrollTop = 0;
		this.utils.showLoading();
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.storageService.sessionStorageSet('hashFrom', 'intro');
		this.assessName = this.storageService.sessionStorageGet('assessName');
		this.getlogID();
	}

	/**getIntroText method for payloadjson object which has type and payload objects */
	getIntroText() {
		// let payloadjson = {
		this.dispatchStore.dispatch({
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'pageText/learnStyle', setVal: 'commonIntro', text: ''
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	/**ngOnDestroy method called when destroying the component */
	ngOnDestroy() {
		this.assessIntro.unsubscribe();
	}

	/*This method is used to get the Learning Style Survey logid.*/
	getlogID() {
		try {
			this.sortName = 'LearnStyle';
			this.accountID = this.utils.getAccountId();
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			let data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['start', this.accountID, this.sortName]
					},
					{
						'param_type': 'query',
						'params': { 'lang': 'en' }
					}
				]
			}
			this.apiJson.method = 'GET';

			let dat = JSON.stringify(data);
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
			console.log('get log id' + e.message);
		}
	}

	/*This method is used to get the responses of LearnStyle apiCall.*/
	getLearnStyleResponses() {
		try {
			// let payloadjson = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_RESPONSES", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['responses'], query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'LearnStyle', setVal: 'commonIntro', text: ''
				}
			});

			// this.commonlang.commonLanguageChange(this.lang, 'responses', payloadjson);

		} catch (e) {
			console.log('get responses exception' + e.message);
		}
	}

	/*This make to navigate to assessment page**/
	startAssessment() {
		try {
			if (this.storageService.sessionStorageGet('logID') != null && this.storageService.sessionStorageGet('logID') != '' && this.storageService.sessionStorageGet('logID') != undefined) {
				this.storageService.sessionStorageSet('save_Par_UserNotes', '');
				this.storageService.sessionStorageSet('save_Com_UserNotes', '');
				this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
			} else {
				this.utils.sessionExpired();
			}
		} catch (e) {
			console.log('start assessment exception:' + e.message);
		}
	}
}
