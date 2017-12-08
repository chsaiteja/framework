/** Angular imports */
import { Component, OnDestroy, Renderer, ElementRef } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/** import shared Components */
import { ServerApi } from '../../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../../shared/outer-services/utilities.service';
import { StorageService } from '../../../../../shared/outer-services/storage.service';

import { AssessmentsService } from '../../../shared/services/assessments.service';
import { AssessmentHeaderComponent } from '../../../shared/assessment-header/assessment-header.component';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState } from '../../../../../state-management/state/main-state';
import { StoreService } from '../../../../../state-management/services/store-service';



@Component({
    selector: 'os-assessment-factors',
    templateUrl: './os-assessment-factors.layout.html',
    styles: [`
  		.class-margin {
		margin: 0px 0 0 17px;
  		}
  	`],
})
export class OSFactorsAssessmentComponent implements OnInit, OnDestroy {
    @ViewChild('itemsp2Val') el: ElementRef;
    browserDom: BrowserDomAdapter;
    occ_sort_factors = [];
    eventHolder1 = [];
    occ_sort_factors2 = [];
    textArr = [];
    eventHolder = [];
    factorsArray1 = [];
    factorsArray2 = [];
    strValue = [];
    finalFactorsMob = [];
    eventHolder2 = [];
    finalArray = [1, 2, 3, 4, 5];
    emptybox = [1, 2, 3, 4, 5];
    dummyVariable = true;
    dummyText = true;
    commonVar = false;
    isDisableSelect = true;
    isDisable = true;
    showImpFac = false;
    isDisableNext = true;
    close_e_mobile = true;
    nextFactorsValue = false;
    visible = 0;
    count = 0;
    facNames;
    enterEventListener;
    osreturnedVal;
    subscription = new Subscription;
    reducerSub2 = new Subscription;
    osintroVal;
    lang;
    QuestionText;
    constructor(private trackEvnt: AssessmentsService, private router: Router, private store: Store<AsmntCommonState>, private store1: Store<AsmntQuestionState>,
        private utils: Utilities, private storageService: StorageService, private activeRoute: ActivatedRoute,
        private dispatchStore: Store<Action>, private assessOccFunction: AssessmentHeaderComponent, private serverApi: ServerApi,
        private renderer: Renderer, private elementRef: ElementRef, private common: StoreService) {
        this.lang = this.storageService.sessionStorageGet('langset');
        this.browserDom = new BrowserDomAdapter();
        this.osreturnedVal = store.select('AsmntCommonText');
        this.osintroVal = store.select('AsmntIntroText');
    }

