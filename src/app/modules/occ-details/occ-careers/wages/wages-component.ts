/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, Action } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Services **/
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";

@Component({
  selector: 'wages',
  templateUrl: './wages-layout.html',
})

export class WagesComponent implements OnInit, OnDestroy {
  selectedStates = ['US']; /** Contains user selected state, by default US */
  duplicateState = ['US'] /** clone variable for selected states, used when displaying states  */
  displayValue = 1; /** Based on this we will apply disable property to the list */
  wagestabs = { 'annual': 'Annual Wages', 'monthly': 'Monthly Wages', 'hourly': 'Hourly Wages' }
  occCareerText; /** Is a variable that is used to store data coming from reducer */
  settingsText; /** Is a variable that is used to store data coming from reducer */
  occTextSub = new Subscription;
  occSettingsSub = new Subscription;
  occPageSub = new Subscription;
  occCareerStore; /** Is a variable that is used to store data coming from reducer */
  langVal; /** To get the value of language */
  settingsTextTab;
  loc_btn_color = ["#a22903", "#005787", "#1b621e", "#014941", "#770c84"];

  constructor(private router: Router, private utils: Utilities, private storageService: StorageService,
    private store: Store<AsmntCommonState>, private dispatchStore: Store<Action>, private OCCPageStateStore: Store<OCCPageState>) {

    /** Get user selected languge */
    this.langVal = this.storageService.sessionStorageGet('langset');
    /** Check whether user selected states while reloading, 
    * if he selected place that states in selected variables,
    * if not default values are inserted
    */
    if (this.storageService.sessionStorageGet('wagesStates') != undefined || this.storageService.sessionStorageGet('wagesStates') != null) {
      let arr = this.storageService.sessionStorageGet('wagesStates').split(',');
      this.duplicateState = arr;
      this.selectedStates = arr;
    }
    else {
      this.selectedStates = ['US'];
      this.duplicateState = ['US'];
    }
    // Get data from reducer to display buttons text
    this.occTextSub = store.select('OccText').subscribe((v) => {
      this.occCareerText = v;
    });
    // Get data from reducer to show tab names and to check sections are available or not etc.,
    this.occSettingsSub = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 2) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));
      }
    });
    // Get data from reducer to display in cards

    this.occPageSub = OCCPageStateStore.select('OccPageText').subscribe((v) => {
      this.occCareerStore = v;
    });
  }
  ngOnInit() {
    let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
    if (val.commonText.common != undefined) {
      this.occCareerText = val;
    }
  }
  /** this ngOnDestroy() function is call after Component destory */
  ngOnDestroy() {
    //unsubscribe all the subscritions
    this.occTextSub.unsubscribe();
    this.occSettingsSub.unsubscribe();
    this.occPageSub.unsubscribe();
  }
  //To keep href dynamically
  value(checkVal) {
    return '#' + checkVal;
  }

  checkopen() {
    //Works when we click on selectStates button 
    this.duplicateState = [];
    for (let i = 0; i < this.selectedStates.length; i++) {
      this.duplicateState.push(this.selectedStates[i]);
    }
    this.displayValue = this.selectedStates.length;
  }
  showStates() {
    //Works when we click on Apply button 
    let states;
    this.selectedStates = this.duplicateState;
    if (this.duplicateState[0] != '') {
      this.utils.showLoading();
      states = this.duplicateState;
    }
    else {
      states = ["''"];
    }
    this.storageService.sessionStorageSet('wagesStates', states);
    let routerVal = this.router.url.split('&');
    let occID = routerVal[0].split('=');

    let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
    if (val.commonText.common != undefined) {
      this.occCareerText = val;
    }
    // }
    this.dispatchStore.dispatch({
      type: "OCC_SETTING_TEXT", payload: {
        methodVal: 'GET', module_Name: 'Settings/v1/',
        path_params: [this.utils.getAccountId()], query_params: { "lang": this.langVal },
        body_Params: {}, endUrlVal: 'occ/standard', name: 'careers'
      }
    });
    this.dispatchStore.dispatch({
      type: "WAGES_TEXT", payload: {
        methodVal: 'GET', module_Name: 'Occ/v1/',
        path_params: ["occ", parseInt(occID[1]), this.utils.getAccountId()], query_params: { "sections": "WageLevels", "states": states, "lang": this.storageService.sessionStorageGet('langset') },
        body_Params: {}, endUrlVal: 'pages'
      }
    });

  }

  count(val, e) {
    //Works when we click on check box 
    if (this.selectedStates[0] == '') {
      this.selectedStates = [];
      this.duplicateState = [];
    }
    if (e.which == 13 || e == "click") {
      if (this.duplicateState.indexOf(val) == -1) {
        this.duplicateState.push(val);
      }
      else if (this.duplicateState.indexOf(val) != -1) {
        this.duplicateState.splice(this.duplicateState.indexOf(val), 1);
      }
      this.displayValue = this.duplicateState.length;
      if (this.displayValue == 0) {
        this.duplicateState = [''];
        this.selectedStates = [''];
      }

    }
  }
  cancelStates() {
    //Works when we click on cancel button 
    this.duplicateState = this.selectedStates;
    this.displayValue = this.selectedStates.length;
  }
  resetStates() {
    //Works when we click on reset button 
    this.duplicateState = [''];
    this.displayValue = -1;
  }

}