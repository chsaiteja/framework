/**Angular2 Libraries **/
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Store, Action } from '@ngrx/store';

/**Services **/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, AsmntResponseState, AsmntQuestionState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'cci-jr-assessment',
	templateUrl: './cci-assessment.layout.html',
})

export class CCIJrAssessmentComponent implements OnInit, OnDestroy {
	restoreQuesArr1 = []; /**Declare for Storing the restore questions array */
	prevQuestion = []; /**Declare for pushing the previous questions */
	answerSet = []; /**Declare for Storing the restoreAnswerSet getting using sessionStorageGet */
	cciQuestionsArr = []; /**Declare for Storing the questions in array */
	cciResponsesArr = []; /**Declare for storing the responses in array */
	savePartialData = []; /**Declare for storing the answerSet */
	restorePrevQuesArr1 = []; /**Declare for Store the restore previous questions array */
	showNxtCCIjr = false; /**showNxt boolean variable used for showing the next button */
	rem = 0; /**Declare for storing the value of current question */
	prevLength = 0; /**Declare for storing the value of prevQuestion number */
	InterestQuestionName = 0;
	currentValue = 0; /**CurrentValue variable  storing the value for filling progress bar */
	remaining = 0; /**Declare for storing the value of remaining questions */
	staticVal = 1; /**Declare for storing the current question number */
	cnt = 1; /**Declare for Stores the value of question number */
	logId; /**Declare for Storing for logID string value */
	cciQuesNames; /**Declare for storing the questions getting using sessionStorage */
	ccijrQuesResponses; /**Declare for  Storing the responses getting using session Storage */
	isClassVisibleCCI = false; /**Previous button show or hide based on isClassVisible value */
	subscription = new Subscription; /** Declare to listen if any change occured.*/
	subscription2 = new Subscription; /** Declare to listen if any change occured.*/
	btnHighLight = -1; /** Declare for  storing the value for circle Highlighted  */
	ccireturnedVal; /**Declare for storing assessmentcommontext from the store. */
	QuestionText; /**Declare for storing the questions text.*/
	responseText; /**Declare for storing the question responses text.*/
	lang; /**Declare for getting the particular language.*/
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat']; /**Declare for storing an array icons.*/

	constructor(private activeRoute: ActivatedRoute, private apiJson: ApiCallClass,
		private trackEvnt: AssessmentsService, private activatedRoute: ActivatedRoute,
		private store: Store<AsmntCommonState>, private store1: Store<AsmntResponseState>,
		private dispatchStore: Store<Action>, private common: StoreService, private eventService: EventDispatchService,
		private http: Http, private router: Router, private store2: Store<AsmntQuestionState>,
		private serverApi: ServerApi, private utils: Utilities, private storageService: StorageService
	) {
		this.lang = this.storageService.sessionStorageGet('langset');
		this.responseText = this.store1.select('AsmntQuestionsResponses');
		/** Below code block listens broadcasted event and
				* calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == 'save_Partial') {
				this.saveParitalAssesment();
			} else if (e.type == 'saveAnswerSet') {
				this.utils.hideLoading();
			} else if (e.type === 'languageChanged') {
				this.utils.showLoading();
				this.lang = this.storageService.sessionStorageGet('langset');
				this.getCCIjrQues();
			}
		});
		this.ccireturnedVal = store.select('AsmntCommonText');
	}

	ngOnInit() {
		this.utils.showLoading();
		this.getCCIjrQues();
	}

	/**
	 * This method is used for getting the questions and responses.
	*/
	cciFun() {
		this.cciQuestionsArr = [];
		this.cciResponsesArr = [];
		this.cciQuesNames = [];
		this.cciQuesNames = JSON.parse(this.storageService.sessionStorageGet('ques'));

		try {
			for (let i = 0; i < this.cciQuesNames.commonIntroText.questions.length; i++) {
				this.cciQuestionsArr.push(this.cciQuesNames.commonIntroText.questions[i].text);
			}

			this.logId = this.storageService.sessionStorageGet('logID');
			let eqAnswerSet: any;
			let routArr = -1;
			if (this.router.url.indexOf('?') != -1) {
				let Arr = this.router.url.split('?');

				if (Arr[1] != '' || Arr[1] != undefined) {
					routArr = parseInt(Arr[1].split('=')[1])
				}
			}
			this.utils.hideLoading();
			if ((this.storageService.sessionStorageGet('savedPartialAsmnt') !== '') &&
				(this.storageService.sessionStorageGet('savedPartialAsmnt') != null)) {
				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else if (routArr != -1) {
				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else {
				this.storageService.sessionStorageRemove('restoreAnsers');
				this.storageService.sessionStorageRemove('savePartial');
				this.startEntrePreExam();

			}

		} catch (e) {
			console.log('cciFun:' + e.message);
		}
	}

	/**
	 * This method is for getting the questions for CCI from API.
	*/
	getCCIjrQues() {
		try {
			// let payloadjson = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['questions'], query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: this.storageService.sessionStorageGet('CCIassessment')
				}
			});
			// this.common.commonLanguageChange(this.lang, 'questions', payloadjson);

			this.subscription2 = this.store2.select('AsmntQuestionsText').subscribe((res) => {
				this.QuestionText = res;
				if (this.QuestionText.commonIntroText.questions != undefined) {
					this.storageService.sessionStorageSet('ques', JSON.stringify(this.QuestionText));
					this.cciFun();
				}
			});
		} catch (e) {
			console.log('CCI questions exception-->' + e.message);
		}
	}

