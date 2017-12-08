/** Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Subscription } from "rxjs/Subscription";

/** import shared Components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';
import { langData } from '../../shared/constants/assessments-constants';
import { StoreService } from '../../../../state-management/services/store-service';

@Component({
	selector: 'wes-intro',
	templateUrl: './wes-intro.layout.html',
})
export class WESIntroComponent implements OnInit, OnDestroy {

	wesreturnedVal; /**Declare for storing assessment commontext from store.*/
	lang; /**Declare for getting the langset values.*/
	wesresponseText; /**Declare for storing the response text.*/
	wesintroVal; /**Declare for storing the intro values from the store.*/
	assessName = ''; /**Declare for getting the assessment name.*/
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree'];
	reducerSub1 = new Subscription; /** Declare to listen if any change occured.*/
	constructor(private router: Router, private store: Store<AsmntCommonState>, private eventService: EventDispatchService,
		private AsmntResponseStore: Store<AsmntResponseState>, private utils: Utilities, private activeRoute: ActivatedRoute,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private commonlang: StoreService,
		private dispatchStore: Store<Action>, private storageService: StorageService) {

		this.lang = this.storageService.sessionStorageGet('langset');
		this.wesreturnedVal = store.select('AsmntCommonText');
		if (langData[this.storageService.sessionStorageGet('langset')] != undefined) {
			langData[this.storageService.sessionStorageGet('langset')] = {};
		}
		this.getIntroText();
		this.getResponses();
		this.reducerSub1 = store.select('AsmntIntroText').subscribe((v) => {
			this.wesintroVal = v;
			this.hideLoadingSymbol();

		});
		this.wesresponseText = AsmntResponseStore.select('AsmntQuestionsResponses');
	}

	ngOnInit() {
		// Get the log-id of WES
		const elmnt = document.getElementById('main-body');
		elmnt.scrollTop = 0;
		this.utils.showLoading();
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('save_Par_UserNotes', '');
		this.storageService.sessionStorageSet('save_ComUserNotes_WES', '');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.storageService.sessionStorageSet('hashFrom', 'intro');
		this.assessName = this.storageService.sessionStorageGet('assessName');
		this.getLogid();
	}

	/**This method is for hiding the loading symbole when data gets loaded.*/
	hideLoadingSymbol() {
		if (this.wesintroVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}
	/**
	* This method is used for unsubscribing the event.
	*/
	ngOnDestroy() {
		this.reducerSub1.unsubscribe();
	}
	/**
	 * This method is used to get the Interest-profiler logid.
	 */
	getLogid() {
		const wesIntro = {
			input_data: [
				{
					'param_type': 'path',
					'params': [this.utils.getAccountId(), 'WES']
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
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		this.apiJson.endUrl = 'users/start';
		this.apiJson.data = JSON.stringify(wesIntro);
		this.serverApi.callApi([this.apiJson]).subscribe((res) => {
			if (res[0].Success + '' === 'true') {
				this.storageService.sessionStorageSet('logID', res[0].Result.logID);
				if (res[0].Result.showRestore == true) {
					const evnt = document.createEvent('CustomEvent');
					evnt.initEvent('restore_btn_true', true, true);
					this.eventService.dispatch(evnt);
				} else {
					const evnt = document.createEvent('CustomEvent');
					evnt.initEvent('restore_btn_false', true, true);
					this.eventService.dispatch(evnt);
				}
				this.hideLoadingSymbol();
			} else {
				// alert("error occured");
			}
		}, this.utils.handleError);
	}
	/**
	 * This method is for getting the WES responses
	 */
	getResponses() {
		this.utils.showLoading();
		// let intropayload = {
		this.dispatchStore.dispatch({
			type: "GET_QUESTION_RESPONSES", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: ['responses'],
				query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'WES', setVal: 'questions', text: ''
			}
		});
		// }
		// this.commonlang.commonLanguageChange(this.lang, 'responses', intropayload);
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
				body_Params: {}, endUrlVal: 'pageText/wes', setVal: 'commonIntro', text: ''
			}
		});
		// }

		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);

	}
	// Go to assessment page when user click start button

	startAssessment() {
		const logId = this.storageService.sessionStorageGet('logID');
		if (logId !== null && logId !== '' && logId !== undefined) {
			this.storageService.sessionStorageSet('save_Par_UserNotes', '');
			this.storageService.sessionStorageSet('save_ComUserNotes_WES', '');
			this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
		} else {
			this.utils.sessionExpired();
		}

	}
}
