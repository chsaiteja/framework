import { Component, ViewChild, HostListener } from '@angular/core';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AssessmentsService } from '../../shared/services/assessments.service';
import { Subscription } from "rxjs/Subscription";
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AsmntCommonState, defaultCommonText } from '../../../../state-management/state/main-state';
import { abilityColors, aeIcons, localJson, defaultgraph } from '../../shared/constants/assessments-constants';
declare var d3pie: any;
@Component({
    selector: 'ae-result',
    templateUrl: './ae-result.layout.html',
})
export class AbilityExplorerResultComponent {

    logId;//variable storing the value of logId 
    lang;  //variable storing the value of lang 
    list; //variable using for assigning the value of res
    area; //variable for storing the value of res
    chart; //chart variable using instance of d3pie
    resultVal;//variable storing the subscribing value of AsmntIntroText
    common = [];//common array for storing the values
    returnedVal;//returnedVal for storing the subscribing the value AsmntCommonText
    aeResultHigh = [];//array variable for pushing the object high level 
    firstTwoVal = [];
    aeResultAverage = [];//array variable for pushing the object average level
    aeResultLow = [];//array variable for pushing the object low level
    chartColors = abilityColors;//assigning the abilityColors from assessment constants
    twoAbilities = [];//array for storing the value of twoAbilities
    aeIconsJson;//variable for storing the icons
    values;
    subscription = new Subscription;
    @ViewChild(OccupationListComponent) public occListComp: OccupationListComponent;
    constructor(private activeRoute: ActivatedRoute, private serverApi: ServerApi, private storageService: StorageService,
        private router: Router, private store: Store<AsmntCommonState>, private trackEvnt: AssessmentsService, private apiJson: ApiCallClass, private eventService: EventDispatchService, private utils: Utilities) {
        /**here listeing the save_complete */
        this.subscription = eventService.listen().subscribe((e) => {
            if (e.type == "save_Complete") {
                this.saveCompleteAEAssessment();
            }
            else if (e.type == "print_Ideas") {
            }
        });
        this.store.select('AsmntCommonText').subscribe((v) => {
            this.returnedVal = v
            if (this.returnedVal.commonText != undefined) {
                this.utils.hideLoading();
            }
        });
        this.store.select('AsmntIntroText').subscribe((v) => {
            this.resultVal = v
        });
    }

    /**in this ngOnInit() ,getting result  */
    ngOnInit() {
        this.utils.showLoading();
        this.logId = this.storageService.sessionStorageGet('logID');
        this.storageService.sessionStorageSet('isAssessment', '');
        this.storageService.sessionStorageSet('isFrom', 'result');
        this.lang = this.storageService.sessionStorageGet('langset');
        this.getAeAreas();
        this.aeIconsJson = aeIcons;
    }

