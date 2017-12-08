/** Angular imports */
import { Component, Renderer, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/** import shared Components */
import { ApiCallClass } from '../../../../../shared/modal/apicall.modal';
import { StorageService } from '../../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../../shared/outer-services/event-dispatch.service';
import { AssessmentsService } from '../../../shared/services/assessments.service';
import { Store, Action } from '@ngrx/store';
import { AsmntCommonState, AsmntQuestionState, AsmntResponseState } from '../../../../../state-management/state/main-state';
import { StoreService } from '../../../../../state-management/services/store-service';


declare const noUiSlider: any;

@Component({
    selector: 'os-assessment-range',
    templateUrl: './os-assessment-range.layout.html',
})

export class OSAssessmentComponent implements OnInit, OnDestroy {
    lang;
    facNames = []; // Contains all questions
    allOptions; // Contains all options
    occIndex = []; // Contains IDs of user selected factors
    /** Variables that store top and bottom values of range bar */
    RangeT = ''; RangeB = ''; RangeTop = []; RangeBottom = [];
    PreTop = []; PreBottom = [];
    Ques = []; // Contain question numbers
    doubleHandleSlider; // reference of class 'double-handle-slider' in html
    ResLength = 0; // Contain upto which question user answered
    occFactors = []; // Contains the selected factor ids
    Precount = 0; // value changes when moving from previous and next
    saved = 0; canZero = 1;
    occQuestionVal = 0; // Contain id for current question
    totalQuesNum; // Contain value of total number of questions
    set = 0; // Contain current question number changes every time when moving from previus and next
    min; max; // current top and bottom value
    requiredOpt = []; // Contains options for selected factors
    currentValue = 0; // For filling the progress bar
    Eleval = document.getElementsByClassName('range-barcircle');
    cardplp2 = document.getElementsByClassName('smile-card-body');
    subscription = new Subscription; // used to listen if any change occured
    osreturnedVal;
    QuestionText;
    reducerSub2 = new Subscription;
    reducerSub3 = new Subscription;
    responseText;
    osintroVal;
    constructor(private activatedRoute: ActivatedRoute, private trackEvnt: AssessmentsService,
        private assess: AssessmentsService, private store: Store<AsmntCommonState>, private store2: Store<AsmntResponseState>, private store1: Store<AsmntQuestionState>,
        private router: Router, private utils: Utilities, private storageService: StorageService,
        private apiJson: ApiCallClass, private renderer: Renderer, private dispatchStore: Store<Action>,
        private eventService: EventDispatchService, private commonlang: StoreService, ) {
        /** Below code block listens broadcasted event and
         * calls respective functionality for this assessment */
        this.subscription = eventService.listen().subscribe((e) => {
            /** After event listen it will check whether user want to save partially or completely */
            if (e.type == 'save_Partial') {
                /** If user want to save partially, then we call the respective function 
                  * and we are setting true to isAssessment to tell that, we are saving from assessment.
                 */
                this.SavePartialOccSort();
                this.storageService.sessionStorageSet('isAssessment', 'true');
            } else if (e.type == 'saveAnswerSet') {
                this.utils.hideLoading();
            }
        });
        this.osreturnedVal = store.select('AsmntCommonText');
        this.osintroVal = store.select('AsmntIntroText');
    }

    ngOnInit() {
        this.utils.showLoading();
        // let intropayload = {
        this.dispatchStore.dispatch({
            type: "GET_QUESTION_RESPONSES", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: ['responses'],
                query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
                body_Params: {}, endUrlVal: 'OccSort'
            }
        });

        // this.commonlang.commonLanguageChange(this.storageService.sessionStorageGet('langset'), 'response', intropayload);
        this.reducerSub3 = this.store2.select('AsmntQuestionsResponses').subscribe((res) => {
            this.responseText = res;
            // console.log("response length--->" + JSON.stringify(this.responseText));
            if (this.responseText.commonResponseText.responses != undefined) {
                const optionsresp = [];
                for (let i = 0; i < this.responseText.commonResponseText.responses.length; i++) {

                    optionsresp.push(this.responseText.commonResponseText.responses[i].resp);
                }
                this.allOptions = optionsresp;
                this.storageService.sessionStorageSet('allOptions', JSON.stringify(optionsresp));
                this.goToOcc();
            }
        });


    }
    goToOcc() {
        this.min = -1; this.max = -1;
        this.set = 0;
        const ref = this;
        /** By using the setTimeout, we are calling function when the timer elapses. */
        setTimeout(function () {
            ref.slider();
        }, 0);
        /** We are assigning the answer set to a variable and by the sessionStorage, factors are stored in occFactors.*/
        let eqAnswerSet: any;
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            eqAnswerSet = params['eqAnswerSet'];
        });
        this.occFactors = JSON.parse(this.storageService.sessionStorageGet('occ_factors')).toString().split(',');
        /** For every selected occ factor i'm considering question and its options */
        this.facNames = JSON.parse(this.storageService.sessionStorageGet('osques'));
        this.occIndex = [];
        this.occFactors.forEach((obj, key) => {
            /**  this.facNames contains, all questions and its corresponding options
              *  and this.occFactors contains factors that are selected by user and here,
              *  for each question we are checking whether it is selected by the user or not.
              */
            this.facNames.forEach((k, v) => {
                if (obj == k.factorID) {
                    /**  If the question matches then we are separating the index of that question
                     *  and its options and storing it in a variable occIndex. 
                     */
                    this.occIndex.push({ 'index': v });
                }
            });
        });
        this.occQuestionVal = this.occIndex[this.set].index;
        // console.log('this.occIndex : ' + JSON.stringify(this.occIndex));
        // console.log('occQuestionVal : ' + this.occQuestionVal);
        this.totalQuesNum = this.occIndex.length;
        const mulvalue = 100 / this.totalQuesNum;
        this.currentValue = mulvalue * (this.set);
        const textVal = [];
        for (let i = 0; i < this.totalQuesNum; i++) {
            textVal.push(this.allOptions[this.occQuestionVal][i].text);
        }
        this.requiredOpt = textVal;
        this.utils.hideLoading();
        /** By using session storage we are checking either savedPartialAsmnt or osAnswerSet is null or not.
          * SavedPartialAsmnt is used in refresh condition where as osAnswerSet is used in restore state.
          * Based on the result, it will check whether to go to restore state, or to normal state.
          */
        const storageVariable = this.storageService.sessionStorageGet('savedPartialAsmnt')
        if ((storageVariable !== '') && (storageVariable !== null)) {
            this.restoreAnswerSets();
        } else if (eqAnswerSet != 0 && eqAnswerSet != "" && eqAnswerSet != null) {
            this.restoreAnswerSets();
        } else {
            /** Here option values and index value are stored in two variable, these
             * variables are used in html to display question and options
             */
            this.storageService.sessionStorageRemove('savePartial');
            this.occQuestionVal = this.occIndex[this.set].index;
        }


    }
    ngOnDestroy() {
        window.location.href.replace(location.hash, '');
        this.reducerSub2.unsubscribe();
        this.reducerSub3.unsubscribe();
        this.subscription.unsubscribe();
    }

    /** The below function is used for partial save of assessment */
    SavePartialOccSort() {
        try {
            if ((this.PreTop.length) <= this.totalQuesNum && this.saved == 0) {
                let res;
                if ((this.min >= 0 && this.min < this.totalQuesNum) &&
                    this.PreTop.length >= this.set && this.PreTop.length < 6 && this.ResLength == 0) {
                    // If the question was answered previously then we replace it with new answers
                    this.PreTop[this.set] = (this.min);
                    this.PreBottom[this.set] = (this.max);
                } else if ((this.min >= 0 && this.min < this.totalQuesNum) && this.ResLength != 0) {
                    if (this.PreTop.length == this.set) {
                        // If the question was not answered previously then add that question and answer
                        this.PreTop.push(this.min);
                        this.PreBottom.push(this.max);
                    } else if (this.PreTop[this.set - 1] != this.min || this.PreBottom[this.set - 1] != (this.max)) {
                        // If the question was answered previously then we replace it with new answers
                        this.PreTop[this.set] = (this.min);
                        this.PreBottom[this.set] = (this.max);
                    }
                }
                this.RangeTop = [];
                this.RangeBottom = [];
                for (res = 0; res < this.PreTop.length; res++) {
                    // Storing values from one to another
                    this.RangeTop[res] = this.PreTop[res];
                    this.RangeBottom[res] = this.PreBottom[res];
                }
                for (res; this.RangeTop.length != this.totalQuesNum; res++) {
                    this.RangeTop[res] = -1;
                    this.RangeBottom[res] = -1;
                }
                this.RangeT = this.RangeTop.toString();
                this.RangeB = this.RangeBottom.toString();
                if (this.PreTop.length != this.Ques.length) {
                    this.Ques.push(this.PreTop.length);
                }

            }
            /** If all the question are answered then the result will be stored */
            if (this.RangeTop.length == this.totalQuesNum) {
                const occsort = [];
                occsort.push({
                    'factors': this.occFactors.toString(),
                    'rangeTop': this.RangeT,
                    'rangeBottom': this.RangeB,
                    'Usernotes': 'save'
                });
                this.apiJson.method = 'POST';
                this.apiJson.sessionID = this.utils.getAuthKey();
                this.apiJson.moduleName = 'Assessment/v1/';

                let SavePartialPost = {};
                SavePartialPost = {

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
                            'params': {
                                'userNotes': occsort[occsort.length - 1].Usernotes,
                                'selectedFactors': occsort[occsort.length - 1].factors,
                                'rangeTop': occsort[occsort.length - 1].rangeTop,
                                'rangeBottom': occsort[occsort.length - 1].rangeBottom,

                            }
                        }
                    ]
                };
                const user = JSON.stringify(SavePartialPost);
                this.apiJson.endUrl = 'users/savePartialOccSort/';
                this.apiJson.data = user;
                // Calling showSaveDialog method in assessment service
                this.assess.showSaveDialog(this.apiJson, 'OS');
            }
        } catch (e) {
            console.log('Error in SavePartialOccSort--->' + e.message);
        }
    }

    restoreAnswerSets() {
        try {
            /** When we are in restore the  */
            this.storageService.sessionStorageRemove('savePartial');
            let TRes = [], BRes = [];
            TRes = this.storageService.sessionStorageGet('RangeTop').slice(1, -1).split(',');
            BRes = this.storageService.sessionStorageGet('RangeBottom').slice(1, -1).split(',');
            for (this.ResLength = 0; this.ResLength < TRes.length; this.ResLength++) {
                /** Check value is greater than zero or not, if it is greater than zero then add the value to variables
                 * if value less than zero break the loop
                 */
                if (TRes[this.ResLength] == -1) {
                    break;
                } else {
                    this.Ques[this.ResLength] = this.ResLength + 1;
                    this.PreTop[this.ResLength] = parseInt(TRes[this.ResLength], 10);
                    this.PreBottom[this.ResLength] = parseInt(BRes[this.ResLength], 10);
                }
            }
            // If the answered questions less than 5 then go to previous
            if (this.ResLength == this.totalQuesNum) {
                // If all questions are answered then go to saveOccSortDt function
                this.saveOccSortDt();
            } else if (this.ResLength - 1 < (this.totalQuesNum - 1) && this.ResLength - 1 >= 0 || this.ResLength == 0) {
                if (this.ResLength == 0) {
                    this.canZero = 0;
                }
                const ref = this;
                this.set = this.ResLength + 1;
                setTimeout(function () {
                    ref.clickArrowPre();
                }.bind(this), 100);
                this.utils.hideLoading();
            }

        } catch (e) {
            console.log('Error in restoreAnswerSets--->' + e.message);
        }
    }

    /**
     * Changes color for circle
     * @param number contain value for how many circles we need to change color
     * @param className contain name of the class that have to change
     * @param booleanVal a value that tells whether to apply class or not
     */
    changeClass(number, className, booleanVal) {
        try {
            for (let i = 0; i < number; i++) {
                this.renderer.setElementClass(this.Eleval[i], className, booleanVal);
                this.renderer.setElementClass(this.cardplp2[i], className, booleanVal);
            }

        } catch (e) {
            console.log('Error in changeClass--->' + e.message);
        }
    }
    // Starting color of the circle
    defaultColor() {
        try {
            /** We apply the default color that is green to all circles */
            this.changeClass(this.totalQuesNum, 'white-circle', false);
            this.changeClass(this.totalQuesNum, 'green-circle', true);

        } catch (e) {
            console.log('Error in defaultColor--->' + e.message);
        }
    }

    /**when the next arrow was clicked the below function will execute*/
    clickArrow() {
        //console.log('in clickArrow function')
        try {
            let count = 0;
            const mulvalue = 100 / this.totalQuesNum;
            this.currentValue = mulvalue * (this.set + 1);
            if (this.set < (this.totalQuesNum - 1)) {
                this.defaultColor();
                /** We are setting default range bar values */
                this.doubleHandleSlider.noUiSlider.set([0, this.totalQuesNum]);
            } else {
                this.utils.showLoading();
            }
            if (this.Precount != 0) {
                /** If the previous button was clicked */
                this.Precount--;
            }
            if (((this.min >= 0 && this.min < this.totalQuesNum) && (this.max >= 0 && this.max < this.totalQuesNum)
                && (this.min <= this.max)) && this.set >= this.PreTop.length &&
                this.PreTop.length != this.totalQuesNum && this.Precount == 0) {
                // Enter only when current answered question is new one
                this.PreTop.push(this.min);
                this.PreBottom.push(this.max);
                this.Ques.push(this.PreTop.length);
                count = this.PreTop.length - 1;
                if (count <= 4 || (this.PreTop.length - 1) != this.totalQuesNum) {
                    this.RangeTop[this.PreTop.length - 1] = this.min;
                    this.RangeBottom[this.PreTop.length - 1] = this.max;
                    count++;
                }
            } else {
                let val = 0;
                // Checking whether the answered question already available are not
                for (let k = 0; k < this.Ques.length; k++) {
                    if (this.Ques[k] == (this.set + 1)) {
                        val = 1;
                        break;
                    }
                }
                if (val == 0 && (this.min <= this.max)) {
                    // If range bar was not selected then we set to default value
                    this.PreTop.push(0);
                    this.PreBottom[this.PreTop.length - 1] = (this.totalQuesNum - 1);
                    this.Ques.push(this.PreTop.length);
                    this.RangeTop[this.PreTop.length - 1] = 0;
                    this.RangeBottom[this.PreTop.length - 1] = this.totalQuesNum - 1;
                    count = this.PreTop.length;
                    this.saved = 0;
                } else if (val == 1 && (this.min <= this.max || this.PreTop.length != this.totalQuesNum) && this.min >= 0) {
                    // If the question was answered previously then we replace it with new answers
                    this.PreTop[this.set] = (this.min);
                    this.PreBottom[this.set] = (this.max);
                    this.RangeTop[this.set] = this.min;
                    this.RangeBottom[this.set] = this.max;
                    count = this.PreTop.length;
                }
                let NextT = this.PreTop[this.set + 1];
                const NextB = this.PreBottom[this.set + 1];
                /** We are setting default range bar values */
                this.doubleHandleSlider.noUiSlider.set([NextT, NextB + 1]);
                /** We add or remove color to circle */
                for (let value = 0; value < this.totalQuesNum; value++) {
                    if (value == NextT && NextT <= NextB) {
                        this.renderer.setElementClass(this.Eleval[NextT], 'green-circle', true);
                        this.renderer.setElementClass(this.cardplp2[NextT], 'green-circle', true);
                        NextT++;
                    } else if (NextT != undefined) {
                        this.renderer.setElementClass(this.Eleval[value], 'white-circle', true);
                        this.renderer.setElementClass(this.cardplp2[value], 'white-circle', true);
                    }
                }
            }
            //console.log('all answers answered :' + (this.PreTop.length == this.totalQuesNum));
            // If all questions are answered we call save occ sort function
            if (this.PreTop.length == this.totalQuesNum && this.set >= (this.totalQuesNum - 1)) {
                //console.log('before calling function saveOccSortDt')
                this.saveOccSortDt();
            }
            if (this.set < (this.totalQuesNum - 1)) {
                try {
                    this.set = this.set + 1;

                    this.occQuestionVal = this.occIndex[this.set].index;
                    const textVal = [];
                    for (let i = 0; i < this.totalQuesNum; i++) {
                        textVal.push(this.allOptions[this.occQuestionVal][i].text);
                    }
                    this.requiredOpt = textVal;
                } catch (e) {
                    console.log('Error in inner try block in clickArrow' + e.message);

                }
            }
            this.min = -1; this.max = -1;

        } catch (e) {
            console.log('Error in  clickArrow--->' + e.message);
        }
    }
    /**when the previous arrow was clicked the below function will execute*/
    clickArrowPre() {
        try {
            /** Checks whether the current question value is greater than 1 or not */

            if (this.set > 0) {
                try {
                    this.set--;
                    this.occQuestionVal = this.occIndex[this.set].index;
                    const textVal = [];
                    // this.allOptions = JSON.parse(this.utils.sessionStorageGet('allOptions'));

                    for (let i = 0; i < this.totalQuesNum; i++) {
                        textVal.push(this.allOptions[this.occQuestionVal][i].text);
                    }
                    this.requiredOpt = textVal;
                    // this.i = (PreTop.length - 1) - Precount;
                    this.defaultColor();

                } catch (e) {
                    console.log('Error in inner clickArrowPre 1st try--->' + e.message);
                }
                /** ResLength represent the restore length */
                try {
                    if (this.ResLength != 0) {
                        let PreT = this.PreTop[this.set];
                        const PreB = this.PreBottom[this.set];
                        if (PreT >= 0 && PreB < this.totalQuesNum) {
                            /** We are setting range bar values */
                            this.doubleHandleSlider.noUiSlider.set([PreT, (PreB + 1)]);
                            // Adding and removing colors to the circle
                            for (let value = 0; value < this.totalQuesNum; value++) {
                                if (value == PreT && PreT <= PreB) {
                                    this.renderer.setElementClass(this.Eleval[PreT], 'green-circle', true);
                                    this.renderer.setElementClass(this.cardplp2[PreT], 'green-circle', true);
                                    PreT++;
                                } else {
                                    this.renderer.setElementClass(this.Eleval[value], 'white-circle', true);
                                    this.renderer.setElementClass(this.cardplp2[value], 'white-circle', true);
                                }
                            }
                        } else {
                            this.doubleHandleSlider.noUiSlider.set([0, this.totalQuesNum]);
                        }
                    } else if (this.canZero == 0) {
                        this.doubleHandleSlider.noUiSlider.set([0, this.totalQuesNum]);
                        // Adding and removing colors to the circle
                        this.changeClass(this.totalQuesNum, 'green-circle', true);
                    } else {
                        /** in normal case */
                        let PreT = this.PreTop[this.set];
                        const PreB = this.PreBottom[this.set];
                        /** Setting range bar values */
                        this.doubleHandleSlider.noUiSlider.set([PreT, (PreB + 1)]);
                        // Adding and removing colors to the circle
                        for (let value = 0; value < this.totalQuesNum; value++) {
                            if (value == PreT && PreT <= PreB) {
                                this.renderer.setElementClass(this.Eleval[PreT], 'green-circle', true);
                                this.renderer.setElementClass(this.cardplp2[PreT], 'green-circle', true);
                                PreT++;
                            } else {
                                this.renderer.setElementClass(this.Eleval[value], 'white-circle', true);
                                this.renderer.setElementClass(this.cardplp2[value], 'white-circle', true);
                            }
                        }
                    }

                } catch (e) {
                    console.log('Error in inner clickArrowPre--->' + e.message);
                }
                try {
                    if ((this.min != -1) && (this.max != -1)) {
                        let val = 0;
                        // Checking whether the answered question already available are not
                        for (let k = 0; k < this.Ques.length; k++) {
                            if (this.Ques[k] == (this.set + 2)) {
                                val = 1;
                                break;
                            }
                        }
                        if ((this.min != this.PreTop[(this.PreBottom.length - 1) - this.Precount] ||
                            this.max != this.PreBottom[(this.PreBottom.length - 1) - this.Precount]) && val == 1) {
                            // If the question was answered previously then we replace it with new answers
                            this.PreTop[this.set + 1] = this.min;
                            this.PreBottom[this.set + 1] = this.max;
                            this.RangeTop[this.set + 1] = this.min;
                            this.RangeBottom[this.set + 1] = this.max;
                            this.RangeT = this.RangeTop.toString();
                            this.RangeB = this.RangeBottom.toString();
                            this.Precount--;
                        } else if (this.min >= 0 && this.min < this.totalQuesNum && val == 0) {
                            // If it was not answered then we add question and its corresponding answers 
                            this.PreTop.push(this.min);
                            this.PreBottom.push(this.max);
                            this.Ques.push(this.PreTop.length);
                            this.RangeTop.push(this.min);
                            this.RangeBottom.push(this.max);
                            this.RangeT = this.RangeTop.toString();
                            this.RangeB = this.RangeBottom.toString();
                            this.Precount--;
                        }
                    }
                    this.Precount++;
                    this.min = -1; this.max = -1;

                } catch (e) {
                    console.log('Error in inner clickArrowPre--->' + e.message);
                }
            }
            if (this.PreTop.length == this.totalQuesNum && this.set >= 4) {
                this.saveOccSortDt();
            }
            const mulvalue = 100 / this.totalQuesNum;
            this.currentValue = mulvalue * this.set;


        } catch (e) {
            console.log('Error in clickArrowPre--->' + e.message);
        }
    }

    /** For range bar we use this function */
    slider() {
        try {
            let changeSlider;
            this.doubleHandleSlider = document.querySelector('.double-handle-slider');
            /** We check the window width to display range bar either horizontally
             * or vertically
             */
            if (window.innerWidth <= 767) {
                changeSlider = 'vertical';
            } else {
                changeSlider = 'horizontal';
            }
            const ref1 = this;
            /** If minimum and maximum values are set then we call slider function
             * if not we keep the default values that is 0 and 5
            */
            if (this.min >= 0 && this.min < this.totalQuesNum) {
                ref1.occSortSilder(this.min, this.max, changeSlider);
            } else {

                if (this.PreTop[this.set] >= 0 && this.PreTop[this.set] < this.totalQuesNum) {
                    this.min = this.PreTop[this.set];
                    this.max = this.PreBottom[this.set];
                }
                ref1.occSortSilder(0, 5, changeSlider);
            }
            this.changeClass(5, 'green-circle', true);
            // Every time we resize we destroy and create new slider
            window.onresize = function () {
                try {
                    ref1.doubleHandleSlider.noUiSlider.destroy();
                    ref1.slider();
                } catch (e) {
                }

            };
            const handle1 = [
                document.querySelector('.noUi-handle-lower'),
                document.querySelector('.noUi-handle-upper')
            ];
            /** This is for accessibility purpose */
            for (let i = 0; i < handle1.length; i++) {
                handle1[i].setAttribute('tabindex', '0');
                handle1[i].addEventListener('click', function () {
                    this.focus();
                });

                handle1[i].addEventListener('keydown', function (e: KeyboardEvent) {
                    const numbers = ref1.doubleHandleSlider.noUiSlider.get();
                    ref1.min = numbers[0]; ref1.max = numbers[1];
                    let handleVal;
                    if (ref1.max - ref1.min >= 1) {
                        switch (e.which) {
                            case 37:
                                // numbers[1]
                                if (i == 0) {
                                    handleVal = [ref1.min - 1, ref1.max];
                                    ref1.doubleHandleSlider.noUiSlider.set(handleVal);
                                    ref1.min--;
                                } else if (i == 1) {
                                    handleVal = [ref1.min, ref1.max - 1];
                                    ref1.doubleHandleSlider.noUiSlider.set(handleVal);
                                    ref1.max--;
                                }
                                if (ref1.min != -1 && ref1.max != ref1.min) {
                                    ref1.onHandlerSlide(handleVal, i);
                                }
                                break;
                            case 39:
                                if (i == 0) {
                                    handleVal = [ref1.min + 1, ref1.max];
                                    ref1.doubleHandleSlider.noUiSlider.set(handleVal);
                                    ref1.min++;
                                } else if (i == 1) {
                                    handleVal = [ref1.min, ref1.max + 1];
                                    ref1.doubleHandleSlider.noUiSlider.set(handleVal);
                                    ref1.max++;
                                }
                                if (ref1.min != -1 && ref1.max != ref1.min) {
                                    ref1.onHandlerSlide(handleVal, i);
                                }
                                break;
                        }

                    }

                });
            }
            this.doubleHandleSlider.noUiSlider.on('update', function (values, handle) {
                /** when the slider is changed we check all the code  */
                if ((values[0] != 0) && (values[0] == values[1]) && (handle == 0)) {
                    const val0 = (values[0] - 1);
                    const val1 = (values[1]);
                    this.doubleHandleSlider.noUiSlider.set([val0, val1]);
                } else if ((values[0] != 0) && (values[0] == values[1]) && (handle == 1)) {
                    const val0 = (values[0]);
                    const val1 = (values[1] + 1);
                    this.doubleHandleSlider.noUiSlider.set([val0, val1]);
                }
                if ((values[0] == 0) && (values[0] == values[1]) && (handle == 1)) {
                    this.doubleHandleSlider.noUiSlider.set([0, 1]);
                }
            });
            this.doubleHandleSlider.noUiSlider.on('slide', function (values, handle) {
                ref1.onHandlerSlide(values, handle)
            });

        } catch (e) {
            console.log('Error in slider--->' + e.message);
        }
    }

    /** This method is to remove and add green and white circle class */
    onHandlerSlide(values, handle) {
        try {
            let mindp, maxdp;
            const ref1 = this;
            for (let value = 0; value < 5; value++) {
                ref1.renderer.setElementClass(this.Eleval[value], 'white-circle', false);
                ref1.renderer.setElementClass(this.cardplp2[value], 'white-circle', false);
            }
            this.saved = 0;
            const rangeValues = values;
            this.min = rangeValues[0];
            this.max = rangeValues[1] - 1;
            mindp = this.min;
            maxdp = this.max;
            for (let value = 0; value < 5; value++) {
                if (value == mindp && mindp <= maxdp) {
                    ref1.renderer.setElementClass(this.Eleval[mindp], 'green-circle', true);
                    ref1.renderer.setElementClass(this.cardplp2[mindp], 'green-circle', true);
                    mindp++;
                } else {
                    ref1.renderer.setElementClass(this.Eleval[value], 'white-circle', true);
                    ref1.renderer.setElementClass(this.cardplp2[value], 'white-circle', true);
                }
            }
        } catch (e) {
            console.log('Error in onHandlerSlide--->' + e.message);
        }
    }

    saveOccSortDt() {
        try {
            /** After completing all the 5 questions in result page if we save data then this function is executed */
            this.RangeT = this.PreTop.toString();
            this.RangeB = this.PreBottom.toString();
            const saveOccsort = [];
            saveOccsort.push({
                'selectedFactors': this.occFactors.toString(),
                'rangeTop': this.RangeT,
                'rangeBottom': this.RangeB
            })
            this.storageService.sessionStorageSet('occsort', JSON.stringify(saveOccsort));
            this.trackEvnt.getOccSortResult(JSON.parse(this.storageService.sessionStorageGet('occsort')),
                this.storageService.sessionStorageGet('save_Par_UserNotes'));

        } catch (e) {
            console.log('Error in saveOccSortDt--->' + e.message);
        }
    }

    /** Create noUi slider */
    occSortSilder(mn, mx, changeSlider) {
        try {
            noUiSlider.create(this.doubleHandleSlider, {
                start: [mn, (mx + 1)],
                range: {
                    'min': 0,
                    'max': 5
                },
                orientation: changeSlider,
                connect: true,
                tooltips: false,
                step: 1,
                format: {
                    to: function (value) {
                        return value;
                    },
                    from: function (value) {
                        return value;
                    }
                }
            });
        } catch (e) {
            console.log('Error in saveOccSortDt--->' + e.message);
        }
    }
    saveChanges() {
        let oschanges = true;
        if ((5 - (this.set + 1)) == 0) {
            oschanges = false;
        }
        return oschanges;
    }
}
