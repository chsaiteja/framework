/** imported angular core libraries */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

/** imported services libraries */
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Subscription } from 'rxjs/Subscription';
import { StoreService } from '../../../../state-management/services/store-service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'ideas-grade',
	templateUrl: './ideas-grade.layout.html',
})
export class IdeasGradeComponent implements OnDestroy {
	gradeValue; /**Declare for storing the related grade value.*/
	answerSetValue; /**Declare for getting the answer sets.*/
	errorMsg = false; /**Declare for showing the error message.*/
	logId; /**Declare for getting the logid for starting an assessment.*/
	lang; /**Declare for getting the language data.*/
	gradeVal; /**Declare for getting the assessment intro text from the store.*/
	returnedVal; /**Declare for storing assessment common text.*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/

	constructor(private assessementSer: AssessmentsService, private serverApi: ServerApi,
		private dispatchStore: Store<Action>, private router: Router, private store: Store<AsmntCommonState>,
		private utils: Utilities, private storageService: StorageService, private commonlang: StoreService,
		private apiJson: ApiCallClass, private eventService: EventDispatchService) {

		/**Here listening the save_Partial event */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'save_Partial') {
				this.SaveParitalAssesment('constructor');
			}
		});
		this.returnedVal = store.select('AsmntCommonText');
		this.gradeVal = store.select('AsmntIntroText');

	}

	/**This ngOnInit() function is called initial loading Component */
	ngOnInit() {
		this.logId = this.storageService.sessionStorageGet('logID');
		this.utils.hideLoading();
		this.answerSetValue = this.storageService.sessionStorageGet('answerSetIdeas');
		this.SaveParitalAssesment('Oninit');
	}

	/** This ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/**
	 * This method is for getting the grade text from the API.
	 */
	getGradeText() {
		this.lang = this.storageService.sessionStorageGet('langset')
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

	/** This  gradevalue(grd) function is get the input value like(789,101112,adults)*/
	gradevalue(grd) {
		this.gradeValue = grd;
		if (this.gradeValue != '' && this.gradeValue != undefined) {
			this.errorMsg = false;

		}
	}

	/** This  submitGrade() function is for send the grade value and answerset to AssessmentsService class*/
	submitGrade() {
		try {

			if (this.gradeValue != '' && this.gradeValue != undefined) {
				this.utils.showLoading();
				this.assessementSer.getIdeasResult(this.answerSetValue.toString(),
					this.gradeValue, this.storageService.sessionStorageGet('save_Par_UserNotes'));
			} else {
				this.errorMsg = true;
			}
		} catch (e) {
			console.log('getting grade value and answerset exception :' + e.message);
		}
	}

	/* This method is for save partial */
	SaveParitalAssesment(val) {
		let answ = [];
		let lastarray = [];
		this.storageService.sessionStorageSet('isAssessment', 'true');
		this.apiJson.method = "POST";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.endUrl = "Users";
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["savePartialIDEAS", this.logId]
				},
				{
					"param_type": "query",
					"params": {}
				},
				{
					"param_type": "body",
					"params": {
						"answers": this.answerSetValue,
						"userNotes": "added"
					}
				}
			]

		}
		let dat = JSON.stringify(data);
		this.apiJson.data = dat;
		if (val == 'constructor') {
			this.assessementSer.showSaveDialog(this.apiJson, 'IDEAS');
		}
		else {
			if (this.storageService.sessionStorageGet('save_Par_UserNotes') == '' ||
				this.storageService.sessionStorageGet('save_Par_UserNotes') == null) {

			}
			const dataVal = JSON.stringify(this.apiJson);
			let jsonSaveObject = JSON.parse(dataVal)
			let val = JSON.parse(jsonSaveObject.data);

			val.input_data[2].params.userNotes = this.storageService.sessionStorageGet('save_Par_UserNotes');
			jsonSaveObject.data = JSON.stringify(val);
			this.serverApi.callApi([jsonSaveObject]).subscribe((response) => {
				if (response.Result + '' == 'true') {
					this.utils.hideLoading();
					this.storageService.sessionStorageSet('savePartial', 'yes');
					this.storageService.sessionStorageSet('savedPartialAsmnt', 'true');
					const evnt = document.createEvent('CustomEvent');
					evnt.initEvent('saveAnswerSet', true, true);
					this.eventService.dispatch(evnt);

				}
			}, this.utils.handleError);
		}

	}

	/**This method is for showing the window message.*/
	saveChanges() {
		try {
			let ideaschanges = true;
			if (this.gradeValue != '' && this.gradeValue != undefined) {
				ideaschanges = false;
			}
			return ideaschanges;
		} catch (e) {
			console.log("save changes exception :" + e.message);
		}
	}

}