	/**
	 * This function is for starting the CCIjr assessement.
	*/
	startEntrePreExam() {
		if (this.storageService.sessionStorageGet('restoreAnsers') == 'yes') {
			this.rem = this.cciQuesNames.commonIntroText.questions.length - this.restoreQuesArr1.length;
			this.remaining = this.restoreQuesArr1.length - 1;
			this.InterestQuestionName = (this.rem);
			const value = 100 / this.cciQuesNames.commonIntroText.questions.length;
			this.currentValue = this.rem * value;
			this.cnt = this.rem + 1;
			this.prevLength = this.rem;
			this.staticVal = this.cnt;
			this.btnHighLight = -1;
			this.answerSet = JSON.parse(this.storageService.sessionStorageGet('restoreAnswerSet'));
			for (let i = 0; i < this.cnt; i++) {
				this.prevQuestion.push({ 'QuestionValue': this.answerSet[i] });
			}
		} else {
			this.isClassVisibleCCI = true;
			this.InterestQuestionName = 0;
			this.remaining = this.cciQuesNames.commonIntroText.questions.length - 1;
			this.answerSet = [];
			this.storageService.sessionStorageRemove('restoreAnswerSet');
			this.storageService.sessionStorageRemove('restoreQuesArr');
			this.storageService.sessionStorageRemove('restorePrevQuesArr');
		}
	}

