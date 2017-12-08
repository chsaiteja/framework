/**Angular imports */
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**Services */
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { AsmntCommonState, OCCPageState } from '../../../../state-management/state/main-state';

@Component({
  selector: 'at-a-glance-cluster',
  templateUrl: './at-a-glance-layout.html',
})

export class AtAGlanceClusterComponent implements OnInit, OnDestroy {
  clusterID = ""; /**Declare for storing ClusterID.*/
  clusterName; /**Declare for storing text from the store.*/
  // nameTxt; /**Declare for storing the lang text*/
  occClusterStore; /**Declare for storing the cluster text from store.*/
  OccSettingsText = new Subscription; /** Declare to listen if any change occured.*/
  settingsText; /**Declare for storing the section names from store.*/
  settingsTextTab; /**Declare for storing the tab values from store.*/

  @Input() atAGlance: any = [];
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private storageService: StorageService, private store: Store<AsmntCommonState>,
    private OCCPageStateStore: Store<OCCPageState>, private utils: Utilities) {
    OCCPageStateStore.select('OccPageText').subscribe((v) => {
      this.occClusterStore = v;
    });

    this.OccSettingsText = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;
      if (this.settingsText.commonText.tabs != null && this.settingsText.commonText.tabs != undefined) {
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          let ref = this;
          if (obj['tabId'] == 0) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));
        let val = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText'));
        let value = true;
        val.commonText.clusList.forEach((v) => {
          if ((v.clusterID == this.clusterID) && value == true) {
            this.clusterName = (v.title);
          }
        });
      }
    });
  }

  /**
  * This method is used to get into At a glance component.
  */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      /**
       * Defaults to 0 if no query param provided.
       * */
      this.clusterID = params['clusId'];
      // this.nameTxt = 'cls_' + this.clusterID;
      this.storageService.sessionStorageSet('cciClus_ID', params['clusId']);
      this.storageService.sessionStorageSet('cciClusIcon', params['clusIcon']);
      this.storageService.sessionStorageSet('cciclusColor', params['clusColor']);
    });
  }

  /**
   * This method is for navigating from cluster to the assessment.
   * @param taken is to check wheather the assessment is taken or not.
   */
  goToCCI(taken) {
    let navVal, navTo;
    const vl = JSON.parse(this.storageService.sessionStorageGet('loginFrameworkConfiguration')).config.Result.tabItems;
    for (let i = 0; i < vl.length; i++) {
      const list = vl[i].compList;
      for (let j = 0; j < list.length; j++) {
        const id = list[j].compId;
        if (id == 'sortCCIJr') {
          navVal = i;
          this.storageService.sessionStorageSet('CCIassessment', 'CCIJr');
          this.storageService.sessionStorageSet('assessmentheader', JSON.stringify(id));
          navTo = 'cciJr';
          break;
        } else if (id == 'sortCCIAdult') {
          navVal = i;
          this.storageService.sessionStorageSet('CCIassessment', 'CCIAdult');
          this.storageService.sessionStorageSet('assessmentheader', JSON.stringify(id));
          navTo = 'cciAdult';
          break;
        }
      }
    }

    if (taken == true) {
      this.storageService.sessionStorageSet('inTab', 'cciCareer');
      this.storageService.sessionStorageSet('CCIjrResult', JSON.stringify(this.occClusterStore.CCIScore.clusters));
      const navigate = '../../../' + navVal + '/' + navTo + '/result'
      this.router.navigate([navigate], { relativeTo: this.activatedRoute });
    }
    else if (taken == false) {
      const navigate = '../../../' + navVal + '/' + navTo + '/intro'
      this.router.navigate([navigate], { relativeTo: this.activatedRoute });
    }
  }

  /**
   * This method is for navigating from cluster to career.
   * @param id for storing the occID.
   * @param name for storing the occ name.
   * @param clusterIcon for storing the clusterIcon.
   * @param clusterColor for storing the clusterColor.
   */
  CallOccDetailCareer(id, name, clusterIcon, clusterColor) {
    const twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], {
        relativeTo: this.activatedRoute,
        queryParams: { occid: id, occname: name, clusIcon: clusterIcon, clusColor: clusterColor }
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

