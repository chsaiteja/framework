/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Subscription } from "rxjs/Subscription";

/**Services **/
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { StoreSharedService } from '../../../../shared/outer-services/store-shared.service'
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AssessmentsService } from "../../../assessments/shared/services/assessments.service";
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';
import { AsmntCommonState, OccIndexCommonState } from "../../../../state-management/state/main-state";

@Component({
    selector: 'occ-index',
    templateUrl: './occ-index-layout.html',
})

export class OccIndexComponent implements OnInit, OnDestroy {
    clusterhide = true; /** Hide cluster details view */
    titlehide = false; /** Hide title details view */
    indexOccId = []; /** Contains OccId */
    indexTitleName = []; /** Contains OccNames */
    search = { text: '', rating: [], wages: [], edu: [] }; /** Used for searching values */
    filtersearch = { text: '', rating: [], wages: [], edu: [] }; /** clone for search variable, used while searching */
    expandCard = 999; /** Used to expand card */
    iconInxVal = 0; /** Value changed everytime when user click filter icon */
    eventServiceSub = new Subscription;
    eventSub = new Subscription;
    occTextSub = new Subscription;
    occNameSub = new Subscription;
    occIndexReducerSub = new Subscription;
    filtericon = ["fa fa-filter", "fa fa-times"];
    occIndexReduTxt; /** Contain all list */
    occIndexListText; /** Is a variable that is used to store data coming from reducer */
    occTxtVal; /** contain all names */
    clusterValues = {}; /** Contain cluster values */
    langVal; /** Gets user selected language */
    showImg = -1; /** Todisplay loading or dataNotFound image */
    searchBox = true;
    langChange = false;
    backAssessmentValue = false; /** Back assessment button */
    show = 0; /**Toggle between buttons */

