/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/**Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

/**Constants */
import { pieColors } from '../../shared/constants/assessments-constants';
import { pieIpIcons } from '../../shared/constants/assessments-constants';

/**Components */
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';

declare const Pizza: any;
declare const html2canvas: any;

@Component({
	selector: 'ipsf-result',
	templateUrl: './ipsf-result.layout.html',
})

export class IPSFResultComponent implements OnInit, OnDestroy {
	ipreturnedVal; /**Declare for storing assessment common text.*/
	result = []; /**Declared for storing the result */
	pieColor = {}; /**Declared for assigning the pie_colors */
	pieIpColor = {}; /**Declared for assigning the pie_Icons*/
	logId; /**Declared for Storing for logID string value */
	ipResareas; /**Declared for assigning the areas */
	ipResult = []; /**Declared for storing the areas title and discription */
	reducerSub3 = new Subscription; /** Declare to listen if any change occured.*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/
	introVal; /**Declare for storing assessment intro text.*/
	lang; /**Declare for getting the langset value.*/

	constructor(private apiJson: ApiCallClass, private trackEvnt: AssessmentsService, private dispatchStore: Store<Action>,
		private serverApi: ServerApi, private utils: Utilities, private storageService: StorageService,
		private store: Store<AsmntCommonState>, private store1: Store<AsmntQuestionState>,
		private eventService: EventDispatchService, private router: Router) {
		this.lang = this.storageService.sessionStorageGet('langset');

		/** Below code block listens broadcasted event and
		* calls respective functionality for this assessment */
		this.subscription = eventService.listen().subscribe((e) => {

			if (e.type === 'save_Complete') {
				this.saveIpSfAssessment();
			} else if (e.type === 'print_interestProfilerSf') {
				this.printResult();
			}
		});
		this.ipreturnedVal = store.select('AsmntCommonText');

		this.reducerSub3 = this.store1.select('AsmntParAreaText').subscribe((res) => {
			this.storageService.sessionStorageSet('OccList', JSON.stringify(res));
			this.ipResareas = res;
			if (this.storageService.sessionStorageGet('module') == 'ip' &&
				this.ipResareas.commonIntroText.length != undefined && this.ipResareas.commonIntroText.length != 0) {

				this.jsonSort(JSON.parse(this.storageService.sessionStorageGet('ipResult')), this.ipResareas);

			}
			/** The below call is for assigning the occ data to the alpha scroll */
		});
	}

    /**
     * This function is for getting into the result page.
    */
	ngOnInit() {
		this.logId = this.storageService.sessionStorageGet('logID');
		this.utils.showLoading();
		this.storageService.sessionStorageSet('isAssessment', '');
		this.storageService.sessionStorageSet('isFrom', 'result');
		this.pieColor = pieColors;
		this.pieIpColor = pieIpIcons;
		this.introVal = this.store.select('AsmntIntroText');
		this.getIPAreas();
	}

    /**
     * This method is for sorting the result
     * @param res contains the result
     * @param area contains the areas coming from Api
     */
	jsonSort(res, area) {
		try {
			if (res != null) {
				const list = res;
				const keysSorted = Object.keys(list)
				const sortJson = [];
				for (let i = 0; i < keysSorted.length; i++) {
					const obj = {};
					obj['interest'] = keysSorted[i];
					obj['score'] = res[keysSorted[i]].score;
					sortJson.push(obj);
				}
				for (let i = 0; i < sortJson.length; i++) {
					for (let j = i + 1; j < sortJson.length; j++) {
						if (sortJson[i].score < sortJson[j].score) {
							const firstScore = sortJson[i];
							sortJson[i] = sortJson[j];
							sortJson[j] = firstScore;
						} else if (sortJson[i].score == sortJson[j].score) {
							if (sortJson[i].interest > sortJson[j].interest) {
								const firstscore = sortJson[i].interest;
								sortJson[i].interest = sortJson[j].interest;
								sortJson[j].interest = firstscore;
							}
						}
					}
				}
				this.storageService.sessionStorageSet('resultIP', JSON.stringify(sortJson));
			}
			this.result = JSON.parse(this.storageService.sessionStorageGet('resultIP'));
			try {
				setTimeout(function () {
					this.displayPieChart(this);
				}.bind(this), 0);
			} catch (e) {
				console.log('exception=>' + e.message);
			}
			for (let i = 0; i < this.result.length; i++) {
				for (let k = 0; k < area.commonIntroText.length; k++) {
					if (area.commonIntroText[k].areaAbbr === this.result[i].interest) {
						this.ipResult.push({
							title: area.commonIntroText[k].title,
							description: area.commonIntroText[k].description
						});
					}
				}
			}
		} catch (e) {
			console.log('jsonSort exception------>' + e.message);
		}
	}
    /**
     * This method is used for getting the areas
     */
	getIPAreas() {
		try {
			this.dispatchStore.dispatch({
				type: 'GET_PARTICULAR_AREA_TEXT', payload: {
					methodVal: 'GET', module_Name: 'Assessment/v1/',
					path_params: ['areas'], query_params: { 'lang': this.lang },
					body_Params: {}, endUrlVal: 'ShortIP'
				}
			});

		} catch (e) {
			console.log('IP areas exception-->' + e.message);
		}
	}

