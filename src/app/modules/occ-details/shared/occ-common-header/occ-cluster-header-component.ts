/**Angular imports */
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';

/**Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { AssessmentsService } from '../../../assessments/shared/services/assessments.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

/**Components */
import { AtAGlanceClusterComponent } from '../../occ-clusters/at-a-glance/at-a-glance.component';
import { AsmntCommonState, OCCPageState, OccIndexCommonState } from "../../../../state-management/state/main-state";
import { SnackBar } from '../../../../shared/modal/shared-modal-component';

@Component({
  selector: 'occ-cluster-header',
  templateUrl: './occ-cluster-layout.html'
})

export class OccClusterHeaderComponent implements OnInit, OnDestroy {
  currentRate; /**Declare for storing the current rating value.*/
  value = "At a Glance"; /**Declare for storing the tab value.*/
  refGlance = {}; /**Declare for storing the icon and cluster color values.*/
  starRes; /**Declare for storing the rating values.*/
  refrelatedcareer = { 'RelatedCareers': {} }; /**Declare for storing the career icon and color values.*/
  clusterID = ""; /**Declare for storing the related clusterIDs.*/
  clusterName; /**Declare for storing the cluster related text coming from store.*/
  //nameTxt; /**Declare for storing the text of different language.*/
  showColorUp = -1; /**Declare for storing the thumbs value.*/
  clusterIcon = ""; /**Declare for storing the cluster icon.*/
  clusterColor = ""; /**Declare for storing the cluster color.*/
  accountID = ""; /**Declare for storing the accountID.*/
  backAssessmentValue = false; /**Declare for storing the value for backtoAssessment.*/
  occClusterText; /**Declare for storing the cluster text.*/
  hideVal = 0; /**Declare for storing the hide values.*/
  occClusterStore; /**Declare for storing the text coming from the store.*/
  activeVal = 0;
  langChange = false; /**Declare for storing the active values.*/
  clussettingsText; /**Declare for storing the settings subscribe text.*/
  subscription = new Subscription; /** Declare to listen if any change occured.*/
  occIndexReducerSub = new Subscription; /** Declare to listen if any change occured.*/
  OccSettingsText = new Subscription; /** Declare to listen if any change occured.*/
  OccText = new Subscription; /** Declare to listen if any change occured.*/
  langVal; /**Declare for getting the language value.*/
  public snackbar = new SnackBar(); /**Declare for showing the snackbar. */

  constructor(private activatedRoute: ActivatedRoute, private apiJson: ApiCallClass,
    private trackEvnt: AssessmentsService, private eventService: EventDispatchService,
    private ratingConfig: NgbRatingConfig, private router: Router, private serverApi: ServerApi,
    private storageService: StorageService, private store: Store<AsmntCommonState>,
    private dispatchStore: Store<Action>, private OCCPageStateStore: Store<OCCPageState>,
    private occStore: Store<OccIndexCommonState>, private utils: Utilities
  ) {
    this.langVal = this.storageService.sessionStorageGet('langset');
    this.dispatchStore.dispatch({ type: "RESET_OccSettingsText" });
    this.dispatchStore.dispatch({ type: "RESET_OCC_PAGE" });
    this.subscription = eventService.listen().subscribe((e) => {
      if (e.type == 'languageChanged') {
        this.langVal = this.storageService.sessionStorageGet('langset');
        let Arr = this.router.url.split('?');
        let routArr = Arr[0].split('/');
        this.hideVal = 0;
        this.langChange = true;
        if (routArr.indexOf('occCluster') != -1) {
          this.ngOnInit()
        }
      }
    });
    this.ratingConfig.max = 1;
    let rtArr = this.router.url.split('/');
    this.occIndexReducerSub = occStore.select('OccIndexReducerText').debounceTime(1000).subscribe((v) => {
      if (this.storageService.sessionStorageGet('parentCnt') == 'true') {
        this.savedClusNames();
      }
    });
    this.OccSettingsText = store.select('OccSettingsText').subscribe((v) => {
      this.clussettingsText = v;
      this.hideLoadingSymbol();
    });
    this.OccText = store.select('OccText').subscribe((v) => {
      if (this.langChange == true) {
        this.occClusterText = v;
      }
    });
    this.occClusterStore = OCCPageStateStore.select('OccPageText');
    if (this.storageService.sessionStorageGet('inTab') != undefined || this.storageService.sessionStorageGet('inTab') != null) {
      if (this.storageService.sessionStorageGet('inTab') == 'Assess' || this.storageService.sessionStorageGet('inTab') == 'cciAssess'
        || this.storageService.sessionStorageGet('inTab') == 'osAssess') {
        this.backAssessmentValue = true;
      }
      else {
        this.backAssessmentValue = false;
      }
    }
  }
  savedClusNames() {
    let val = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText'));
    let value = true;
    val.commonText.clusList.forEach((v) => {
      if ((v.clusterID == this.clusterID) && value == true) {
        this.clusterName = (v.title);
      }
    });
  }
  /**
	 * This method is used to get into Occ Cluster component.
	 */
  ngOnInit() {
    this.utils.showLoading();

    this.activatedRoute.queryParams.subscribe(params => {
      /** Defaults to 0 if no query param provided.*/
      this.clusterID = params['clusId'];
      // this.nameTxt = 'cls_' + this.clusterID;
      this.clusterIcon = params['clusIcon'];
      this.clusterColor = params['clusColor'];
    });
    this.savedClusNames();
    this.accountID = this.utils.getAccountId();
    this.dispatchStore.dispatch({
      type: "GET_ASMNT_COMMON_TEXT", payload: {
        methodVal: 'GET', module_Name: 'Occ/v1/',
        path_params: ["cluster", this.clusterID, this.accountID], query_params: {
          "sections": "all", "lang": this.langVal
        },
        body_Params: {}, endUrlVal: 'pages', setVal: 'clusterPageResult', text: ''
      }
    });
    let endVal
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
    this.getRating();
    this.refGlance['iconName'] = this.clusterIcon;
    this.refGlance['clusterColor'] = this.clusterColor;
    this.refrelatedcareer['clusterIcon'] = this.clusterIcon;
    this.refrelatedcareer['clusterColor'] = this.clusterColor;
  }