    constructor(private router: Router, private utils: Utilities, private storageService: StorageService, private trackEvnt: AssessmentsService,
        private dispatchStore: Store<Action>, private activatedRoute: ActivatedRoute, private store: Store<AsmntCommonState>, private occStore: Store<OccIndexCommonState>,
        private eventService: EventDispatchService, private storeService: StoreSharedService) {
        /** Get user selected languge */
        // console.log('in occIndex : ' + new Date().getTime());
        this.langVal = this.storageService.sessionStorageGet('langset');
        this.eventSub = eventService.listen().subscribe((e) => {
            if (e.type == 'languageChanged') {
                /** When user changes language parameter this subscription detected*/
                // this.utils.showLoading();

                this.langChange = true;
                this.langVal = this.storageService.sessionStorageGet('langset');
                let routArr = this.router.url.split('/');
                this.ngOnInit();
                this.savedCareerNames();
            }
        });
        //below condition is for checking back to assessment button to display 
        if (this.storageService.sessionStorageGet('inTab') != undefined || this.storageService.sessionStorageGet('inTab') != null) {

            if (this.storageService.sessionStorageGet('inTab') == 'Assess' || this.storageService.sessionStorageGet('inTab') == 'cciAssess'
                || this.storageService.sessionStorageGet('inTab') == 'osAssess') {
                this.backAssessmentValue = true;
            }
            else {
                this.backAssessmentValue = false;
            }
        }
        // Get data from reducer to display buttons text
        this.occTextSub = store.select('OccText').subscribe((v) => {
            if (this.langChange == true) {
                this.occIndexListText = v;
            }
        });
        // Contain cluster list and title list
        this.occIndexReducerSub = occStore.select('OccIndexReducerText').subscribe((v) => {
            if (this.langChange == true) {
                this.occIndexReduTxt = v;
                if (this.storageService.sessionStorageGet('parentCnt') == '') {
                    this.showImg = -1;
                } else if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
                    this.showImg = 1;
                    this.occBtnTxt();
                    this.savedCareerNames();
                } else if (this.storageService.sessionStorageGet('parentCnt') == 'false') {
                    this.showImg = 0;
                }
            }
            else if (this.langChange == false) {
                this.occBtnTxt();
                this.savedCareerNames();
            }
        });

    }
    ngOnInit() {
        if (this.storageService.sessionStorageGet('careerShow') != undefined) {
            let showval = this.storageService.sessionStorageGet('careerShow');
            if (showval == '1') {
                this.show = 1;
                this.titlehide = true;
                this.clusterhide = false;
            }
            else if (showval == '0') {
                this.show = 0;
                this.titlehide = false;
                this.clusterhide = true;
            }
        }
        this.clusterValues = clusterDetails;
    }
    occBtnTxt() {
        if (this.langChange == false) {
            let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
            if (val.commonText.common != undefined) {

                this.occIndexListText = val;
            }
        }
    }
    /** this ngOnDestroy() function is call after Component destory */
    savedCareerNames() {
        // if (this.langChange == false) {
        let val = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText'));
        let value = true;
        this.indexOccId = [];
        this.indexTitleName = [];
        if (val.commonText != undefined) {
            this.occIndexReduTxt = val;
            this.utils.hideLoading();
            // console.log('tiles clicked without lang click : ' + new Date().getTime());
            if (this.storageService.sessionStorageGet('parentCnt') == '') {
                this.showImg = -1;
            } else if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
                this.showImg = 1;
            } else if (this.storageService.sessionStorageGet('parentCnt') == 'false') {
                this.showImg = 0;
            }
        }
        if (this.storageService.sessionStorageGet("savedValId") != '') {
            val.commonText.occList.forEach((v) => {
                if ((v.occID == parseInt(this.storageService.sessionStorageGet("savedValId"))) && value == true) {
                    if (this.indexOccId.indexOf(parseInt(this.storageService.sessionStorageGet("savedValId"))) == -1) {
                        this.indexOccId.push(parseInt(this.storageService.sessionStorageGet("savedValId")));
                        this.indexTitleName.push(v.title);
                        value = false;
                    }
                }
            });
        }
        // }
        // else {
        //     // console.log('tiles clicked with lang click : ' + new Date().getTime());
        //     this.utils.hideLoading();
        // }
    }
    ngOnDestroy() {
        //unsubscribe all the subscritions
        this.eventServiceSub.unsubscribe();
        this.eventSub.unsubscribe();
        this.occTextSub.unsubscribe();
        this.occNameSub.unsubscribe();
        this.occIndexReducerSub.unsubscribe();
    }
    //Display filter values in div
    setFilterVal(filtername, val) {
        let isAvailable = false;
        let inx1 = -1;
        for (let i = 0; i < this.search[filtername].length; i++) {

            if (val == this.search[filtername][i]) {
                isAvailable = true;
                inx1 = i;
                break;
            }
            else {
                isAvailable = false;
            }
        }
        if (isAvailable == false) {
            this.search[filtername].push(val);
            isAvailable = true;
        }
        else {
            this.search[filtername].splice(inx1, 1);
        }
    }

    // called whenever we are tring to search
    changeText() {
        this.occIndexReduTxt = this.storeService.filterListData({
            text: this.search.text, edu: this.search.edu,
            rating: this.search.rating, wages: this.search.wages,
            module: 'occ_index'
        }, 'index');
        if (this.occIndexReduTxt.commonText.occList.length == 0) {
            this.showImg = 0;
        } else {
            this.showImg = 1;
        }
        this.iconInxVal = 0;
        this.searchBox = true;
    }
    // Calls when user click on careeer or emerge
    callOccDetail(occID, occName, clusterId) {
        if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
            && this.indexOccId.indexOf(occID) != -1)) {
            this.utils.showLoading();
            let clusterIcon;
            let backGroundClr;
            let clsVal = this.trackEvnt.clustDetails(clusterId);
            clusterIcon = clsVal.clusterIconValue;
            backGroundClr = clsVal.clusterBgColor;
            let twoDigit = occID.toString().substr(0, 2);
            if (twoDigit == 14) {
                this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: occID, occname: occName, clusIcon: clusterIcon, clusColor: backGroundClr } });
            }
            else {
                this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: occID, occname: occName } });
            }
        }
    }
    // Calls when user click on cluster
    callOccDetailCluster(clusterId, ClusterName) {
        if (this.indexOccId.length < 2 || (this.indexOccId.length == 2
            && this.indexOccId.indexOf(clusterId) != -1)) {
            this.utils.showLoading();
            let clusterIcon;
            let backGroundClr;
            let clsVal = this.trackEvnt.clustDetails(clusterId);

            clusterIcon = clsVal.clusterIconValue;
            backGroundClr = clsVal.clusterBgColor;
            this.router.navigate(['../occCluster'], {
                relativeTo: this.activatedRoute,
                queryParams: { clusId: clusterId, clusName: ClusterName, clusIcon: clusterIcon, clusColor: backGroundClr }
            });
        }
    }

    //Cluster or career hide
    clusterListFun(hide) {
        if (hide == 'cluster' && (this.show != 1)) {
            this.show = 1;
            this.titlehide = true;
            this.clusterhide = false;
        }
        else if (hide == 'title' && (this.show != 0)) {
            this.show = 0;
            this.titlehide = false;
            this.clusterhide = true;
        }
    }
    //Executed when click on career to get result for selected options
    getResultFilter() {
        this.filtersearch = { text: '', rating: [], wages: [], edu: [] };
        this.filtersearch.text = this.search.text;
        if (this.search.rating.length > 0) {
            this.search.rating.forEach(function (obj, inx) {
                this.filtersearch.rating.push(obj);
            }.bind(this));
        }
        if (this.search.wages.length > 0) {
            this.search.wages.forEach(function (obj, inx) {
                this.filtersearch.wages.push(obj);
            }.bind(this));
        }
        if (this.search.edu.length > 0) {
            this.search.edu.forEach(function (obj, inx) {
                this.filtersearch.edu.push(obj);
            }.bind(this));
        }
        this.occIndexReduTxt = this.storeService.filterListData({
            text: this.search.text, edu: this.search.edu,
            rating: this.search.rating, wages: this.search.wages,
            module: 'occ_index'
        }, 'index');
        if (this.occIndexReduTxt.commonText.occList.length == 0) {
            this.showImg = 0;
        } else {
            this.showImg = 1;
        }
        this.iconInxVal = 0;
        this.searchBox = true;
    }
    //Reset the selected option 
    resetCheckBoxes() {
        this.search = { text: this.search.text, rating: [], wages: [], edu: [] };
    }
    //revite the selected values
    cancelButton() {
        this.search = { text: '', rating: [], wages: [], edu: [] };
        this.search.text = this.filtersearch.text;
        if (this.filtersearch.rating.length > 0) {
            this.filtersearch.rating.forEach(function (obj, inx) {
                this.search.rating.push(obj);
            }.bind(this));
        }
        if (this.filtersearch.wages.length > 0) {
            this.filtersearch.wages.forEach(function (obj, inx) {
                this.search.wages.push(obj);
            }.bind(this));
        }
        if (this.filtersearch.edu.length > 0) {
            this.filtersearch.edu.forEach(function (obj, inx) {
                this.search.edu.push(obj);
            }.bind(this));
        }
        this.iconInxVal = 0;
        this.searchBox = true;
    }
    //Executes when user click on checkbox
    checkCareer(id, name, e) {
        if ((e == "click") && this.indexTitleName.length <= 2) {
            let isAvailable = false;
            let inx1 = -1;
            for (let i = 0; i < this.indexOccId.length; i++) {

                if (id == this.indexOccId[i]) {
                    isAvailable = true;
                    inx1 = i;
                    break;
                }
                else {
                    isAvailable = false;
                }
            }
            if (isAvailable == false) {
                this.indexOccId.push(id);
                this.indexTitleName.push(name);
                isAvailable = true;
            }
            else {
                this.indexOccId.splice(inx1, 1);
                this.indexTitleName.splice(inx1, 1);
            }
        }
    }
    // Navigate to compare screen
    CompareOccupations() {
        try {
            this.router.navigate(['../compare'], {
                relativeTo: this.activatedRoute,
                queryParams: {
                    occId: this.indexOccId[0] + "&" + this.indexOccId[1],
                    occName: this.indexTitleName[0] + "&" + this.indexTitleName[1]
                }
            });
        }
        catch (e) {
            alert("error--->" + e.message);
        }

    }
    //Goes to result page of assessment from where we came
    backAssessment() {
        if (this.storageService.sessionStorageGet('inTab') != 'cciAssess' && this.storageService.sessionStorageGet('inTab') != 'osAssess') {
            this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
        }
    }
    //changes icon
    showHideIcon() {
        if (this.iconInxVal == 0) {
            this.iconInxVal = 1;
            this.searchBox = false;
        }
        else {
            this.iconInxVal = 0;
            this.searchBox = true;
        }
    }
    //Expand or closes the card
    methodfilter(valfil) {
        if (this.expandCard != valfil) {
            this.expandCard = valfil;
        }
        else {
            this.expandCard = 999;
        }
    }
}