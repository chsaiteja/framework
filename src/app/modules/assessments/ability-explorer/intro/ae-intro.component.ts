/** Angualr2 Libaries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Action } from '@ngrx/store';

/** Services**/
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';

import { StoreService } from '../../../../state-management/services/store-service';
import { Subscription } from 'rxjs/Subscription';

import { StorageService } from '../../../../shared/outer-services/storage.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';


@Component({
	selector: 'ae-intro',
	templateUrl: './ae-intro.layout.html',
})
export class AbilityExplorerIntroComponent implements OnInit, OnDestroy {
	accountId; /**Declare for storing the accountid.*/
	assessName = ''; /**Declare for getting the assessment name.*/
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree',
		'fa icon-verry-poor']; /**Declare for storing the icon arrays.*/
	introVal; /**Declare for storing the intro values from the store.*/
	lang; /**Declare for getting the langset values.*/
	returnedVal; /**Declare for storing assessment commontext from store.*/
	responseText; /**Declare for storing the response text from the store.*/
	subscription2 = new Subscription;  /** Declare to listen if any change occured.*/

	constructor(private store: Store<AsmntCommonState>,
		private dispatchStore: Store<Action>,
		private eventService: EventDispatchService,
		private store1: Store<AsmntResponseState>,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private utils: Utilities,
		private storageService: StorageService,
		private serverApi: ServerApi,
		private commonlang: StoreService,
		private apiJson: ApiCallClass) {
		this.lang = this.storageService.sessionStorageGet('langset');
		this.returnedVal = store.select('AsmntCommonText');
		this.responseText = store.select('AsmntQuestionsResponses');
		this.storageService.sessionStorageSet('inTab', 'Assess');
		this.subscription2 = store.select('AsmntIntroText').subscribe((v) => {
			this.introVal = v;
			this.hideLoadingSymbol();

		});
	}

	/**This method is for hiding the loading symbol.*/
	hideLoadingSymbol() {
		if (this.introVal.commonText.pageText != undefined && this.storageService.sessionStorageGet('logID') != null) {
			this.utils.hideLoading();
		}
	}

	/* Initial component loading method */
	ngOnInit() {
		this.utils.showLoading();
		this.storageService.sessionStorageSet('isFrom', 'intro');
		this.storageService.sessionStorageSet('mainPath', 'intro');
		this.storageService.sessionStorageSet('hashFrom', 'intro');
		this.storageService.sessionStorageSet('module', 'ae');
		this.dispatchStore.dispatch({ type: 'RESET_RESULT' });
		this.storageService.sessionStorageSet('savedPartialAsmnt', '');
		this.storageService.sessionStorageSet('save_Par_UserNotes', '');
		this.storageService.sessionStorageSet('save_Com_UserNotes', '');
		this.assessName = this.storageService.sessionStorageGet('assessName');
		this.accountId = this.utils.getAccountId();

		/*This getLogID() function is getting logid */
		this.getIntroText();
		this.getAbilityResponses();
		this.getlogID();
	}

	/**This method is for getting the intro text.*/
	getIntroText() {

		let payloadjson = {
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'pageText/ae'
			}
		}

		this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	/**This method is for getting the responses from the API.*/
	getAbilityResponses() {
		try {
			let intropayload = {
				type: "GET_QUESTION_RESPONSES", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['responses'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'AE'
				}
			}

			this.commonlang.commonLanguageChange(this.lang, 'response', intropayload);
		} catch (e) {
			console.log('IP responses exception-->' + e.message);
		}
	}

	/**This method is for starting the assessment when we click on the start button in intro page.*/
	startAssessment() {
		this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
	}

	/* This method is for getting LogId */
	getlogID() {
		const aeIntro = {
			input_data: [
				{
					'param_type': 'path',
					'params': [this.utils.getAccountId(), 'AE']
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
		this.apiJson.data = JSON.stringify(aeIntro);
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
			} else {
			}
			this.utils.hideLoading();
		}, this.utils.handleError);
	}

	/**
	* This method is used for unsubscribing the event
	*/
	ngOnDestroy() {
		this.subscription2.unsubscribe();
	}

}
