/**imported angular core libraries */
import { Component, OnInit, Output } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

/**imported services libraries */
import { Subscription } from 'rxjs/Subscription';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Store } from '@ngrx/store';
import { AsmntCommonState, defaultCommonText } from '../../../../state-management/state/main-state';



@Component({
	selector: 'ideas-restore',
	templateUrl: './ideas-restore.layout.html',
})
export class IdeasRestoreComponent {
	resLength = -1; /**Declare for storing the result length.*/
	deleteVal = ""; /**Declare for getting the delete answer set.*/
	logId; /**Declare for getting the logid for starting the assessment.*/
	answerSet; /**Declare for storing the answer set values.*/
	ideasreturnedVal; /**Declare for storing assessmentcommon text from the store.*/
	restoreAnswerSet = []; /**Declare for storing the answer sets that are restored.*/
	restoreQuesArr = []; /**Declare for storing the restore questions.*/
	restorePrevQuesArr = []; /**Declare for storing the previous question array.*/
	subscription = new Subscription(); /** Declare to listen if any change occured.*/

	constructor(private assssementSer: AssessmentsService,
		private activatedRoute: ActivatedRoute,
		private router: Router, private storageService: StorageService,
		private utils: Utilities,
		private apiJson: ApiCallClass,
		private serverApi: ServerApi, private store: Store<AsmntCommonState>,
		private eventService: EventDispatchService) {

		/**Here listening the deleteAnswerSet event */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				this.getIdeasAnswerSet();
			}
		})
		this.ideasreturnedVal = store.select('AsmntCommonText');
	}

	/** This  ngOnInit() function is initial loading Component*/
	ngOnInit() {
		try {
			this.logId = this.storageService.sessionStorageGet('logID');
			this.storageService.sessionStorageSet('isFrom', 'restore');
			this.storageService.sessionStorageSet('mainPath', 'restore');
			this.storageService.sessionStorageSet('hashFrom', 'restore');
			this.getIdeasAnswerSet();
		} catch (e) {
			console.log("getting init restore excepion :" + e.message);
		}
	}

	/** This restoreQuestionsIdeas(answerSet, usernotes) function is restore the answer and usernotes */
	restoreQuestionsIdeas(answerSet, usernotes) {
		try {
			this.answerSet = answerSet;
			this.utils.showLoading();
			this.storageService.sessionStorageSet('ShotIdeasAnswerSe', answerSet);
			this.apiJson.endUrl = "users/answerSets";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",

						"params": [this.logId, "restoreIDEAS", this.answerSet]
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

				let answerSetRes = [];
				var splitQuestions = response[0].Result.answers.split(',');
				for (var i = 0; i < splitQuestions.length; i++) {
					if (splitQuestions[i] == 'NR') {

						this.restoreQuesArr.push({ "QuestionValue": splitQuestions[i] });
					}
					else {
						this.restorePrevQuesArr.push({ "QuestionValue": splitQuestions[i] });
						answerSetRes.push(splitQuestions[i]);
					}
				}
				if (this.restoreQuesArr.length == 0) {
					this.storageService.sessionStorageSet('checkgrade', 'gradekey');
					this.storageService.sessionStorageSet('answerSetIdeas', response[0].Result.answers);
					this.storageService.sessionStorageSet('save_Par_UserNotes', response[0].Result.userNotes);
					if (response[0].Result.gradeLevel != 'no') {

						this.assssementSer.getIdeasResult(response[0].Result.answers.toString(), response[0].Result.gradeLevel,
							this.storageService.sessionStorageGet('save_Par_UserNotes'));
					} else {
						this.router.navigate(['../grade'], { relativeTo: this.activatedRoute });
					}

				}
				else {
					this.storageService.sessionStorageSet('save_Par_UserNotes', usernotes);
					this.storageService.sessionStorageSet('restoreAnswerSet', JSON.stringify(answerSetRes));
					this.storageService.sessionStorageSet('restoreQuesArr', JSON.stringify(this.restoreQuesArr));
					this.storageService.sessionStorageSet('restorePrevQuesArr', JSON.stringify(this.restorePrevQuesArr));
					this.router.navigate(['../assessment'], {
						relativeTo: this.activatedRoute,
						queryParams: { ideasAnswerSet: answerSet }
					});
				}

			}, this.utils.handleError)
		} catch (e) {
			console.log('restore Component excepion :' + e.message);
		}
	}
	/** This getIdeasAnswerSet() function is for getting answerSet */
	getIdeasAnswerSet() {
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
						"params": ["answerSets", this.logId]
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
				if (this.deleteVal != '0' && this.deleteVal != null && this.deleteVal != '') {
				}
			}, this.utils.handleError)
		} catch (e) {
			console.log("getting ideasAnswerSet excepion :" + e.message);
		}
	}

	/**This deleteIdeasAnswerSet(answerSet)  function is for delete the answerSet*/
	deleteIdeasAnswerSet(answerSet) {
		try {

			this.answerSet = answerSet;
			this.apiJson.endUrl = "users/answerSets";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {

				input_data: [
					{
						"param_type": "path",

						"params": [this.logId, "delete", this.answerSet]
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
			this.assssementSer.showDeleteDialog(this.apiJson, 'IDEAS');
		} catch (e) {
			console.log("delete answer excepion :" + e.message);
		}
	}

	/** This ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
