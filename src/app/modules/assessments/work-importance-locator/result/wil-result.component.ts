/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/**Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

/**Constants */
import { wilCardColors } from '../../shared/constants/assessments-constants';
import { wilResultIcons } from '../../shared/constants/assessments-constants';
import { Store, Action } from '@ngrx/store';
import { StoreService } from '../../../../state-management/services/store-service';
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';


declare const Pizza: any;
declare const html2canvas: any;

@Component({
    selector: 'wil-result',
    templateUrl: './wil-result.layout.html',
})
export class WILResultComponent implements OnInit, OnDestroy {
    result = []; /**Declared for storing the result */
    pieColor = {}; /**Declared for assigning the pie_colors */
    wilIcon = {};  /**Declared for assigning the Icons*/
    wil_Areas_Res; /**Declared for assigning the areas */
    wilResult = []; /**Declared for storing the areas title and discription */
    firstTwoVal = []; /**Declared for storing top two values */
    wilColors = []; /**Declared for storing wil colors */
    wilreturnedVal; /**Declare for storing assessment common text.*/
    eventSub = new Subscription; /** Declare to listen if any change occured.*/
    reducerSub = new Subscription; /** Declare to listen if any change occured.*/
    reducerSub2 = new Subscription; /** Declare to listen if any change occured.*/
    resVal; /**Declare for storing resulr text.*/
    lang; /**Declare for getting the langset value.*/

    constructor(private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>, private AsmntQuestionStore: Store<AsmntQuestionState>, private apiJson: ApiCallClass, private trackEvnt: AssessmentsService, private serverApi: ServerApi, private utils: Utilities,
        private eventService: EventDispatchService, private commonlang: StoreService, private router: Router, private storageService: StorageService, ) {

		/** Below code block listens broadcasted event and
        * calls respective functionality for this assessment */
        this.lang = this.storageService.sessionStorageGet('langset')
        this.eventSub = eventService.listen().subscribe((e) => {

            if (e.type === 'save_Complete') {
                this.saveUserNotes();
            } else if (e.type === 'EQPrint') {
                // this.printResult();
            }
        });
        this.wilreturnedVal = store.select('AsmntCommonText');
        this.reducerSub = this.store.select('AsmntIntroText').subscribe((res) => {
            this.resVal = res;
        });
    }

    /**This function is for getting into the result page. */
    ngOnInit() {
        this.utils.showLoading();
        this.storageService.sessionStorageSet('isAssessment', '');
        this.storageService.sessionStorageSet('isFrom', 'result');
        this.wilIcon = wilResultIcons;
        this.getWilAreas();

        // let payloadjson = {
        this.dispatchStore.dispatch({
            type: "GET_INTRO_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: [], query_params: { 'lang': this.lang },
                body_Params: {}, endUrlVal: 'pageText/wil'
            }
        });

