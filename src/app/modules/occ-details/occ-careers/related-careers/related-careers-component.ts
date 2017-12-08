/**Angular Libraries **/
import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Services **/
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";

@Component({
  selector: 'related-careers',
  templateUrl: './related-careers-layout.html',
})

export class RelatedCareersComponent implements OnInit, OnDestroy {
  @Output() changeViewRelate = new EventEmitter();
  showMilataryCareer = false; /** Show and hide milatary career */
  occCareerStore; /** Is a variable that is used to store data coming from reducer */
  occSettingsSub = new Subscription;
  occPageSub = new Subscription;
  settingsTextTab;
  settingsText /** Is a variable that is used to store data coming from reducer */

  constructor(private router: Router, private utils: Utilities, private activatedRoute: ActivatedRoute,
    private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>,
    private eventService: EventDispatchService) {

    // Get data from reducer to show tab names and to check sections are available or not etc.,
    this.occSettingsSub = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 6) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));
      }
    });
    // Get data from reducer to display in cards
    this.occPageSub = OCCPageStateStore.select('OccPageText').subscribe((v) => {
      this.occCareerStore = v;
      if (this.occCareerStore.RelatedMilitary != undefined) {
        if (this.occCareerStore.RelatedMilitary.length != 0) {
          this.showMilataryCareer = true;
        } else {
          this.showMilataryCareer = false;
        }
      }
    });
  }
  ngOnInit() {
  }
  /** this ngOnDestroy() function is call after Component destory */
  ngOnDestroy() {
    //unsubscribe all the subscritions
    this.occSettingsSub.unsubscribe();
    this.occPageSub.unsubscribe();
  }
  //Redirects to respective career page
  CallOccDetailCareer(id, name) {
    let twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name, clusIcon: this.occCareerStore.ParentCluster.parentClusterIcon, clusColor: (this.occCareerStore).ParentCluster.parentClusterColor } });
    }
    else {
      let occArray = [id, name]
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
      this.utils.showLoading();
      setTimeout(function () {
        let evnt = document.createEvent("CustomEvent");
        evnt.initEvent("relatedDispatch", true, true);
        this.eventService.dispatch(evnt);
      }.bind(this), 100);
    }

  }

  //Redirects to respective cluster page
  CallOccDetailCluster(clusId, ClusName) {
    let clusterIcon = this.occCareerStore.ParentCluster.parentClusterIcon;
    this.router.navigate(['../occCluster'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        clusId: clusId, clusName: ClusName, clusIcon: clusterIcon,
        clusColor: (this.occCareerStore).ParentCluster.parentClusterColor
      }
    });
  }
}