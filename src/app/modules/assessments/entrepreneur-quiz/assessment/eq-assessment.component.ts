/*Import angular core packages*/
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, Action } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';
/*Custom imports*/
import { Subscription } from "rxjs/Subscription";

/*Shared component imports*/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, AsmntResponseState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';

@Component({
	selector: 'eq-assessment',
	templateUrl: './eq-assessment.layout.html'

})

export class EQAssessmentComponent implements OnInit, OnDestroy {


	cnt: any = 1; /**Declare for Stores the value of question number */
	currentValue: any = 0; /**CurrentValue variable  storing the value for filling progress bar */
	entrePreQuestionName: any = 0;
	showNxt: boolean = false; /**showNxt boolean variable used for showing the next button */
	isClassVisible: boolean = false; /**Previous button show or hide based on isClassVisible value */
	public type: string;/**type is a key which is used in payloadjson object */
	remaining: any = 0; /**Declare for storing the value of remaining questions */
	rem: any = 0; /**Declare for storing the value of current question */
	btnHighLight: any = -1;/** Declare for  storing the value for circle Highlighted  */
	prevLength: any = 0;/**Declare for storing the value of prevQuestion number */
	staticVal: any = 1;/**Declare for storing the current question number */
	eqQuesNames: any; /**Declare for storing the questions getting using sessionStorage */
	eqResponses: any; /**Declare for  Storing the responses getting using session Storage */
	logID: string; /**Declare for Storing for logID string value */
	answerSet: any = [];/**Declare for Storing the restoreAnswerSet getting using sessionStorageGet */
	prevQuestion: any = []; /**Declare for pushing the previous questions */
	restoreQuesArr1: any = [];/**Declare for Storing the restore questions array */
	restorePrevQuesArr1: any = [];/**Declare for Store the restore previous questions array */
	savePartialData: any = [];/**Declare for storing the answerSet */
	quesArr: any = []; /**Declare for Storing the questions in array */
	responsesArr: any = []; /**Declare for storing the responses in array */
	subscription2 = new Subscription;/**For storing the subscribe text for AssessmentQuestions text */
	subscription = new Subscription;/**For storing the event types of save_Partial and saveAnswerSet values */
	eqreturnedVal;/**Variable for storing the data from AsmntCommonText state reducer */
	QuestionText;/**Variable for storing the data from QuestionsText  reducer */
	responseText;/**Variable for storing the data from responseText reducer */
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly', 'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree'];
	lang;/**Variable for storing the changed language */
	constructor(private store: Store<AsmntCommonState>, private activatedRoute: ActivatedRoute, private router: Router, private trackEvnt: AssessmentsService,
		private dispatchStore: Store<Action>, private store1: Store<AsmntResponseState>, private commonlang: StoreService,
		private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass, private serverApi: ServerApi, private store2: Store<AsmntQuestionState>,
		private eventService: EventDispatchService) {
		this.eqreturnedVal = store.select('AsmntCommonText');

        /** Below code block listens broadcasted event and 
		 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			/** After event listen it will check whether user want to save partially or completely */

			if (e.type == 'save_Partial') {
				/** If user want to save partially, then we call the respective function 
				 * and we are setting true to isAssessment to tell that, we are saving from assessment.
				*/
				this.saveParitalAssesment();
			}
			else if (e.type == 'saveAnswerSet') {
				this.utils.hideLoading();
			}
		});
		//get the responses text from reducer
		this.responseText = this.store1.select('AsmntQuestionsResponses');
	}

	/** In eqFunction store the  questions,responses  to an arrays and 
	 * check the conditions for savedpartialasmnt and eqAnswerset is null or not  */
	eqFunction() {
		try {
			this.eqQuesNames = [];
			this.quesArr = [];
			this.eqQuesNames = JSON.parse(this.storageService.sessionStorageGet('ques'));
			this.eqResponses = this.responseText;

			/**Pushing the questions and responses text into quesArr and responsesArr arrays */
			for (let i = 0; i < this.eqQuesNames.commonIntroText.questions.length; i++) {
				this.quesArr.push(this.eqQuesNames.commonIntroText.questions[i].text);
			}

			/** Assigning the answer set to a variable */
			let eqAnswerSet: any;

			/** By using session storage we are checking either savedPartialAsmnt or eqAnswerSet is null or not.
			   * SavedPartialAsmnt is used in refresh condition where as eqAnswerSet is used in restore state.
			   * Based on the result, it will check whether to go to restore state, or to normal state.
			   */


			let routArr = -1;
			if (this.router.url.indexOf('?') != -1) {
				let Arr = this.router.url.split('?');

				if (Arr[1] != '' || Arr[1] != undefined) {
					routArr = parseInt(Arr[1].split('=')[1]);
				}
			}

			if ((this.storageService.sessionStorageGet('savedPartialAsmnt') != '') && (this.storageService.sessionStorageGet('savedPartialAsmnt') != null)) {

				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else if (routArr != -1) {

				this.utils.hideLoading();
				this.restoreAnswerSets();
			}
			else {
				/* clearing the restore answer session and starting exam*/
				this.storageService.sessionStorageRemove('restoreAnsers');
				this.startEntQuizPrExam();
			}
			this.utils.hideLoading();
		} catch (e) {
			console.log("exception--->" + e.message);
		}
	}

	/*This method is used for displaying the alert when startover button clicked*/
	saveChanges() {
		let eqchanges = true
		if (this.remaining == 0) {
			eqchanges = false;
		}
		return eqchanges;
	}

	/**ngOnInit method called when initialization of the component */
	ngOnInit() {
		this.utils.showLoading();
		this.lang = this.storageService.sessionStorageGet('langset');
		this.getEqQuesResponses();
	}



	/**this method is used for starting the previous exam when it comes from resore state */
	startEntQuizPrExam() {

		try {
			/* Checking whether it is restore state or normal state*/
			if (this.storageService.sessionStorageGet("restoreAnsers") == "yes") {
				/* If it is restore state, set default values */

				/* this.rem contain value of current question*/

				this.rem = this.eqQuesNames.commonIntroText.questions.length - this.restoreQuesArr1.length;
				this.remaining = this.restoreQuesArr1.length - 1;

				this.entrePreQuestionName = (this.rem);
				let value = 100 / this.eqQuesNames.commonIntroText.questions.length;
				this.currentValue = this.rem * value;
				this.cnt = this.rem + 1;
				this.prevLength = this.rem;
				this.staticVal = this.cnt;
				this.btnHighLight = -1;
				this.answerSet = JSON.parse(this.storageService.sessionStorageGet("restoreAnswerSet"));
				/* Getting answer set values using session storage*/
				for (let i = 0; i < this.cnt; i++) {
					this.prevQuestion.push({ "question": (i), "QuestionValue": this.answerSet[i] });
				}
			} else {

				/*It is normal state a new exam will be started*/
				this.storageService.sessionStorageRemove('restoreAnsers');
				this.isClassVisible = true;
				this.entrePreQuestionName = 0;
				this.remaining = this.eqQuesNames.commonIntroText.questions.length - 1;

				this.answerSet = [];
				/* Clearing previous restore values*/
				this.storageService.sessionStorageRemove('restoreAnswerSet');
				this.storageService.sessionStorageRemove('restoreQuesArr');
				this.storageService.sessionStorageRemove('restorePrevQuesArr');
			}
		} catch (e) {
			console.log("starting previous exam exception:" + e.message);
		}
	}

	/**getEqQuesResponses method for storing the questions api call in payload object 
	 * and has type key in questionpayload object */
	getEqQuesResponses() {

		// let questionpayload = {
		this.dispatchStore.dispatch({
			type: "GET_QUESTION_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: ['questions'],
				query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'EntQuiz'
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'questions', questionpayload);
		//Get the questions text from reducer
		this.subscription2 = this.store2.select('AsmntQuestionsText').subscribe((v) => {
			this.QuestionText = v;
			if (this.QuestionText.commonIntroText.questions + '' != 'undefined') {

				this.storageService.sessionStorageSet('ques', JSON.stringify(this.QuestionText));
				this.eqFunction();
			}

		});
	}

	/**when the next arrow was clicked the execute below function*/
	nextEQArrow(cnt) {
		try {
			this.remaining = this.remaining - 1;
			this.isClassVisible = false;
			/* Show or hide next Arrow based on the length of next array*/
			if ((this.cnt + 1) == this.staticVal) {
				this.showNxt = false;
			}
			else {
				this.showNxt = true;
			}
			this.prevLength = this.cnt;
			this.entrePreQuestionName = this.cnt
			this.cnt++;
			if ((this.cnt) == this.staticVal) {
				this.btnHighLight = -1;
			}
			else {
				this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
			}
		} catch (e) {
			console.log("next arrow clicked in entquiz exception" + e.message);
		}
	}

	/** If any circle clicked to answer the question*/
	callQuestion(quesAnswered) {

		try {
			/* Not in restore state and current question value is less than total question*/
			if (this.cnt <= 20) {

				this.remaining = this.remaining - 1;

				this.isClassVisible = false;
				let value = 100 / 20;

				/*Filling the bar based on the value*/
				if (this.staticVal == this.cnt) {
					this.currentValue = value * this.cnt;
				}

				this.entrePreQuestionName = this.cnt;

				if (this.storageService.sessionStorageGet('savePartial') == 'yes') {
					this.answerSet = [];
					this.answerSet = this.savePartialData;
					this.savePartialData = [];
					this.storageService.sessionStorageRemove('savePartial');
				}

				if (this.cnt == this.staticVal) {
					this.answerSet.push(quesAnswered);
					this.prevQuestion.push({ "question": (this.entrePreQuestionName - 1), "QuestionValue": quesAnswered });
				} else {
					this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
					this.answerSet[this.cnt - 1] = quesAnswered;

				}

				this.prevLength = this.cnt;
				if (this.cnt == 20) {
					/* If current question is the last question then set answer set*/
					this.remaining = 0;
					this.utils.showLoading();
					this.storageService.sessionStorageSet('entiQuizAnswerSet', this.answerSet.toString());
					this.trackEvnt.eqResultCall(this.answerSet.toString(), this.storageService.sessionStorageGet("save_Par_UserNotes"));
				}

				if (this.cnt == this.staticVal) {
					/*Hide the next arrow when the current question is new*/
					this.staticVal++;
				}

				if (this.cnt + 1 == this.staticVal) {
					this.showNxt = false;
					this.btnHighLight = -1;
				} else {
					this.btnHighLight = this.answerSet[this.cnt];
				}
				if (this.cnt != 20) {
					/* Increase the count value*/
					this.cnt = this.cnt + 1;
				}
			}
		} catch (e) {
			console.log("answering the question in entquiz assessment exception" + e.message);
		}
	}

	/*This method is used when user clicks On previous button to navigate to the  previous question*/
	previousQuestion() {
		try {
			/* Checking whether it is in restore state or not*/
			if (this.cnt > 1) {
				this.remaining = this.remaining + 1;
				this.prevLength = this.prevLength - 1;
				this.cnt = this.cnt - 1;
				this.entrePreQuestionName = this.cnt - 1;
				if (this.cnt == 1) {
					this.isClassVisible = true;
				}
				this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
				if (this.cnt == this.staticVal) {
					/* Hide the next arrow when the current question is new*/
					this.showNxt = false;
				}
				else {
					/* Show the next arrow when previous clicked*/
					this.showNxt = true;
				}
			}
		} catch (e) {
			console.log(" previous button in entquiz assessment exception" + e.message);
		}
	}

	/** The below function is used for partial save of assessment */
	saveParitalAssesment() {
		try {
			this.logID = this.storageService.sessionStorageGet('logID');
			this.storageService.sessionStorageSet('isAssessment', 'true');
			/*Setting true to isAssessment to tell that, we are saving from assessment.*/
			let answ = [];
			let lastarray = [];
			this.apiJson.method = "POST";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.endUrl = "Users";
			this.apiJson.moduleName = "Assessment/v1/";
			let SavePartialPost = {};

			try {
				this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));
			}
			catch (e) {
				console.log("json exception--->" + e.message);
			}

			this.storageService.sessionStorageSet('staticval', this.staticVal - 1);
			/* Storing answers in different states like restore and normal state*/
			try {
				let s = [];
				answ = this.answerSet;
				let last = answ.toString().split(",");
				let i;
				for (i = 0; i < this.staticVal - 1; i++) {
					lastarray.push(last[i]);
				}
				for (let i = this.staticVal - 1; i < this.eqQuesNames.commonIntroText.questions.length; i++) {
					lastarray.push(0);
				}

			} catch (e) {
				console.log("Exception----" + e.message);
			}

			SavePartialPost = {

				input_data: [
					{
						"param_type": "path",
						"params": ["savePartial", this.logID]
					},
					{
						"param_type": "query",
						"params": {}

					},
					{
						"param_type": "body",
						"params": {
							"answers": lastarray, "userNotes": "added"
						}
					}
				]
			}
			/*Showing popUp for save dialog*/
			let dat = JSON.stringify(SavePartialPost);
			this.apiJson.data = dat;
			this.trackEvnt.showSaveDialog(this.apiJson, 'EQ');
		} catch (e) {
			console.log("save partial assessment entquiz exception:" + e.message);
		}
	}

	restoreAnswerSets() {
		/** When we are in restore state */
		this.storageService.sessionStorageSet('restoreAnsers', 'yes');
		this.storageService.sessionStorageRemove('savePartial');
		this.restoreQuesArr1 = [];
		this.restorePrevQuesArr1 = [];
		/*Getting the answer set from restore page*/
		this.restoreQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restoreQuesArr'));

		this.restorePrevQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restorePrevQuesArr'));

		/* Starting the exam*/
		this.startEntQuizPrExam();
	}

	/**ngOnDestroy method is used for unsubscribe the event */
	ngOnDestroy() {
		this.subscription2.unsubscribe();
		this.subscription.unsubscribe();
	}
}