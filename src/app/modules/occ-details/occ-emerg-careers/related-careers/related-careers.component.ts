/**import angular packages*/
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**custom imports */
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";
import { clusterDetails } from '../../../assessments/shared/constants/assessments-constants';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'related-careers-emerg',
  templateUrl: './related-careers-layout.html',
})

export class RelatedCareersEmergComponent implements OnInit, OnDestroy {
  @Input('relatedCareers') relatedCareers: any = {};
  relatedcareers; //Declare for storing the subscribe value for OccPageStateStore
  settingsTextTab; //Declare for storing the obj value of settingsText
  settingsText; //Declare for storing the value of settingsText
  showMilataryCareer = false; //Variable defaults false value
  reducerSub2 = new Subscription;
  reducerSub1 = new Subscription;
  constructor(private router: Router, private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>, private activatedRoute: ActivatedRoute, private utils: Utilities, private eventService: EventDispatchService) {

    //get the data from reducer state OCCPageStateStore
    this.reducerSub2 = OCCPageStateStore.select('OccPageText').subscribe((v) => {
      this.relatedcareers = v;
      if (this.relatedcareers.RelatedMilitary != undefined) {
        if (this.relatedcareers.RelatedMilitary.length != 0) {
          this.showMilataryCareer = true;
        } else {
          this.showMilataryCareer = false;

        }
      }
    });

    //get the data from state store
    this.reducerSub1 = store.select('OccSettingsText').subscribe((v) => {
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
  }

  /**ngOnInit method called when initializing the component  */
  ngOnInit() {

  }

  /**ngOnDestroy method called when destroying the component */
  ngOnDestroy() {
    this.reducerSub2.unsubscribe();
    this.reducerSub1.unsubscribe();
  }

  /**CallOccDetailCareer method for clicking list links in careers div */
  CallOccDetailCareer(id, name, clusterIcon, clusterColor) {
    let twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name, clusIcon: clusterIcon, clusColor: clusterColor } });
      setTimeout(function () {
        let evnt = document.createEvent("CustomEvent");
        evnt.initEvent("relatedEmergingDispatch", true, true);
        this.eventService.dispatch(evnt);
      }.bind(this), 100);

    }
    else {
      this.router.navigate(['../occCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
    }
  }

  /**CallOccDetailCluster method for clicking links in clusters div */
  CallOccDetailCluster(clusId, ClusName, clusterIcon, clusterColor) {
    this.utils.showLoading();
    this.router.navigate(['../occCluster'], {
      relativeTo: this.activatedRoute,
      queryParams: { clusId: clusId, clusName: ClusName, clusIcon: clusterIcon, clusColor: clusterColor }
    });
  }
}