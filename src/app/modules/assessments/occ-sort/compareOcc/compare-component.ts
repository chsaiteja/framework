/** Angular imports */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

/** import shared Components */
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, OCCPageState } from '../../../../state-management/state/main-state';
import { Subscription } from "rxjs/Subscription";
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

@Component({
    selector: 'compare-occ',
    templateUrl: './compare-layout.html',
})

export class OSCompareComponent implements OnInit, OnDestroy {
    browserDom: BrowserDomAdapter;
    enterEventListener;
    Firstresult = [];
    SecondResult = [];
    comOccName = [];
    IndexkeyValue = [];
    iconClass = [];
    colorClass = [];
    outLookHeading = [];
    wageTextVal = {};
    CompWageLabel = [];
    CompWageLabel1 = [];
    filter = [0, 999, 999, 999, 999, 999];
    finalCompArray = [];
    reducerSub1 = new Subscription;
    reducerSub2 = new Subscription;
    finalCompArray2 = [];
    growthimgsrc = [];
    occID = '';
    compareNames = [];
    settingsTextTab = [];
    occName = '';
    settingsText;
    accountId = '';
    occIndexListText;
    occCareerStore;
    backAssessmentValue = true;
    lang;
    constructor(private router: Router, private utils: Utilities, private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>,
        private apiJson: ApiCallClass, private apiJson1: ApiCallClass, private serverApi: ServerApi, private OCCPageStateStore: Store<OCCPageState>,
        private storageService: StorageService, private activatedRoute: ActivatedRoute) {
        this.lang = this.storageService.sessionStorageGet('langset');
        // console.log('in constructor')
        this.browserDom = new BrowserDomAdapter();

        const rtArr = this.router.url.split('/');

        /** To display back assessment button on header */
        for (let i = 0; i < rtArr.length; i++) {
            if (rtArr[i] == 'occdetails') {
                this.backAssessmentValue = false;
                break;
            } else {
                this.backAssessmentValue = true;
            }
        }
        this.activatedRoute.queryParams.subscribe(params => {
            // Defaults to 0 if no query param provided.
            this.occID = params['occId'];
            this.occName = params['occName'];
        });
        this.accountId = this.utils.getAccountId();
        this.reducerSub1 = store.select('OccText').subscribe((v) => {
            this.occIndexListText = v;
        });
        this.reducerSub2 = store.select('OccSettingsText').subscribe((v) => {
            this.settingsText = v;
            if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
                let ref = this;
                ref.settingsTextTab = [];
                this.settingsText.commonText.tabs.forEach(function (obj, inx) {
                    obj.sections.forEach(function (obj1, inx1) {
                        ref.settingsTextTab.push(obj1);
                    });
                }.bind(this));
            }
        });
    }

    ngOnDestroy() {
        document.removeEventListener('scroll', this.enterEventListener, true);
        this.reducerSub1.unsubscribe();
        this.reducerSub2.unsubscribe();
    }
    ngOnInit() {
        // console.log('in compare compo')
        this.dynamicStyle();
        this.utils.showLoading();
        let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
        if (val.commonText.common != undefined) {
            this.occIndexListText = val;
        }
        this.dispatchStore.dispatch({
            type: "OCC_SETTING_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Settings/v1/',
                path_params: [this.utils.getAccountId()], query_params: { "lang": this.storageService.sessionStorageGet('langset') },
                body_Params: {}, endUrlVal: 'occ/standard', name: 'careers'
            }
        });
        this.storageService.sessionStorageSet('savedValId', '');
        let compareTwoOcc = [];
        let OccIds = [];
        /** Getv the occupation id and name that is selected by user in occ list */

        OccIds = this.occID.split('&');
        compareTwoOcc = this.occName.split('&');

        for (let i = 0; i < OccIds.length; i++) {
            this.comOccName.push(compareTwoOcc[i]);
        }
        /** Here we are calling two api calls to get the result of the
         */
        this.apiJson = new ApiCallClass();
        this.apiJson.method = 'GET';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Occ/v1/';
        this.apiJson.endUrl = 'pages';
        // console.log('before inputdata 1');
        const compareInfo = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': ['occ', OccIds[0], this.accountId]
                },
                {
                    'param_type': 'query',
                    'params': {
                        'sections': 'Overview,TaskList,WageLevels,OutlookRatings,WorkingConditions,Preparation',
                        'states': 'US', 'lang': this.lang
                    }
                },
                {
                    'param_type': 'body',
                    'params': {

                    }
                }
            ]
        };
        // console.log('before inpu data 2');

        const user = JSON.stringify(compareInfo);
        this.apiJson.data = user;
        compareTwoOcc[0] = this.apiJson;
        this.apiJson1 = new ApiCallClass();
        const compareInfo1 = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': ['occ', OccIds[1], this.accountId]
                },
                {
                    'param_type': 'query',
                    'params': {
                        'sections': 'Overview,TaskList,WageLevels,OutlookRatings,WorkingConditions,Preparation',
                        'states': 'US', 'lang': this.lang
                    }
                },
                {
                    'param_type': 'body',
                    'params': {

                    }
                }
            ]
        };
        // console.log('before call');

        this.apiJson1.method = 'GET';
        this.apiJson1.sessionID = this.utils.getAuthKey();
        this.apiJson1.moduleName = 'Occ/v1/';
        this.apiJson1.endUrl = 'pages';
        const user1 = JSON.stringify(compareInfo1);
        this.apiJson1.data = user1;
        compareTwoOcc[1] = this.apiJson1;
        /** compareTwoOcc array contain data of two api call */
        this.serverApi.callApi(compareTwoOcc).subscribe((res) => {
            // console.log('after call');
            /** After hitting the api we get the result of
             * frst and second occupations
             */
            for (let i = 0; i < res[0].Result.length; i++) {

                /** Since we get the same same result length for both first and second
                 * occupations take the length of any result
                 */
                if (res[0].Result[i].sectionName == 'Overview' && (this.settingsTextTab.indexOf('Overview') != -1)) {
                    this.IndexkeyValue.push(res[0].Result[i].sectionName);
                    this.iconClass.push('icon-overview');
                    this.colorClass.push('cardcolor-5');
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                } else if (res[0].Result[i].sectionName == 'TaskList' && (this.settingsTextTab.indexOf('TaskList') != -1)) {
                    this.IndexkeyValue.push(res[0].Result[i].sectionName);
                    this.colorClass.push('cardcolor-12');
                    this.iconClass.push('icon-job-list');
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                } else if (res[0].Result[i].sectionName == 'WageLevels' && (this.settingsTextTab.indexOf('WageLevels') != -1)) {
                    this.IndexkeyValue.push(res[0].Result[i].sectionName);
                    this.colorClass.push('cardcolor-1');
                    this.iconClass.push('icon-clu_finance');
                    this.Firstresult.push([res[0].Result[i].sectionResults]);
                    this.SecondResult.push([res[1].Result[i].sectionResults]);
                    // console.log('res[0].Result[i].sectionResults :' + JSON.stringify(res[0].Result[i].sectionResults.headers))
                    res[0].Result[i].sectionResults.headers.forEach((ele, inx) => {
                        this.wageTextVal[ele.type] = ele.header;
                    });
                    // console.log('ele wageTextVal : ' + JSON.stringify(this.wageTextVal));
                    this.firstWageValue(res[0].Result[i].sectionResults);
                    this.secondWageValue(res[1].Result[i].sectionResults);
                } else if (res[0].Result[i].sectionName == 'OutlookRatings' && (this.settingsTextTab.indexOf('OutlookRatings') != -1)) {
                    this.IndexkeyValue.push(res[0].Result[i].sectionName);
                    this.colorClass.push('cardcolor-3');
                    this.iconClass.push('icon-employment-outlook');
                    this.Firstresult.push([res[0].Result[i].sectionResults]);
                    this.SecondResult.push([res[1].Result[i].sectionResults]);
                } else if (res[0].Result[i].sectionName == 'WorkingConditions' && (this.settingsTextTab.indexOf('WorkingConditions') != -1)) {
                    this.IndexkeyValue.push(res[0].Result[i].sectionName);
                    this.colorClass.push('cardcolor-11');
                    this.iconClass.push('icon-work-setting');
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                } else if (res[0].Result[i].sectionName == 'Preparation' && (this.settingsTextTab.indexOf('Preparation') != -1)) {
                    this.IndexkeyValue.push(res[0].Result[i].sectionName);
                    this.colorClass.push('cardcolor-10');
                    this.iconClass.push('icon-preparation');
                    this.Firstresult.push(res[0].Result[i].sectionResults);
                    this.SecondResult.push(res[1].Result[i].sectionResults);
                }
            }
            // console.log('in result')
            this.utils.hideLoading();
            this.getCompareText();
        });
    }

    dynamicStyle() {

        let ref = this;
        this.enterEventListener = function (event) {
            try {
                if (window.innerWidth >= 767) {
                    if (document.getElementById('cmpr-header') != null) {

                        const heightVal = document.getElementById('cmpr-header').offsetHeight;
                        const htValue = document.getElementById('cmpr-img').offsetHeight;
                        const elmnt = document.getElementById('main-body');
                        if ((elmnt.scrollTop) <= (heightVal + htValue + 50)) {
                            ref.browserDom.removeStyle(ref.browserDom.query('.two-headdings'), 'position');
                            ref.browserDom.removeStyle(ref.browserDom.query('.two-headdings'), 'top');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'width', '100%');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'padding-left', '0');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'padding-right', '0px');
                            //console.log('true');
                        } else {
                            ref.browserDom.removeStyle(ref.browserDom.query('.two-headdings'), 'width');

                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'position', 'fixed');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'top', '93px');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'z-index', '999');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'padding-left', '0');
                            ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'padding-right', '30px');
                            /* ref.browserDom.setStyle(ref.browserDom.query('.two-headdings'), 'width', '81.4%');*/
                            //ref.browserDom.setStyle(ref.browserDom.query('.cmpir-2-btn-plp3'), 'background', 'ORANGERED');
                            //console.log('false');
                        }
                    }
                }
            } catch (e) {
                console.log('error in factor tru block--->' + e.message);
            }
        };
        document.addEventListener('scroll', this.enterEventListener, true);

    }

    /** Below code is to get the text of section names dynamically form api
     * we use occ text api call and retrive the result in that we will
     * show what are the session are available inthis compare screen
     */
    getCompareText() {
        for (let i = 0; i < this.IndexkeyValue.length; i++) {
            this.compareNames.push(this.settingsText.commonText.allSections[this.IndexkeyValue[i]]);
        }
    }

    /** firstWageValue method is to push all the values of first result
     *  according to their label names and the state Name
     * so that the label contain states and ites payperiod and
     * respective median wages of first occupation that is selected
     */
    firstWageValue(firstRes) {
        // console.log('in firestwagevalue');
        let LabelAvailable = false;
        const uniValName = true;
        const jsonValues = [];

        /** Get first wage result and push it to an json array */
        for (let i = 0; i < firstRes.periods.length; i++) {
            const allValues = [];
            for (let j = 0; j < firstRes.periods[i].wages.length; j++) {
                for (let loc = 0; loc < firstRes.periods[i].wages[j].locations.length; loc++) {
                    allValues.push({
                        label: firstRes.periods[i].wages[j].label,
                        location: firstRes.periods[i].wages[j].locations[loc].location,
                        period: firstRes.periods[i].period,
                        median: firstRes.periods[i].wages[j].locations[loc].median
                    });
                }
            }
            jsonValues.push(allValues);

            /** Get all labels in first result and store it in an array */
            for (let j = 0; j < firstRes.periods[i].wages.length; j++) {
                for (let k = 0; k < this.CompWageLabel.length; k++) {
                    if (firstRes.periods[i].wages[j].label == this.CompWageLabel[k]) {
                        LabelAvailable = true;
                        break;
                    } else {
                        LabelAvailable = false;
                    }
                }
                if (LabelAvailable == false) {
                    this.CompWageLabel.push([firstRes.periods[i].wages[j].label]);
                }

            }
        }
        // console.log('after for');
        /** converting jsonValues so that the json array contain label name and its child values  */
        const jsonArray1 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel.length; variable1++) {
            for (let variable2 = 0; variable2 < jsonValues.length; variable2++) {
                const localArray = [];
                for (let variable3 = 0; variable3 < jsonValues[variable2].length; variable3++) {
                    if (jsonValues[variable2][variable3].label == this.CompWageLabel[variable1]) {
                        localArray.push({
                            loc: jsonValues[variable2][variable3].location,
                            prd: jsonValues[variable2][variable3].period,
                            mdn: jsonValues[variable2][variable3].median
                        });
                    }
                }
                jsonArray1.push({
                    lab: this.CompWageLabel[variable1],
                    val: localArray
                });
            }
        }

        /** convert jsonArray1 based on label so that we can have
         * all the values of same label in one array andget the all unique
         * names of same label in one array
        */
        const CompWageUniName = [];
        const jsonArray2 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel.length; variable1++) {
            const localjson = [];
            const uniqueName = [];
            let isValAvail = false;
            for (let variable2 = 0; variable2 < jsonArray1.length; variable2++) {
                if (jsonArray1[variable2].lab == this.CompWageLabel[variable1]) {
                    for (let variable3 = 0; variable3 < jsonArray1[variable2].val.length; variable3++) {
                        localjson.push(jsonArray1[variable2].val[variable3]);
                        for (let k = 0; k < uniqueName.length; k++) {
                            if (jsonArray1[variable2].val[variable3].loc == uniqueName[k]) {
                                isValAvail = true;
                                break;
                            } else { isValAvail = false; }
                        }
                        if (isValAvail == false) {
                            uniqueName.push(jsonArray1[variable2].val[variable3].loc);
                        }
                    }
                }
            }
            CompWageUniName.push(uniqueName);
            jsonArray2.push(localjson);
        }

        /** now in final json array we have the state and ite values according to their
         * label name so that we can display all the values in our template for first result
         */
        for (let variable1 = 0; variable1 < jsonArray2.length; variable1++) {
            const finalRes = [];
            for (let variable2 = 0; variable2 < CompWageUniName[variable1].length; variable2++) {
                const parares = [];
                for (let j = 0; j < jsonArray2[variable1].length; j++) {
                    if (jsonArray2[variable1][j].loc == CompWageUniName[variable1][variable2]) {
                        parares.push([jsonArray2[variable1][j].prd, jsonArray2[variable1][j].mdn]);
                    }
                }
                finalRes.push({
                    plocV: CompWageUniName[variable1][variable2],
                    pVal: parares
                });
            }
            this.finalCompArray.push(finalRes);

        }

    }

    /** secondWageValue method is to push all the values of second result
     *  according to their label names and the state Name
     * so that the label contain states and ites payperiod and
     * respective median wages of second occupation that is selected
     */
    secondWageValue(secondRes) {
        let LabelAvailable1 = false;
        const jsonValues = [];
        // console.log('in second wage value')

        /** Get second wage result and push it to an json array */

        for (let variable1 = 0; variable1 < secondRes.periods.length; variable1++) {
            const allValues = [];
            for (let j = 0; j < secondRes.periods[variable1].wages.length; j++) {
                for (let loc = 0; loc < secondRes.periods[variable1].wages[j].locations.length; loc++) {
                    allValues.push({
                        label: secondRes.periods[variable1].wages[j].label,
                        location: secondRes.periods[variable1].wages[j].locations[loc].location,
                        period: secondRes.periods[variable1].period,
                        median: secondRes.periods[variable1].wages[j].locations[loc].median
                    });
                }
            }
            jsonValues.push(allValues);
            /** Get all labels in second result and store it in an array */
            for (let j = 0; j < secondRes.periods[variable1].wages.length; j++) {
                for (let k = 0; k < this.CompWageLabel1.length; k++) {
                    if (secondRes.periods[variable1].wages[j].label == this.CompWageLabel1[k]) {
                        LabelAvailable1 = true;
                        break;
                    } else { LabelAvailable1 = false; }
                }
                if (LabelAvailable1 == false) {
                    this.CompWageLabel1.push([secondRes.periods[variable1].wages[j].label]);
                }
            }
        }

        /** converting jsonValues so that the json array contain label name and its child values  */
        const jsonArray1 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel1.length; variable1++) {
            for (let variable2 = 0; variable2 < jsonValues.length; variable2++) {
                const localArray = [];
                for (let variable3 = 0; variable3 < jsonValues[variable2].length; variable3++) {
                    if (jsonValues[variable2][variable3].label == this.CompWageLabel1[variable1]) {
                        localArray.push({
                            loc: jsonValues[variable2][variable3].location,
                            prd: jsonValues[variable2][variable3].period,
                            mdn: jsonValues[variable2][variable3].median
                        });
                    }
                }
                jsonArray1.push({
                    lab: this.CompWageLabel1[variable1],
                    val: localArray
                });
            }
        }

        /** convert jsonArray1 based on label so that we can have
         * all the values of same label in one array andget the all unique
         * names of same label in one array
        */
        const CompWageUniName = [];
        const jsonArray2 = [];
        for (let variable1 = 0; variable1 < this.CompWageLabel1.length; variable1++) {
            const localjson = [];
            const uniqueName = [];
            let isValAvail = false;
            for (let variable2 = 0; variable2 < jsonArray1.length; variable2++) {
                if (jsonArray1[variable2].lab == this.CompWageLabel1[variable1]) {
                    for (let variable3 = 0; variable3 < jsonArray1[variable2].val.length; variable3++) {
                        localjson.push(jsonArray1[variable2].val[variable3]);
                        for (let k = 0; k < uniqueName.length; k++) {
                            if (jsonArray1[variable2].val[variable3].loc == uniqueName[k]) {
                                isValAvail = true;
                                break;
                            } else { isValAvail = false; }
                        }
                        if (isValAvail == false) {
                            uniqueName.push(jsonArray1[variable2].val[variable3].loc);
                        }
                    }
                }
            }
            CompWageUniName.push(uniqueName);
            jsonArray2.push(localjson);
        }

        /** now in final json array we have the state and ite values according to their
         * label name so that we can display all the values in our template for first result
         */
        for (let variable1 = 0; variable1 < jsonArray2.length; variable1++) {
            const finalRes = [];
            for (let variable2 = 0; variable2 < CompWageUniName[variable1].length; variable2++) {
                const parares = [];
                for (let j = 0; j < jsonArray2[variable1].length; j++) {
                    if (jsonArray2[variable1][j].loc == CompWageUniName[variable1][variable2]) {
                        parares.push([jsonArray2[variable1][j].prd, jsonArray2[variable1][j].mdn]);
                    }
                }
                finalRes.push({
                    plocV: CompWageUniName[variable1][variable2],
                    pVal: parares
                });
            }
            this.finalCompArray2.push(finalRes);

        }
    }

    /** This method is used to check on which list user clicked, so that
    * the remaining panels are closed and we show the only user clicked panel.
    * simply it is for collapsing the panel
    */
    methodfilter(valfil, index) {
        this.filter = [999, 999, 999, 999, 999, 999];
        this.filter[index] = valfil;
    }

    /** The below method is used to return the key value according to the given check value */
    valueOccIndexCheck(key, checkVal) {
        if (checkVal == 'ref') {
            return '#collapsed' + key;
        } else if (checkVal == 'controls') {
            return 'collapsed' + key;
        }
    }

    /** Navigate to career list */
    CareerList(check) {
        // this.utils.showLoading();
        this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
    }

    /** Navigates to occlist page */
    backAssessment() {
        if (this.storageService.sessionStorageGet('module') == 'ip') {
            this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
        }
    }
}
