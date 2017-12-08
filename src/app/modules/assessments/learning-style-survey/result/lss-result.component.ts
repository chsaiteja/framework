/**Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Subscription";

/**Custom imports */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { langData } from '../../shared/constants/assessments-constants';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Store, Action } from '@ngrx/store';
import { StoreService } from '../../../../state-management/services/store-service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
	selector: 'lss-result',
	templateUrl: './lss-result.layout.html',
})
export class LSSResultComponent implements OnInit, OnDestroy {
	logID: any;/**Declare for storing the logID */
	subscription = new Subscription;/**Subscription for checking the events save_complete and lsprint */
	resultls = [];/**Declare for pushing the title,colorCode and score */
	result = [];/**Declare for pushing the icon,heading,description */
	lang;/**Variable for storing the value of changed language */
	areaVal;/**Variable for storing the value of assessment area text */
	lssresultVal = {};/**Storing the value of  assessment intro text*/
	cardVal = [];
	lssResultArr = {};/**Storing the value of lssresultVal */
	assessArea = new Subscription;/**Subscription for assessment area text */
	assessIntro = new Subscription;/**Subscription for assessment Intro text */

	lssResultArea;/**Variable for storing the value of areaVal */
	lssArray = [{ url: '/assets/images/ear.png', areaAbbr: 'auditory', colorCode: '#ffc72e' },
	{ url: '/assets/images/hand-stop.png', areaAbbr: 'tactile', colorCode: '#70cde9' },
	{ url: '/assets/images/visual.png', areaAbbr: 'visual', colorCode: '#ee4242' }];
	learnStyleAreas = [];/**Declare for storing the pushing the result Areas*/
	resLss: any = [];/**Declare for storing the pushing the result */
	colLss: any = [];/**Delare for storing the color */
	showNxtArrow = [];
	showPreArrow = [];
	showArrow = [0, 0, 0];
	cardText = [];
	constructor(private apiJson: ApiCallClass, private store: Store<AsmntCommonState>, private store1: Store<AsmntQuestionState>, private serverApi: ServerApi, private commonlang: StoreService,
		private eventService: EventDispatchService,
		private dispatchStore: Store<Action>, private trackEvnt: AssessmentsService,
		private storageService: StorageService,
		private router: Router, private utils: Utilities, private activeRoute: ActivatedRoute) {
		this.lang = this.storageService.sessionStorageGet('langset');
		if (langData[this.storageService.sessionStorageGet('langset')] != undefined) {
			langData[this.storageService.sessionStorageGet('langset')] = {};
		}
		this.getIntroText();
		this.resLss = JSON.parse(this.storageService.sessionStorageGet('resultLearnStyle'));

		this.getAreasLssResult();
		//Get the assessment area text from reducer
		this.assessArea = this.store1.select('AsmntAreaText').subscribe((val) => {
			this.areaVal = val;
			if (this.areaVal != null) {
				this.lssResultArea = this.areaVal;
				this.storageService.sessionStorageSet('lssArea', JSON.stringify(this.lssResultArea));
				this.getAreas();
			}
		});
		//Get the assessment intro text from reducer
		this.assessIntro = this.store.select('AsmntIntroText').subscribe((val) => {
			this.lssresultVal = val;

			if (this.lssresultVal != null) {
				this.lssResultArr = this.lssresultVal;

				this.storageService.sessionStorageSet('lssText', JSON.stringify(this.lssResultArr));

			}
		});


		/** Below code block listens broadcasted event and 
		 * calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == 'save_Complete') {
				this.saveUserNotes();
			}
			else if (e.type == 'LSPrint') {

			}
		});
	}

	/**ngOnInit method called when initializing the component */
	ngOnInit() {
		this.utils.showLoading();
		let color = ['#ffc72e', '#70cde9', '#ee4242'];
		this.storageService.sessionStorageSet('color', JSON.stringify(color));
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'result');
		this.colLss = JSON.parse(this.storageService.sessionStorageGet('color'));
	}

	/**ngOnDestroy called when destroying the component */
	ngOnDestroy() {
		window.location.href.replace(location.hash, '');
		this.assessIntro.unsubscribe();
		this.assessArea.unsubscribe();
		this.subscription.unsubscribe();
	}
	carouselOptionsPrev(divVal) {
		if (this.showArrow[divVal] == 2) {
			this.showArrow[divVal] = 1;
			this.showNxtArrow[divVal] = true;
			this.showPreArrow[divVal] = true;
			this.cardText[divVal] = this.result[divVal].studyTipsAll.title;
			this.cardVal[divVal] = this.result[divVal].learning;
		} else if (this.showArrow[divVal] == 1) {
			this.showArrow[divVal] = 0;
			this.showNxtArrow[divVal] = true;
			this.showPreArrow[divVal] = false;
			this.cardText[divVal] = this.result[divVal].studyTips.title;
		}
	}
	carouselOptions(divVal) {
		if (this.showArrow[divVal] == 0) {
			this.showArrow[divVal] = 1;
			this.showNxtArrow[divVal] = true;
			this.showPreArrow[divVal] = true;
			this.cardText[divVal] = this.result[divVal].studyTipsAll.title;
			this.cardVal[divVal] = this.result[divVal].learning;
		} else if (this.showArrow[divVal] == 1) {
			this.showArrow[divVal] = 2;
			this.showNxtArrow[divVal] = false;
			this.showPreArrow[divVal] = true;
			this.cardVal[divVal] = this.result[divVal].studyTips.title;
		}
	}