        // this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
    }



    /**
     * This method is for sorting the result
     * @param res contains the result
     * @param area contains the areas coming from Api
     */
    getResult(res, area) {
        if (res != null) {
            this.wilResult = [];
            let interestedAreas = Object.keys(res);
            for (let i = 0; i < area.commonIntroText.length; i++) {
                this.wilResult.push({
                    areaAbbr: area.commonIntroText[i].areaAbbr,
                    title: area.commonIntroText[i].title,
                    score: res[area.commonIntroText[i].areaAbbr].score,
                    description: area.commonIntroText[i].description,
                });
                this.wilColors[area.commonIntroText[i].areaAbbr] = wilCardColors[area.commonIntroText[i].areaAbbr]
            }
            for (let i = 0; i < this.wilResult.length; i++) {
                for (let j = i + 1; j < this.wilResult.length; j++) {
                    if (this.wilResult[i].score < this.wilResult[j].score) {
                        const a = this.wilResult[i];
                        this.wilResult[i] = this.wilResult[j];
                        this.wilResult[j] = a;
                    }
                }
            }
            this.storageService.sessionStorageSet('resultWIL', JSON.stringify(this.wilResult));
        }
        else {
            this.wilResult = JSON.parse(this.storageService.sessionStorageGet('resultWIL'));
            for (let i = 0; i < area.commonIntroText.length; i++) {
                this.wilColors[area.commonIntroText[i].areaAbbr] = wilCardColors[area.commonIntroText[i].areaAbbr]
            }
        }
        this.utils.hideLoading();
        this.firstTwoVal.push(this.wilResult[0].title);
        this.firstTwoVal.push(this.wilResult[1].title);
        this.storageService.sessionStorageSet('twoTitleVal', this.firstTwoVal);
        try {
            setTimeout(function () {
                this.displayPieChart(this);
            }.bind(this), 0);
        } catch (e) {
            console.log('exception=>' + e.message);
        }
    }

    /**This method is used for getting the areas */
    getWilAreas() {
        try {
            this.dispatchStore.dispatch({
                type: "GET_PARTICULAR_AREA_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: [], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'wil/areas'
                }
            });

            this.reducerSub2 = this.AsmntQuestionStore.select('AsmntParAreaText').subscribe((res) => {
                this.wil_Areas_Res = res;
                if (this.storageService.sessionStorageGet('module') == 'wil' && this.wil_Areas_Res.commonIntroText.length != undefined && this.wil_Areas_Res.commonIntroText.length != 0) {
                    this.getResult(JSON.parse(this.storageService.sessionStorageGet('wilResult')), this.wil_Areas_Res);
                }
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    /* This method for displaying the result in pie chart format. */
    displayPieChart(ref) {
        Pizza.init();
    }

	/* This method is for saving the assessment in the server with Usernotes.
		Here call for the SaveUserNotes takes place.
	*/
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
        this.trackEvnt.showSaveDialog(this.apiJson, 'WIL');
    }

	/* This method gets called when user clicks the area of interest.
	    This navigates user to occupation list which gets the occupation based on interest.*/
    getOccListBasedOnInterest = function (interest, descrip, titleVal) {
        this.storageService.sessionStorageSet('titleVal', titleVal);
        this.storageService.sessionStorageSet('wilInterest', interest);
        this.storageService.sessionStorageSet('wilInterestText', descrip);
        this.storageService.sessionStorageSet('module', 'wil')
        setTimeout(function () {
            const rtArr = this.router.url.split('/');
            const rtVal = rtArr.slice(1, rtArr.length - 1).join('/');
            this.router.navigate([rtVal + '/occlist'], { relativeTo: this.activeRoute });
        }.bind(this), 0);
    };

    /**This method is used for getting the areas result when top two areas button was clicked */
    getWilTwoAreas(area1, area2) {
        let interest = [];
        let titleVal = [];
        let description = [];
        for (let i = 0; i < this.wilResult.length; i++) {
            if (this.wilResult[i].title == area1 || this.wilResult[i].title == area2) {
                interest.push(this.wilResult[i].areaAbbr);
                titleVal.push(this.wilResult[i].title);
                description.push(this.wilResult[i].description);
            }
        }
        this.getOccListBasedOnInterest(interest, description, titleVal);
    }

    /* This method is for printing the result page when we click on print button.*/
    // printResult() {
    // 	setTimeout(() => { Pizza.init(); }, 1000);
    // 	document.getElementById('openModalButton').click();
    // }
    /**This function is for printing the result page when we click
	* on done button in popup, that displays when print button is clicked  */

    printResultPage() {
        //     let theCanvas = '';
        //     try {

        //         html2canvas(document.getElementById('print-list'), {
        //             onrendered: function (canvas) {
        //                 theCanvas = canvas;
        //                 const headingToPrint = document.getElementById('ip-print-heading');
        //                 const divToPrint = document.getElementById('print-piechart');
        //                 const textToPrint = document.getElementById('print-text');
        //                 const list = document.getElementById('list-popup');


        //                 const newWin = window.open('', 'Print-Window', 'width=500,height=500');

        //                 newWin.document.open();
        //                 newWin.document.write(`<html>
        //                                       <head>
        //                                            <link type='text/css' rel='stylesheet'
        // 										    href='node_modules/bootstrap/dist/css/bootstrap.min.css'>
        //                                             <style>
        //                                              .main-print-ip{
        //                                                  width:30%;
        //                                                  float:left;
        //                                              }
        //                                              .ip-img-print-main{
        //                                                 width:70%;
        //                                                  margin:34px 0 30px 0;
        //                                              }
        //                                              .headding-ip{
        //                                                  margin-left:10px;
        //                                              }
        //                                                .print-text{
        //                                                   margin:10px;
        //                                              }
        //                                               @media screen and (max-width: 767px) {
        // 												   .main-print-ip{
        //                                                  width:100%;
        //                                                  float:left;
        //                                              }
        //                                                   .ip-img-print-main{
        //                                                 width:100%;
        //                                                  margin:34px 0 30px 0;
        //                                              }
        //                                              }                                             
        // 											   </style>
        //                                         </head>
        //                                              <body onload='window.print()'> <h4 class='headding-ip'>` + headingToPrint.innerHTML +
        //                     `</h4> <div class='main-print-ip'>` + divToPrint.innerHTML + `</div>
        //                                              <div class='color-box'  style='margin: 56px 0 82px;'>` + list.innerHTML +
        //                     `</div>` + textToPrint.innerHTML + `</body></html>`);

        //                 newWin.document.close();
        //                 setTimeout(function () { window.close(); }, 10000);
        //             }
        //         });
        //     } catch (e) {
        //         console.log('printResultPage exception:' + e.message);
        //     }

    }
    /**
     * This method is used for unsubscribing the event.
     */
    ngOnDestroy() {
        this.reducerSub.unsubscribe();
        this.reducerSub2.unsubscribe();
        this.eventSub.unsubscribe();
    }
}


