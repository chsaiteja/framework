/**imported angular core libraries */
import { Component, OnInit, OnDestroy, Renderer } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

/**imported services libraries */
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';

/**imported colors and icons from assessments-constants */
import { ideasColors, ideasIcons, localJson, defaultgraph } from '../../shared/constants/assessments-constants';

@Component({
	selector: 'ideas-result',
	templateUrl: './ideas-result.layout.html',
})
export class IdeasResultComponent implements OnDestroy {
	ideasResultHigh = []; /**Declare for pushing the high values.*/
	returnedVal; /**Declare for storing the assessment common text.*/
	ideasResultAverage = []; /**Declare for pushing the average values.*/
	ideasResultLow = []; /**Declare for pushing the low values.*/
	list; /**Declare for storing the result values.*/
	lang; /**Declare for setting the langset values.*/
	common = []; /**Declare for pushing the chart values.*/
	ideasIconsJson = {}; /**Declare for storing the icons from the constants.*/
	logId; /**Declare for getting the logid for starting the assessment.*/
	introVal; /**Declare for storing the assessment common text.*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/
	reducerSub1 = new Subscription; /** Declare to listen if any change occured.*/
	chartColors = ideasColors; /**Declare for getting colors from the constants.*/
	interestJson = localJson; /**Declare for storing the localjson value.*/
	defaultCardJson = defaultgraph; /**Declare for storing the json values.*/

