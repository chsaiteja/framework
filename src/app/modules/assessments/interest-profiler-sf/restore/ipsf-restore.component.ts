/**Angular2 Libraries **/
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
/**Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store } from '@ngrx/store';
import { AsmntCommonState } from '../../../../state-management/state/main-state';


@Component({
	selector: 'ipsf-restore',
	templateUrl: './ipsf-restore.layout.html',

})
export class IPSFRestoreComponent implements OnInit, OnDestroy {
	restoreAnswerSet = []; /**restoreAnswerSet variable storing the result of answerSets */
	ipreturnedVal; /**Declare for storing the assessment common text.*/
	restoreQuesArr = []; /**restoreQuesArr variable storing the restore questions */
	restorePrevQuesArr = []; /**restorePrevQues variable storing the previous questions */
	resLength = -1; /**Declare for storing the value of answersets length */
	deleteVal = ''; /**Declare for storing the delete answersets */
	logId; /**Declare for Storing the value for logID */
	answerSet;  /**Declare for Storing the value of answerSets */
	subscription = new Subscription(); /** Declare to listen if any change occured.*/

	constructor(private assssementSer: AssessmentsService,
		private activatedRoute: ActivatedRoute, private store: Store<AsmntCommonState>,
		private router: Router, private utils: Utilities, private storageService: StorageService,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService) {
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				this.getIPAnswerSet();
			}
		});
		this.ipreturnedVal = store.select('AsmntCommonText');
	}

	ngOnInit() {
		this.logId = this.storageService.sessionStorageGet('logID');
		this.storageService.sessionStorageSet('isFrom', 'restore');
		this.storageService.sessionStorageSet('mainPath', 'restore');
		this.getIPAnswerSet();
	}

    /**
     * This method is used for getting the answerset
     */
	getIPAnswerSet() {
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

				if (this.deleteVal !== '0' && this.deleteVal != null && this.deleteVal !== '') {

				}
			}, this.utils.handleError);
		} catch (e) {
			console.log('IPAnswer set exception-->' + e.message);
		}
	}

    /**
     * This method is used to restore the answer set and display the questions.
     * @param answerSet contains the answer set value
     * @param usernotes contains usernotes
     */
	restoreQuestionsIP(answerSet, usernotes) {
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

				let quesName = '';
				const answerSetRes = [];
				const splitQuestionsarray = [];
				const splitQuestions = response[0].Result.answers.split(',');
				for (let i = 0; i < splitQuestions.length; i++) {
					if (splitQuestions[i] === 'NR') {
						quesName = 'shortip_ques_q' + i;

						this.restoreQuesArr.push({ 'key': quesName, 'question': i, 'QuestionValue': splitQuestions[i] });
					} else {
						quesName = 'shortip_ques_q' + i;
						this.restorePrevQuesArr.push({ 'key': quesName, 'question': i, 'QuestionValue': splitQuestions[i] });
						answerSetRes.push(splitQuestions[i]);
					}
				}
				if (this.restoreQuesArr.length === 0) {

					this.storageService.sessionStorageSet('answerSetIP', response[0].Result.answers);
					this.assssementSer.getIpSfResult(response[0].Result.answers, response[0].Result.userNotes);

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
			console.log('restore questionsip exception-->' + e.message);
		}
	}

    /**
     * This method is used to delete the answerset for interest-profiler.
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
			this.assssementSer.showDeleteDialog(this.apiJson, 'IP');
		} catch (e) {
			console.log('Deleteip exception-->' + e.message);
		}
	}

	/** this ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