  /**
   * This method is used for hiding the loading symbole after getting the entire data.
   */
  hideLoadingSymbol() {
    if (this.clusterName != undefined && (this.clussettingsText != undefined)) {
      if ((this.clussettingsText.commonText.topSections != undefined)) {
        let ref = this;
        setTimeout(function () {
          ref.utils.hideLoading();
        }, 500);
      }
    }
  }

  /**
   * This method is used to get the cluster rating.
   */
  getRating() {
    try {
      this.apiJson.method = "GET";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let getThumbsResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accountID, "ratings", this.clusterID]
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
          this.getText();
        }
      }, this.utils.handleError);
    }
    catch (e) {
      console.log("Cluster header rating error-->" + e.message);
    }
  }

  /**
   * 
   * @param thumbVal is used to indicate the thumb value.
   */
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
  resultPost() {
    setTimeout(function () {
      this.apiJson.method = "POST";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let starResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accountID, "ratings", this.clusterID, this.showColorUp]
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
          this.starRes = this.showColorUp;
          this.getRating();
        }

      }, this.utils.handleError);
    }.bind(this));
  }
  /**
   * This method is  for getting the text from the store and display.
   */
  getText() {
    if (this.langChange == false) {
      let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
      if (val.commonText.common != undefined) {
        this.occClusterText = val;
      }
    }
    this.dispatchStore.dispatch({
      type: "OCC_SETTING_TEXT", payload: {
        methodVal: 'GET', module_Name: 'Settings/v1/',
        path_params: [this.accountID], query_params: { "lang": this.langVal },
        body_Params: {}, endUrlVal: 'occ/cluster'
      }
    });
  }

  /**
   * This method is used in the mobile view dropdown.
   * @param name is for storing the tab value.
   * @param num is for storing the index value.
   */
  dropDownVal(name, num) {
    this.value = name;
    this.activeVal = num;
  }
  /** This function is for posting the data when user gives the StarRating */
  starPost() {
    try {
      setTimeout(function () {
        this.apiJson.method = "POST";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = "Occ/v1/";
        let starResult = {
          input_data: [
            {
              "param_type": "path",
              "params": [this.accountID, "ratings", this.clusterID, this.currentRate]
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
            this.starRes = this.currentRate;
          }
          else {
          }
        }, this.utils.handleError);
      }.bind(this));
    }
    catch (e) {
      console.log("Star rating post call error-->" + e.message);
    }
  }
  /** This function is for saving the data as favorites */
  savePost() {
    try {
      this.utils.showLoading();
      this.apiJson.method = "POST";
      this.apiJson.sessionID = this.utils.getAuthKey();
      this.apiJson.moduleName = "Occ/v1/";
      let saveResult = {
        input_data: [
          {
            "param_type": "path",
            "params": [this.accountID, "favorites", this.clusterID]
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
    catch (e) {
      console.log("Saving as a favorite error-->" + e.message);
    }
  }
  /**
   * 
   * @param check is used for checking from which career we came from.
   */
  CareerList(check) {
    // this.utils.showLoading();
    this.storageService.sessionStorageSet('careerShow', '1');
    this.router.navigate(['../occIndex'], { relativeTo: this.activatedRoute, queryParams: { chk: check } });
  }
  /**
   * This method is for navigating to the occlist page.
   */
  backAssessment() {
    if (this.storageService.sessionStorageGet('inTab') != 'cciAssess' && this.storageService.sessionStorageGet('inTab') != 'osAssess') {
      this.router.navigate(['../occlist'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['../result'], { relativeTo: this.activatedRoute });
    }
  }

  /** 
   * This ngOnDestroy() function is call after Component destory.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.occIndexReducerSub.unsubscribe();
    this.OccSettingsText.unsubscribe();
    this.OccText.unsubscribe();
  }
}