	/**learnStyleResult method is used for displaying the result */
	learnStyleResult(res, col, areaRes) {
		this.result = [];
		this.resultls = [];
		try {
			let resultText = JSON.parse(this.storageService.sessionStorageGet("lssText"));
			let list = res;
			let colList = col;
			if (resultText != null && resultText != undefined && areaRes.areas != null && areaRes.areas != undefined) {
				let keylist = resultText.commonText.pageText.resultsPage.boxes.key;
				let titleKeys = Object.keys(keylist);
				let keysObtain = [] = Object.keys(list).sort(function (a, b) { return list[b] - list[a] });
				let objJson = [];
				let iconUrl, header, descrip, color, scoreVal, title, titleName, studyTipsObj, studyTipsAllObj, learnStyle;

				for (let i = 0; i < keysObtain.length; i++) {
					for (let j = 0; j < this.lssArray.length; j++) {
						if (i == 0) {
							if (this.lssArray[j].areaAbbr == keysObtain[i]) {
								iconUrl = this.lssArray[j].url;
								header = resultText.commonText.pageText.resultsPage.boxes.rightTitle1;
								learnStyle = resultText.commonText.pageText.resultsPage.boxes.tipsReturn1;
								color = this.lssArray[j].colorCode;
								scoreVal = list[keysObtain[i]];
							}
						}
						else if (i == 1) {
							if (this.lssArray[j].areaAbbr == keysObtain[i]) {
								iconUrl = this.lssArray[j].url;
								header = resultText.commonText.pageText.resultsPage.boxes.rightTitle2;
								learnStyle = resultText.commonText.pageText.resultsPage.boxes.tipsReturn2;
								color = this.lssArray[j].colorCode;
								scoreVal = list[keysObtain[i]];
							}
						}
						else {
							if (this.lssArray[j].areaAbbr == keysObtain[i]) {
								iconUrl = this.lssArray[j].url;
								header = resultText.commonText.pageText.resultsPage.boxes.rightTitle3;
								learnStyle = resultText.commonText.pageText.resultsPage.boxes.tipsReturn3;
								color = this.lssArray[j].colorCode;
								scoreVal = list[keysObtain[i]];
							}
						}
					}

					for (let j = 0; j < areaRes.areas.length; j++) {
						if (areaRes.areas[j].areaAbbr == keysObtain[i]) {
							title = areaRes.areas[j].title;
							descrip = areaRes.areas[j].description;
							studyTipsObj = areaRes.areas[j].studyTips;
							studyTipsAllObj = areaRes.areas[j].studyTipsAll
						}
					}

					for (let j = 0; j < titleKeys.length; j++) {
						if (titleKeys[j] == keysObtain[i]) {
							titleName = keylist[keysObtain[i]];
						}
					}
					this.result.push({
						icon: iconUrl,
						heading: header + "" + title,
						description: descrip,
						studyTips: studyTipsObj,
						studyTipsAll: studyTipsAllObj,
						learning: learnStyle
					});

					this.resultls.push({
						title: titleName,
						colorCode: color,
						score: scoreVal
					});
				}
				for (let i = 0; i < this.result.length; i++) {
					this.cardText.push(this.result[i].studyTips.title);
					this.cardVal.push(this.result[i].studyTips.title);
					this.showNxtArrow.push(true);
					this.showPreArrow.push(false);
				}
			}
		} catch (e) {
			console.log('learn style result exception' + e.message);
		}
	}

	/**getIntroText method for payloadjson object for type and payload objects */
	getIntroText() {
		try {
			// let payloadjson = {
			this.dispatchStore.dispatch({
				type: "GET_INTRO_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: [], query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'pageText/learnStyle', setVal: 'commonIntro', text: ''
				}
			});

			// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
		} catch (e) {
			console.log("getintro exception--->" + e.message);
		}
	}

	/**This function is for saving the user notes when user clicks on save button. */
	saveUserNotes() {
		try {
			this.logID = this.storageService.sessionStorageGet('logID');
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
			this.trackEvnt.showSaveDialog(this.apiJson, 'LSCOMPLETE');
		} catch (e) {
			console.log('save user notes exception:' + e.message);
		}
	}

	/**getAreas method for getting the text of learnstyleAreas */
	getAreas() {
		try {

			this.learnStyleAreas = JSON.parse(this.storageService.sessionStorageGet('lssArea'));

			this.learnStyleResult(this.resLss, this.colLss, this.learnStyleAreas);
			this.utils.hideLoading();
		} catch (e) {
			console.log("getAreas exception" + e.message);
		}
	}

	/*This method is used for getting the areas result text*/
	getAreasLssResult() {
		try {
			// let lssAreaspayload = {
			this.dispatchStore.dispatch({
				type: "GET_AREA_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['areas'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'LearnStyle'
				}
			});

			// this.commonlang.commonLanguageChange(this.lang, 'areas', lssAreaspayload);


		} catch (e) {
			console.log('get areas lss exception: ' + e.message);
		}
	}
}
