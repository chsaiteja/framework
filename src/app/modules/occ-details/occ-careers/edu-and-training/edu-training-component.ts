/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs/Subscription";

/**Services **/
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";

@Component({
  selector: 'edu-and-traninig',
  templateUrl: './edu-training.layout.html',
})

export class EduTrainingComponent implements OnDestroy, OnInit {
  expandCard = 9; /** A variable to tell which card to open first */
  occSettingsSub = new Subscription;
  occPageSub = new Subscription;
  abilityRes = [];/** Contain related program text */
  occCareerStore; /** Is a variable that is used to store data coming from reducer */
  settingsText; /** Is a variable that is used to store data coming from reducer */
  settingsTextTab;
  LicenCertificate; /** it if for displaying LicenCertificate card */
  constructor(private router: Router, private utils: Utilities,
    private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>) {
    // Get data from reducer to show tab names and to check sections are available or not etc.,
    this.occSettingsSub = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 4) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));
      }
    });
    // Get data from reducer to display in cards
    this.occPageSub = OCCPageStateStore.select('OccPageText').subscribe((v) => {
      this.occCareerStore = v;
      if (this.occCareerStore.RelatedPrograms != null) {
        this.abilityRes.push(this.occCareerStore.RelatedPrograms);
      }
      let val = []
      val = this.occCareerStore.LicensingCert;
      if (val != undefined) {
        this.LicenCertificate = val.length;
      }
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    //unsubscribe all the subscritions
    this.occSettingsSub.unsubscribe();
    this.occPageSub.unsubscribe();
  }
  /** Called when a card is clicked to open or close */
  methodfilter(valfil) {
    this.expandCard = valfil;
  }
}