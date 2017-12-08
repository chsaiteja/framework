/** Angular imports */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/** import shared Components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState, AsmntResponseState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';

@Component({
	selector: 'wes-assessment',
	templateUrl: './wes-assessment.layout.html'

})
export class WESAssessmentComponent implements OnInit, OnDestroy {

	WES_Questions = [];
	WES_Responses = [];
	wes_icons = ['icon-asmnt-strongly-agree', 'icon-asmnt-between-somewhat', 'icon-asmnt-strongly-disagree'];
	currentQuestion = 0;
	nextVal = 1;
	answers = [];
	prevVal = 0;
	userNote = '';
	showNxt = false;
	btnHighLight = -1;
	currentValue = 0;
	wesreturnedVal;
	remainQuestion = 20;
	subscription = new Subscription;
	reducerSub1 = new Subscription;
	lang;
	wesresponseText;

	wesQuestionsText;
	constructor(private store: Store<AsmntCommonState>, private AsmntResponseStore: Store<AsmntResponseState>, private AsmntQuestionStore: Store<AsmntQuestionState>, private router: Router, private commonlang: StoreService, private utils: Utilities, private activeRoute: ActivatedRoute,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService, private storageService: StorageService,
		private dispatchStore: Store<Action>, private assess: AssessmentsService) {
		this.lang = this.storageService.sessionStorageGet('langset');

		this.wesresponseText = AsmntResponseStore.select('AsmntQuestionsResponses');
		this.reducerSub1 = this.AsmntQuestionStore.select('AsmntQuestionsText').subscribe((v) => {
			this.wesQuestionsText = v;

			if (this.wesQuestionsText.commonIntroText.questions + '' != 'undefined') {
				this.storageService.sessionStorageSet('ques', JSON.stringify(this.wesQuestionsText));
				this.wesFunction();
			}
		});

		this.subscription = eventService.listen().subscribe((e) => {

			/** After event listen it will check whether user want to save partially or completely */
			if (e.type === 'save_Partial') {
                /** If user want to save partially, then we call the respective function
                  * and we are setting true to isAssessment to tell that, we are saving from assessment.
                 */
				this.savePartialWES();
				this.storageService.sessionStorageSet('isAssessment', 'true');
			} else if (e.type === 'saveAnswerSet') {
				this.utils.hideLoading();
			}
		});

		this.wesreturnedVal = store.select('AsmntCommonText');

	}

	ngOnInit() {
		this.utils.showLoading();
		try {

			let wesAnswerSet: any;
			// this.activeRoute.queryParams.subscribe((params: Params) => {
			// 	wesAnswerSet = params['wesAnswerSet'];
			// 	this.userNote = params['usrNotes'];
			// });
			let routArr = -1;
			if (this.router.url.indexOf('?') != -1) {
				let Arr = this.router.url.split('?');

				if (Arr[1] != '' || Arr[1] != undefined) {
					routArr = parseInt(Arr[1].split('=')[1])
				}
			}

			// Check whether the assessment coming from restore or reloading
			const assess = this.storageService.sessionStorageGet('savedPartialAsmnt');
			if ((assess !== '') && (assess != null)) {
				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else if (routArr != -1) {
				this.utils.hideLoading();
				this.restoreAnswerSets();
			} else {

				this.storageService.sessionStorageRemove('savePartial');
				this.storageService.sessionStorageRemove('restoreAnsers');
				this.getQuestions();
				this.utils.hideLoading();
			}

		} catch (e) {
			console.log('Error in WES ngOnInit assessment--->' + e.message);
		}
	}
	wesFunction() {
		this.WES_Questions = [];
		let wesQuestions = JSON.parse(this.storageService.sessionStorageGet('ques'));
		try {
			let qlength = wesQuestions.commonIntroText.questions.length;
			for (let i = 0; i < qlength; i++) {
				this.WES_Questions.push(wesQuestions.commonIntroText.questions[i].text);
			}
			this.utils.hideLoading();
			//    alert("wesquestions--->" +JSON.stringify(this.WES_Questions));
		} catch (e) {
			console.log('wes function exception' + e.message);
		}
	}
	ngOnDestroy() {
		window.location.href.replace(location.hash, '');
		this.reducerSub1.unsubscribe();
		this.subscription.unsubscribe();
	}

	// When user click on save button in assessment we save the answer for that particular answer set
	savePartialWES() {

		let ans = '';
		if (this.answers.length !== this.WES_Questions.length) {
			for (let i = 0; i < this.answers.length; i++) {
				if (ans !== '') {
					ans = ans + ',' + this.answers[i];
				} else {
					ans = this.answers[i] + '';
				}
			}
			const length = this.WES_Questions.length - this.answers.length;
			for (let i = 0; i < length; i++) {
				if (ans !== '') {
					ans = ans + ',NR';
				} else {
					ans = ans + 'NR';
				}
			}
		}
		this.apiJson.method = 'POST';
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = 'Assessment/v1/';

		let SavePartialPost = {};
		SavePartialPost = {
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
						'answers': ans,
						'userNotes': this.userNote
					}
				}
			]
		};
		const user = JSON.stringify(SavePartialPost);
		this.apiJson.endUrl = 'users/savePartial/';
		this.apiJson.data = user;
		this.assess.showSaveDialog(this.apiJson, 'WES');
	}

	// Restore the answer up to where user answered the questions
	restoreAnswerSets() {

		this.storageService.sessionStorageRemove('savePartial');
		this.answers = JSON.parse(this.storageService.sessionStorageGet('wesAnswers'));
		if (this.answers.length !== 0) {
			this.currentQuestion = this.answers.length;
			const value = 100 / JSON.parse(this.storageService.sessionStorageGet('wesallQueLength'));
			this.currentValue = this.currentQuestion * value;
			this.prevVal = this.currentQuestion - 1;
			this.nextVal = this.currentQuestion + 1;
		}
		this.utils.hideLoading();

		this.getQuestions();


	}

	// Get the all questions and its options values
	getQuestions() {

		// let questionpayload = {
		this.dispatchStore.dispatch({
			type: "GET_QUESTION_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: ['questions'],
				query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: 'WES'
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'questions', questionpayload);

	}

	// Save the user selected answer for that particular question
	callQuestion(quesVal) {

		if (this.currentQuestion === (this.answers.length)) {
			this.answers.push(quesVal);
			this.btnHighLight = -1;
		} else {
			this.answers[this.currentQuestion] = quesVal;
			this.btnHighLight = this.answers[this.currentQuestion + 1];
		}
		this.currentQuestion++;
		this.prevVal = this.currentQuestion - 1;
		this.nextVal = this.currentQuestion + 1;

		if (this.currentQuestion === (this.answers.length)) {
			this.showNxt = false;
		} else {
			this.showNxt = true;
		}
		if (this.currentQuestion === this.WES_Questions.length) {
			this.currentQuestion--;
			this.prevVal = this.currentQuestion + 1;
			this.nextVal = this.currentQuestion - 1;
			let resultAns = '';
			this.utils.showLoading();
			for (let i = 0; i < this.answers.length; i++) {
				if (i < (this.answers.length - 1)) {
					resultAns = resultAns + parseInt(this.answers[i], 10) + ',';
				} else {
					resultAns = resultAns + parseInt(this.answers[i], 10);
				}
			}
			this.assess.wesResultCall(resultAns, this.storageService.sessionStorageGet('save_Par_UserNotes'));
		}
		const value = 100 / this.WES_Questions.length;
		this.currentValue = this.answers.length * value;
	}

	// Get the previous question and the answer that user selected for that question
	previousQuestion() {
		if (this.currentQuestion !== 0) {
			this.currentQuestion--;
			this.prevVal = this.currentQuestion - 1;
			this.nextVal = this.currentQuestion + 1;
			this.showNxt = true;
			this.btnHighLight = this.answers[this.currentQuestion];
		}
	}

	// Gets the question and its corresponding answer
	nextQuestion() {
		if (this.currentQuestion === (this.answers.length - 1)) {
			this.showNxt = false;
			this.btnHighLight = -1;
		} else {
			this.showNxt = true;
			this.btnHighLight = this.answers[this.currentQuestion + 1];
		}
		this.currentQuestion++;
		this.prevVal = this.currentQuestion - 1;
		this.nextVal = this.currentQuestion + 1;
	}

	saveChanges() {
		let weschanges = true;
		if ((this.WES_Questions.length - (this.currentQuestion + 1)) === 0) {
			weschanges = false;
		}
		return weschanges;
	}
}
