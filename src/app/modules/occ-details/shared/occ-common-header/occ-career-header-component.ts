/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Services **/
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { SnackBar } from '../../../../shared/modal/shared-modal-component';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, OCCPageState, OccIndexCommonState } from "../../../../state-management/state/main-state";

@Component({
    selector: 'occ-detail-header',
    templateUrl: './occ-career-layout.html'
})

export class OccCareerHeaderComponent implements OnInit, OnDestroy {
    showCareerColorUp = -1; /** To show thumbs up or down */
    filter = false;  /** Became true or false when user clicks on Fav icon */
    value = ""; /** To display name of the tab in dropdown for mobile screen */
    states = 'US' /** Contains all the states that user selected */
    indexOccId = []; /** Contains id values */
    indexTitleName = []; /** Contain titles to display in compare popup */
    accId = ""; /** Contains account id value */
    occID = ""; /** Contains current occId value */
    occName;  /** Contain current occName */
    occTxtVal = {}; /** JSON obj that contains id and name */
    // nameTxt;  /** Contain key */
    isSaveid = []; /** If user save data in compare popup, it'll stored in this variable */
    activeVal = 0; /** Use to tell which tab we have to display */
    occCareerStore; /** Is a variable that is used to store data coming from reducer */
    hideVal = 0;
    settingsText; /** Is a variable that is used to store data coming from reducer */
    occCareerText; /** Is a variable that is used to store data coming from reducer */
    eventSub = new Subscription;
    langChange = false;
    occTextSub = new Subscription;
    occSettingsTextSub = new Subscription;
    occIndexReducerSub = new Subscription;
    backAssessmentValue = false; /** To show back to assesment button  */
    langVal; /** Gets user selected language */
    public snackbar = new SnackBar();
    constructor(
        private router: Router, private storageService: StorageService, private activatedRoute: ActivatedRoute,
        private utils: Utilities, private apiJson: ApiCallClass, private store: Store<AsmntCommonState>,
        private dispatchStore: Store<Action>, private OCCPageStateStore: Store<OCCPageState>,
        private serverApi: ServerApi, private occStore: Store<OccIndexCommonState>, private eventService: EventDispatchService) {
        /** Get user selected languge */
        this.langVal = this.storageService.sessionStorageGet('langset');
        this.dispatchStore.dispatch({ type: "RESET_OccSettingsText" });
        this.dispatchStore.dispatch({ type: "RESET_OCC_PAGE" });
        this.storageService.sessionStorageRemove('outlookStates');
        this.storageService.sessionStorageRemove('wagesStates');
        this.eventSub = eventService.listen().subscribe((e) => {
            if (e.type == 'relatedDispatch') {
                /** When user click on link that is in related career to navegate 
                * to another career we are subscribing an event 
                */
                this.activatedRoute.queryParams.subscribe(params => {
                    this.activeVal = 0;
                    this.occID = params['occid'];
                    this.savedCareerNames();
                    this.getCareer();
                });
            }
            else if (e.type == 'languageChanged') {
                /** When user changes language parameter this subscription detected*/
                let txt = (this.storageService.sessionStorageGet('occlistText'));
                this.langVal = this.storageService.sessionStorageGet('langset');
                let Arr = this.router.url.split('?');
                let routArr = Arr[0].split('/');
                this.hideVal = 0;
                this.langChange = true;
                if (routArr.indexOf('occCareer') != -1) {
                    this.ngOnInit();
                }
            }
            else if (e.type == 'callWagePage') {
                /** When user clicks on 'wages' card in at-a-glance screen this subscription detected*/
                this.checkValues(2);
            }
            else if (e.type == 'job_Setting' || e.type == 'job_Task') {
                /** When user clicks on 'job task' or 'work setting' card in at-a-glance screen this subscription detected*/
                this.checkValues(1);
            }
            else if (e.type == 'callOutlookPage') {
                /** When user clicks on 'Employment oppertunities' card in at-a-glance screen this subscription detected*/
                this.checkValues(3);
            }
            else if (e.type == 'calleduPage') {
                /** When user clicks on 'education and training' card in at-a-glance screen this subscription detected*/
                this.checkValues(4);
            }
        });
        this.activatedRoute.queryParams.subscribe(params => {
            // Get occId from parameters
            this.occID = params['occid'];
            // Get key value to nameTxt using occID
        });
        //Setting default state
        this.storageService.sessionStorageSet('states', 'US');
        // Get data from reducer to display buttons text
        this.occTextSub = store.select('OccText').subscribe((v) => {
            if (this.langChange == true) {
                this.occCareerText = v;
            }
        });
        // Get data from reducer to show tab names, user rating etc.,
        this.occSettingsTextSub = store.select('OccSettingsText').subscribe((v) => {
            this.settingsText = v;
            if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
                this.value = this.settingsText.commonText.tabs[0].title;
                let ref = this;
                setTimeout(function () {
                    ref.utils.hideLoading();
                }, 1000);
            }
        });
        // Get data from reducer to show image and vedio
        this.occCareerStore = OCCPageStateStore.select('OccPageText');
        this.occIndexReducerSub = occStore.select('OccIndexReducerText').debounceTime(1000).subscribe((v) => {
            if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
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
        this.accId = this.utils.getAccountId();
    }
    ngOnInit() {
        this.storageService.sessionStorageSet('occIDval', this.occID);
        this.utils.showLoading();
        this.savedCareerNames();
    }
    savedCareerNames() {
        let endVal;
        if (this.storageService.sessionStorageGet('inTab') == 'osAssess') {
            endVal = 'pageText/occSort';
        } else {
            endVal = 'pageText/wil';
        }
        this.dispatchStore.dispatch({
            type: "GET_INTRO_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: [], query_params: { 'lang': this.langVal },
                body_Params: {}, endUrlVal: endVal, setVal: 'commonIntro', text: ''
            }
        });
        let val = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText'));
        let value = true;
        val.commonText.occList.forEach((v) => {
            this.occTxtVal['occ_' + v.occID] = v.title;
            if ((v.occID == this.occID) && value == true) {
                this.occName = (v.title);
                value = false;
                this.getValues();
            }
        });
    }
    //The method checks tabId and open respective tabs
    checkValues(number) {
        if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
            let ref = this;
            this.settingsText.commonText.tabs.forEach(function (obj, inx) {
                if (obj['tabId'] == number) {
                    ref.dropDownVal(obj['title'], inx);
                }
            }.bind(this));
        }
    }
    getValues() {
        if (this.occID != '') {
            this.indexOccId[0] = parseInt(this.occID);
            this.indexTitleName[0] = (this.occName);
        }
        //calling getCareer method for getting text from api
        this.getCareer();
    }
    /** this ngOnDestroy() function is call after Component destory */
    ngOnDestroy() {
        //unsubscribe all the subscritions
        this.eventSub.unsubscribe();
        this.occTextSub.unsubscribe();
        this.occSettingsTextSub.unsubscribe();
        this.occIndexReducerSub.unsubscribe();
    }
    getUnFill(thumbVal) {
        //this call is to fill and unfill the thumbs up and down icon
        if (thumbVal == 'up' && (this.showCareerColorUp != 1)) {
            this.showCareerColorUp = 1;
        }
        else if (thumbVal == 'down' && (this.showCareerColorUp != 0)) {
            this.showCareerColorUp = 0;
        }
        else {
            this.showCareerColorUp = -1;
        }
        this.resultPost();
    }
    compareOccupations() {
        //used to navigate to compare screen
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
    //Gets executed when related career tab was clicked
    relate(eve) {
        this.occID = eve[0];
        this.accId = this.utils.getAccountId();
        this.getCareer();
    }
    getCareer() {
        if (this.langChange == false) {
            let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
            if (val.commonText.common != undefined) {
                this.occCareerText = val;
            }
        }
        this.dispatchStore.dispatch({
            type: "OCC_SETTING_TEXT", payload: {
                methodVal: 'GET', module_Name: 'Settings/v1/',
                path_params: [this.utils.getAccountId()], query_params: { "lang": this.langVal },
                body_Params: {}, endUrlVal: 'occ/standard', name: 'careers'
            }
        });

        this.getRating();
        this.careerHeader();
    }
    savePost() {
        //to post the favorites data
        this.utils.showLoading();
        this.apiJson.method = "POST";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = "Occ/v1/";
        let saveResult = {
            input_data: [
                {
                    "param_type": "path",
                    "params": [this.utils.getAccountId(), "favorites", this.occID]
                },
                {
                    "param_type": "query",
                    "params": { "lang": this.langVal }
                }

            ]
        }
        let user = JSON.stringify(saveResult);
        this.apiJson.endUrl = "users";
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((res) => {
            this.utils.hideLoading();
            this.snackbar.myFunction("Successfully added to favourites.");

        }, this.utils.handleError);
    }
    getRating() {
        // to get the data to show what user selected between thumbs up and down
        this.apiJson.method = "GET";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = "Occ/v1/";
        let getThumbsResult = {
            input_data: [
                {
                    "param_type": "path",
                    "params": [this.utils.getAccountId(), "ratings", this.occID]
                },
                {
                    "param_type": "query",
                    "params": { "lang": this.langVal }
                }

            ]
        }
        let user = JSON.stringify(getThumbsResult);
        this.apiJson.endUrl = "users";
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((res) => {
            if (res[0].Success + "" == "true") {
                if (res[0].Result == "1") {
                    this.showCareerColorUp = 1;
                }
                else if (res[0].Result == "0") {
                    this.showCareerColorUp = 0;
                }
                else {
                    this.showCareerColorUp = -1;
                }

            }
        }, this.utils.handleError);

    }

    dropDownVal(name, num) {
        //for dropdown in mobile
        this.value = name;
        this.activeVal = num;
    }
    careerHeader() {
        //data for header part
        try {
            this.dispatchStore.dispatch({
                type: "GET_ASMNT_COMMON_TEXT", payload: {
                    methodVal: 'GET', module_Name: 'Occ/v1/',
                    path_params: ["occ", this.occID, this.utils.getAccountId()], query_params: { "sections": "all", "states": this.states, "lang": this.langVal },
                    body_Params: {}, endUrlVal: 'pages'
                }
            });

        }
        catch (e) {
            alert("error------>" + e.message);
        }
    }
    resultPost() {

        //post thumbs up and down to api
        setTimeout(function () {
            this.apiJson.method = "POST";
            this.apiJson.sessionID = this.utils.getAuthKey();
            this.apiJson.moduleName = "Occ/v1/";
            let starResult = {
                input_data: [
                    {
                        "param_type": "path",
                        "params": [this.utils.getAccountId(), "ratings", this.occID, this.showCareerColorUp]
                    },
                    {
                        "param_type": "query",
                        "params": { "lang": this.langVal }
                    }

                ]
            }
            let user = JSON.stringify(starResult);
            this.apiJson.endUrl = "users";
            this.apiJson.data = user;
            this.serverApi.callApi([this.apiJson]).subscribe((res) => {
                if (res.Result + "" == "true") {
                }

            }, this.utils.handleError);
        }.bind(this));

    }

    checkCareer(id) {
        //this method is to remove occupation from popup

        let inx1 = -1;
        console.log('id : ' + id);
        console.log('indexOccId : ' + this.indexOccId);
        for (let i = 0; i < this.indexOccId.length; i++) {
            if (id == this.indexOccId[i]) {
                inx1 = i;
                this.isSaveid.push(id);
            }
        }
        console.log('isSaveid.length : ' + this.isSaveid.length);
        this.indexOccId.splice(inx1, 1);
        this.indexTitleName.splice(inx1, 1);
    }
    careerList(check) {
        //navigate to occindex based on whether the occupation saved or not
        // this.utils.showLoading();
        this.storageService.sessionStorageSet('careerShow', '0');
        this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
    }
    cancleOccupation() {
        //when x in pop-up was clicked cancel the changes
        for (let i = 0; i < this.isSaveid.length; i++) {
            this.indexOccId.push(this.isSaveid[i]);
            let nameValue = this.occTxtVal['occ_' + this.isSaveid[i]];
            this.indexTitleName.push(nameValue)
        }
        this.isSaveid = [];
    }

    showAllCareer() {
        // when compare button was clicked the below code executed to display Name
        if (this.storageService.sessionStorageGet("savedValId") != '') {
            let idValue = parseInt(this.storageService.sessionStorageGet("savedValId"));
            if (this.indexOccId.indexOf(idValue) == -1) {
                let nameValue = this.occTxtVal['occ_' + idValue];
                if (nameValue != undefined) {
                    this.indexTitleName.push(nameValue);
                    this.indexOccId.push(idValue);
                }
            }
        }
    }
    saveOccupation() {
        this.isSaveid = [];
        //when save button in pop-up was clicked save the occupation to compare    
        if (this.indexOccId.length == 1) {
            this.storageService.sessionStorageSet("savedValId", this.indexOccId[0]);
        }
        if (this.indexOccId.length == 0) {
            this.storageService.sessionStorageSet("savedValId", '');
        }
    }
    backAssessment() {
        //when back assessment data was clicked navigate to respective page
        if (this.storageService.sessionStorageGet('inTab') != 'cciAssess' && this.storageService.sessionStorageGet('inTab') != 'osAssess') {
            this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
        } else {
            this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
        }
    }

}