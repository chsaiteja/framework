/**Angular Libraries **/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs/Subscription";

/**Services **/
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";
import { StorageService } from '../../../../shared/outer-services/storage.service';


@Component({
  selector: 'at-a-glance',
  templateUrl: './at-a-glance-layout.html',
})

export class AtAGlanceComponent implements OnInit, OnDestroy {
  occCareerStore; /** Is a variable that is used to store data coming from reducer */
  occSettingsSub = new Subscription;
  occPageSub = new Subscription;
  eduIcon = ['icon-education-level-1', 'icon-education-level-2', 'icon-education-level-3', 'icon-education-level-4', 'icon-education-level-5'];
  settingsText; /** Is a variable that is used to store data coming from reducer */
  occCareerText; /** Is a variable that is used to store data coming from reducer */
  settingsTextTab;
  constructor(private router: Router, private storageService: StorageService, private eventService: EventDispatchService, private activatedRoute: ActivatedRoute,
    private utils: Utilities, private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>) {
    // Get data from reducer to display buttons text
    this.occCareerText = store.select('OccText');
    // Get data from reducer to show tab names and to check sections are available or not etc.,
    this.occSettingsSub = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 0) {
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
  ngOnDestroy() {
    //unsubscribe all the subscritions
    this.occSettingsSub.unsubscribe();
    this.occPageSub.unsubscribe();
  }
  //When user click on card respective events are emmited
  callPage(page) {
    if (page == 'wage') {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("callWagePage", true, true);
      this.eventService.dispatch(evnt);
    } else if (page == 'outlook') {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("callOutlookPage", true, true);
      this.eventService.dispatch(evnt);
    } else if (page == 'edu') {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("calleduPage", true, true);
      this.eventService.dispatch(evnt);
    } else if (page == 'job_Setting') {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("job_Setting", true, true);
      this.eventService.dispatch(evnt);
    } else if (page == 'job_Task') {
      let evnt = document.createEvent("CustomEvent");
      evnt.initEvent("job_Task", true, true);
      this.eventService.dispatch(evnt);
    }
  }
  //Redirect to cluster page
  workplaceRedirect(id, name, icon, color) {
    this.router.navigate(['../occCluster'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        clusId: id, clusName: name, clusIcon: icon,
        clusColor: color
      }
    });
  }
}