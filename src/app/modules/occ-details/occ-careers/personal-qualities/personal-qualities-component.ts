/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Services **/
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { pieLinksColors } from '../../../assessments/shared/constants/assessments-constants';
import { wilCardlinkColors } from '../../../assessments/shared/constants/assessments-constants';
import { AsmntCommonState, OCCPageState, AsmntQuestionState } from "../../../../state-management/state/main-state";

@Component({
  selector: 'personal-qualities',
  templateUrl: './personal-qualities-layout.html',
})

export class PersonalQualitiesComponent implements OnInit, OnDestroy {
  occCareerStore; /** Is a variable that is used to store data coming from reducer */
  settingsText; /** Is a variable that is used to store data coming from reducer */
  settingsTextTab;
  pieColor; /** Get IP pie chart colors */
  wilColors; /** Get WIL pie chart colors */
  wil_Areas_Res;
  asessmentValueAttended = false; /** Check whether Assessment for value is taken or not, by default false */
  occSettingsSub = new Subscription;
  occPageSub = new Subscription;
  asmntParAreaSub = new Subscription;
  asessmentInterestAttended = false; /** Check whether Assessment for interest is taken or not, by default false */

  constructor(private router: Router, private dispatchStore: Store<Action>, private utils: Utilities, private storageService: StorageService,
    private apiJson: ApiCallClass, private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>, private AsmntQuestionStore: Store<AsmntQuestionState>,
    private activatedRoute: ActivatedRoute) {
    // Get data from reducer to show tab names and to check sections are available or not etc.,
    this.occSettingsSub = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 5) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));
      }
    });
    // Get data from reducer to display in cards
    this.occPageSub = OCCPageStateStore.select('OccPageText').subscribe((v) => {
      this.occCareerStore = v;
      /** Check whether IP is taken or not, by default false */
      if (this.occCareerStore.TopInterests != undefined) {
        if (this.occCareerStore.TopInterests.taken != undefined) {
          this.asessmentInterestAttended = true;
        }
      }
      /** Check whether WIL is taken or not, by default false */
      if (this.occCareerStore.TopValues != undefined) {
        if (this.occCareerStore.TopValues.taken != undefined) {
          this.asessmentValueAttended = true;
        }
      }
    });
  }
  ngOnInit() {

    this.dispatchStore.dispatch({
      type: "GET_PARTICULAR_AREA_TEXT", payload: {
        methodVal: 'GET', module_Name: 'Assessment/v1/',
        path_params: [], query_params: { 'lang': this.storageService.sessionStorageGet('langset') },
        body_Params: {}, endUrlVal: 'wil/areas'
      }
    });
    this.pieColor = pieLinksColors;
    this.wilColors = wilCardlinkColors;
    this.asmntParAreaSub = this.AsmntQuestionStore.select('AsmntParAreaText').subscribe((res) => {
      this.wil_Areas_Res = res;
    });
  }

  /** this ngOnDestroy() function is call after Component destory */
  ngOnDestroy() {
    //unsubscribe all the subscritions
    this.occSettingsSub.unsubscribe();
    this.occPageSub.unsubscribe();
    this.asmntParAreaSub.unsubscribe();
  }
  //Takes user back to either IP or WIL based on user selection 
  backAssessment(name) {
    let navVal, navTo, id;
    let vl = JSON.parse(this.storageService.sessionStorageGet('loginFrameworkConfiguration')).config.Result.tabItems;
    for (let i = 0; i < vl.length; i++) {
      let list = vl[i].compList;
      for (let j = 0; j < list.length; j++) {
        id = list[j].compId;
        if (id == 'sortShortIP') {
          navVal = i;
          break;
        }
        else if (id == 'sortWIL') {
          navVal = i;
          break;
        }
      }
    }

    if (name == 'IP' && id == 'sortShortIP') {
      this.router.navigate(['../../../' + navVal + '/interestProfilerSf/intro'], { relativeTo: this.activatedRoute });
    }
    else if (name == 'WIL' && id == 'sortWIL') {
      this.router.navigate(['../../../' + navVal + '/wilAsessment/intro'], { relativeTo: this.activatedRoute });
    }
  }
  // Below method executes when user click on any link of top two values
  callIpResult(assessment, interest) {
    let navVal, navTo;
    let vl = JSON.parse(this.storageService.sessionStorageGet('loginFrameworkConfiguration')).config.Result.tabItems;
    this.storageService.sessionStorageSet('inTab', 'career');
    // If IP link was clicked we go to IP occlist page 
    if (assessment == 'IP') {
      this.dispatchStore.dispatch({ type: "RESET_RESULT" });
      let id;
      for (let i = 0; i < vl.length; i++) {
        let list = vl[i].compList;
        for (let j = 0; j < list.length; j++) {
          id = list[j].compId;
          if (id == 'sortShortIP') {
            navVal = i;
            this.storageService.sessionStorageSet('assessmentheader', JSON.stringify(id));
            break;
          }
        }
      }
      let ipresult = [];
      let ipresultArr = [];
      ipresult = this.occCareerStore.TopInterests.interests;
      for (let i = 0; i < ipresult.length; i++) {
        ipresultArr.push({ "interest": ipresult[i].interest.toLowerCase(), "score": ipresult[i].score });
      }
      this.storageService.sessionStorageSet("ipsfInterest", interest.toLowerCase());
      this.storageService.sessionStorageSet("resultIP", JSON.stringify(ipresultArr));
      this.router.navigate(['../../../' + navVal + '/interestProfilerSf/occlist'], { relativeTo: this.activatedRoute });
    }
    else if (assessment == 'WIL') {
      // If WIL link was clicked we go to WIL occlist page 
      let wilresultArr = [];
      if (this.wil_Areas_Res.commonIntroText.length != undefined) {
        for (let i = 0; i < vl.length; i++) {
          let list = vl[i].compList;
          for (let j = 0; j < list.length; j++) {
            let id = list[j].compId;
            if (id == 'sortWIL') {
              navVal = i;
              this.storageService.sessionStorageSet('assessmentheader', JSON.stringify(id));
              break;
            }
          }
        }
        let wilresult = [];
        wilresult = this.occCareerStore.TopValues.values;
        for (let i = 0; i < wilresult.length; i++) {
          wilresultArr.push({ "areaAbbr": wilresult[i].value.toLowerCase(), "title": wilresult[i].value, "score": wilresult[i].score, "description": "" });
        }
        this.apiJson.endUrl = 'wil/areas';
        let par = wilresultArr;
        if (this.wil_Areas_Res != '') {
          for (let i = 0; i < this.wil_Areas_Res.commonIntroText.length; i++) {
            for (let j = 0; j < par.length; j++) {
              if (par[j].title == this.wil_Areas_Res.commonIntroText[i].title) {
                par[j].description = this.wil_Areas_Res.commonIntroText[i].description;
                par[j].areaAbbr = this.wil_Areas_Res.commonIntroText[i].areaAbbr;
                wilresultArr[j].description = this.wil_Areas_Res.commonIntroText[i].description;
              }
            }
          }
        }
        this.storageService.sessionStorageSet('resultWIL', JSON.stringify(wilresultArr));
        let interests = [];
        let titleVal = [];
        let description = [];
        for (let i = 0; i < wilresultArr.length; i++) {
          if (wilresultArr[i].title == interest) {
            interests.push(wilresultArr[i].areaAbbr);
            titleVal.push(wilresultArr[i].title);
            description.push(wilresultArr[i].description)
          }
        }
        this.storageService.sessionStorageSet('titleVal', titleVal);
        this.storageService.sessionStorageSet('wilInterest', interests);
        this.storageService.sessionStorageSet('wilInterestText', description);
        let twoVal = [];
        twoVal.push(this.occCareerStore.TopValues.values[0].value);
        twoVal.push(this.occCareerStore.TopValues.values[1].value);
        this.storageService.sessionStorageSet('twoTitleVal', twoVal);
        this.router.navigate(['../../../' + navVal + '/wilAsessment/occlist'], { relativeTo: this.activatedRoute });
        this.utils.hideLoading();
      }
    }
  }
}