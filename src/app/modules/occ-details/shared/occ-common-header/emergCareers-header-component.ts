/**Import angular core packages */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Custom imports */
import { AsmntCommonState, OCCPageState, OccIndexCommonState } from "../../../../state-management/state/main-state";
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { SnackBar } from '../../../../shared/modal/shared-modal-component';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'occ-emerg-header',
  templateUrl: './emergCareers-layout.html',


})

export class OccEmergHeaderComponent implements OnInit, OnDestroy {

  accountId; // Declare for storing the value of accountid 
  // nameTxt; // Declare for storing the value of occid 
  occName; // Declare for storing the occName value
  occEmergingStore;// Declare for assigning the value of OCCPageStatestore 
  occTextStore; // Declare for assinging the value of store
  settingsText; // Declare for assigning the subscribing value of occsettingsText 
  clusterIcon = ""; // Declare the params value of clusterIcon 
  clusterColor = ""; //Declare the params value of clustercolor 
  value = "About this Career"; //Declare for storing the values of dropdownmenus list 
  occID = ""; //Declare for storing the occid value 
  showColorUp = -1; //Declare for storing the thumbs value
  langVal; //Declare for storing of sessionstorageget value of langset
  activeVal = 0; //Declare for dropdown menu lists value  
  hideVal = 0;
  backAssessmentValue = false;
  emergingJsonValue = [];
  subscription = new Subscription;
  langChange = false;
  occIndexReducerSub = new Subscription;
  occText = new Subscription;
  occSettingsText = new Subscription;
  public snackbar = new SnackBar();
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private storageService: StorageService,
    private utils: Utilities, private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>, private OCCPageStateStore: Store<OCCPageState>,
    private occStore: Store<OccIndexCommonState>,
    private apiJson: ApiCallClass, private serverApi: ServerApi, private eventService: EventDispatchService) {
    this.langVal = this.storageService.sessionStorageGet('langset');
    /** Below code block listens broadcasted event and 
		 * calls respective functionality */
    this.subscription = eventService.listen().subscribe((e) => {
      /** After event listen it will check whether user want functionality of
       * languagechanged event and relatedemergingdispatch event*/
      if (e.type == 'relatedEmergingDispatch') {
        this.activeVal = 0;
        this.ngOnInit();

      }
      else if (e.type == 'languageChanged') {
        this.langVal = this.storageService.sessionStorageGet('langset');
        let Arr = this.router.url.split('?');
        let routArr = Arr[0].split('/');
        this.hideVal = 0;
        this.langChange = true;
        if (routArr.indexOf('occEmergCareer') != -1) {
          this.ngOnInit();
        }
      }
    });

    /**get the data from reducer related effect name**/
    this.occIndexReducerSub = occStore.select('OccIndexReducerText').debounceTime(1000).subscribe((v) => {
      if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
        this.savedCareerNames();
      }
    });
    this.occEmergingStore = OCCPageStateStore.select('OccPageText');


    this.occText = store.select('OccText').subscribe((v) => {
      if (this.langChange == true) {
        this.occTextStore = v;
      }
    });

    this.occSettingsText = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      this.hideLoadingSymbol();
    });

    this.activatedRoute.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.occID = params['occid'];
      // this.nameTxt = 'occ_' + this.occID;
      this.clusterIcon = params['clusIcon'];
      this.clusterColor = params['clusColor'];
    });

  }

  /**hideLoadingSymbol method is used for the hide the loading symbol */
  hideLoadingSymbol() {
    if (this.occName != undefined && (this.settingsText != undefined)) {
      if ((this.settingsText.commonText.topSections != undefined)) {
        let ref = this;
        setTimeout(function () {
          ref.utils.hideLoading();
        }, 500);
      }
    }
  }

  /** ngOnInit method is called at the time of initialization of the component */
  ngOnInit() {
    this.utils.showLoading();
    this.savedCareerNames();
    /**this condition is for backtoassessment button when the user come from assessments or from careers */
    if (this.storageService.sessionStorageGet('inTab') != undefined || this.storageService.sessionStorageGet('inTab') != null) {
      if (this.storageService.sessionStorageGet('inTab') == 'Assess' || this.storageService.sessionStorageGet('inTab') == 'cciAssess'
        || this.storageService.sessionStorageGet('inTab') == 'osAssess') {
        this.backAssessmentValue = true;
      }
      else {
        this.backAssessmentValue = false;
      }
    }
    this.storageService.sessionStorageSet('occIDval', this.occID);
    this.emergingJsonValue['clusIcon'] = this.clusterIcon;
    this.emergingJsonValue['clusColor'] = this.clusterColor;
    this.accountId = this.utils.getAccountId();
    this.dispatchStore.dispatch({
      type: 'GET_ASMNT_COMMON_TEXT', payload: {
        methodVal: 'GET', module_Name: 'Occ/v1/',
        path_params: ['emerging', this.occID, this.accountId],
        query_params: { 'sections': 'all', 'lang': this.langVal },
        body_Params: {}, endUrlVal: 'pages', text: ''
      }
    });

    this.getText();
    this.getRating();
  }
  savedCareerNames() {
    let val = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText'));
    let value = true;
    val.commonText.occList.forEach((v) => {
      if ((v.occID == this.occID) && value == true) {
        this.occName = (v.title);
        value = false;
        // }
      }
    });
  }

  /**ngOnDestroy method is called when user destroying the component */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.occIndexReducerSub.unsubscribe();
    this.occText.unsubscribe();
    this.occSettingsText.unsubscribe();
  }

  /**dropDownVal method is for the dropDown menu dispalyed in mobileview */
  dropDownVal(name, val) {
    this.value = name;
    this.activeVal = val;
  }

  /**getUnFill method is for filling the thumbs icons */
  getUnFill(thumbVal) {
    if (thumbVal == 'up' && (this.showColorUp != 1)) {
      this.showColorUp = 1;
    }

    else if (thumbVal == 'down' && (this.showColorUp != 0)) {
      this.showColorUp = 0;
    }
    else {
      this.showColorUp = -1;
    }
    this.resultPost();
  }

  /**savePost method is for saving the result of favorites*/
  savePost() {

    this.utils.showLoading();
    this.apiJson.method = "POST";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let saveResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accountId, "favorites", this.occID]
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

      if (res.Result + "" == "true") {
        this.utils.hideLoading();
        this.snackbar.myFunction("Successfully added to favourites.");
      }

    }, this.utils.handleError);

  }

  /**getRating method is for the get the rating with ratings call */
  getRating() {
    this.apiJson.method = "GET";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.apiJson.moduleName = "Occ/v1/";
    let getThumbsResult = {
      input_data: [
        {
          "param_type": "path",
          "params": [this.accountId, "ratings", this.occID]
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

          this.showColorUp = 1;
        }
        else if (res[0].Result == "0") {

          this.showColorUp = 0;
        }
        else {

          this.showColorUp = -1;
        }
      }
    }, this.utils.handleError);

  }

  /**getText method is for dispatching the pages call text and settings call text*/
  getText() {
    if (this.langChange == false) {
      let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
      if (val.commonText.common != undefined) {
        this.occTextStore = val;
      }
    }
    this.dispatchStore.dispatch({
      type: "OCC_SETTING_TEXT", payload: {
        methodVal: 'GET', module_Name: 'Settings/v1/',
        path_params: [this.accountId], query_params: { "lang": this.langVal },
        body_Params: {}, endUrlVal: 'occ/emerging'
      }
    });

  }

  /**resultPost method is for posting the result of ratings */
  resultPost() {
    setTimeout(function () {
      this.apiJson.method = "POST";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let starResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accountId, "ratings", this.occID, this.showColorUp]
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
          // this.starRes = this.showColorUp;

          // this.getRating();

        }
        else {

        }
      }, this.utils.handleError);
    }.bind(this));
  }

  /**backAssessment method is for the backtoassessment 
   *  button clicking,when we come from the ip assessment  */
  backAssessment() {
    //when back assessment data was clicked navigate to respective page
    if (this.storageService.sessionStorageGet('inTab') != 'cciAssess' && this.storageService.sessionStorageGet('inTab') != 'osAssess') {
      this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
    }
  }

  /**careerlist method is for careerlist button,after clicking it will go to the occIndex page */
  CareerList(check) {
    // this.utils.showLoading();
    this.storageService.sessionStorageSet('careerShow', '0');
    this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
  }
}

