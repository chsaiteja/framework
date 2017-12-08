/** imported angular core  libraries*/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute, Params } from '@angular/router';

/**imported services llibraries*/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AsmntCommonState, AsmntResponseState } from '../../../../state-management/state/main-state';
import { StorageService } from '../../../../shared/outer-services/storage.service';


@Component({
	selector: 'ideas-assessment',
	templateUrl: './ideas-assessment.layout.html'
})
export class IdeasAssessmentComponent implements OnDestroy {
	isClassVisibleIdea = false; /**Declare for Previous button show or hide based on isClassVisible value */
	showNxtIDea = false; /**showNxtIDea boolean variable used for showing the next button */
	btnHighLight = -1; /** Declare for  storing the value for circle Highlighted */
	staticVal = 1; /**Declare for storing the current question number */
	rem = 0; /**Declare for storing the value of current question */
	remaining = 0; /**Declare for storing the value of remaining questions */
	ideasQuestionName = 0; /**Declare for storing the remaining values.*/
	cnt = 1; /**Declare for Stores the value of question number */
	currentValue = 0;  /**CurrentValue variable  storing the value for filling progress bar */
	prevLength = 0; /**Declare for storing the value of prevQuestion number */
	savePartialData = [];  /**Declare for storing the answerSet */
	restorePrevQuesArr1 = []; /**Declare for Store the restore previous questions array */
	answerSet = []; /**Declare for Storing the restoreAnswerSet getting using sessionStorageGet */
	prevQuestion = []; /**Declare for pushing the previous questions */
	logId;  /**Declare for Storing for logID string value */
	ideasQuesNames; /**Declare for storing the questions getting using sessionStorage */
	ideasQuesResponses;  /**Declare for  Storing the responses getting using session Storage */
	questionarr = []; /**Declare for Storing the questions in array */
	responsesarr = []; /**Declare for storing the responses in array */
	restoreQuesArr1 = []; /**Declare for Storing the restore questions array */
	returnedVal; /**Declare for storing assessment common text.*/
	responseText; /**Declare for storing assessment responses from store.*/
	subscription2 = new Subscription; /** Declare to listen if any change occured.*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/
	iconArray = ['fa icon-asmnt-strongly-agree', 'fa icon-asmnt-between-strongly',
		'fa icon-asmnt-somewhat', 'fa icon-asmnt-between-somewhat', 'fa icon-asmnt-strongly-disagree'];
	/**Declare for storing the icons.*/

