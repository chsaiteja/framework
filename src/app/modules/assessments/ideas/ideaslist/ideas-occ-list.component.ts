/**imported angular core libraries */
import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';

/**imported services libraries */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { Store, Action } from '@ngrx/store';
/**imported colorjson from  assessments-constants */
import { ideasColors, localJson, defaultgraph } from '../../shared/constants/assessments-constants';
import { AsmntQuestionState } from '../../../../state-management/state/main-state';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'ideas-occlist',
    templateUrl: './ideas-occ-list.layout.html',
})

export class IDEASOccListComponent implements OnInit, OnDestroy {
    ideasResultHigh = []; /**Declare for pushing the high values.*/
    ideasResultAverage = []; /**Declare for pushing the average values.*/
    ideasResultLow = []; /**Declare for pushing the low values.*/
    resultChart; /**Declare for getting the result of the page.*/
    interest; /**Declare for getting the titles of the result page.*/
    area; /**Declare for getting the areas.*/
    lang; /**Declare for getting the language data.*/
    areaAbbr; /**Declare for getting the areaabbr */
    introVal; /**Declare for getting the assessment intro text.*/
    chartColors = ideasColors; /**Declare for getting the color values from the constants.*/
    reducerSub1 = new Subscription; /** Declare to listen if any change occured.*/
    reducerSub3 = new Subscription; /** Declare to listen if any change occured.*/
    interestJson = localJson; /**Declare for getting the values from the constants for showing the graph.*/
    defaultCardJson = defaultgraph;  /**Declare for getting the values from the constants for showing the graph.*/
    ideas_Areas_Res;
    areaResult;

    @ViewChild(OccupationListComponent) public occListComp: OccupationListComponent;
    constructor(private utils: Utilities, private storageService: StorageService,
        private apiJson: ApiCallClass, private dispatchStore: Store<Action>,
        private serverApi: ServerApi,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private store: Store<AsmntQuestionState>) {
        this.lang = this.storageService.sessionStorageGet('langset');
    }

    /** This  ngOnInit() function for assign color and prepare piechart */
    ngOnInit() {
        try {


            this.storageService.sessionStorageSet('module', 'ideas');
            this.resultChart = JSON.parse(this.storageService.sessionStorageGet('ideasfullresult'));
            this.ideasResultHigh = [];
            this.ideasResultAverage = [];
            this.ideasResultLow = [];
            this.resultChart.forEach(function (obj, inx) {
                if (obj.level === 'high') {
                    this.ideasResultHigh.push(obj);
                } else if (obj.level === 'average') {
                    this.ideasResultAverage.push(obj);
                } else if (obj.level === 'low') {
                    this.ideasResultLow.push(obj);
                }
            }.bind(this));

            setTimeout(function () {
                this.displayPieChartInOccList(this);
            }.bind(this), 0);
            this.areaAbbr = this.storageService.sessionStorageGet('areaAbbr');
            this.interest = this.storageService.sessionStorageGet('ideastitle');
            this.dispatchStore.dispatch({
                type: 'GET_PARTICULAR_AREA_TEXT', payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['areas'], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'IDEAS'
                }
            });
            this.reducerSub3 = this.store.select('AsmntParAreaText').subscribe((res) => {
                this.ideas_Areas_Res = res;
                if (this.ideas_Areas_Res.commonIntroText.length != undefined) {
                    this.areaResult = this.ideas_Areas_Res.commonIntroText;
                }

            });
        }
        catch (e) {
            console.log("ideas-occ-list init exception:" + e.message);
        }
        this.introVal = this.store.select('AsmntIntroText');
    }


    /**This displayPieChartInOccList(ref) function is for  preparing piechart*/
    displayPieChartInOccList(ref) {
        try {
            let tempArray = [];
            for (let j = 0; j < this.resultChart.length; j++) {
                if (tempArray.indexOf(this.resultChart[j].type) == -1) {
                    for (let i = 0; i < this.interestJson.length; i++) {
                        let sendJson = {};
                        if (this.interestJson[i].childAreas.indexOf(this.resultChart[j].areaAbbr) > -1) {
                            tempArray.push(this.resultChart[j].type);
                            sendJson['type'] = this.resultChart[j].type;
                            sendJson['height'] = this.interestJson[i].height;
                            sendJson['id'] = this.interestJson[i].id;
                            sendJson['range'] = this.interestJson[i].range;
                            sendJson['margin'] = this.interestJson[i].margin;
                            sendJson['rotate'] = this.interestJson[i].rotate;
                            sendJson['transformer'] = this.interestJson[i].transformer;
                            sendJson['width'] = this.interestJson[i].width;
                            this.circularText(sendJson);
                        }
                    }
                }
                let sendJson2 = {};
                for (let k = 0; k < this.defaultCardJson.length; k++) {
                    if (this.resultChart[j].areaAbbr == this.defaultCardJson[k].areaAbbr) {
                        sendJson2['type'] = this.defaultCardJson[k].areaAbbr;
                        sendJson2['height'] = this.defaultCardJson[k].height;
                        sendJson2['id'] = this.defaultCardJson[k].id;
                        sendJson2['range'] = this.defaultCardJson[k].range;
                        sendJson2['margin'] = this.defaultCardJson[k].margin;
                        sendJson2['rotate'] = this.defaultCardJson[k].rotate;
                        sendJson2['transformer'] = this.defaultCardJson[k].transformer;
                        sendJson2['width'] = this.defaultCardJson[k].width;
                        sendJson2['level'] = this.resultChart[j].level;
                        this.circularText(sendJson2);
                    }
                }
            }
            this.elementRef.nativeElement.querySelector('#' + ref.areaAbbr).click();
        } catch (e) {
            console.log('displayPieChartInOccList exception :' + e.message);
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
                this.renderer.setElementStyle(document.getElementsByClassName("idea-color-level")[receive['id']], "background", this.chartColors[receive['level']]);
            }
            var deg = receive['range'] / receive['type'].length,
                origin = 0;

            receive['type'].forEach((ea) => {
                ea = `<p style='height:${receive['height']}px;position:absolute;transform:rotate(${origin}deg);transform-origin:0 100%'><span class="result-idea-text"  style='transform:rotate(${receive['transformer']}deg);position:absolute;width:${receive['width']}px;'>${ea}</span></p>`;

                classIndex.innerHTML += ea;
                origin += deg;
            });
        }
        catch (e) {
            console.log("exception change text-->" + e.message);
        }
    }

    /** This getIdeasAreaOccListParent is for send the areaAbbr,title  to occlist */
    getIdeasAreaOccListParent(area, interstparam) {

        this.utils.showLoading();
        this.area = area;
        this.interest = interstparam;
        this.dispatchStore.dispatch({
            type: "GET_AREA_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: ['occList', this.area], query_params: { 'lang': this.lang },
                body_Params: {}, endUrlVal: 'IDEAS'
            }
        });
        this.reducerSub1 = this.store.select('AsmntAreaText').subscribe((res) => {
            this.storageService.sessionStorageSet('OccList', JSON.stringify(res));
            /** The below call is for assigning the occ data to the alpha scroll */
            this.occListComp.getOccListData(res);
        });
    }

    /**
     * This ngOnDestroy() function is call after Component destory.
     */
    ngOnDestroy() {
        this.reducerSub1.unsubscribe();
    }
}
