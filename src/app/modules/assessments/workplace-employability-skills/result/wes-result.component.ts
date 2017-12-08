/** Angular imports */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/** import shared Components */
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { wesIcons } from '../../shared/constants/assessments-constants';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';

@Component({
	selector: 'wes-result',
	templateUrl: './wes-result.layout.html',
})

export class WESResultComponent implements OnInit, OnDestroy {
	resultWESvar; /** A variable that stores result of WES */
	keys = []; /** Contains all stateAbbr */
	percentage = []; /** Tells percentages for each skill */
	wesreturnedVal;  /** Is a variable that is used to store data coming from reducer */
	eventSub = new Subscription;
	asmntAreaTextSub = new Subscription;
	asmntIntroTextSub = new Subscription;
	numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
	osResult = []; /** Pushing every data init to display it in result html */
	levels = []; /** Contains levels for that particular set min is 1 and max is 3*/
	colorClass = []; /** Contains color for each skill based on level */
	wesresultVal; /** Is a variable that is used to store data coming from reducer to display description */
	lang;  /** Get and stores user selected language */
	wesareaVal;
	nameKeys; /** Contains names for levels */

	constructor(private store: Store<AsmntCommonState>, private AsmntQuestionStateStore: Store<AsmntQuestionState>,
		private commonlang: StoreService, private serverApi: ServerApi, private trackEvnt: AssessmentsService,
		private router: Router, private utils: Utilities, private storageService: StorageService, private dispatchStore: Store<Action>,
		private apiJson: ApiCallClass, private eventService: EventDispatchService) {
		this.getAreasWes();
		this.asmntAreaTextSub = this.AsmntQuestionStateStore.select('AsmntAreaText').subscribe((val) => {
			this.wesareaVal = val;
			if (this.wesareaVal != null) {

				this.storageService.sessionStorageSet('wesArea', JSON.stringify(this.wesareaVal));
				this.wes_Result_Function(this.wesareaVal);
			}
		});

		this.asmntIntroTextSub = this.store.select('AsmntIntroText').subscribe((val) => {
			this.wesresultVal = val;
			if (this.wesresultVal != null) {
				this.storageService.sessionStorageSet('wesText', JSON.stringify(this.wesresultVal));
			}
		});
		/** Below code block listens broadcasted event and
		* calls respective functionality for this assessment */
		this.eventSub = eventService.listen().subscribe((e) => {
			if (e.type === 'save_Complete') {
				this.saveUserNotes();
			} else if (e.type === 'EQPrint') {
				// this.printResult();
			}
		});
		this.wesreturnedVal = store.select('AsmntCommonText');
	}

	ngOnInit() {
		this.utils.showLoading();
	}