	constructor(private activatedRoute: ActivatedRoute, private trackEvnt: AssessmentsService, private router: Router,
		private utils: Utilities, private storageService: StorageService, private store: Store<AsmntCommonState>,
		private store1: Store<AsmntResponseState>,
		private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService) {
		/** Here we can get questions response from intro Component session storage */
		this.responseText = this.store1.select('AsmntQuestionsResponses');
		/** Here listening the save partial event */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'save_Partial') {

				this.SaveParitalAssesment();
			}
		});

		this.returnedVal = store.select('AsmntCommonText');
	}


	/* This method is getting all ideas questions  */
	ngOnInit() {

		this.utils.showLoading();
		try {
			this.apiJson.endUrl = "IDEAS";
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = "Assessment/v1/";
			let data = {
				input_data: [
					{
						"param_type": "path",
						"params": ["questions"]
					},
					{
						"param_type": "query",
						"params": { "lang": this.storageService.sessionStorageGet('langset') }
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
			/*  This call is for get questions from API--->GET /IDEASGET / questions */
			this.serverApi.callApi([this.apiJson]).subscribe((response) => {

				this.ideasQuesNames = response[0].Result;
				for (let i = 0; i < this.ideasQuesNames.questions.length; i++) {
					this.questionarr.push(this.ideasQuesNames.questions[i].text);
				}
				this.ideas_Func();
				this.utils.hideLoading();
			}, this.utils.handleError)
		} catch (e) {
			console.log("getting questions exception:" + e.message);
		}
	}

	/**This method is for getting the question names and answersets.*/
	ideas_Func() {
		this.logId = this.storageService.sessionStorageGet('logID');
		let ideasAnswerSet: any;
		this.activatedRoute.queryParams.subscribe((params: Params) => {
			ideasAnswerSet = params['ideasAnswerSet'];

		});
		this.utils.hideLoading();
		if ((this.storageService.sessionStorageGet('savedPartialAsmnt') != '') &&
			(this.storageService.sessionStorageGet('savedPartialAsmnt') != null)) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		} else if (ideasAnswerSet != 0 && ideasAnswerSet != '' && ideasAnswerSet != null) {
			this.utils.hideLoading();
			this.RestoreAnswerSets();
		}
		else {
			this.storageService.sessionStorageRemove('restoreAnsers');
			this.storageService.sessionStorageRemove('savePartial');
			this.startEntrePreExam();
		}
	}

	/** This startEntrePreExam() function is to start the assessment */
	startEntrePreExam() {
		try {
			if (this.storageService.sessionStorageGet('restoreAnsers') == 'yes') {
				this.rem = this.ideasQuesNames.questions.length - this.restoreQuesArr1.length;
				this.remaining = this.restoreQuesArr1.length - 1;
				this.ideasQuestionName = (this.rem);
				let value = 100 / this.ideasQuesNames.questions.length;
				this.currentValue = this.rem * value;
				this.cnt = this.rem + 1;
				this.prevLength = this.rem;
				this.staticVal = this.cnt;
				this.btnHighLight = -1;
				this.answerSet = JSON.parse(this.storageService.sessionStorageGet('restoreAnswerSet'));
				for (let i = 0; i < this.cnt; i++) {
					this.prevQuestion.push({ 'QuestionValue': this.answerSet[i] });
				}
			}
			else {
				this.isClassVisibleIdea = true;
				this.ideasQuestionName = 0;
				this.remaining = this.ideasQuesNames.questions.length - 1;
				this.answerSet = [];
				this.storageService.sessionStorageRemove('restoreAnswerSet');
				this.storageService.sessionStorageRemove('restoreQuesArr');
				this.storageService.sessionStorageRemove('restorePrevQuesArr');

			}
			
		} catch (e) {
			console.log('start assessment exception:' + e.message);
		}
	}
	/**This nextIdeaArrow(cnt) function is for call the next question*/
	nextIdeaArrow(cnt) {
		try {
			this.remaining = this.remaining - 1;
			this.isClassVisibleIdea = false;
			/**show or hide next Arrow based on the length of
			 *  next array*/
			if ((this.cnt + 1) == this.staticVal) {
				this.showNxtIDea = false;
			}
			else {
				this.showNxtIDea = true;
			}
			this.prevLength = this.cnt;
			this.ideasQuestionName = this.cnt
			this.cnt++;
			if ((this.cnt) == this.staticVal) {
				this.btnHighLight = -1;
			}
			else {
				this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
			}
		} catch (e) {
			console.log('calling next question exception :' + e.message);
		}
	}
	/**This  previousQuestion() function is for call the previous question*/
	previousQuestion() {
		try {
			/**checking whether it is in restore state or not*/
			if (this.cnt > 1) {
				this.remaining = this.remaining + 1;
				this.prevLength = this.prevLength - 1;
				this.cnt = this.cnt - 1;
				this.ideasQuestionName = this.cnt - 1;
				if (this.cnt == 1) {
					this.isClassVisibleIdea = true;
				}
				this.btnHighLight = parseInt(this.prevQuestion[this.cnt - 1].QuestionValue);
				if (this.cnt == this.staticVal) {
					/**Hide the next arrow when the current question is new*/
					this.showNxtIDea = false;
				}
				else {
					/**show the next arrow when previous clicked*/
					this.showNxtIDea = true;
				}
			}
		} catch (e) {
			console.log("getting previous questions exception :" + e.message);
		}
	}
	/**This  callQuestion(quesAnswered) function is for moving answered questions */
	callQuestion(quesAnswered) {
		try {
			if (this.cnt <= this.ideasQuesNames.questions.length) {
				this.storageService.sessionStorageRemove('checkgrade');
				this.remaining = this.remaining - 1;
				this.isClassVisibleIdea = false;
				let value = 100 / this.ideasQuesNames.questions.length;
				/**Filling the bar based on the value*/
				if (this.staticVal === this.cnt) {
					this.currentValue = value * this.cnt;
				}
				this.ideasQuestionName = this.cnt;
				let quesName = 'shortip_ques_q' + (this.cnt - 1);
				if (this.storageService.sessionStorageGet('savePartial') == 'yes') {
					this.answerSet = [];
					this.answerSet = this.savePartialData;
					this.savePartialData = [];
					this.storageService.sessionStorageRemove('savePartial');
				}
				if (this.cnt === this.staticVal) {
					this.answerSet.push(quesAnswered);
					this.prevQuestion.push({ "QuestionValue": quesAnswered });
				}
				else {
					this.prevQuestion[this.cnt - 1].QuestionValue = quesAnswered;
					this.answerSet[this.cnt - 1] = quesAnswered;

				}
				this.prevLength = this.cnt;
				if (this.cnt === this.ideasQuesNames.questions.length) {
					/**If current question is the last question then set answer set*/
					this.remaining = 0;
					this.storageService.sessionStorageSet('answerSetIdeas', this.answerSet.toString());
					this.storageService.sessionStorageSet('checkgrade', 'gradekey');

					this.router.navigate(['../grade'], { relativeTo: this.activatedRoute });

				}
				if (this.cnt === this.staticVal) {
					/**Hide the next arrow when the current question is new*/
					this.staticVal++;
				}
				if (this.cnt + 1 === this.staticVal) {
					this.showNxtIDea = false;
					this.btnHighLight = -1;
				}
				else {
					this.btnHighLight = this.answerSet[this.cnt];
				}
				if (this.cnt != this.ideasQuesNames.questions.length) {
					/**Increase the count value*/
					this.cnt = this.cnt + 1;
				}
			}

		} catch (e) {
			console.log("getting call question exception :" + e.message);
		}
	}
	/** This saveChanges() function is for unsaved changes*/
	saveChanges() {
		try {
			let ideaschanges = true
			if (this.remaining === 0) {
				ideaschanges = false;
			}
			return ideaschanges;
		} catch (e) {
			console.log("save changes exception :" + e.message);
		}
	}

	/* This method is for save partial */
	SaveParitalAssesment() {
		let answ = [];
		let lastarray = [];
		this.storageService.sessionStorageSet("isAssessment", "true");
		this.apiJson.method = "POST";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.endUrl = "Users";
		this.apiJson.moduleName = "Assessment/v1/";
		let data = {
			input_data: [
				{
					"param_type": "path",
					"params": ["savePartialIDEAS", this.logId]
				},
				{
					"param_type": "query",
					"params": {}
				},
				{
					"param_type": "body",
					"params": {
						"answers": lastarray,
						"userNotes": "added"
					}
				}
			]
		}

		try {
			this.savePartialData = JSON.parse(JSON.stringify(this.answerSet));

		}
		catch (e) {
			console.log("json exception--->" + e.message);
		}

		this.storageService.sessionStorageSet('staticval', this.staticVal - 1);

		try {
			let s = [];

			answ = this.answerSet;
			let last = answ.toString().split(",");

			let i;
			for (i = 0; i < this.staticVal - 1; i++) {
				lastarray.push(last[i]);
			}
			for (let i = this.staticVal - 1; i < this.ideasQuesNames.questions.length; i++) {

				lastarray.push("NR");
			}
		}
		catch (e) {
			alert("Exception----" + e.message);
		}

		let dat = JSON.stringify(data);

		this.apiJson.data = dat;
		this.trackEvnt.showSaveDialog(this.apiJson, 'IDEAS');

	}
	/**This is for restoring the set of answers */
	RestoreAnswerSets() {
		try {
			this.storageService.sessionStorageSet('restoreAnsers', 'yes');
			this.storageService.sessionStorageRemove('savePartial');
			this.restoreQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restoreQuesArr'));
			this.restorePrevQuesArr1 = JSON.parse(this.storageService.sessionStorageGet('restorePrevQuesArr'));
			this.startEntrePreExam();
		} catch (e) {
			console.log("restoreAnswerSet exception :" + e.message);
		}
	}

	/** This ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}

