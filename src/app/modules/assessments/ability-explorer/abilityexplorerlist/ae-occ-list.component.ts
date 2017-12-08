/**Import angular core packages */
import { Component, ElementRef, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Import shared Imports */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { abilityColors, ideasIcons, localJson, defaultgraph } from '../../shared/constants/assessments-constants';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { StoreService } from '../../../../state-management/services/store-service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

declare var d3pie: any;
@Component({
    selector: 'ae-list',
    templateUrl: './ae-occ-list.layout.html',
})
export class AbilityExplorerListComponent implements OnInit, OnDestroy {

    aeOccListData = []; //array variable for storing the result
    resultChart = []; //array variable for storing the result getting from result page
    interest = []; //array variable for storing the areaAbbr key in resultChart array
    chartColors = abilityColors; //assigning the abilityColors to the chartColors variable
    titleVal = []; //array variable for storing the title key in resultChart array
    inOccList = false; //inOccList boolean variable for checking it is in ae occlist page
    description = []; // array variable for storing the description key in resultChart array
    pieColor = {};//pieColor object for pieChart colors using in occlist 
    areaTypes;//areaTypes variable for storing the type key in resultchart array
    areaKnowledges;//areaKnowledges variable for storing the knowledges key in resultChart array
    area;//area variable for areaAbbr
    lang;//lang variable for storing the language value
    chart;//chart variable using in piechart
    twoAbilityVal = [];//array for storing the top two abilities
    subscription = new Subscription;
    areadescription;//areadescription for storing the description
    listpageVal;//variable for storing the subscribe value of AsmntIntroText

    @ViewChild(OccupationListComponent) public occListComp: OccupationListComponent;
    constructor(private router: Router, private utils: Utilities, private storageService: StorageService, private eventService: EventDispatchService,
        private apiJson: ApiCallClass, private serverApi: ServerApi, private elementRef: ElementRef, private store: Store<any>) {
        this.lang = this.storageService.sessionStorageGet('langset');
        this.store.select('AsmntIntroText').subscribe((v) => {
            this.listpageVal = v
            if (this.listpageVal.commonText != undefined && this.listpageVal.commonText != null) {
                this.utils.hideLoading();
            }
        });

    }

    ngOnInit() {

        try {
            this.twoAbilityVal = this.storageService.sessionStorageGet('twoAbilities').split(',');
            // for (let i = 0; i < values.length; i++) {
            //     if (i == 0) {
            //         this.twoAbilityVal.push(values[0]);
            //     } else if (i == 1) {
            //         this.twoAbilityVal.push('&' + values[1]);
            //     }
            // }

            this.storageService.sessionStorageSet('module', 'ae');
            this.resultChart = JSON.parse(this.storageService.sessionStorageGet('abilitiesfullresult'));
            //this.twoAbilityVal = this.storageService.sessionStorageGet('twoAbilityVal').split(',');
            this.interest = (this.storageService.sessionStorageGet('aeInterest')).split(',');
            this.titleVal = (this.storageService.sessionStorageGet('aetitleVal')).split(',');

            this.description = (this.storageService.sessionStorageGet('aeInterestText')).split(',');
            this.areaTypes = (this.storageService.sessionStorageGet('aeType')).split(',');
            this.areaKnowledges = (this.storageService.sessionStorageGet('aeknowledges')).split(',');
            for (let i = 0; i < this.resultChart.length; i++) {
                this.pieColor[this.resultChart[i].level] = abilityColors[this.resultChart[i].level]
            }
            setTimeout(function () {
                this.displayPieChartInAeOccList(this);
            }.bind(this), 0);
        } catch (e) {
            console.log('ae occ list oninit exception:' + e.message);
        }
    }

    /** This function is to display the pie chart. */
    displayPieChartInAeOccList(ref) {
        try {

            this.commonPieChartResponsive();
            for (let i = 0; i < ref.interest.length; i++) {
                this.elementRef.nativeElement.querySelector('#' + ref.interest[i]).click();
            }
        } catch (e) {
            console.log('displayPieChartInOccList exception :' + e.message);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.commonPieChartResponsive();
    }

    commonPieChartResponsive() {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;

        var piesize = { height: 245, width: 500, outerRadius: 0, truncateLength: 50 };

        var high = 1200;
        if (screenWidth >= high) {
            piesize.outerRadius = 80;
        } else if (screenWidth <= 767) {
            piesize.outerRadius = 40;
            piesize.height = 170;
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

    /**testDraw method has @param piesize using for the  for piechart */
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
                "content": this.resultChart

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


    /** this getAEAreaOccListParent is for send the areaAbbr,title  to occlist */
    getAEAreaOccListParent(area, title, areadescription, aetype, aeknowledge) {

        if (this.titleVal.length == 1 || this.inOccList == true) {

            this.utils.showLoading();
            this.interest = [area];
            this.titleVal = [title];

            this.description = [areadescription];
            this.area = area;
            this.areaTypes = [aetype];
            this.areaKnowledges = [aeknowledge];

            this.store.dispatch({
                type: "GET_AREA_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['occList', this.area], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'AE'
                }
            });

            this.store.select('AsmntAreaText').subscribe((res) => {

                this.storageService.sessionStorageSet('OccList', JSON.stringify(res));

                /** The below call is for assigning the occ data to the alpha scroll */
                this.occListComp.getOccListData(res);
            });
        } else if (this.area == undefined) {
            this.area = area;
            this.inOccList = false;

            this.getAeTwoAreas(this.titleVal[0], this.titleVal[1]);
        }
        else {
            this.inOccList = true;
        }
    }

    /**
       * This method is called when two top Value links are clicked
       * @param area1 contains the First area name of top two values
       * @param area2 contains the Second area name of top two values
       */
    getAeTwoAreas(area1, area2) {

        let interest = [];
        let titleVal = [];
        let description = [];
        let areaTypes = [];
        let areaKnowledges = [];
        for (let i = 0; i < this.resultChart.length; i++) {
            if (this.resultChart[i].title == area1 || this.resultChart[i].title == area2) {
                interest.push(this.resultChart[i].areaAbbr);
                titleVal.push(this.resultChart[i].title);
                description.push([this.resultChart[i].description]);
                areaTypes.push([this.resultChart[i].type]);
                areaKnowledges.push([this.resultChart[i].knowledges]);
            }
        }

        this.interest = interest;
        this.titleVal = titleVal;
        this.description = description;
        this.areaTypes = areaTypes;
        this.areaKnowledges = areaKnowledges;

        this.getAeTwoAreaOcclist(this.interest[0], this.interest[1]);
    }

    /**
     * This method is called when two top Value links are clicked
     * @param areaAbbr1 contains the First areaAbbr name of top two values
     * @param areaAbbr2 contains the Second areaAbbr name of top two values
     */
    getAeTwoAreaOcclist(areaAbbr1, areaAbbr2) {

        try {
            this.utils.showLoading();
            this.apiJson.endUrl = 'ae/occList';
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = 'Assessment/v1/';
            const data = {
                input_data: [

                    {
                        'param_type': 'path',
                        'params': [areaAbbr1, areaAbbr2]
                    },
                    {
                        'param_type': 'query',
                        'params': { 'lang': 'en', 'stateAbbr': 'IC' }
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

                    this.storageService.sessionStorageSet('OccList', JSON.stringify(response));

                    this.aeOccListData = response[0].Result;

                    /** The below call is for assigning the occ data to the alpha scroll */
                    this.occListComp.getOccListData(this.aeOccListData);
                }
            }, this.utils.handleError);
        } catch (e) {
            console.log('ae area two exception-->' + e.message);
        }
    }
}
