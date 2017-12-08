import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AsmntCommonState, OCCPageState } from '../../../../state-management/state/main-state';

@Component({
  selector: 'related-careers-cluster',
  templateUrl: './related-careers-layout.html',
})

export class RelatedCareerClusterComponent implements OnInit, OnDestroy {
  occClusterStore; /**Declare for storing the cluster text from store.*/
  settingsTextTab; /**Declare for storing the tab values from store.*/
  settingsText; /**Declare for storing the section names from store.*/
  OccSettingsText = new Subscription;  /** Declare to listen if any change occured.*/

  @Input('relatedcareersData') relatedcareersData: any = {};
  constructor(private activatedRoute: ActivatedRoute, private eventService: EventDispatchService,
    private router: Router, private store: Store<AsmntCommonState>, private OCCPageStateStore:
      Store<OCCPageState>) {
    this.relatedcareersData['RelatedCareers'] = { 'lists': [] };
    this.occClusterStore = OCCPageStateStore.select('OccPageText');
    this.OccSettingsText = store.select('OccSettingsText').subscribe((v) => {
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
  }

  ngOnInit() {
  }

  /**
   * This method is for navigating from cluster to the career.
   * @param id is for storing the careerID.
   * @param name is for storing the cluster name.
   */
  CallOccDetailCareer(id, name) {
    const twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          occid: id, occname: name, clusIcon: this.relatedcareersData['clusterIcon'],
          clusColor: this.relatedcareersData['clusterColor']
        }
      });
    }
    else {
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }
  }

  /**
     * This ngOnDestroy() function is call after Component destory.
     */
  ngOnDestroy() {
    this.OccSettingsText.unsubscribe();
  }
}


