/** Import Angular core packages */
import { Component, Renderer, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

/**Custom imports */
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { Subscription } from "rxjs/Subscription";

/**Import shared service components */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store, Action } from '@ngrx/store';
import { StoreService } from '../../../../state-management/services/store-service';
/**Import assessment-constants */
import { cardEqIcons } from '../../shared/constants/assessments-constants';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';

declare function circleGraphic(string): string;
declare let html2canvas: any;


@Component({
	selector: 'eq-result',
	templateUrl: './eq-result.layout.html',
})
export class EQResultComponent implements OnInit, OnDestroy {
	resultEntiQuizvar: any = 0;/**Declare for Storing the value of EntQuiz result */
	browserDom: BrowserDomAdapter;
	subscription = new Subscription;/**Subscription for save_Complete,print_entrepreneurQuiz and saveAnswerset events*/
	cir: any;/**Declare for Assigning the value of circleGraphic html element */
	dataUrl: any;
	logID: string; /**Declare for Stroing the value of LogID value */
	areasResult: any; /**Declare for Assigning the value of areas result */
	cardIcon: any; /**Declare for Assigning the value of CardEqIcons */
	percentage = 0;
	eqResArr = [];
	resultVal;/**Variable for stroing the assessment intro text */
	lang;/**Variable for storing the value of changed language */
	areaVal;/**Variable for storing the value of assessment area text */
	//limit = 75;
	printcontentdata = '';
	@ViewChild('bordered') elbord: ElementRef;
	@ViewChild('divTarget') innerDIV: ElementRef;
	@ViewChild('printView') printPreView: ElementRef;

	constructor(private trackEvnt: AssessmentsService, private store: Store<AsmntCommonState>,
		private router: Router, private utils: Utilities, private storageService: StorageService, private commonlang: StoreService, private store1: Store<AsmntQuestionState>,
		private dispatchStore: Store<Action>, private apiJson: ApiCallClass, private serverApi: ServerApi,
		private renderer: Renderer, private eventService: EventDispatchService) {
		this.browserDom = new BrowserDomAdapter();
		this.lang = this.storageService.sessionStorageGet('langset');
		//Get the logID from sessionStorage
		this.logID = this.storageService.sessionStorageGet("logID");
		//Get the introtext from reducer
		this.resultVal = this.store.select('AsmntIntroText');
		//Get the areatext from reducer
		this.areaVal = this.store1.select('AsmntAreaText');
		this.getAreasResult();

		/** Below code block listens broadcasted event and 
		 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type == 'save_Complete') {
				this.saveUserNotes();
			}
			else if (e.type == 'print_entrepreneurQuiz') {
				this.printResult();
			}
			else if (e.type == 'saveAnswerSet') {
				this.utils.hideLoading();
			}

		});
		var borderFiller = window.requestAnimationFrame(this.borderFill.bind(this));
	}
	borderFill() {

		try {
			this.percentage++;
			if ((this.percentage / 3.6) <= this.resultEntiQuizvar) {

				this.elbord.nativeElement.setAttribute('data-percentage', '' + Math.floor(this.percentage / 3.6));
				if (this.percentage < 180) {
					// el.style.backgroundImage = "linear-gradient(" + (90 + percentage) + "deg, transparent 50%, chocolate 50%), linear-gradient(90deg, chocolate 50%, transparent 50%)";
					this.renderer.setElementStyle(this.elbord.nativeElement, "backgroundImage", "linear-gradient(" + (90 + this.percentage) + "deg, transparent 50%, #ECECEC 50%), linear-gradient(90deg, #ECECEC 50%, transparent 50%)");

				} else if (this.percentage > 180 && this.percentage <= 360) {
					//el.style.backgroundImage = "linear-gradient(" + (percentage - 90) + "deg, transparent 50%, brown 50%), linear-gradient(90deg, chocolate 50%, transparent 50%)";
					this.renderer.setElementStyle(this.elbord.nativeElement, "backgroundImage", "linear-gradient(" + (this.percentage - 90) + "deg, transparent 50%, #00c546 50%), linear-gradient(90deg, #ECECEC 50%, transparent 50%)");
				}
				if (this.percentage > 360) {
					this.percentage = 0;
				}
				else {
					var borderFiller = window.requestAnimationFrame(this.borderFill.bind(this));
				}
			}
		} catch (e) {
			alert('chart exception:' + e.message);
		}
	}
	/** This function gets start when enters into Entrepreneur-quiz result. */
	ngOnInit() {
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'result');
		this.resultEntiQuizvar = parseInt(this.storageService.sessionStorageGet('resultEntiQuiz'));
		//this.limit = this.resultEntiQuizvar;
		var borderFiller = window.requestAnimationFrame(this.borderFill.bind(this));
		this.cardIcon = cardEqIcons;
		let ref = this;

		setTimeout(function () {

			this.cir = document.getElementsByClassName('circleGraphic1');

			//	circleGraphic(this.cir);
			this.cir = document.getElementsByClassName('circleGraphic2');
			this.utils.hideLoading();
			//circleGraphic(this.cir);
		}.bind(this), 200);
	}

	/*ngOnDestroy method is used for unsubscribe the event */
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	eqResClick(inx) {
		this.eqResArr[inx] = inx;
	}

	/**This function is for saving the user notes when user clicks on save button. */
	saveUserNotes() {
		try {
			this.apiJson.method = 'POST';
			let SaveUserNotes = {};

			this.apiJson.sessionID = this.utils.getAuthKey();

			this.apiJson.moduleName = 'Assessment/v1/';
			SaveUserNotes = {

				input_data: [
					{
						'param_type': 'path',
						'params': [this.logID]
					},
					{
						'param_type': 'query',
						'params': {}
					},
					{
						'param_type': 'body',
						'params': { 'userNotes': 'added' }
					}
				]
			}
			let user = JSON.stringify(SaveUserNotes);
			this.apiJson.endUrl = 'users/saveUserNotes/';
			this.apiJson.data = user;
			this.trackEvnt.showSaveDialog(this.apiJson, 'EQCOMPLETE');
		} catch (e) {
			console.log('saveUserNotes EntQuiz exception' + e.message);
		}
	}

	/** This function is for displaying the pop-up when we ckick on print button */
	printResult() {
		try {
			document.getElementById("openModalButton").click();
			let name = document.getElementById("theName");
			name.innerHTML = this.innerDIV.nativeElement.innerHTML

		} catch (e) {
			console.log("print Result Exception" + e.message);
		}
	}

	/**This function is for getting the areas result */
	getAreasResult() {
		try {
			// let eqAreaspayload = {
			this.dispatchStore.dispatch({
				type: "GET_AREA_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['areas'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'EntQuiz', setVal: 'questions', text: ''
				}
			});

			// this.commonlang.commonLanguageChange(this.lang, 'areas', eqAreaspayload);
		} catch (e) {
			console.log("get areas exception" + e.message);
		}
	}

    /**This function is for printing the result page when we click 
      * on done button in popup, that displays when print button is clicked  */
	printResultPage() {
		try {

			// setTimeout(function () { window.close(); }, 10000);
		} catch (e) {
			console.log(" Print exception:" + e.message);
		}
	}
}


