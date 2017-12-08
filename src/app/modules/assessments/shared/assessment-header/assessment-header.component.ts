/**Angular2 Libraries **/
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/** import local shared Components */
import { headerButtons } from '../constants/assessments-constants';
import { AssessmentsService } from '../services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";

/** import outer shared Components */
import { AsmntCommonState } from '../../../../state-management/state/main-state';
import { Store } from '@ngrx/store';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';


@Component({
    selector: 'assessment-header',
    templateUrl: './assessment-header.layout.html'
})

export class AssessmentHeaderComponent implements OnInit, OnDestroy {

    public supportedLanguages: any[];
    selectedLang = '';
    assessmentheadextra;//variable for storing the extraname value
    headerSubscription;//variable for storing the subscription value of FreameworkConfigReducer
    footerPostion = 0;
    viewValue = 0;
    _hash = '!';
    constantNames = [];
    restoreBtnSub = new Subscription;
    routeSub = new Subscription;
    subscription = new Subscription;
    asmntname = '';//variable for stroing the assessment value
    endurl = '';//variable for storing the endurl
    occID;//variable for storing the occID value
    headerid;//variable for storing the assessment id name
    headerName;//variable for storing the assessment header name
    backCareerValue = false;//variable for storing the boolean value false
    // ComponentListNames=[];
    path;
    HeaderExtra = 'false';
    reducerSub = new Subscription;
    returnedVal;//variable for assessment common text
    btnValue = false;//variable for boolean value defaults false
    TextSub1;
    constructor(private trackEvnt: AssessmentsService, private route: Router,
        private store: Store<AsmntCommonState>,
        private activatedRoute: ActivatedRoute, private utils: Utilities, private storageService: StorageService,
        private eventService: EventDispatchService) {
        this.subscription = eventService.listen().subscribe((e) => {
            if (e.type === 'restore_btn_true') {
                this.HeaderExtra = 'true';
            } else if (e.type === 'restore_btn_false') {
                this.HeaderExtra = 'false';
            }
        });
        try {
            this.trackEvnt.callCommonText();

            this.returnedVal = store.select('AsmntCommonText');
            this.routeSub = route.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.path = event.url.split('/');
                    if (this.path.length > 1) {
                        this.asmntname = this.path[this.path.length - 2];
                    }
                    if (this.path.length > 2) {
                        if (this.path[this.path.length - 1].indexOf('?') == -1) {
                            this.endurl = this.path[this.path.length - 1];
                        } else {
                            let val = this.path[this.path.length - 1].split('?');
                            this.endurl = val[0];
                        }
                    }
                    if ((this.endurl.indexOf('occCareer') == -1) && (this.endurl.indexOf('occCluster') == -1)
                        && (this.endurl.indexOf('occEmergCareer') == -1)
                        && (this.endurl.indexOf('occIndex') == -1) && (this.endurl.indexOf('compare') == -1)) {
                        this.constantNames = headerButtons[this.endurl];
                    }
                    let TextSub = JSON.parse(this.storageService.sessionStorageGet('AsmntIntroText'));
                    if (this.endurl.indexOf('comparison') != -1) {
                        this.assessmentheadextra = TextSub.commonText.pageText.comparePage.pageTitleExtra;
                    }
                    else if (this.endurl.indexOf('occlist') != -1) {
                        this.assessmentheadextra = TextSub.commonText.pageText.listPage.pageTitleExtra;
                    }
                    else if (this.endurl.indexOf('result') != -1) {
                        this.assessmentheadextra = TextSub.commonText.pageText.resultsPage.pageTitleExtra;
                    } else if (this.endurl.indexOf('restore') != -1) {
                        let CommonSub = JSON.parse(this.storageService.sessionStorageGet('AsmntCommonTextStorage'));
                        this.assessmentheadextra = ': ' + CommonSub.commonText.restore;

                    } else if (this.endurl.indexOf('factors') != -1) {
                        this.occFactorHeader();
                    } else {
                        this.assessmentheadextra = '';
                    }
                    let rtArr = window.location.pathname.split('/');

                    for (let i = 0; i < rtArr.length; i++) {
                        if (this.storageService.sessionStorageGet('inTab') != undefined ||
                            this.storageService.sessionStorageGet('inTab') != null) {
                            if (rtArr[i] == 'occlist' && (this.storageService.sessionStorageGet('inTab') == 'career')) {
                                this.storageService.sessionStorageSet('goTo', 'career');
                                this.backCareerValue = true;
                                break;
                            } else if (this.storageService.sessionStorageGet('inTab') == 'cciCareer') {
                                this.storageService.sessionStorageSet('goTo', 'cluster');
                                this.backCareerValue = true;
                                break;
                            }
                            else {
                                this.storageService.sessionStorageSet('goTo', '');
                                this.backCareerValue = false;
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.log('assessment header constructor exception:' + e.message);
        }
    }

    /**ngOnInit method called when  initialization of the component */
    ngOnInit() {
        this.headerSubscription = this.store.select('FrameworkConfigReducer').subscribe((id) => {
            let ref = this;
            ref.storageService.sessionStorageSet('logoutClicked', '');
            ref.headerid = JSON.parse(ref.storageService.sessionStorageGet("assessmentheader"));

            id['config']['Result']['tabItems'].forEach(function (obj, inx) {
                for (let i = 0; i < obj.compList.length; i++) {
                    if (ref.headerid == obj.compList[i].compId) {
                        ref.headerName = obj.compList[i].compName;
                        ref.storageService.sessionStorageSet('assessName', obj.compList[i].compName);
                        break;
                    }
                }
            });
        });
    }
    callFunction(call) {
        if (call == 'restore') {
            this.restoreAnswerSets();
        } else if (call == 'assessName') {
            this.launchIntroPage();
        } else if (call == 'startover') {
            this.startOver();
        } else if (call == 'partialsave') {
            this.saveParitalAssesment(this.headerName);
        } else if (call == 'resultsave') {
            this.saveResultAssessment(this.headerName);
        } else if (call == 'print') {
            this.printResult();
        } else if (call == 'Back_Result') {
            this.backToResult();
        } else if (call == 'Back_Career') {
            this.backToCareer(this.headerName);
        }
    }
    /**occFactorHeader method for the Occupation Sort Factors headers changing dynamically in factors page*/
    occFactorHeader(): Observable<Event> {
        let TextSub = JSON.parse(this.storageService.sessionStorageGet('AsmntIntroText'));

        if (this.storageService.sessionStorageGet('occFactorHeader') == 'true') {

            this.assessmentheadextra = TextSub.commonText.pageText.rankPage.pageTitleExtra;
        } else {

            this.assessmentheadextra = TextSub.commonText.pageText.selectPage.pageTitleExtra;;
        }
        return;
    }

    /**This method for saving the partial assessment */
    saveParitalAssesment(assessmentName) {
        const evnt = document.createEvent('CustomEvent');
        evnt.initEvent('save_Partial', true, true);
        this.eventService.dispatch(evnt);
    }

    /**This function is for restoring the answer sets. */
    restoreAnswerSets() {
        this.route.navigate(['./restore'], { relativeTo: this.activatedRoute });
    }

    /**This function is for saving the assessement. */
    saveResultAssessment(assessmentName) {
        const evnt = document.createEvent('CustomEvent');
        evnt.initEvent('save_Complete', true, true);
        this.eventService.dispatch(evnt);
    }

    /**In restore page of assessments, this method for the button navigate to the assessment intro page */
    launchIntroPage() {
        // this.btnValue = false;
        this.storageService.sessionStorageSet('save_Par_UserNotes', '');
        this.storageService.sessionStorageSet('save_Com_UserNotes', '');
        this.route.navigate(['./intro'], { relativeTo: this.activatedRoute });
    }

    /**This function is for showing the pop-up and for starting the assessement.  */
    startOver() {
        this.storageService.sessionStorageSet('save_Par_UserNotes', '');
        this.storageService.sessionStorageSet('save_Com_UserNotes', '');
        if (this.path.indexOf('assessment') != -1) {
            this.trackEvnt.showStartOverDialog('/intro');
        } else {

            this.storageService.sessionStorageRemove('logID');
            const rtArr = this.route.url.split('/');
            const rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
            this.route.navigate(['../' + rtVal + '/intro'], { relativeTo: this.activatedRoute });
        }
    }

    /**This function is for printing the result screen in Interest-profiler and Entrepreneur-quiz. */
    printResult() {
        const rtArr = this.route.url.split('/');
        const rtVal = rtArr.slice(rtArr.length - 2, rtArr.length - 1).join('/');
        const evnt = document.createEvent('CustomEvent');
        let name = 'print_' + rtVal;
        evnt.initEvent(name, true, true);
        this.eventService.dispatch(evnt);
    }


    /*This function is to display the browser pop-up on page refresh*/

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHander($event: any) {
        const savePart = this.storageService.sessionStorageGet('savePartial');
        this.storageService.sessionStorageSet('isAssessment', this.endurl);

        if ((this.path.indexOf('assessment') != -1) && savePart != 'yes' && this.storageService.sessionStorageGet('logoutClicked') == '') {
            $event.returnValue = 'Your data will be lost!';
        }
    }

    @HostListener('window:hashchange', ['$event'])
    hashChangeEvent($event: any) {

        if (window.location.hash !== this._hash) {

            window.location.hash = this._hash;
        }
    }

    /**This function is for logging out of the modules. */
    logOut() {
        this.storageService.sessionStorageSet('logoutClicked', 'yes');
        if (this.path.indexOf('assessment') != -1) {
            this.trackEvnt.showStartOverDialog('logout');
        } else {
            this.storageService.mainLogOut();
        }
    }

    /**backToResult method for the button in the occlist pages navigates to the result page */
    backToResult() {
        this.route.navigate(['./result'], { relativeTo: this.activatedRoute });
    }

    /**backToCareer method for the button navigates to the career page when click on the link in personal qualities page*/
    backToCareer(assessmentName) {
        let rtArr = window.location.pathname.split('/');
        try {
            let navVal, navTo, id;
            let vl = JSON.parse(this.storageService.sessionStorageGet('loginFrameworkConfiguration')).config.Result.tabItems;
            for (let i = 0; i < vl.length; i++) {
                let list = vl[i].compList;
                for (let j = 0; j < list.length; j++) {
                    id = list[j].compId;
                    if (id == 'fileOcc') {
                        navVal = i;
                    }
                }
            }
            for (let i = 0; i < rtArr.length; i++) {
                if (this.storageService.sessionStorageGet('goTo') == 'career') {
                    this.occID = this.storageService.sessionStorageGet('occIDval');
                    this.route.navigate(['../../' + navVal + '/occdetails/occCareer'], {
                        relativeTo: this.activatedRoute,
                        queryParams: {
                            occid: this.occID,
                            occname: ''
                        }
                    });
                }
                else if (this.storageService.sessionStorageGet('goTo') == 'cluster') {
                    let clusId = this.storageService.sessionStorageGet('occIDval');
                    this.route.navigate(['../../' + navVal + '/occdetails/occCluster'], {
                        relativeTo: this.activatedRoute,
                        queryParams: {
                            clusId: this.storageService.sessionStorageGet('cciClus_ID'),
                            clusIcon: this.storageService.sessionStorageGet('cciClusIcon'),
                            clusColor: this.storageService.sessionStorageGet('cciclusColor')
                        }
                    });
                }
            }
        } catch (e) {
            console.log('backToCareer exception:' + e.message);
        }
    }

    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.restoreBtnSub.unsubscribe();
        this.routeSub.unsubscribe();
    }
}