	/**
	 * This function gets called when we click  the  arrow in the assessement page.
	*/
	nextCCIArrow(cnt) {
		this.remaining = this.remaining - 1;
		this.isClassVisibleCCI = false;
		/**Show or hide next Arrow based on the length of next array.*/
		if ((this.cnt + 1) == this.staticVal) {
			this.showNxtCCIjr = false;
		} else {
			this.showNxtCCIjr = true;
		}
		this.prevLength = this.cnt;
		this.InterestQuestionName = this.cnt;
		this.cnt++;
		if ((this.cnt) == this.staticVal) {
			this.btnHighLight = -1;
		} else {
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue, 10);
		}
	}

	/**
	 * This method is for if any circle clicked to answer the question.
	*/
	callQuestion(quesAnswered) {
		try {
			if (this.cnt <= this.cciQuesNames.commonIntroText.questions.length) {
				this.remaining = this.remaining - 1;
				this.isClassVisibleCCI = false;
				const value = 100 / this.cciQuesNames.commonIntroText.questions.length;
				/**Filling the bar based on the value*/
				if (this.staticVal == this.cnt) {
					this.currentValue = value * this.cnt;
				}
				this.InterestQuestionName = this.cnt;
				const quesName = 'shortip_ques_q' + (this.cnt - 1);
				if (this.storageService.sessionStorageGet('savePartial') == 'yes') {
					this.answerSet = [];
					this.answerSet = this.savePartialData;
					this.savePartialData = [];
					this.storageService.sessionStorageRemove('savePartial');
				}
				if (this.cnt == this.staticVal) {
					this.answerSet.push(quesAnswered);
					this.prevQuestion.push({ 'key': quesName, 'question': (this.InterestQuestionName - 1), 'QuestionValue': quesAnswered });
				} else {
					this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
					this.answerSet[this.cnt - 1] = quesAnswered;

				}
				this.prevLength = this.cnt;
				if (this.cnt == this.cciQuesNames.commonIntroText.questions.length) {

					/**If current question is the last question then set answer set.*/
					this.remaining = 0;
					this.utils.showLoading();
					this.storageService.sessionStorageSet('answerSetCCIjr', this.answerSet.toString());

					this.trackEvnt.getCCIjrResult(this.answerSet.toString(), this.storageService.sessionStorageGet('save_Par_UserNotes'));
				}
				if (this.cnt == this.staticVal) {
					/**Hide the next arrow when the current question is new*/
					this.staticVal++;
				}
				if (this.cnt + 1 == this.staticVal) {
					this.showNxtCCIjr = false;
					this.btnHighLight = -1;
				} else {
					this.btnHighLight = this.answerSet[this.cnt];
				}
				if (this.cnt !== this.cciQuesNames.commonIntroText.questions.length) {
					/**Increase the count value*/
					this.cnt = this.cnt + 1;
				}
			}
		} catch (e) {
			console.log('cci callquestion exception-->' + e.message);
		}
	}

	/**
	 * This method is used when user clicks On previous button to navigate to the  previous question.
	 */
	previousQuestion() {
		/**Checking whether it is in restore state or not*/
		if (this.cnt > 1) {
			this.remaining = this.remaining + 1;
			this.prevLength = this.prevLength - 1;
			this.cnt = this.cnt - 1;
			this.InterestQuestionName = this.cnt - 1;
			if (this.cnt == 1) {
				this.isClassVisibleCCI = true;
			}
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue, 10);
			if (this.cnt == this.staticVal) {
				/**Hide the next arrow when the current question is new.*/
				this.showNxtCCIjr = false;
			} else {
				/**Show the next arrow when previous clicked.*/
				this.showNxtCCIjr = true;
			}
		}
	}

	/**
	 * This function is for saving the answers when we are in the middle of the assessement.
	 */
	saveParitalAssesment() {
		let answ = [];
		const lastarray = [];
		let strArr = '';
		this.storageService.sessionStorageSet('isAssessment', 'true');
		this.apiJson.method = 'POST';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.endUrl = 'Users';
		this.apiJson.moduleName = 'Assessment/v1/';

		try {
			this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));
		} catch (e) {
			alert('json exception--->' + e.message);
		}

		this.storageService.sessionStorageSet('staticval', this.staticVal - 1);

		try {
			const s = [];
			answ = this.answerSet;
			const last = answ.toString().split(',');

			let i;
			for (i = 0; i < this.staticVal - 1; i++) {
				lastarray.push(last[i]);

			}
			for (i = this.staticVal - 1; i < this.cciQuesNames.commonIntroText.questions.length; i++) {

				lastarray.push('NR');
			}
			strArr = lastarray.toString();
		} catch (e) {
			alert('Exception----' + e.message);
		}

		const data = {
			input_data: [
				{

					'param_type': 'path',
					'params': ['savePartial', this.logId]
				},
				{
					'param_type': 'query',
					'params': {}
				},
				{
					'param_type': 'body',
					'params': {
						'answers': strArr,
						'userNotes': 'added'
					}
				}
			]

		};
		const dat = JSON.stringify(data);

		this.apiJson.data = dat;
		this.trackEvnt.showSaveDialog(this.apiJson, 'CCI');
	}

	/**
	 * This is for restoring the set of answers.
	*/
	restoreAnswerSets() {
		this.storageService.sessionStorageSet('restoreAnsers', 'yes');
		this.storageService.sessionStorageRemove('savePartial');
		this.restoreQuesArr1 = [];
		this.restoreQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restoreQuesArr'));
		this.restorePrevQuesArr1 = [];
		this.restorePrevQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restorePrevQuesArr'));
		this.startEntrePreExam();
	}

	/**
	 * This method is used for displaying the alert when startover button clicked.
	 */
	saveChanges() {
		let ccichanges = true;
		if (this.remaining == 0) {
			ccichanges = false;
		}
		return ccichanges;
	}

	/**
	 * This method is used for unsubscribing the event.
	 */

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subscription2.unsubscribe();
		this.storageService.sessionStorageRemove('ques');
		window.location.href.replace(location.hash, '');
	}
}

