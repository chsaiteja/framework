/**Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";

/**Custom imports */
import { AsmntCommonState } from '../../../../state-management/state/main-state';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Store } from '@ngrx/store';
import { Utilities } from '../../../../shared/outer-services/utilities.service';


@Component({
	selector: 'lss-restore',
	templateUrl: './lss-restore.layout.html',
})
export class LSSRestoreComponent implements OnInit, OnDestroy {
	logID: any;/**Declare for storing the logID */
	restoreAnswerSet = [];/**restoreAnswerSet variable storing the result of answerSets */
	resLength = -1;/**Declare for storing the value of answersets length */
	answerSet;/**Declare for Storing the value of answerSets */
	restoreQuesArr = [];/**restoreQuesArr variable storing the restore questions */
	restorePrevQuesArr = [];/**restorePrevQues variable storing the previous questions */
	deleteVal: any;/**Declare for storing the delete answersets */
	subscription = new Subscription;/**For deleteAnswerSet event subscription */
	lssreturnedVal;/**Variable for storing the AssessmentCommonText  */

	constructor(private router: Router, private store: Store<AsmntCommonState>, private serverApi: ServerApi, private eventService: EventDispatchService,
		private trackEvnt: AssessmentsService, private activatedRoute: ActivatedRoute,
		private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass) {
		//Get the assessment common text from reducer
		this.lssreturnedVal = store.select('AsmntCommonText');
		this.logID = this.storageService.sessionStorageGet('logID');
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want delete or not */
			if (e.type == 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				this.getAnswerSet();

			}
		})
	}

	/*this method is used to get the saved answer sets form the server*/
	ngOnInit() {
		this.utils.showLoading();
		this.storageService.sessionStorageSet('isFrom', 'restore');
		this.storageService.sessionStorageSet('mainPath', 'restore');
		this.storageService.sessionStorageSet('hashFrom', 'restore');
		this.getAnswerSet();
	}

	/**ngOnDestroy method called when destroying the component */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	/*Used to display the list when restore button is clicked */
	getAnswerSet() {
		try {
			this.utils.showLoading();
			this.storageService.sessionStorageRemove('restoreQuesArr');
			this.storageService.sessionStorageRemove('restorePrevQuesArr');
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			let data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['answerSets', this.logID]
					},
					{
						'param_type': 'query',
						'params': {}
					},
					{
						'param_type': 'body',
						'params': {}
					}
				]
			}
			this.apiJson.method = 'GET';
			let dat = JSON.stringify(data);
			this.apiJson.data = dat;
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.restoreAnswerSet = response[0].Result;
				this.resLength = this.restoreAnswerSet.length;

				this.utils.hideLoading();
			}, this.utils.handleError);
		} catch (e) {
			console.log('lss get answerset exception' + e.message);
		}
	}

	/*this method is used to restore the answer set and display the questions*/
	restoreQuestionsLearnStyle(answerSet, usernotes) {
		try {
			this.utils.showLoading();
			this.answerSet = answerSet;
			/*Set answer set so that it is used when the restore answer set is clicked */
			this.storageService.sessionStorageSet('learnStyleAnswerSet', answerSet);
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			let data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['answerSets', this.logID, 'restore', this.answerSet]
					},
					{
						'param_type': 'query',
						'params': {}
					},
					{
						'param_type': 'body',
						'params': {}
					}
				]
			}
			this.apiJson.method = 'GET';
			let dat = JSON.stringify(data);
			this.apiJson.data = dat;
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				let answerSetRes = [];
				var splitQuestions = response[0].Result.answers.split(',');

				/*pushing value to restoreQuesArr*/
				for (var i = 0; i < splitQuestions.length; i++) {
					if (splitQuestions[i] == 0) {
						this.restoreQuesArr.push({ 'question': i, 'QuestionValue': splitQuestions[i] });
					}
					else {

						this.restorePrevQuesArr.push({ 'question': i, 'QuestionValue': splitQuestions[i] });
						answerSetRes.push(splitQuestions[i]);
					}

				}
				/*if the length of restoreQuesArr is zero means all questions are answered */
				if (this.restoreQuesArr.length == 0) {
					/*Since all questions are answered goto result page*/
					this.storageService.sessionStorageSet('learnStyleAnswerSet', response[0].Result.answers);
					this.trackEvnt.learnStyleResultCall(response[0].Result.answers, usernotes);
				}
				else {

					/*If all questions are not answered go to assessment page */
					this.storageService.sessionStorageSet('save_Par_UserNotes', usernotes);
					this.storageService.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
					this.storageService.sessionStorageSet('restoreQuesArr', JSON.stringify(this.restoreQuesArr));
					this.storageService.sessionStorageSet('restorePrevQuesArr', JSON.stringify(this.restorePrevQuesArr));

					this.router.navigate(['../assessment'], {
						relativeTo: this.activatedRoute,
						queryParams: { lsAnswerSet: answerSet }
					});
				}

			}, this.utils.handleError);
		} catch (e) {
			console.log('restore questions lss exception' + e.message);
		}
	}

	/*this method is used to delete the answerset for learning style survey*/
	deleteLSAnswerSet(answerSet) {
		try {
			this.answerSet = answerSet;

			this.apiJson.endUrl = 'users/answerSets';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';

			let data = {

				input_data: [
					{
						'param_type': 'path',
						'params': [this.logID, 'delete', this.answerSet]
					},
					{
						'param_type': 'query',
						'params': {}
					},
					{
						'param_type': 'body',
						'params': {}
					}
				]

			}
			this.apiJson.method = 'GET';

			let dat = JSON.stringify(data);
			this.apiJson.data = dat;

			/*Check the action done in dialogbox */
			this.trackEvnt.showDeleteDialog(this.apiJson, 'LS');
		} catch (e) {
			console.log('delete ls answerset exception' + e.message);
		}
	}
}
