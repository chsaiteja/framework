/*Import angular core packages*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Action } from '@ngrx/store';

/*Custom imports*/
import { Subscription } from "rxjs/Subscription";
/*Import shared  services components*/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';
import { langData } from '../../shared/constants/assessments-constants';

import { StoreService } from '../../../../state-management/services/store-service';

@Component({
	selector: 'eq-into',
	templateUrl: './eq-intro.layout.html',
})

export class EQIntroComponent implements OnInit, OnDestroy {
	eqQuestions: any;/*Declare for storing questions variable*/
	sortName: string; /*Declare for Store sortName value*/
	accountID: string; /* Declare for Store accountID value */
	eqResponses: any;/*Declare for storing responses variable*/
	eqResponsesArr = []; /**Declare for pushing the responses text */
	eqreturnedVal;/**Variable for storing the value of AssessmentCommonText */
	lang;/**Variable for storing the value of changed language */
	eqintroVal;/**Variable for storing the subscribe value of AssessmentIntroText */
	eqresponseText;/**Variable for storing the value of assessment responses text */
	assessName = '';/**Variable for storing the value of assessment name */
	subscription = new Subscription;/**For the storing of languageChanged subscribe value */
	reducerSub1 = new Subscription;/**For the storing of Assessment Intro text subscribe value */
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat',
		'fa icon-asmnt-strongly-disagree'];/**Array of assessment responses icons */


	constructor(private activeRoute: ActivatedRoute, private store1: Store<AsmntResponseState>, private dispatchStore: Store<Action>,
		private router: Router, private utils: Utilities, private storageService: StorageService, private store: Store<AsmntCommonState>, private eventService: EventDispatchService,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private commonlang: StoreService) {

		/*call the get api call of questions and responses at the time of loading */
		this.lang = this.storageService.sessionStorageGet('langset');
		if (langData[this.storageService.sessionStorageGet('langset')] != undefined) {
			langData[this.storageService.sessionStorageGet('langset')] = {};
		}

		//Get the assessment intro text from reducer
		this.reducerSub1 = store.select('AsmntIntroText').subscribe((v) => {
			this.eqintroVal = v;
			this.hideLoadingSymbol();

		});
		//language changed subscription 
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'languageChanged') {
				this.utils.showLoading();
				this.lang = this.storageService.sessionStorageGet('langset');
				this.getEqResponses();
				this.getIntroText();
			}
		});

		this.eqreturnedVal = store.select('AsmntCommonText');
		this.eqresponseText = store1.select('AsmntQuestionsResponses');
	}

	/**hideLoadingSymbol method for the hiding the loading symbol after all text appeared in the screen */
	hideLoadingSymbol() {
		if (this.eqintroVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}

	/*This method start when it come from entrepreneur-quiz assessment*/
	ngOnInit() {
		const elmnt = document.getElementById('main-body');
		elmnt.scrollTop = 0;
		this.utils.showLoading();
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('module', 'eq');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.assessName = this.storageService.sessionStorageGet('assessName');
		/**Call the getLogID method for getting the logid at the time of loading */
		this.getEQLogID();
		this.getIntroText();
		this.getEqResponses();
	}

    /**getIntroText method for storing the intro text call as 
	 * payload object and maintain type key in payloadjson object */
	getIntroText() {
		// let payloadjson = {
		this.dispatchStore.dispatch({
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'pageText/entQuiz', setVal: 'commonIntro', text: ''
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	/*This method is used to get the responses from EntiQuiz api call*/
	getEqResponses() {

		try {
			// let intropayload = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_RESPONSES", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['responses'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'EntQuiz', setVal: 'questions', text: ''
				}
			})
			// this.commonlang.commonLanguageChange(this.lang, 'responses', intropayload);
		} catch (e) {
			console.log("get eqassessment responses exception:" + e.message);
		}
	}


	/*This method is used to get the Entrepreneur-quiz logid.*/
	getEQLogID() {
		try {
			this.sortName = "EntQuiz";
			this.accountID = this.utils.getAccountId();
			this.apiJson.endUrl = "Users";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",
						"params": ["start", this.accountID, this.sortName]
					},
					{
						"param_type": "query",
						"params": { "lang": this.storageService.sessionStorageGet('langset') }
					}
				]
			}

			this.apiJson.method = "GET";
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
			console.log("get eqAssessment logid exception:" + e.message);
		}
	}

	/**This makes to navigate to assessement page. */
	startAssessment() {
		try {
			if (this.storageService.sessionStorageGet('logID') != null && this.storageService.sessionStorageGet('logID') != '' && this.storageService.sessionStorageGet('logID') != undefined) {
				this.storageService.sessionStorageSet('save_Par_UserNotes', '');
				this.storageService.sessionStorageSet('save_Com_UserNotes', '');
				this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
			}
			else {
				this.utils.sessionExpired();
			}
		} catch (e) {
			console.log("StartAssessment EntQuiz exception:" + e.message);
		}
	}

	/**ngOnDestroy method called when destroying the component */
	ngOnDestroy() {
		this.reducerSub1.unsubscribe();
		this.subscription.unsubscribe();
	}
}