    /**
     * This method for displaying the result in pie chart format.
     * @param ref contains the reference.
     */
	displayPieChart(ref) {
		Pizza.init();
		ref.utils.hideLoading();
	}

	/* This method is for saving the assessment in the server with Usernotes.
		Here call for the SaveUserNotes takes place.
	*/
	saveIpSfAssessment() {
		try {
			this.apiJson.method = 'POST';
			this.apiJson.sessionID = this.utils.getAuthKey();
			this.apiJson.moduleName = 'Assessment/v1/';
			let SaveUserNotes = {};
			SaveUserNotes = {
				input_data: [
					{
						'param_type': 'path',

						'params': ['saveUserNotes', this.logId]
					},
					{
						'param_type': 'query',
						'params': {}
					},
					{
						'param_type': 'body',
						'params': {
							'userNotes': 'added'
						}
					}
				]
			};
			const user = JSON.stringify(SaveUserNotes);
			this.apiJson.endUrl = 'Users';
			this.apiJson.data = user;
			this.trackEvnt.showSaveDialog(this.apiJson, 'IPCOMPLETE');

		} catch (e) {
			console.log('IP savecomplete exception-->' + e.message);
		}
	}

	/* This method gets called when user clicks the area of interest.
	    This navigates user to occupation list which gets the occupation based on interest.*/
	getOccListBasedOnInterest = function (interest) {
		this.storageService.sessionStorageSet('ipsfInterest', interest);
		setTimeout(function () {
			const rtArr = this.router.url.split('/');
			const rtVal = rtArr.slice(1, rtArr.length - 1).join('/');
			this.router.navigate([rtVal + '/occlist'], { relativeTo: this.activeRoute });
		}.bind(this), 0);
	};

	/* This method is for printing the result page when we click on print button.*/
	printResult() {
		setTimeout(() => { Pizza.init(); }, 1000);
		document.getElementById('openModalButton').click();
	}

    /**This function is for printing the result page when we click
	* on done button in popup, that displays when print button is clicked  */
	printResultPage(divName) {
		let theCanvas = '';
		try {
			html2canvas(document.getElementById('print-list'), {
				onrendered: function (canvas) {
					theCanvas = canvas;
					const headingToPrint = document.getElementById('ip-print-heading');
					const divToPrint = document.getElementById('print-piechart');
					const textToPrint = document.getElementById('print-text');
					const list = document.getElementById('list-popup');
					const newWin = window.open('', 'Print-Window', 'width=500,height=500');
					newWin.document.open();
					newWin.document.write(`<html>
                                          <head>
                                               <link type='text/css' rel='stylesheet'
											    href='node_modules/bootstrap/dist/css/bootstrap.min.css'>
                                                <style>
                                                 .main-print-ip{
                                                     width:30%;
                                                     float:left;
                                                 }
                                                 .ip-img-print-main{
                                                    width:70%;
                                                     margin:34px 0 30px 0;
                                                 }
                                                 .headding-ip{
                                                     margin-left:10px;
                                                 }
                                                   .print-text{
                                                      margin:10px;
                                                 }
                                                  @media screen and (max-width: 767px) {
													   .main-print-ip{
                                                     width:100%;
                                                     float:left;
                                                 }
                                                      .ip-img-print-main{
                                                    width:100%;
                                                     margin:34px 0 30px 0;
                                                 }
                                                 }                                             
												   </style>
                                            </head>
                                                 <body onload='window.print()'> <h4 class='headding-ip'>` + headingToPrint.innerHTML +
						`</h4> <div class='main-print-ip'>` + divToPrint.innerHTML + `</div>
                                                 <div class='color-box'  style='margin: 56px 0 82px;'>` + list.innerHTML +
						`</div>` + textToPrint.innerHTML + `</body></html>`);

					newWin.document.close();
					setTimeout(function () { window.close(); }, 10000);
				}
			});
		} catch (e) {
			console.log('printResultPage exception:' + e.message);
		}

	}
    /**
     * This method is used for unsubscribing the event.
     */
	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.reducerSub3.unsubscribe();
	}
}


