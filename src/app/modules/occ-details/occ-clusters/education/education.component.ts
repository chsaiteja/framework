import { ActivatedRoute, Params, Router } from '@angular/router';
import { AsmntCommonState, OCCPageState } from '../../../../state-management/state/main-state';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

@Component({
  selector: 'education',
  templateUrl: './education-layout.html'
})

export class EducationComponent implements OnInit, OnDestroy {
  occClusterStore; /**Declare for storing the cluster text from store.*/
  OccSettingsText = new Subscription; /** Declare to listen if any change occured.*/
  settingsText; /**Declare for storing the section names from store.*/
  settingsTextTab; /**Declare for storing the tab values from store.*/

  @Input('educationData') educationData: any = {};
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>) {

    this.educationData['RelatedPrograms'] = { 'lists': [] };
    this.occClusterStore = OCCPageStateStore.select('OccPageText');
    this.OccSettingsText = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;

      if (this.settingsText.commonText.tabs != null &&
        this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 2) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));

      }
    });
  }

  ngOnInit() {

  }
  /**
   * This method is for navigating from cluster to career.
   * @param id is for storing occid.
   * @param name is for storing occcareername.
   */
  CallOccDetailCareer(id, name) {
    let twoDigit = id.toString().substr(0, 2);
    if (twoDigit == 14) {
      this.router.navigate(['../occEmergCareer'], { relativeTo: this.activatedRoute, queryParams: { occid: id, occname: name } });
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
