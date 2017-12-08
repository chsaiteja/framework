/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

/**Services **/
import { Subscription } from "rxjs/Subscription";
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'cci-jr-restore',
	templateUrl: './cci-restore.layout.html',
})
export class CCIJrRestoreComponent implements OnInit, OnDestroy {
	restoreAnswerSet = []; /**restoreAnswerSet variable storing the result of answerSets */
	restoreQuesArr = []; /**restoreQuesArr variable storing the restore questions */
	restorePrevQuesArr = []; /**restorePrevQues variable storing the previous questions */
	deleteVal = ''; /**Declare for storing the delete answersets */
	logId; /**Declare for Storing the value for logID */
	resLength = -1; /**Declare for storing the value of answersets length */
	answerSet; /**Declare for Storing the value of answerSets */
	ccireturnedVal; /**Declare for storing the assessmentcommon text.*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/

	constructor(private store: Store<AsmntCommonState>, private http: Http,
		private router: Router, private utils: Utilities, private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService, private storageService: StorageService,
		private assssementSer: AssessmentsService, private activatedRoute: ActivatedRoute) {
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				this.getCCIjrAnswerSet();
			}
		});
		this.ccireturnedVal = store.select('AsmntCommonText');
	}

	ngOnInit() {
		this.logId = this.storageService.sessionStorageGet('logID');
		/**Call the getCCIjrAnswerSet method for getting the answetSet value at the time of loading */
		this.getCCIjrAnswerSet();
	}

	/**
	 * This method is for getting the answer sets from the Api
	 */
	getCCIjrAnswerSet() {
		try {
			this.utils.showLoading();
			this.storageService.sessionStorageRemove('restoreQuesArr');
			this.storageService.sessionStorageRemove('restorePrevQuesArr');
			this.apiJson.endUrl = 'Users';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			const data = {
				input_data: [
					{
						'param_type': 'path',
						'params': ['answerSets', this.logId]
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
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				this.restoreAnswerSet = response[0].Result;

				this.resLength = this.restoreAnswerSet.length;
				this.utils.hideLoading();

				if (this.deleteVal !== '0' && this.deleteVal !== null && this.deleteVal !== '') {

				}
			}, this.utils.handleError);
		} catch (e) {
			console.log('Answer set exception-->' + e.message);
		}
	}

	/**
	 * This method is used to restore the answer set and display the questions.
	 * @param answerSet contains the answerset value.
	 * @param usernotes contains the usernotes.
	 */
	restoreQuestionsCCIjr(answerSet, usernotes) {
		try {
			this.answerSet = answerSet;

			this.utils.showLoading();
			this.storageService.sessionStorageSet('ShoptIPAnswerSet', answerSet);
			this.apiJson.endUrl = 'users/answerSets';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';

			const data = {

				input_data: [
					{
						'param_type': 'path',

						'params': [this.logId, 'restore', this.answerSet]
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
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {
				const quesName = '';
				const answerSetRes = [];
				const splitQuestionsarray = [];
				const splitQuestions = response[0].Result.answers.split(',');

				for (let i = 0; i < splitQuestions.length; i++) {
					if (splitQuestions[i] == 'NR') {
						this.restoreQuesArr.push({ 'QuestionValue': splitQuestions[i] });
					} else {
						this.restorePrevQuesArr.push({ 'QuestionValue': splitQuestions[i] });
						answerSetRes.push(splitQuestions[i]);
					}
				}
				if (this.restoreQuesArr.length == 0) {
					this.storageService.sessionStorageSet('answerSetCCIjr', response[0].Result.answers);
					/**The below function is for getting the result for the answer set. This is present in the
					 * assessment.service.ts. On success it navigates to the result page.
					 */
					this.assssementSer.getCCIjrResult(response[0].Result.answers, response[0].Result.userNotes);
				} else {

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
			console.log('restore questions exception-->' + e.message);
		}
	}

	/**
	 * This method is for deleting the answerset
	 * @param answerSet contains the answerset value
	 */
	DeleteIPAnswerSet(answerSet) {
		try {
			this.answerSet = answerSet;

			this.apiJson.endUrl = 'users/answerSets';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			const data = {
				input_data: [
					{
						'param_type': 'path',

						'params': [this.logId, 'delete', this.answerSet]
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
			this.assssementSer.showDeleteDialog(this.apiJson, 'CCI');
		} catch (e) {
			console.log('Delete cci exception-->' + e.message);
		}
	}

	/**
	 * This method is used for unsubscribing the event.
	 */

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
