/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/**Services */
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState, AsmntResponseState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'ipsf-assessment',
	templateUrl: './ipsf-assessment.layout.html'
})

export class IPSFAssessmentComponent implements OnInit, OnDestroy {

	InterestQuestionName = 0; /**Declare for storing the remaining values.*/
	cnt = 1; /**Declare for Stores the value of question number */
	showNxtIP = false; /**showNxt boolean variable used for showing the next button */
	isClassVisible = false; /**Previous button show or hide based on isClassVisible value */
	rem = 0; /**Declare for storing the value of current question */
	currentValue = 0; /**CurrentValue variable  storing the value for filling progress bar */
	public type: string;
	remaining = 0; /**Declare for storing the value of remaining questions */
	answerSet = []; /**Declare for Storing the restoreAnswerSet getting using sessionStorageGet */
	prevLength = 0; /**Declare for storing the value of prevQuestion number */
	prevQuestion = []; /**Declare for pushing the previous questions */
	restoreQuesArr1 = []; /**Declare for Storing the restore questions array */
	restorePrevQuesArr1 = []; /**Declare for Store the restore previous questions array */
	btnHighLight = -1; /** Declare for  storing the value for circle Highlighted  */
	staticVal = 1; /**Declare for storing the current question number */
	savePartialData = []; /**Declare for storing the answerSet */
	ipQuesNames; /**Declare for storing the questions getting using sessionStorage */
	logId; /**Declare for Storing for logID string value */
	ipQuesResponses; /**Declare for  Storing the responses getting using session Storage */
	questionArr = []; /**Declare for Storing the questions in array */
	responsesArr = []; /**Declare for storing the responses in array */
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree'];
	/**Declare for storing the icon array.*/
	subscription = new Subscription;  /** Declare to listen if any change occured.*/
	reducerSub1 = new Subscription;  /** Declare to listen if any change occured.*/
	ipreturnedVal; /**Declare for storing the assessmentcommon text.*/
	responseText; /**Declare for storing the response text.*/
	lang; /**Declare for getting the language values.*/
	QuestionText; /**Declare for storing the questions text.*/

	constructor(private activatedRoute: ActivatedRoute, private trackEvnt: AssessmentsService,
		private dispatchStore: Store<Action>, private serverApi: ServerApi, private router: Router,
		private utils: Utilities, private storageService: StorageService,
		private store: Store<AsmntCommonState>, private store2: Store<AsmntResponseState>,
		private store1: Store<AsmntQuestionState>,
		private apiJson: ApiCallClass,
		private eventService: EventDispatchService, private common: StoreService) {
		this.lang = this.storageService.sessionStorageGet('langset');
		this.responseText = this.store1.select('AsmntQuestionsResponses');

		/** Below code block listens broadcasted event and
		  * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type == 'save_Partial') {
				this.saveParitalAssesment();
			} else if (e.type == 'saveAnswerSet') {
				this.utils.hideLoading();
			}
		});
		this.ipreturnedVal = store.select('AsmntCommonText');
	}

	ngOnInit() {
		this.utils.showLoading();
		this.getIPQues();

	}

	/**This method is for getting the question names and answersets.*/
	ipsf_Func() {
		this.questionArr = [];
		this.responsesArr = [];
		this.ipQuesNames = [];
		this.ipQuesNames = JSON.parse(this.storageService.sessionStorageGet('ipques'));
		try {
			for (let i = 0; i < this.ipQuesNames.commonIntroText.questions.length; i++) {
				this.questionArr.push(this.ipQuesNames.commonIntroText.questions[i].text);
			}
			this.logId = this.storageService.sessionStorageGet('logID');
			let eqAnswerSet: any;
			this.activatedRoute.queryParams.subscribe((params: Params) => {
				eqAnswerSet = params['eqAnswerSet'];
			});
			this.utils.hideLoading();
			let routArr = -1;
			if (this.router.url.indexOf('?') != -1) {
				let Arr = this.router.url.split('?');

				if (Arr[1] != '' || Arr[1] != undefined) {
					routArr = parseInt(Arr[1].split('=')[1])
				}
			}
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
				this.startEnterExam();
			}
		} catch (e) {
			console.log('exception in ipsf_Func-->' + e.message);
		}
	}

