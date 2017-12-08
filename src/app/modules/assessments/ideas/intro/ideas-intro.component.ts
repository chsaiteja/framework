/*Import angular core packages*/
import { Component, OnInit, Output, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'
import { Http, Response } from '@angular/http';

/*Import shared  services components*/
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service'
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'ideas-intro',
	templateUrl: './ideas-intro.layout.html',
})
export class IdeasIntroComponent implements OnInit, OnDestroy {

	ideaQuesResponses; /*Declare for storing responses variable*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/
	returnedVal; /**Declare for storing the assessmentcommon text.*/
	lang; /**Declare for setting the languageset values.*/
	introVal; /**Declare for storing the assessment intro text.*/
	assessName = ''; /**Declare for getting the assessmename.*/
	reducerSub1 = new Subscription; /** Declare to listen if any change occured.*/
	responseText; /**Declare for storing the assessment responses.*/
	smileys = ['icon-asmnt-strongly-agree', 'icon-asmnt-between-strongly ', 'icon-asmnt-somewhat',
		'icon-asmnt-between-somewhat', 'icon-asmnt-strongly-disagree'];
	/**Declare for storing the icons.*/
	accountId; /* Declare for Store accountID value */

	constructor(private store: Store<AsmntCommonState>, private storageService: StorageService,
		private store2: Store<AsmntResponseState>, private dispatchStore: Store<Action>,
		private router: Router, private utils: Utilities, private trackEvnt: AssessmentsService,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private activeRoute: ActivatedRoute,
		private commonlang: StoreService, private eventService: EventDispatchService) {

		/*  This function call is get Question responses */
		this.lang = this.storageService.sessionStorageGet('langset')
		this.getIdeaQuesRes();
		this.getIntroText();
		this.returnedVal = store.select('AsmntCommonText');
		this.responseText = store2.select('AsmntQuestionsResponses');
		this.assessName = this.storageService.sessionStorageGet('assessName');
		this.reducerSub1 = store.select('AsmntIntroText').subscribe((v) => {
			this.introVal = v;
			this.hideLoadingSymbol();
		});
	}

	/**This method is for hiding the loading symbol when the data gets loaded.*/
	hideLoadingSymbol() {

		if (this.introVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}

	/* This method is getting all ideas responses  */
	getIdeaQuesRes() {
		try {
			// let intropayload = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_RESPONSES", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['responses'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'IDEAS', setVal: 'questions', text: ''
				}
			});
			// this.commonlang.commonLanguageChange(this.lang, 'response', intropayload);

		} catch (e) {
			console.log("ideas responses exception :" + e.message);
		}
	}
	/**This method is for getting */
	getIntroText() {
		// let payloadjson = {
		this.dispatchStore.dispatch({
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'pageText/ideas', setVal: 'commonIntro', text: ''
			}
		});
		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	ngOnDestroy() {
		this.reducerSub1.unsubscribe();
	}

	/* Initial component loading method */
	ngOnInit() {
		const elmnt = document.getElementById('main-body');
		elmnt.scrollTop = 0;
		this.utils.showLoading();
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('module', 'ideas');
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.dispatchStore.dispatch({ type: 'RESET_RESULT' });
		this.storageService.sessionStorageSet('twoTitleVal', '');
		this.storageService.sessionStorageSet('hashFrom', 'intro');
		this.accountId = this.utils.getAccountId();
		/*This getLogID() function is getting logid */
		this.getLogID();
	}

	/* This method is for getting LogId */
	getLogID() {
		try {
			this.apiJson.endUrl = "Users";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",
						"params": ["start", this.accountId, "IDEAS"]
					},
					{
						"param_type": "query",
						"params": {}
					},
					{
						"param_type": "body",
						"params": {

						}
					}
				]

			}
			this.apiJson.method = "GET";
			let dat = JSON.stringify(data);
			this.apiJson.data = dat;
			/* This call is for get LogId from API--->GET /Users/start/{accountID}/{sortName} */
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
			console.log('getting logid exception:' + e.message);
		}
	}

	/* This method is for start the assessment*/
	startAssessment() {
		try {
			if (this.storageService.sessionStorageGet('logID') != null && this.storageService.sessionStorageGet('logID') != ""
				&& this.storageService.sessionStorageGet('logID') != undefined) {
				this.storageService.sessionStorageSet('save_Par_UserNotes', '');
				this.storageService.sessionStorageSet('save_Com_UserNotes', '');
				this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
			} else {
				this.utils.sessionExpired();
			}
		} catch (e) {
			console.log('startAssessment Ideas exception:' + e.message);
		}
	}
}
