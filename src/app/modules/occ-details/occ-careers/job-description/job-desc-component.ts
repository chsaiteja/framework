/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Services **/
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service'
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";

@Component({
  selector: 'job-description',
  templateUrl: './job-desc-layout.html',
})

export class JobDescriptionComponent implements OnInit, OnDestroy {
  expandCard = 1; /** A variable to tell which card to open first */
  settingsText; /** Is a variable that is used to store data coming from reducer */
  occCareerStore; /** Is a variable that is used to store data coming from reducer */
  eventSub = new Subscription;
  occSettingsSub = new Subscription;
  settingsTextTab;
  constructor(private router: Router, private utils: Utilities,
    private eventService: EventDispatchService,
    private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>, ) {
    // Subsribing an event, when job task or setting was clicked in at-a-glance
    this.eventSub = eventService.listen().subscribe((e) => {
      if (e.type == 'job_Setting') {
        this.expandCard = 2;
      } else if (e.type == 'job_Task') {
        this.expandCard = 5;
      }
    });
    // Get data from reducer to show tab names and to check sections are available or not etc.,
    this.occSettingsSub = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 1) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));
      }
    });
    // Get data from reducer to display in cards
    this.occCareerStore = OCCPageStateStore.select('OccPageText');
  }
  ngOnInit() {
  }
  /** Called when a card is clicked to open or close */
  methodfilter(valfil) {
    this.expandCard = valfil;
  }
  /** this ngOnDestroy() function is call after Component destory */
  ngOnDestroy() {
    //unsubscribe all the subscritions
    this.occSettingsSub.unsubscribe();
    this.eventSub.unsubscribe();
  }
}