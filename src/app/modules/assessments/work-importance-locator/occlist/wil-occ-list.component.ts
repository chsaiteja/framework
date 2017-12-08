/**Angular imports */
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/** Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

/**Assessment constants */
import { wilCardColors } from '../../shared/constants/assessments-constants';

/**Components */
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { Store, Action } from '@ngrx/store';
declare const Pizza: any;
import { Subscription } from 'rxjs/Subscription';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service'
import { AsmntCommonState, AsmntQuestionState } from '../../../../state-management/state/main-state';
import { StoreService } from '../../../../state-management/services/store-service';

@Component({
    selector: 'wil-occlist',
    templateUrl: './wil-occ-list.layout.html',
})
export class WILOccListComponent implements OnInit, OnDestroy {
    wilOccListData = [];/**Declare for storing the areas result */
    pieDataInOcc = []; /**Declare for storing the result */
    interest = []; /**Declare for setting the interest */
    subscription2 = new Subscription; /** Declare to listen if any change occured.*/
    reducerSub = new Subscription; /** Declare to listen if any change occured.*/
    titleVal = []; /** Contains all title values */
    inOccList = false; /** It tells whether to get area for one or two, by default one*/
    description = []; /** Contain description for title */
    pieColor = {}; /**Declare for assigning the pieColors */
    introVal; /** Contains text to display */
    twoTitleVal; /** Contains top two values */
    area; /**Declare for selecting the particular area */
    lang; /**Declare for getting the langset value.*/

    @ViewChild(OccupationListComponent) public occListComp: OccupationListComponent;
    constructor(private storeCommon: Store<AsmntCommonState>, private router: Router, private AsmntQuestionStore: Store<AsmntQuestionState>, private utils: Utilities,
        private commonlang: StoreService, private dispatchStore: Store<Action>, private apiJson: ApiCallClass, private serverApi: ServerApi, private elementRef: ElementRef,
        private storageService: StorageService) {
        this.lang = this.storageService.sessionStorageGet('langset');
        this.reducerSub = this.storeCommon.select('AsmntIntroText').subscribe((res) => {
            this.introVal = res;
        });
    }

    ngOnInit() {
        this.utils.hideLoading();
        try {
            //Dispatch event to get text from reducer
            // let payloadjson = {
            this.dispatchStore.dispatch({
                type: "GET_INTRO_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: [], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'pageText/wil'
                }
            });
            // this.commonlang.commonLanguageChange(this.lang, 'intro', payloadjson);
            this.twoTitleVal = this.storageService.sessionStorageGet('twoTitleVal').split(',');
            this.storageService.sessionStorageSet('module', 'wil');
            this.pieDataInOcc = JSON.parse(this.storageService.sessionStorageGet('resultWIL'));
            this.interest = (this.storageService.sessionStorageGet('wilInterest')).split(',');
            this.titleVal = (this.storageService.sessionStorageGet('titleVal')).split(',');
            this.description = (this.storageService.sessionStorageGet('wilInterestText')).split(',');
            for (let i = 0; i < this.pieDataInOcc.length; i++) {
                this.pieColor[this.pieDataInOcc[i].areaAbbr] = wilCardColors[this.pieDataInOcc[i].areaAbbr]
            }
            setTimeout(function () {
                this.displayPieChartInOccList(this);
            }.bind(this), 0);

            this.subscription2 = this.AsmntQuestionStore.select('AsmntAreaText').subscribe((res) => {
                try {
                    this.storageService.sessionStorageSet('OccList', JSON.stringify(res));
                    this.wilOccListData.push(res);
                    /** The below call is for assigning the occ data to the alpha scroll */
                    this.occListComp.getOccListData(res);
                } catch (e) {
                    console.log('AsmntAreaText exception:' + e.message);
                }
            });

        } catch (e) {
            console.log('wil occ list oninit exception:' + e.message);
        }
    }

    /** This function is to display the pie chart. */
    displayPieChartInOccList(ref) {
        try {
            Pizza.init();
            for (let i = 0; i < ref.interest.length; i++) {
                this.elementRef.nativeElement.querySelector('#' + ref.interest[i]).click();
            }
        } catch (e) {
            console.log('displayPieChartInOccList exception :' + e.message);
        }
    }
    /**
    * This method is called when two top Value links are clicked
    * @param area1 contains the First area name of top two values
    * @param area2 contains the Second area name of top two values
    */
    getWilTwoAreas(area1, area2) {
        let interest = [];
        let titleVal = [];
        let description = [];
        for (let i = 0; i < this.pieDataInOcc.length; i++) {
            if (this.pieDataInOcc[i].title == area1 || this.pieDataInOcc[i].title == area2) {
                interest.push(this.pieDataInOcc[i].areaAbbr);
                titleVal.push(this.pieDataInOcc[i].title);
                description.push([this.pieDataInOcc[i].description])
            }
        }
        this.interest = interest;
        this.titleVal = titleVal;
        this.description = description;
        this.getWilTwoAreaOcclist();
    }

    /**
     * This method is used for getting the data from the server when clicked on the pie-chart links
     * @param title contains the titleNames of interest
     * @param desp contains the description of interest
     * @param area contains the area of interest
     */
    getWilAreaOccListParent(area, desp, title) {
        if (this.titleVal.length == 1 || this.inOccList == true) {
            try {
                this.utils.showLoading();
                this.interest = [area];
                this.titleVal = [title];
                this.description = [desp];
                this.area = area;
                this.dispatchStore.dispatch({
                    type: "GET_AREA_TEXT", payload: {
                        methodVal: 'GET', module_Name: 'Assessment/v1/',
                        path_params: ['occList', this.area], query_params: { 'lang': this.lang },
                        body_Params: {}, endUrlVal: 'WIL'
                    }

                });

            } catch (e) {
                console.log('IP area exception-->' + e.message);
            }
        } else if (this.area == undefined) {
            this.area = area;
            this.inOccList = false;
            this.getWilTwoAreas(this.titleVal[0], this.titleVal[1]);
        }
        else {
            this.inOccList = true;
        }
    }
    // This method is called when we click on top two values
    getWilTwoAreaOcclist() {
        try {
            this.utils.showLoading();
            this.apiJson.endUrl = 'wil/occList';
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = 'Assessment/v1/';
            const data = {
                input_data: [

                    {
                        'param_type': 'path',
                        'params': [this.titleVal[0], this.titleVal[1]]
                    },
                    {
                        'param_type': 'query',
                        'params': { 'lang': 'en' }
                    },
                    {
                        'param_type': 'body',
                        'params': {

                        }
                    }
                ]
            };
            this.apiJson.method = 'GET';
            const dat = JSON.stringify(data);

            this.apiJson.data = dat;
            this.serverApi.callApi([this.apiJson]).subscribe((response) => {
                if (response[0].Success + '' === 'true') {
                    this.storageService.sessionStorageSet('OccList', JSON.stringify(response[0].Result));
                    this.wilOccListData = response[0].Result;
                    /** The below call is for assigning the occ data to the alpha scroll */
                    this.occListComp.getOccListData(response[0].Result);
                }
            }, this.utils.handleError);
        } catch (e) {
            console.log('IP area two exception-->' + e.message);
        }
    }
    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        this.subscription2.unsubscribe();
        this.reducerSub.unsubscribe();
    }
}





