/** Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
/** Custom imports */
import { Subscription } from 'rxjs/Subscription';
import { AsmntCommonState } from '../../../../state-management/state/main-state';
/** import shared Components */
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';




@Component({
	selector: 'wes-restore',
	templateUrl: './wes-restore.layout.html',
})
export class WESRestoreComponent implements OnInit, OnDestroy {
	restoreAnswerSet = [];/**restoreAnswerSet variable storing the result of answerSets */
	resLength = -1;/**Declare for storing the value of answersets length */
	deleteVal = '';/**Declare for storing the delete answersets */
	wesreturnedVal;/**Declare for storing the assessment common text.*/
	subscription = new Subscription();/** Declare to listen if any change occured.*/
	constructor(private store: Store<AsmntCommonState>, private trackEvnt: AssessmentsService, private eventService: EventDispatchService,
		private router: Router, private utils: Utilities, private storageService: StorageService,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private activeRoute: ActivatedRoute) {
		/** Below code block subscribe event and
	* calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'deleteAnswerSet') {
				this.deleteVal = this.storageService.sessionStorageGet('delAnswerSet');
				this.getWESAnswerSet();
			}
		});
		this.wesreturnedVal = store.select('AsmntCommonText');
	}

	ngOnInit() {
		this.storageService.sessionStorageSet('isFrom', 'restore');
		this.storageService.sessionStorageSet('mainPath', 'restore');
		this.storageService.sessionStorageSet('hashFrom', 'restore');
		this.getWESAnswerSet();
	}

	// Get all answer set and display in restore
	getWESAnswerSet() {
		this.utils.showLoading();
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [

				{
					'param_type': 'path',
					'params': [this.storageService.sessionStorageGet('logID')]
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
		this.apiJson.data = JSON.stringify(data);
		this.serverApi.callApi([this.apiJson]).subscribe((response) => {
			this.restoreAnswerSet = response[0].Result;
			this.resLength = this.restoreAnswerSet.length;
			this.utils.hideLoading();
		}, this.utils.handleError);
	}

	/**
	 * Get the answers for the required answer set and check whether
	 * It goes to result page or assessment page
	 */

	restoreQuestionsWES(answerSet, userNotes) {
		this.utils.showLoading();
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [

				{
					'param_type': 'path',
					'params': [this.storageService.sessionStorageGet('logID'), 'restore', answerSet]
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
			const allAnswers = [];
			let resultAns = '';
			const answ = (response[0].Result.answers).split(',');
			for (let i = 0; i < answ.length; i++) {
				if (answ[i] !== 'NR') {
					allAnswers.push(parseInt(answ[i], 10));
					if (i < (answ.length - 1)) {
						resultAns = resultAns + parseInt(answ[i], 10) + ',';
					} else {
						resultAns = resultAns + parseInt(answ[i], 10);
					}

				} else {
					break;
				}
			}
			if (allAnswers.length !== answ.length) {
				this.storageService.sessionStorageSet('save_Par_UserNotes', userNotes);
				this.storageService.sessionStorageSet('wesAnswers', JSON.stringify(allAnswers));
				this.storageService.sessionStorageSet('wesallQueLength', JSON.stringify(answ.length));
				this.router.navigate(['../assessment'], {
					relativeTo: this.activeRoute,
					queryParams: { wesAnswerSet: answerSet, usrNotes: userNotes }
				});
			} else {
				this.trackEvnt.wesResultCall(resultAns, userNotes);
			}
		}, this.utils.handleError);
	}

	// Dispatch the answer set number when user click on delete to delete that answer set
	DeleteWESAnswerSet(answerSet) {
		this.apiJson.endUrl = 'users/answerSets';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';
		const data = {
			input_data: [

				{
					'param_type': 'path',
					'params': [this.storageService.sessionStorageGet('logID'), 'delete', answerSet]
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
		this.trackEvnt.showDeleteDialog(this.apiJson, 'WES');
	}
	/** this ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
