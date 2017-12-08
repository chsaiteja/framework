import { Component, Input, OnDestroy, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AsmntCommonState, OCCPageState } from '../../../../state-management/state/main-state';

@Component({
  selector: 'pathways',
  templateUrl: './pathways-layout.html',
})

export class PathwaysComponent implements OnInit, OnDestroy {
  filter; /**Declare for storing the index value */
  highlightedDiv: number; /**Declare for storing the number value. */
  occClusterStore; /**Declare for storing the cluster text from store.*/
  showId = false; /**Declare for storing the booleanvalue */
  settingsTextTab;  /**Declare for storing the tab values from store.*/
  settingsText;  /**Declare for storing the section names from store.*/

  @Input('pathwaysData') pathwaysData = { 'Pathways': [] };
  dom: BrowserDomAdapter;
  reducerSub1 = new Subscription;
  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>) {
    this.occClusterStore = OCCPageStateStore.select('OccPageText');
    this.reducerSub1 = store.select('OccSettingsText').subscribe((v) => {
      this.settingsText = v;

      if (this.settingsText.commonText.tabs != null &&
        this.settingsText.commonText.tabs != undefined) {
        let ref = this;
        this.settingsText.commonText.tabs.forEach(function (obj, inx) {
          if (obj['tabId'] == 3) {
            ref.settingsTextTab = obj;
          }
        }.bind(this));

      }
    });
  }
  ngOnInit() {
  }

  /**
   * 
   * @param valfil is for storing the value.
   * @param indexval is for storing the index value.
   * @param newValue isfor storing the number value.
   */
  methodfilter(valfil, indexval, newValue: number) {
    this.filter = valfil;
    this.showId = indexval;
    if (this.highlightedDiv === newValue) {
      this.highlightedDiv = 0;
    }
    else {
      this.highlightedDiv = newValue;
    }
  }

  /**
   * This method is for navigating from cluster to the career.
   * @param id is for storing the occcareer id.
   * @param nameis for storing the occcareer name.
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
    this.reducerSub1.unsubscribe();
  }
}
