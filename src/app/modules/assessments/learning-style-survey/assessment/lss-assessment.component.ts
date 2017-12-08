/*Import angular core packages*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from "rxjs/Subscription";

/*Shared component imports*/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { AsmntCommonState, AsmntResponseState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { langData } from '../../shared/constants/assessments-constants';
import { StoreService } from '../../../../state-management/services/store-service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Store, Action } from '@ngrx/store';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
	selector: 'lss-assessment',
	templateUrl: './lss-assessment.layout.html'

})
export class LSSAssessmentComponent implements OnInit, OnDestroy {

	lsResArray = [];/**Declare for storing the responses array */
	learnStyQues = [];/**Declare for storing the questions  */
	answerSet = [];/**Declare for storing the restore answerSet */
	quesCnt: any = 1;/**Declare for Stores the value of question number */
	currentValue: any = 0; /**CurrentValue variable  storing the value for filling progress bar */
	learnStyleQuestionName;/**Variable for storing the current question value in the assessment */
	staticVal: any = 1;/**Declare for storing the current question number */
	restoreQuesArr1 = [];/**Declare for Storing the restore questions array */
	rem: any = 0;/**Declare for storing the value of current question */
	remaining: any = 0;/**Declare for storing the value of remaining questions */
	prevQuestion = [];/**Declare for pushing the previous questions */
	prevLength: any = 0;/**Declare for storing the previous question length */
	showNxt: boolean = false;/**showNxt boolean variable used for showing the next button */
	btnHighLight: any = -1;/** Declare for  storing the value for circle Highlighted  */
	isClassVisible: boolean = false;/**Previous button show or hide based on isClassVisible value */
	savePartialData = [];
	restorePrevQuesArr1 = [];/**Declare for Store the restore previous questions array */
	logID: string;/*store logid*/
	qcnt: any;/**Declare for storing the questions length */
	learnStyleQuesNames: any;/*for storing the questions */
	learnStyleResponses: any;/*for storing the responses */
	lssreturnedVal;/**For storing the assessment common text */
	assessQuestions = new Subscription;/**Storing the subscribe assessment questions text */
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-somewhat', 'fa icon-asmnt-strongly-disagree'];
	subscription = new Subscription;/**save_Partial and saveAnswerSet events subscription */
	lang;/**Variable for storing the value of changed language */
	lssQuestionText;/**Variable for storing the subscribe value assessment question text */
	lssresponseText = {};/**Variable for storing the subscribe value of assessment response text */
	constructor(private router: Router, private utils: Utilities, private storageService: StorageService, private commonlang: StoreService, private store2: Store<AsmntQuestionState>,
		private activatedRoute: ActivatedRoute, private store: Store<AsmntCommonState>, private store1: Store<AsmntResponseState>,
		private dispatchStore: Store<Action>, private eventService: EventDispatchService,
		private trackEvnt: AssessmentsService, private apiJson: ApiCallClass) {
		this.lang = this.storageService.sessionStorageGet('langset');
		if (langData[this.storageService.sessionStorageGet('langset')] != undefined) {
			langData[this.storageService.sessionStorageGet('langset')] = {};
		}
		//Get the assessmentcommontext data from reducer
		this.lssreturnedVal = store.select('AsmntCommonText');
		//Get the assessmentQuestions data from reducer
		this.lssresponseText = store1.select('AsmntQuestionsResponses');

		/** Below code block listens broadcasted event and 
			   * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want to save partially or completely */

			if (e.type == 'save_Partial') {
				/** If user want to save partially, then we call the respective function 
                 * and we are setting true to isAssessment to tell that, we are saving from assessment.
                */
				this.saveParitalAssesment();
			} else if (e.type == 'saveAnswerSet') {
				this.utils.hideLoading();
			}
		});

	}

	/**ngOnInit method called when initializing the component */
	ngOnInit() {
		this.utils.showLoading();
		this.getLssQuesResponses();
	}

	/**lssFunction for the pushing the questions and responses to arrays */
	lssFunction() {
		try {
			this.learnStyleQuesNames = [];
			this.learnStyQues = [];
			this.learnStyleQuesNames = JSON.parse(this.storageService.sessionStorageGet("ques"));
			this.qcnt = this.learnStyleQuesNames.commonIntroText.questions.length;
			for (let i = 0; i < this.learnStyleQuesNames.commonIntroText.questions.length; i++) {
				this.learnStyQues.push(this.learnStyleQuesNames.commonIntroText.questions[i].text);

			}
			let lsAnswerSet;
			let routArr = -1;
			if (this.router.url.indexOf('?') != -1) {
				let Arr = this.router.url.split('?');

				if (Arr[1] != '' || Arr[1] != undefined) {
					routArr = parseInt(Arr[1].split('=')[1])
				}
			}

			if ((this.storageService.sessionStorageGet('savedPartialAsmnt') != '') &&
				(this.storageService.sessionStorageGet('savedPartialAsmnt') != null)) {
				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else if (routArr != -1) {
				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else {
				/*clearing the restore answer session and starting exam*/
				this.storageService.sessionStorageRemove('restoreAnsers');
				this.startInterestPrExam();
			}
			this.utils.hideLoading();
		} catch (e) {
			console.log("exception---->" + e.message);
		}
	}

	restoreAnswerSets() {
		/* When we are in restore state */
		this.storageService.sessionStorageSet('restoreAnsers', 'yes');
		this.storageService.sessionStorageRemove('savePartial');
		/*Getting the answer set from restore page*/
		this.restoreQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restoreQuesArr'));
		this.restorePrevQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restorePrevQuesArr'));
		/*starting the exam*/
		this.startInterestPrExam();
	}

	/**ngOnDestroy method called when destroying the component */
	ngOnDestroy() {
		window.location.href.replace(location.hash, "");
		this.subscription.unsubscribe();
		this.assessQuestions.unsubscribe();

	}

	/*This function is used for starting the previous exam when it is restore state*/
	startInterestPrExam() {
		try {
			/*checking whether it is restore state or normal state*/
			if (this.storageService.sessionStorageGet('restoreAnsers') == 'yes') {
				/*if it is restore state, set default values*/

				/*this.rem contain value of current question*/
				this.rem = this.learnStyleQuesNames.commonIntroText.questions.length - this.restoreQuesArr1.length;
				this.remaining = this.restoreQuesArr1.length - 1;
				this.learnStyleQuestionName = (this.rem);
				let value = 100 / this.qcnt;
				this.currentValue = this.rem * value;
				this.quesCnt = this.rem + 1;
				this.prevLength = this.rem;
				this.staticVal = this.quesCnt;
				this.btnHighLight = -1;
				this.answerSet = JSON.parse(this.storageService.sessionStorageGet('restoreAnswerSet'));

				/*Getting answer set values using session storage*/
				for (let i = 0; i < this.quesCnt; i++) {

					this.prevQuestion.push({ 'question': (i), 'QuestionValue': this.answerSet[i] });
				}

			} else {
				/* It is normal state a new exam will be started */
				this.storageService.sessionStorageRemove('restoreAnsers');
				this.isClassVisible = true;
				this.learnStyleQuestionName = 0;
				this.remaining = this.learnStyleQuesNames.commonIntroText.questions.length - 1;
				/*Clearing previous restore values*/
				this.storageService.sessionStorageRemove('restoreAnswerSet');
				this.storageService.sessionStorageRemove('restoreQuesArr');
				this.storageService.sessionStorageRemove('restorePrevQuesArr');
			}
		} catch (e) {
			console.log('start prexam exception--->' + e.message);
		}
	}

	/*This function is used for the call the next question while clicking the response in the assessment*/
	callQuestion(quesAnswered) {
		try {
			if (this.quesCnt <= this.qcnt) {
				this.remaining = this.remaining - 1;
				this.isClassVisible = false;
				let value = 100 / this.qcnt;
				/*Filling the bar based on the value*/
				if (this.staticVal == this.quesCnt) {
					this.currentValue = value * this.quesCnt;
				}
				this.learnStyleQuestionName = this.quesCnt;
				if (this.storageService.sessionStorageGet('savePartial') == 'yes') {
					this.answerSet = [];
					this.answerSet = this.savePartialData;
					this.savePartialData = [];
					this.storageService.sessionStorageRemove("savePartial");
				}
				if (this.quesCnt == this.staticVal) {
					this.answerSet.push(quesAnswered);
					this.prevQuestion.push({
						'question': (this.learnStyleQuestionName - 1),
						'QuestionValue': quesAnswered
					});
				}
				else {
					this.prevQuestion[this.quesCnt - 1].QuestionValue = quesAnswered;
					this.answerSet[this.quesCnt - 1] = quesAnswered;

				}
				this.prevLength = this.quesCnt;

				if (this.quesCnt == this.qcnt) {
					/*if current question is the last question then set answer set*/
					this.remaining = 0;
					this.utils.showLoading();
					this.storageService.sessionStorageSet('learnStyleAnswerSet', this.answerSet.toString());

					this.trackEvnt.learnStyleResultCall(this.answerSet.toString(), this.storageService.sessionStorageGet("save_Par_UserNotes"));
				}
				if (this.quesCnt == this.staticVal) {
					/*Hide the next arrow when the current question is new*/
					this.staticVal++;
				}
				if (this.quesCnt + 1 == this.staticVal) {
					this.showNxt = false;
					this.btnHighLight = -1;
				}
				else {
					this.btnHighLight = this.answerSet[this.quesCnt];
				}
				if (this.quesCnt != this.qcnt) {
					/*increase the count value*/
					this.quesCnt = this.quesCnt + 1;
				}
			}
		} catch (e) {
			console.log('call question exception' + e.message);
		}
	}

	/*This function is used for clicking next arrow in the assessment.*/
	nextLSArrow(cnt) {
		try {
			this.remaining = this.remaining - 1;
			this.isClassVisible = false;
			/*show or hide next Arrow based on the length of next array*/
			if ((this.quesCnt + 1) == this.staticVal) {
				this.showNxt = false;
			}
			else {
				this.showNxt = true;
			}
			this.prevLength = this.quesCnt;
			this.learnStyleQuestionName = this.quesCnt;
			this.quesCnt++;
			if ((this.quesCnt) == this.staticVal) {
				this.btnHighLight = -1;
			}
			else {
				this.btnHighLight = parseInt(this.prevQuestion[this.quesCnt - 1].QuestionValue);

			}
		} catch (e) {
			console.log('next arrow' + e.message);
		}
	}

	/*This method is used when user clicks On previous button to navigate to the  previous question*/
	previousQuestion() {
		/*checking whether it is in restore state or not*/
		try {
			if (this.quesCnt > 1) {

				this.remaining = this.remaining + 1;
				this.prevLength = this.prevLength - 1;
				this.quesCnt = this.quesCnt - 1;
				this.learnStyleQuestionName = this.quesCnt - 1;
				if (this.quesCnt == 1) {
					this.isClassVisible = true;
				}
				this.btnHighLight = parseInt(this.prevQuestion[this.quesCnt - 1].QuestionValue);

				if (this.quesCnt == this.staticVal) {
					/*Hide the next arrow when the current question is new*/
					this.showNxt = false;
				}
				else {
					/*show the next arrow when previous clicked*/
					this.showNxt = true;
				}
			}
		} catch (e) {
			console.log('previous question exception' + e.message);
		}
	}

	/**getLssQuesResponses method for the lssquespayload object which contains type and payload objects */
	getLssQuesResponses() {

		// let lssquespayload = {
		this.dispatchStore.dispatch({
			type: "GET_QUESTION_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: ['questions'],
				query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'LearnStyle'
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'questions', lssquespayload);
		this.assessQuestions = this.store2.select('AsmntQuestionsText').subscribe((v) => {
			this.lssQuestionText = v;
			if (this.lssQuestionText.commonIntroText.questions + '' != 'undefined') {
				this.storageService.sessionStorageSet('ques', JSON.stringify(this.lssQuestionText));
				this.lssFunction();
			}
		});

	}

	/** The below function is used for partial save of assessment */
	saveParitalAssesment() {

		try {
			this.logID = this.storageService.sessionStorageGet('logID');
			this.storageService.sessionStorageSet('isAssessment', 'true');
			/*Setting true to isAssessment to tell that, we are saving from assessment.*/
			let answ = [];
			let lastarray = [];
			this.apiJson.method = 'POST';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.endUrl = 'Users';
			this.apiJson.moduleName = 'Assessment/v1/';
			let SavePartialPost = {};
			try {
				this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));
			}
			catch (e) {
				console.log('json exception--->' + e.message);
			}

			this.storageService.sessionStorageSet('staticval', this.staticVal - 1);
			/*storing answers in different states like restore and normal state*/
			try {
				let s = [];
				answ = this.answerSet;

				let last = answ.toString().split(',');
				let i;
				for (i = 0; i < this.staticVal - 1; i++) {
					lastarray.push(last[i]);
				}

				for (let i = this.staticVal - 1; i < this.learnStyleQuesNames.commonIntroText.questions.length; i++) {
					lastarray.push(0);
				}

			}
			catch (e) {
				console.log('Exception----' + e.message);
			}

			SavePartialPost = {

				input_data: [
					{
						'param_type': 'path',
						'params': ['savePartial', this.logID]
					},
					{
						'param_type': 'query',
						'params': {}
					},
					{
						'param_type': 'body',
						'params': { 'answers': lastarray, 'userNotes': 'added' }
					}
				]

			}
			/*showing popUp for save dialog*/

			this.apiJson.data = JSON.stringify(SavePartialPost);

			this.trackEvnt.showSaveDialog(this.apiJson, 'LS');
		} catch (e) {
			console.log('save partial assessment exception' + e.message);
		}
	}

	/*This method is used for displaying the alert when startover button clicked*/
	saveChanges() {
		let lsschanges = true
		if (this.remaining == 0) {
			lsschanges = false;
		}
		return lsschanges;
	}
}