    /**getAeAreas method for the ae/areas api call */
    getAeAreas() {
        try {
            let area;
            this.store.dispatch({
                type: "GET_PARTICULAR_AREA_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['areas'], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'AE'
                }
            });

            this.store.select('AsmntParAreaText').subscribe((res) => {
                area = res;

                if (this.storageService.sessionStorageGet('module') == 'ae' &&
                    area.commonIntroText.length != undefined && area.commonIntroText.length != 0) {

                    this.abilitiesResponseResult(this.storageService.sessionStorageGet('aeResult'), area);
                }
            });
        } catch (e) {
            console.log("getting area exception :" + e.message);
        }
    }

    /**HostListener for onResize event and calling the commonPieChartResponsive method */
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonPieChartResponsive();

    }

    /**commonPieChartResponsive method for the piechart displayed in the view */
    commonPieChartResponsive() {

        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;

        var piesize = { height: 350, width: 500, outerRadius: 0, truncateLength: 50 };
        var high = 1200;
        if (screenWidth >= high) {
            piesize.outerRadius = 120;
        } else if (screenWidth <= 767) {
            piesize.outerRadius = 40;
            piesize.height = 200;
            if (screenWidth <= 350) {
                piesize.truncateLength = 15;
            }
            if (screenWidth <= 576) {
                piesize.width = screenWidth - 50;

            }

        } else {
            piesize.outerRadius = (screenWidth / high) * 100;
            piesize.width = (screenWidth / 2) - 50;
        }

        this.testDraw(piesize);
    }

    /**testDraw method for the piechart */
    public testDraw(piesize) {

        if (this.chart != undefined) {
            this.chart.destroy();
        }
        this.chart = new d3pie("pieChart", {
            "size": {
                "canvasHeight": piesize.height,
                "canvasWidth": piesize.width,
                "pieOuterRadius": piesize.outerRadius
            },
            "data": {
                "content": this.common
            },
            "labels": {
                "outer": {
                    "pieDistance": 10
                },
                "inner": {
                    "format": "none"
                },
                "mainLabel": {
                    "fontSize": 11
                },
                "percentage": {
                    "color": "#ffffff",
                    "decimalPlaces": 0
                },
                "value": {
                    "color": "#adadad",
                    "fontSize": 11
                },
                "lines": {
                    "enabled": true,
                    "style": "straight"
                },
                "truncation": {
                    "enabled": true,
                    "truncateLength": piesize.truncateLength
                }
            },
            "effects": {
                "pullOutSegmentOnClick": {
                    "speed": 400,
                    "size": 20
                }
            },
            "misc": {
                "gradient": {
                    "enabled": false,
                    "percentage": 100
                }
            }
        });
    }

    /** This abilitiesResponseResult method @param res and @param area function is for sorting,
     *  assign color and displaying prepare piechart */
    abilitiesResponseResult(res, area) {
        this.twoAbilities = [];
        this.list = JSON.parse(res);
        for (let i = 0; i < area.commonIntroText.length; i++) {
            if (this.list.ability1 == area.commonIntroText[i].areaAbbr ||
                this.list.ability2 == area.commonIntroText[i].areaAbbr) {
                this.twoAbilities.push(area.commonIntroText[i].title);
            }
        }



        this.storageService.sessionStorageSet('twoAbilities', this.twoAbilities);
        /**Here result is sorting */
        for (let k = 0; k < this.list.areas.length; k++) {
            for (let j = k + 1; j < this.list.areas.length; j++) {

                if (this.list.areas[k].score < this.list.areas[j].score) {
                    const a = this.list.areas[k];
                    this.list.areas[k] = this.list.areas[j];
                    this.list.areas[j] = a;
                }
            }
        }

        this.common = [];

        /**Here we can prepare the final result to display on layout */
        for (let i = 0; i < this.list.areas.length; i++) {
            for (let j = 0; j < area.commonIntroText.length; j++) {
                if (this.list.areas[i].areaAbbr == area.commonIntroText[j].areaAbbr) {
                    this.common.push({
                        "level": this.list.areas[i].level,
                        "areaAbbr": this.list.areas[i].areaAbbr,
                        "score": this.list.areas[i].score,
                        "title": area.commonIntroText[j].title,
                        "type": area.commonIntroText[j].type,
                        "description": area.commonIntroText[j].description,
                        "occIDs": this.list.areas[i].occIDs,
                        "label": area.commonIntroText[j].title,
                        "value": this.list.areas[i].score,
                        "knowledges": area.commonIntroText[j].knowledges,
                    });

                }
            }
        }
        this.aeResultHigh = [];
        this.aeResultAverage = [];
        this.aeResultLow = [];
        try {
            /** Here assign the colors to result */
            this.common.forEach(function (obj, inx) {
                if (obj.level === 'high') {
                    obj['color'] = abilityColors['high'];
                    this.common['color'] = abilityColors['high'];
                    this.aeResultHigh.push(obj);
                } else if (obj.level === 'medium') {
                    obj['color'] = abilityColors['medium'];
                    this.common['color'] = abilityColors['medium'];
                    this.aeResultAverage.push(obj);
                } else if (obj.level === 'low') {
                    obj['color'] = abilityColors['low'];
                    this.common['color'] = abilityColors['low'];
                    this.aeResultLow.push(obj);
                }

                this.commonPieChartResponsive();
            }.bind(this));
            this.storageService.sessionStorageSet('abilitiesfullresult', JSON.stringify(this.common));

        }
        catch (e) {
            console.log("this abilities response result exception" + e.message);
        }
    }


    /** This saveCompleteAEAssessment() is for complete save */
    saveCompleteAEAssessment() {
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
                    "params": { "stateAbbr": "IC" }
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
        this.trackEvnt.showSaveDialog(this.apiJson, 'AECOMPLETE');
    }

    getAETwoAreas(title1, title2) {

        let interest = [];
        let titleVal = [];
        let description = [];
        let aetype = [];
        let aeknowledges = [];

        for (let i = 0; i < this.common.length; i++) {
            if (this.common[i].title == title1 || this.common[i].title == title2) {
                interest.push(this.common[i].areaAbbr);
                titleVal.push(this.common[i].title);
                description.push(this.common[i].description);
                aetype.push(this.common[i].type);
                aeknowledges.push(this.common[i].knowledges);
            }
        }
        if (title2 == null || title2 == undefined) {
            titleVal.push(title2);
        }

        this.getAEOccListBasedOnInterest(interest, description, titleVal, aetype, aeknowledges);

    }


    getAEOccListBasedOnInterest = function (interest, descrip, titleVal, aetype, aeknowledges) {
        this.storageService.sessionStorageSet('aetitleVal', titleVal);
        this.storageService.sessionStorageSet('aeInterest', interest);
        this.storageService.sessionStorageSet('aeInterestText', descrip);
        this.storageService.sessionStorageSet('aeType', aetype);

        this.storageService.sessionStorageSet('aeknowledges', aeknowledges);
        this.router.navigate(['../occlist'], { relativeTo: this.activeRoute });
    };

    /** This ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