    /**
     * This method is for getting the IP questions
     */
	getIPQues() {
		try {
			// let payloadjson = {
			this.dispatchStore.dispatch({
				type: "GET_QUESTION_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['questions'], query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'ShortIP'
				}
			});
			// this.common.commonLanguageChange(this.lang, 'questions', payloadjson);
			this.reducerSub1 = this.store2.select('AsmntQuestionsText').subscribe((v) => {
				this.QuestionText = v;
				if (this.QuestionText.commonIntroText.questions != undefined) {
					this.storageService.sessionStorageSet('ipques', JSON.stringify(this.QuestionText));
					this.ipsf_Func();
				}
			});
		} catch (e) {
			console.log('IP Questions exception-->' + e.message);
		}
	}

    /**
     * This method is for starting the assessement 
     */
	startEnterExam() {
		if (this.storageService.sessionStorageGet('restoreAnsers') == 'yes') {
			this.rem = this.ipQuesNames.commonIntroText.questions.length - this.restoreQuesArr1.length;
			this.remaining = this.restoreQuesArr1.length - 1;
			this.InterestQuestionName = (this.rem);
			const value = 100 / this.ipQuesNames.commonIntroText.questions.length;
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
			this.isClassVisible = true;
			this.InterestQuestionName = 0;
			this.remaining = this.ipQuesNames.commonIntroText.questions.length - 1;
			this.answerSet = [];
			this.storageService.sessionStorageRemove('restoreAnswerSet');
			this.storageService.sessionStorageRemove('restoreQuesArr');
			this.storageService.sessionStorageRemove('restorePrevQuesArr');
		}
	}

    /**
     *This method is for when the next arrow was clicked the below function execute 
     * @param cnt contains count of the questions
     */
	nextIPArrow(cnt) {
		this.remaining = this.remaining - 1;
		this.isClassVisible = false;
		/** Show or hide next Arrow based on the length of next array*/
		if ((this.cnt + 1) == this.staticVal) {
			this.showNxtIP = false;
		} else {
			this.showNxtIP = true;
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
     * This method is for if any circle clicked to answer the question
     * @param quesAnswered contains the questions which are answered
     */
	callQuestion(quesAnswered) {
		try {
			if (this.cnt <= this.ipQuesNames.commonIntroText.questions.length) {
				this.remaining = this.remaining - 1;
				this.isClassVisible = false;
				const value = 100 / this.ipQuesNames.commonIntroText.questions.length;
				/** Filling the bar based on the value*/
				if (this.staticVal == this.cnt) {
					this.currentValue = value * this.cnt;
				}
				this.InterestQuestionName = this.cnt;
				const quesName = this.cnt - 1;
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
				if (this.cnt == this.ipQuesNames.commonIntroText.questions.length) {
					/**If current question is the last question then set answer set*/
					this.remaining = 0;
					this.utils.showLoading();
					this.storageService.sessionStorageSet('answerSetIP', this.answerSet.toString());
					this.trackEvnt.getIpSfResult(this.answerSet.toString(), this.storageService.sessionStorageGet('save_Par_UserNotes'));
				}
				if (this.cnt == this.staticVal) {
					/**Hide the next arrow when the current question is new*/
					this.staticVal++;
				}
				if (this.cnt + 1 == this.staticVal) {
					this.showNxtIP = false;
					this.btnHighLight = -1;
				} else {
					this.btnHighLight = this.answerSet[this.cnt];
				}
				if (this.cnt !== this.ipQuesNames.commonIntroText.questions.length) {
					/**Increase the count value*/
					this.cnt = this.cnt + 1;
				}
			}
		} catch (e) {
			console.log('IP question exception-->' + e.message);
		}
	}

    /**
     *This method is used when user clicks On previous button to navigate to the  previous question
     */
	previousQuestion() {
		/** Checking whether it is in restore state or not*/
		if (this.cnt > 1) {
			this.remaining = this.remaining + 1;
			this.prevLength = this.prevLength - 1;
			this.cnt = this.cnt - 1;
			this.InterestQuestionName = this.cnt - 1;
			if (this.cnt == 1) {
				this.isClassVisible = true;
			}
			this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue, 10);
			if (this.cnt == this.staticVal) {
				/** Hide the next arrow when the current question is new*/
				this.showNxtIP = false;
			} else {
				/**Show the next arrow when previous clicked*/
				this.showNxtIP = true;
			}
		}
	}

    /**
     * This function is for saving the answers when we are in the middle of the assessement
     */
	saveParitalAssesment() {
		let answ = [];
		const lastarray = [];
		this.storageService.sessionStorageSet('isAssessment', 'true');
		this.apiJson.method = 'POST';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.endUrl = 'Users';
		this.apiJson.moduleName = 'Assessment/v1/';
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
						'answers': lastarray,
						'userNotes': 'added'
					}
				}
			]

		};

		try {
			this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));
		} catch (e) {
			console.log('json exception--->' + e.message);
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
			for (i = this.staticVal - 1; i < this.ipQuesNames.commonIntroText.questions.length; i++) {
				lastarray.push('NR');
			}
		} catch (e) {
			console.log('Exception----' + e.message);
		}
		const dat = JSON.stringify(data);
		this.apiJson.data = dat;
		this.trackEvnt.showSaveDialog(this.apiJson, 'IP');
	}

    /**
     * This method is for restoring the set of answers
     */
	restoreAnswerSets() {
		this.storageService.sessionStorageSet('restoreAnsers', 'yes');
		this.storageService.sessionStorageRemove('savePartial');
		this.restoreQuesArr1 = [];
		this.restoreQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restoreQuesArr'));
		this.restorePrevQuesArr1 = [];
		this.restorePrevQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restorePrevQuesArr'));
		this.storageService.sessionStorageSet('restoreAnsers', 'yes');
		this.startEnterExam();
	}

    /**
     * This function is for changing the text of the language desired by us 
     */
	saveChanges() {
		let ipchanges = true;
		if (this.remaining == 0) {
			ipchanges = false;
		}
		return ipchanges;
	}

    /**
     * This method is used for unsubscribing the event
     */
	ngOnDestroy() {
		window.location.href.replace(location.hash, '');
		this.reducerSub1.unsubscribe();
		this.subscription.unsubscribe();
		this.storageService.sessionStorageRemove('ipques');
	}
}
