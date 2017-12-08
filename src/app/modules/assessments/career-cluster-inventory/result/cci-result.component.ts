/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/**Services **/
import { AssessmentsService } from '../../shared/services/assessments.service';
import { StoreService } from '../../../../state-management/services/store-service';

import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState } from '../../../../state-management/state/main-state';

@Component({
	selector: 'cci-jr-result',
	templateUrl: './cci-result.layout.html',
})
export class CCIJrResultComponent implements OnInit, OnDestroy {

	introVal; /**Declare for storing the assessmentintro text from store.*/
	ccijrresultArr = []; /*Declare for storing result*/
	logId; /**Declare for Storing the value for logID */
	ccikeys = []; /**Declare for Storing the value of cluster Id's */
	ccijrResult = []; /**Declare for pushing the result */
	subscription2 = new Subscription; /** Declare to listen if any change occured.*/
	subscription = new Subscription; /** Declare to listen if any change occured.*/
	lang; /**Declare for setting the language value.*/
	returnedVal; /**Declare for storing the assessment common text.*/

	constructor(private http: Http, private router: Router, private trackEvnt: AssessmentsService, private commonlang: StoreService,
		private dispatchStore: Store<Action>, private utils: Utilities, private storageService: StorageService,
		private activatedRoute: ActivatedRoute, private apiJson: ApiCallClass, private serverApi: ServerApi,
		private eventService: EventDispatchService, private store: Store<AsmntCommonState>) {

		/** Below code block listens broadcasted event and
		* calls respective functionality for this assessment */

		this.subscription = eventService.listen().subscribe((e) => {
			if (e.type === 'save_Complete') {
				this.saveCCIjrAssessment();
			}
		});
	}

	ngOnInit() {
		this.utils.showLoading();
		this.storageService.sessionStorageSet('inTab', 'cciAssess');
		this.lang = this.storageService.sessionStorageGet('langset')
		this.subscription2 = this.store.select('AsmntIntroText').subscribe((v) => {
			this.introVal = v;
			this.utils.hideLoading();
		});
		this.returnedVal = this.store.select('AsmntCommonText');
		const ref = this;
		this.logId = this.storageService.sessionStorageGet('logID');
		this.storageService.sessionStorageSet('isAssessment', 'true');
		this.storageService.sessionStorageSet('isFrom', 'result');
		/**Hear we are getting the result for Career Cluster Inventory */
		this.ccijrresultArr = JSON.parse(this.storageService.sessionStorageGet('CCIjrResult'));
		for (let k = 0; k < ref.ccijrresultArr.length; k++) {
			let val = this.trackEvnt.clustDetails(ref.ccijrresultArr[k].clusterID);
			/**Hear we are comparing the Cluster ID's */
			ref.ccijrresultArr[k].clusterIconValue = (val.clusterIconValue);
			ref.ccijrresultArr[k].clusterBgColor = (val.clusterBgColor);
			ref.ccijrresultArr[k].clusterName = (val.clusterName);
		}
		this.getIntroText();
		this.CCIjsonSort(JSON.parse(this.storageService.sessionStorageGet('CCIjrResult')));
	}

	@HostListener('window:beforeunload', ['$event'])
	yourfunction($event) {

		console.log("his");

	}
	/**This method is to check from which assessment we are coming from.*/
	getIntroText() {
		let intoEndUrl;
		if (this.storageService.sessionStorageGet('CCIassessment') == 'CCIJr') {
			intoEndUrl = 'pageText/cciJr';
		} else {
			intoEndUrl = 'pageText/cciAdult';
		}

		// let payloadjson = {
		this.dispatchStore.dispatch({
			type: "GET_INTRO_TEXT", payload: {
				methodVal: 'GET', module_Name: 'Assessment/v1/',
				path_params: [], query_params: { 'lang': this.lang },
				body_Params: {}, endUrlVal: intoEndUrl, setVal: 'commonIntro', text: ''
			}
		});

		// this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
	}

	/**This method is for navigating from result to the related cluster.*/
	callOccDetailCluster(clusterId, ClusterName, clusterIcon, clusterColor) {
		this.utils.showLoading();
		this.router.navigate(['../occCluster'], {
			relativeTo: this.activatedRoute,
			queryParams: { clusId: clusterId, clusName: ClusterName, clusIcon: clusterIcon, clusColor: clusterColor }
		});

	}

	/**
	 * This method is for sorting the score to desending order
	 * @param res contains the result from Api.
	 */
	CCIjsonSort(res) {
		try {
			const obj = {};
			const Careerlist = res;
			const cciScore = [];

			for (let j = 0; j < Careerlist.length; j++) {
				cciScore.push(Careerlist[j].score);
				this.ccikeys.push(Careerlist[j].clusterID);
			}
			for (let i = 0; i < cciScore.length; i++) {
				for (let j = i + 1; j < cciScore.length; j++) {
					if (cciScore[i] < cciScore[j]) {
						const firstscore = cciScore[i];
						cciScore[i] = cciScore[j];
						cciScore[j] = firstscore;
						const secondscore = this.ccikeys[i];
						this.ccikeys[i] = this.ccikeys[j];
						this.ccikeys[j] = secondscore;
					} else if (cciScore[i] == cciScore[j]) {
						if (this.ccikeys[i] > this.ccikeys[j]) {
							const firstscore = this.ccikeys[i];
							this.ccikeys[i] = this.ccikeys[j];
							this.ccikeys[j] = firstscore;
						}
					}
				}

				for (let k = 0; k < this.ccijrresultArr.length; k++) {
					if (this.ccijrresultArr[k].clusterID == this.ccikeys[i]) {
						this.ccijrResult.push({
							ccijrClusterId: this.ccikeys[i],
							ccijrScore: cciScore[i],
							ccijrIcon: this.ccijrresultArr[k].clusterIconValue,
							ccijrBgColor: this.ccijrresultArr[k].clusterBgColor,
							ccijrClusterName: this.ccijrresultArr[k].clusterName
						});
					}
				}
			}
			this.utils.hideLoading();
		} catch (e) {
			console.log('result exception-->' + e.message);
		}
	}

	/**
	 * This method is for saving the complete user notes.
	 */
	saveCCIjrAssessment() {
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
			this.trackEvnt.showSaveDialog(this.apiJson, 'CCICOMPLETE');
		} catch (e) {
			console.log('Saveusernotes exception-->' + e.message);
		}
	}

	/**
	 * This method is used for unsubscribing the event
	 */
	ngOnDestroy() {
		this.subscription2.unsubscribe();
		this.subscription.unsubscribe();
	}
}