	constructor(private store: Store<AsmntCommonState>, private storageService: StorageService,
		private store1: Store<AsmntQuestionState>, private dispatchStore: Store<Action>, private trackEvnt: AssessmentsService,
		private router: Router, private renderer: Renderer, private utils: Utilities,
		private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService) {

		/**Here listeing the save_complete */
		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type == "save_Complete") {
				this.saveCompleteIdeasAssessment();
			}
			else if (e.type == "print_Ideas") {
			}
		});
		this.returnedVal = store.select('AsmntCommonText');
	}
	/**In this ngOnInit() ,getting result  */
	ngOnInit() {
		try {
			this.logId = this.storageService.sessionStorageGet('logID');
			let area;
			this.dispatchStore.dispatch({

				type: "GET_PARTICULAR_AREA_TEXT", payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['areas'], query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
					body_Params: {}, endUrlVal: 'IDEAS'
				}
			});

			this.reducerSub1 = this.store1.select('AsmntParAreaText').subscribe((res) => {
				area = res;
				if (this.storageService.sessionStorageGet('module') == 'ideas' &&
					area.commonIntroText.length != undefined && area.commonIntroText.length != 0) {
					this.ideasResponseResult(this.storageService.sessionStorageGet('ideasResult'), area);
				}
				/** The below call is for assigning the occ data to the alpha scroll */
			});
			this.ideasIconsJson = ideasIcons;

		} catch (e) {
			console.log("getting area exception :" + e.message);
		}
		this.introVal = this.store.select('AsmntIntroText');
	}

	/** This ideasResponseResult(res, area)  function is for sorting, assign color and displaying prepare piechart */
	ideasResponseResult(res, area) {
		this.list = JSON.parse(res);
		/**Here result is sorting */
		for (let k = 0; k < this.list.length; k++) {
			for (let j = k + 1; j < this.list.length; j++) {
				if (this.list[k].score < this.list[j].score) {
					const a = this.list[k];
					this.list[k] = this.list[j];
					this.list[j] = a;
				}
			}
		}
		this.common = [];

		/**Here we can prepare the final result to display on layout */
		for (let i = 0; i < this.list.length; i++) {
			for (let j = 0; j < area.commonIntroText.length; j++) {
				if (this.list[i].areaAbbr == area.commonIntroText[j].areaAbbr) {
					this.common.push({
						"level": this.list[i].level,
						"areaAbbr": this.list[i].areaAbbr,
						"score": this.list[i].score,
						"title": area.commonIntroText[j].title,
						"type": area.commonIntroText[j].type,
						"description": area.commonIntroText[j].description,
						"relatedcourse":area.commonIntroText[j].relatedCourses,
						"occIDs": this.list[i].occIDs
					});
				}
			}
		}
		this.ideasResultHigh = [];
		this.ideasResultAverage = [];
		this.ideasResultLow = [];
		try {
			/** Here assign the colors to result */
			this.common.forEach(function (obj, inx) {
				if (obj.level === 'high') {
					obj['color'] = ideasColors['high'];
					this.ideasResultHigh.push(obj);
				} else if (obj.level === 'average') {

					obj['color'] = ideasColors['average'];

					this.ideasResultAverage.push(obj);
				} else if (obj.level === 'low') {

					obj['color'] = ideasColors['low'];
					this.ideasResultLow.push(obj);
				}

			}.bind(this));
					/** Here preparing the pie chart     */
			let tempArray = [];
			for (let j = 0; j < this.common.length; j++) {
				if (tempArray.indexOf(this.common[j].type) == -1) {
					for (let i = 0; i < this.interestJson.length; i++) {
						let sendJson = {};
						if (this.interestJson[i].childAreas.indexOf(this.common[j].areaAbbr) > -1) {
							tempArray.push(this.common[j].type);
							sendJson['type'] = this.common[j].type;
							sendJson['height'] = this.interestJson[i].height;
							sendJson['id'] = this.interestJson[i].id;
							sendJson['range'] = this.interestJson[i].range;
							sendJson['margin'] = this.interestJson[i].margin;
							sendJson['rotate'] = this.interestJson[i].rotate;
							sendJson['transformer'] = this.interestJson[i].transformer;
							sendJson['width'] = this.interestJson[i].width;

							setTimeout(function () {

								this.circularText(sendJson);

							}.bind(this), 0);
						}
					}
				}
				let sendJson2 = {};
				for (let k = 0; k < this.defaultCardJson.length; k++) {
					if (this.common[j].areaAbbr == this.defaultCardJson[k].areaAbbr) {
						sendJson2['type'] = this.defaultCardJson[k].areaAbbr;
						sendJson2['height'] = this.defaultCardJson[k].height;
						sendJson2['id'] = this.defaultCardJson[k].id;
						sendJson2['range'] = this.defaultCardJson[k].range;
						sendJson2['margin'] = this.defaultCardJson[k].margin;
						sendJson2['rotate'] = this.defaultCardJson[k].rotate;
						sendJson2['transformer'] = this.defaultCardJson[k].transformer;
						sendJson2['width'] = this.defaultCardJson[k].width;
						sendJson2['level'] = this.common[j].level;
						setTimeout(function () {

							this.circularText(sendJson2);

						}.bind(this), 0);

					}
				}
			}

			this.storageService.sessionStorageSet('ideasfullresult', JSON.stringify(this.common));
			this.utils.hideLoading();
		} catch (e) {
			console.log("this-->" + e.message);
		}
	}

	/** This circularText(receive) function is for printing the piechart on layout */
	circularText(receive) {
		try {
			receive['type'] = receive['type'].split("");
			let classIndex = document.getElementsByClassName("circTxt")[receive['id']];
			this.renderer.setElementStyle(document.getElementsByClassName("circTxt")[receive['id']], "margin", receive['margin']);
			this.renderer.setElementStyle(document.getElementsByClassName("circTxt")[receive['id']], "transform", receive['rotate']);
			this.renderer.setElementStyle(document.getElementsByClassName("circTxt")[receive['id']], "transform", receive['transformer']);
			if (receive['level'] != undefined) {
				this.renderer.setElementStyle(document.getElementsByClassName("idea-color-level")
				[receive['id']], "background", this.chartColors[receive['level']]);
			}
			var deg = receive['range'] / receive['type'].length,
				origin = 0;
			receive['type'].forEach((ea) => {
				ea = `<p style='height:${receive['height']}px;position:absolute;transform:rotate(${origin}deg);transform-origin:0 100%'><span class="result-idea-text" 
				 style='transform:rotate(${receive['transformer']}deg);position:absolute;width:${receive['width']}px;'>${ea}</span></p>`;
				classIndex.innerHTML += ea;
				origin += deg;
			});

		}
		catch (e) {
			console.log('exception change text-->' + e.message);
		}

	}

	/** This getIdeasOccListBasedOnTitle is for send the areaAbbr,title  to ideaslist */
	getIdeasOccListBasedOnTitle = function (areaAbbr, ideastitle) {
		try {
			this.storageService.sessionStorageSet('areaAbbr', areaAbbr);
			this.storageService.sessionStorageSet('ideastitle', ideastitle);
			setTimeout(function () {
				const rtArr = this.router.url.split('/');
				let rtVal = rtArr.slice(1, rtArr.length - 1).join('/');
				this.router.navigate([rtVal + '/occlist'], { relativeTo: this.activeRoute });
			}.bind(this), 0);
		} catch (e) {
			console.log('getideasOccListBasedOnTitle  exception :' + e.message);
		}
	}

	/** This saveCompleteIdeasAssessment() is for complete save */
	saveCompleteIdeasAssessment() {
		this.apiJson.method = "POST";
		this.apiJson.sessionID = this.utils.getAuthKey();
		this.apiJson.moduleName = "Assessment/v1/";
		let SaveUserNotes = {};
		SaveUserNotes = {
			input_data: [
				{
					"param_type": "path",

					"params": ["saveUserNotes", this.logId]
				},
				{
					"param_type": "query",
					"params": {}
				},
				{
					"param_type": "body",
					"params": {
						"userNotes": "added"
					}
				}
			]
		}
		let user = JSON.stringify(SaveUserNotes);
		this.apiJson.endUrl = "Users";
		this.apiJson.data = user;
		this.trackEvnt.showSaveDialog(this.apiJson, 'IDEASCOMPLETE');
	}

	/** This ngOnDestroy() function is call after Component destory */
	ngOnDestroy() {
		this.reducerSub1.unsubscribe();
		this.subscription.unsubscribe();
	}
}







