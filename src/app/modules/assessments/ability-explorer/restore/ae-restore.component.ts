/**Custom imports */
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

/**Import shared service components */
import { AsmntCommonState, defaultCommonText } from '../../../../state-management/state/main-state';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
	selector: 'ae-restore',
	templateUrl: './ae-restore.layout.html',
})
export class AbilityExplorerRestoreComponent {
	restoreAnswerSet: any = [];/**restoreAnswerSet variable storing the result of answerSets */
	restoreQuesArr: any = []; /**restoreQuesArr variable storing the restore questions */
	restorePrevQuesArr: any = [];/**restorePrevQues variable storing the previous questions */
	successDelete: boolean = false;
	deleteVal = "";/**Declare for storing the delete answersets */
	resLength: number = -1;/**Declare for storing the value of answersets length */
	logID: string;/**Declare for Storing the value for logID */
	answerSet;/**Declare for Storing the value of answerSets */
	aereturnedVal;
	constructor(private trackEvnt: AssessmentsService, private store: Store<AsmntCommonState>, private storageService: StorageService,
		private router: Router, private activatedRoute: ActivatedRoute,
		private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {

		/** Below code block listens broadcasted event and 
				 * calls respective functionality for this assessment */
		eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want delete or not */
			if (e.type == 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				/**Call the getAnswerSet method for deleting the answerSet */
				this.getAnswerSet();
			}
		});
		this.aereturnedVal = store.select('AsmntCommonText');
		this.logID = this.storageService.sessionStorageGet('logID');
	}

	/* This method is used to get the saved answer sets form the server*/
	ngOnInit() {
		this.storageService.sessionStorageSet('isFrom', 'restore');
		this.storageService.sessionStorageSet('mainPath', 'restore');
		/**Call the getAnswerSet method for getting the answetSet value at the time of loading */
		this.getAnswerSet();
	}

	/* Used to display the list when restore button is clicked    */
	getAnswerSet() {
		try {
			this.utils.showLoading();
			this.storageService.sessionStorageRemove('restoreQuesArr');
			this.storageService.sessionStorageRemove('restorePrevQuesArr');
			this.apiJson.endUrl = "Users";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",
						"params": ["answerSets", this.logID]
					},
					{
						"param_type": "query",
						"params": { "stateAbbr": "IC" }
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
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.restoreAnswerSet = response[0].Result;

				this.resLength = this.restoreAnswerSet.length;
				this.utils.hideLoading();

			}, this.utils.handleError);
		} catch (e) {
			console.log("answer set ablityEX exception:" + e.message);
		}
	}

	/* This method is used to restore the answer set and display the questions*/
	restoreQuestionsAE(answerSet, usernotes) {
		try {
			this.utils.showLoading();
			this.answerSet = answerSet;
			/* Set answer set so that it is used when the restore answer set is clicked */
			this.storageService.sessionStorageSet('abilityExpAnswerSet', answerSet);
			this.apiJson.endUrl = "Users";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",
						"params": ["answerSets", this.logID, "restore", this.answerSet]
					},
					{
						"param_type": "query",
						"params": { "stateAbbr": "IC" }
					},
					{
						"param_type": "body",
						"params": {}
					}
				]
			}
			this.apiJson.method = "GET";
			let dat = JSON.stringify(data);
			this.apiJson.data = dat;

			this.serverApi.callApi([this.apiJson]).subscribe((response) => {


				let answerSetRes = [];
				var splitQuestions = response[0].Result.answers.split(',');

				/* Pushing value to restoreQuesArr*/
				for (var i = 0; i < splitQuestions.length; i++) {

					if (splitQuestions[i] == 'NR') {
						this.restoreQuesArr.push({ "question": i, "QuestionValue": splitQuestions[i] });
					}
					else {
						this.restorePrevQuesArr.push({ "question": i, "QuestionValue": splitQuestions[i] });
						answerSetRes.push(splitQuestions[i]);


					}
				}
				/* If the length of restoreQuesArr is zero means all questions are answered */
				if (this.restoreQuesArr.length == 0) {
					/* Since all questions are answered goto result page*/
					this.storageService.sessionStorageSet('abilityExpAnswerSet', response[0].Result.answers);
					this.trackEvnt.getAbilitiesResult(response[0].Result.answers, usernotes);
				}
				else {

					/* If all questions are not answered go to assessment page */
					this.storageService.sessionStorageSet('save_Par_UserNotes', usernotes);
					this.storageService.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
					this.storageService.sessionStorageSet('restoreQuesArr', JSON.stringify(this.restoreQuesArr));
					this.storageService.sessionStorageSet('restorePrevQuesArr', JSON.stringify(this.restorePrevQuesArr));


					this.router.navigate(['../assessment'], {
						relativeTo: this.activatedRoute,
						queryParams: { aeAnswerSet: answerSet }
					});
				}
			}, this.utils.handleError);
		} catch (e) {
			console.log("restore questions abilityExp exception:" + e.message);
		}
	}

	/*This method is used to delete the answerset for enterprenur-quiz*/
	deleteAEAnswerSet(answerSet) {
		try {
			this.answerSet = answerSet;

			this.apiJson.endUrl = "users/answerSets";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": 'path',
						"params": [this.logID, "delete", this.answerSet]
					},
					{
						"param_type": "query",
						"params": { "stateAbbr": "IC" }
					},
					{
						"param_type": "body",
						"params": {}
					}
				]

			}
			this.apiJson.method = "GET";

			let dat = JSON.stringify(data);
			this.apiJson.data = dat;

			/** Check the action done in dialogbox */
			this.trackEvnt.showDeleteDialog(this.apiJson, 'AE');
		} catch (e) {
			console.log("delete ae Answerset exception:" + e.message);
		}

	}
}