	// WES area call to get list of areas and description
	getAreasWes() {
		try {
			this.lang = this.storageService.sessionStorageGet('langset');
			// let wesAreaspayload = {
			// 	type: "GET_AREA_TEXT", payload: {
			// 		methodVal: 'GET', module_Name: 'Assessment/v1/',
			// 		path_params: ['areas'],
			// 		query_params: { 'lang': this.lang },
			// 		body_Params: {}, endUrlVal: 'WES'
			// 	}
			// }

			// this.commonlang.commonLanguageChange(this.lang, 'areas', wesAreaspayload);
			this.dispatchStore.dispatch({
				type: "GET_AREA_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['areas'],
					query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'WES'
				}
			})

		} catch (e) {
			console.log('get areas wes exception: ' + e.message);
		}
	}
	/**
	* This method is for sorting the result
	* @param result contains the result coming from Api
	*/
	wes_Result_Function(result) {
		const score = [], level = [], resultWESvar = [];
		this.osResult = []; this.percentage = [];
		try {
			this.storageService.sessionStorageSet('isAssessment', '');
			this.storageService.sessionStorageSet('isFrom', 'result');
			this.resultWESvar = (JSON.parse(this.storageService.sessionStorageGet('resultWES')));

			let resultText = JSON.parse(this.storageService.sessionStorageGet("wesText"));

			this.nameKeys = Object.keys(resultText.commonText.pageText.resultsPage.box.key);

			// Get all the keys in api result call
			this.keys = (Object.keys(this.resultWESvar));
			for (let i = 0; i < this.keys.length; i++) {
				score.push(this.resultWESvar[this.keys[i]].score);
				level.push(this.resultWESvar[this.keys[i]].level);
			}
			// Align the keys in decending order of score
			for (let i = 0; i < score.length; i++) {
				for (let j = i + 1; j < score.length; j++) {
					if (score[i] < score[j]) {
						const a = score[i];
						score[i] = score[j];
						score[j] = a;
						const b = level[i];
						level[i] = level[j];
						level[j] = b;
						const c = this.keys[i];
						this.keys[i] = this.keys[j];
						this.keys[j] = c;
					} else if (score[i] === score[j]) {
						if (this.keys[i] > this.keys[j]) {
							const a = this.keys[i];
							this.keys[i] = this.keys[j];
							this.keys[j] = a;
						}
					}
				}

				// Get the color for keys
				let colors;
				let levelName;
				if (level[i] === this.nameKeys[0]) {
					if (this.colorClass[this.nameKeys[0]] != '' || this.colorClass[this.nameKeys[0]] != undefined) {
						this.colorClass[this.nameKeys[0]] = 'wes-color-box-proficient';
						this.levels[this.nameKeys[0]] = (resultText.commonText.pageText.resultsPage.box.key[this.nameKeys[0]]);
					}
					colors = 'wes-color-box-proficient';
					levelName = resultText.commonText.pageText.resultsPage.box.key[this.nameKeys[0]];
				} else if (level[i] === this.nameKeys[1]) {
					if (this.colorClass[this.nameKeys[1]] != '' || this.colorClass[this.nameKeys[1]] != undefined) {
						this.colorClass[this.nameKeys[1]] = ('wes-color-box-Knowledge');
						this.levels[this.nameKeys[1]] = (resultText.commonText.pageText.resultsPage.box.key[this.nameKeys[1]]);
					}
					colors = 'wes-color-box-Knowledge';
					levelName = resultText.commonText.pageText.resultsPage.box.key[this.nameKeys[1]];
				} else if (level[i] === this.nameKeys[2]) {
					if (this.colorClass[this.nameKeys[2]] != '' || this.colorClass[this.nameKeys[2]] != undefined) {
						this.colorClass[this.nameKeys[2]] = ('wes-color-box-NeedImp');
						this.levels[this.nameKeys[2]] = (resultText.commonText.pageText.resultsPage.box.key[this.nameKeys[2]]);
					}
					colors = 'wes-color-box-NeedImp';
					levelName = resultText.commonText.pageText.resultsPage.box.key[this.nameKeys[2]];
				}
				// Get the score and name of the respective keys
				for (let k = 0; k < result.areas.length; k++) {
					if (result.areas[k].areaAbbr === this.keys[i]) {
						this.osResult.push({
							givenName: result.areas[k].title,
							areaAbbr: result.areas[k].areaAbbr,
							shortTitle: result.areas[k].shortTitle,
							description: result.areas[k].description,
							givenScore: score[i],
							givenIcon: wesIcons[result.areas[k].areaAbbr],
							givenLevel: levelName,
							givenColor: colors
						});
					}
				}
				this.percentage.push((score[i] / 12) * 100);
			}
			this.utils.hideLoading();
		} catch (e) {
			console.log("wes function" + e.message);
		}
	}
	/**
		 * This method is used for unsubscribing the event.
		 */
	ngOnDestroy() {
		this.eventSub.unsubscribe();
		this.asmntAreaTextSub.unsubscribe();
		this.asmntIntroTextSub.unsubscribe();
	}

	// Save the usernotes when user click save button in result page
	saveUserNotes() {
		this.apiJson.method = 'POST';
		let SaveUserNotes = {};

		this.apiJson.sessionID = this.utils.getAuthKey();

		this.apiJson.moduleName = 'Assessment/v1/';
		SaveUserNotes = {
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
					'params': 'added'
				}
			]
		};
		const user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = 'users/saveUserNotes';
		this.apiJson.data = user;
		this.utils.hideLoading();
		this.trackEvnt.showSaveDialog(this.apiJson, 'WES');
	}

}
