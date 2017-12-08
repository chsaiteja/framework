/**Import angular core packages */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Custom imports */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { AsmntCommonState, defaultCommonText } from '../../../../state-management/state/main-state';
import { CustomDate } from '../../../../shared/pipes/customPipes';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';


@Component({
	selector: 'eq-restore',
	templateUrl: './eq-restore.layout.html',

})
export class EQRestoreComponent implements OnInit, OnDestroy {
	restoreAnswerSet: any = [];/**restoreAnswerSet variable storing the result of answerSets */
	restoreQuesArr: any = []; /**restoreQuesArr variable storing the restore questions */
	restorePrevQuesArr: any = [];/**restorePrevQues variable storing the previous questions */
	successDelete: boolean = false;
	deleteVal = "";/**Declare for storing the delete answersets */
	resLength: number = -1;/**Declare for storing the value of answersets length */
	logID: string;/**Declare for Storing the value for logID */
	answerSet;/**Declare for Storing the value of answerSets */
	eqreturnedVal;/*Declare for storing the value of AsmntCommonText*/
	subscription = new Subscription();/**For storing the subscribing event deleteanswerset */
	constructor(private trackEvnt: AssessmentsService, private store: Store<AsmntCommonState>,
		private router: Router, private activatedRoute: ActivatedRoute,
		private utils: Utilities, private storageService: StorageService,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {
		//Get the AsmntCommonText data from reducer
		this.eqreturnedVal = store.select('AsmntCommonText');
		this.logID = this.storageService.sessionStorageGet('logID');
		/** Below code block listens broadcasted event and 
				 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want delete or not */
			if (e.type == 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				/**Call the getAnswerSet method for deleting the answerSet */
				this.getAnswerSet();
			}
		})
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
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.restoreAnswerSet = response[0].Result;

				this.resLength = this.restoreAnswerSet.length;
				this.utils.hideLoading();

			}, this.utils.handleError);
		} catch (e) {
			console.log("answer set entquiz exception:" + e.message);
		}
	}

	/* This method is used to restore the answer set and display the questions*/
	restoreQuestionsEntiQuiz(answerSet, usernotes) {
		try {
			this.utils.showLoading();

			this.answerSet = answerSet;
			/* Set answer set so that it is used when the restore answer set is clicked */
			this.storageService.sessionStorageSet('entiQuizAnswerSet', answerSet);
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
						"params": {}
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
					if (splitQuestions[i] == 0) {
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
					this.storageService.sessionStorageSet('entiQuizAnswerSet', response[0].Result.answers);
					this.trackEvnt.eqResultCall(response[0].Result.answers, usernotes);
				}
				else {

					/* If all questions are not answered go to assessment page */
					this.storageService.sessionStorageSet('save_Par_UserNotes', usernotes);
					this.storageService.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
					this.storageService.sessionStorageSet('restoreQuesArr', JSON.stringify(this.restoreQuesArr));
					this.storageService.sessionStorageSet('restorePrevQuesArr', JSON.stringify(this.restorePrevQuesArr));


					this.router.navigate(['../assessment'], {
						relativeTo: this.activatedRoute,
						queryParams: { eqAnswerSet: answerSet }
					});
				}
			}, this.utils.handleError);
		} catch (e) {
			console.log("restore questions entquiz exception:" + e.message);
		}
	}

	/*This method is used to delete the answerset for enterprenur-quiz*/
	deleteEQAnswerSet(answerSet) {
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
						"params": {}
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
			this.trackEvnt.showDeleteDialog(this.apiJson, 'EQ');
		} catch (e) {
			console.log("delete eq Answerset exception:" + e.message);
		}

	}
	/**ngOnDestroy method called when destroying the component */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