    ngOnInit() {
        this.utils.showLoading();
        try {
            this.getFactorsQues();
            const ref = this;
            this.storageService.sessionStorageSet('occFactorHeader', 'false');
            this.browserDom.setStyle(this.browserDom.query('.view'), 'position', 'fixed');
            this.browserDom.setStyle(this.browserDom.query('.view'), 'bottom', '0px');
            const widthVal = document.getElementById('fhid').offsetWidth + 'px';
            ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', widthVal);
            window.onresize = null;
            window.onscroll = null;
            this.nextFactorsValue = false;
            this.storageService.sessionStorageRemove('occ_factors');
            this.storageService.sessionStorageSet('isAssessment', '');
            this.storageService.sessionStorageSet('savedPartialAsmnt', '');

            // This is used to adjust footer height
            this.enterEventListener = function (event) {
                try {
                    if (document.getElementById('fhid') != null) {
                        const width = document.getElementById('fhid').offsetWidth + 'px';
                        const heightVal = document.getElementById('fhid').offsetHeight + 'px';
                        const elmnt = document.getElementById('main-body');
                        const scrollHeight = document.getElementById('main-body').scrollHeight;
                        if ((elmnt.scrollTop + elmnt.offsetHeight) >= scrollHeight) {
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), 'bottom', heightVal);
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', width);

                        } else {
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), 'bottom', '0px');
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), 'z-index', '6');
                            ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', width);

                        }
                    }
                } catch (e) {
                    console.log('error in factor tru block--->' + e.message);
                }
            };
            document.addEventListener('scroll', this.enterEventListener, true);
            window.onresize = function () {
                if (document.getElementById('fhid') != null) {
                    const width = document.getElementById('fhid').offsetWidth + 'px';
                    const heightVal = document.getElementById('fhid').offsetHeight + 'px';
                    const elmnt = document.getElementById('main-body');
                    const scrollHeight = document.getElementById('main-body').scrollHeight;
                    if ((elmnt.scrollTop + elmnt.offsetHeight) >= scrollHeight) {
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'bottom', heightVal);
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', width);
                    } else {
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'bottom', '0px');
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'z-index', '6');
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', width);
                    }
                }
            };
        } catch (e) {
            console.log('os factors exception:' + e.message);
        }
    }
    getFactorsQues() {

        // let payloadjson = {
        this.dispatchStore.dispatch({
            type: "GET_QUESTION_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: ['questions'], query_params: { 'lang': this.lang },
                body_Params: {}, endUrlVal: 'OccSort'
            }
        });
        // this.common.commonLanguageChange(this.lang, 'questions', payloadjson);
        this.reducerSub2 = this.store1.select('AsmntQuestionsText').subscribe((res) => {
            this.QuestionText = res;
            //  console.log("ass questions---->" + JSON.stringify(this.QuestionText.commonIntroText.questions));
            if (this.QuestionText.commonIntroText.questions != undefined) {
                // console.log("comming if--->");
                this.storageService.sessionStorageSet('osques', JSON.stringify(this.QuestionText.commonIntroText.questions));

                this.osQuestionsFun();
            }
        });

    }
    osQuestionsFun() {
        this.occ_sort_factors = [];
        this.occ_sort_factors2 = [];
        this.facNames = JSON.parse(this.storageService.sessionStorageGet('osques'));
        /** We are spliting the factors into two column */
        for (let i = 0; i < this.facNames.length; i++) {
            /** Adding the first half occ factors to a variable */
            this.occ_sort_factors.push(i);
        }
        this.utils.hideLoading();
    }
    ngOnDestroy() {
        document.removeEventListener('scroll', this.enterEventListener, true);
        this.reducerSub2.unsubscribe();
        this.subscription.unsubscribe();
    }

    // Select 5 to 10 factors
    selectFactor(event, inx, value) {
        this.isDisableSelect = false;
        if (this.factorsArray1.length < 10 && (this.factorsArray1.indexOf(inx) == -1)) {
            this.renderer.setElementClass(event.target, 'disabledp2', true);
            this.eventHolder.push(event.target);
            this.factorsArray1.push(inx);
            if (this.factorsArray1.length >= 5) {
                this.isDisable = false;
            }
            this.emptybox = [];
            this.count = this.factorsArray1.length;
            for (let i = 0; i < (5 - this.factorsArray1.length); i++) {
                this.emptybox.push(i);
            }
            if (this.factorsArray1.length < 10 && this.factorsArray1.length >= 5) {
                this.emptybox.push(1);
            }
        }
        this.storageService.sessionStorageSet('testArr', JSON.stringify(this.textArr));
    }

    // Remove occFactor
    selectFactorRemove(event, inx) {
        if (this.factorsArray1.length <= 5) {
            this.isDisable = true;
            if (this.factorsArray1.length == 1) {
                this.isDisableSelect = true;
            }
        }
        for (let i = 0; i < this.factorsArray1.length; i++) {

            if (this.factorsArray1[i] == inx) {
                this.renderer.setElementClass(this.eventHolder[i], 'disabledp2', false);
                this.factorsArray1.splice(i, 1);
                this.eventHolder.splice(i, 1);
            }
        }
        this.emptybox = [];
        this.count = this.factorsArray1.length;
        if (this.factorsArray1.length < 5) {
            for (let i = 0; i < (5 - this.factorsArray1.length); i++) {
                this.emptybox.push(i);
            }
        } else {
            this.emptybox.push(0);
        }
    }

    // Click on next button
    nextFactors() {
        const arrayOfAll = (document.getElementsByClassName('word-3-dots'));
        for (let i = 0; i < arrayOfAll.length; i++) {
            this.renderer.setElementClass(arrayOfAll[i], 'disabledp2', true);
        }
        const widthVal = document.getElementById('fhid').offsetWidth + 'px';
        this.browserDom.setStyle(this.browserDom.query('.view'), 'width', widthVal);
        this.storageService.sessionStorageSet('occFactorHeader', 'true');
        /** After the next button click in factors screen we check whether the count  */
        this.emptybox = [];
        for (let i = 0; i < this.factorsArray1.length; i++) {
            this.finalFactorsMob.push(this.factorsArray1[i]);
        }
        this.close_e_mobile = false;
        this.commonVar = true;
        this.nextFactorsValue = true;
        this.isDisableNext = true;
        this.storageService.sessionStorageRemove('occ_factors');
        this.renderer.setElementClass(this.el.nativeElement, 'slideLeft', true);
        this.renderer.setElementClass(this.el.nativeElement, 'mobile-factor-hs', true);
        this.renderer.setElementAttribute(document.getElementById('focus0'), 'tabindex', '0');
        document.getElementById('focus0').focus();
        this.isDisable = false;
        this.dummyVariable = false;
        /***for mobile** */
        window.onresize = null;
        this.visible = 2;
        this.visibleSet();
        this.assessOccFunction.occFactorHeader();
    }

    // Goto assessment screen
    nextQuestions() {
        this.browserDom.removeAttribute(this.browserDom.query('.view'), 'position');
        /** After clicking start button to start assessment */
        if (JSON.parse(this.storageService.sessionStorageGet('occ_factors')) != null) {
            /** If the number of selected factors are not empty then we enter into this block */
            if (JSON.parse(this.storageService.sessionStorageGet('occ_factors')).length == 5) {
                /** If the total length of selected factors are 5 thenwe navigate to the assessment page */
                this.router.navigate(['../assessment'], { relativeTo: this.activeRoute });
            } else if (JSON.parse(this.storageService.sessionStorageGet('occ_factors')).length < 5) {

            }

        }

    }

    // Selecting final factors
    finalFactors(event, inx) {
        if (this.nextFactorsValue == true) {
            if (this.factorsArray2.length < 5 && (this.factorsArray2.indexOf(inx) == -1)) {
                for (let i = 0; i < this.factorsArray1.length; i++) {
                    if (this.factorsArray1[i] == inx) {
                        this.factorsArray2.push(inx);
                        const k = document.getElementsByClassName('empty-box').length - this.factorsArray1.length;
                        this.renderer.setElementClass(document.getElementsByClassName('empty-box')[i], 'disabledp2', true);
                        for (let j = 0; j < this.finalFactorsMob.length; j++) {
                            if (this.finalFactorsMob[j] == inx) {
                                this.finalFactorsMob.splice(j, 1);
                            }
                        }
                        this.eventHolder1.push(document.getElementsByClassName('empty-box')[i]);
                        this.eventHolder2.push(document.getElementsByClassName('empty-box')[k + i]);
                        this.dummyText = false;
                    }
                }
                if (this.factorsArray2.length == 5) {
                    this.isDisableNext = false;
                    this.storageService.sessionStorageSet('occ_factors', JSON.stringify(this.factorsArray2));
                }
                if (this.finalFactorsMob.length == 0) {
                    this.showImpFac = true;
                }
                this.finalArray = [];
                for (let i = 0; i < (5 - this.factorsArray2.length); i++) {
                    this.finalArray.push(i);
                }
            }
        }
    }

    // Remove a factor
    removeFinalFactor(event, inx) {
        if (this.factorsArray2.length <= 5) {
            this.isDisableNext = true;
        }
        for (let i = 0; i < this.factorsArray2.length; i++) {
            if (this.factorsArray2[i] == inx) {
                this.factorsArray2.splice(i, 1);
                this.renderer.setElementClass(this.eventHolder1[i], 'disabledp2', false);
                this.renderer.setElementClass(this.eventHolder2[i], 'disabledp2', false);
                this.eventHolder1.splice(i, 1);
                this.eventHolder2.splice(i, 1);
                this.finalFactorsMob.push(inx);
            }
            if (this.showImpFac == true) {
                this.showImpFac = false;
            }
        }
        if (this.factorsArray2.length == 0) {
            this.dummyText = true;
        }
        this.finalArray = [];
        for (let i = 0; i < (5 - this.factorsArray2.length); i++) {
            this.finalArray.push(i);
        }
        this.storageService.sessionStorageSet('occ_factors', JSON.stringify(this.factorsArray2));
    }

    visibleSet() {
        const ref = this;
        /** on window resize we use this data for mobile view*/
        window.onresize = function () {
            try {
                if (window.innerWidth <= 767) {
                    ref.commonVar = true;

                    const widthVal = document.getElementById('fhid').offsetWidth + 'px';
                    const heightVal = document.getElementById('fhid').offsetHeight + 'px';
                    const elmnt = document.getElementById('main-body');
                    const scrollHeight = document.getElementById('main-body').scrollHeight;
                    if ((elmnt.scrollTop + elmnt.offsetHeight) >= scrollHeight) {
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'bottom', heightVal);
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', widthVal);
                    } else {
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'bottom', '0px');
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'z-index', '6');
                        ref.browserDom.setStyle(ref.browserDom.query('.view'), 'width', widthVal);
                    }
                } else {
                    ref.visible = 1;
                }
            } catch (e) {
                console.log('error in resize--->' + e.message);
            }
        };
        if (window.innerWidth <= 767 && (this.visible == 2)) {
            this.commonVar = true;
        }
    }
}
