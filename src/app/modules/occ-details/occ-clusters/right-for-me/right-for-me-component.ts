import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { AsmntCommonState, OCCPageState } from '../../../../state-management/state/main-state';
@Component({
  selector: 'right-for-me',
  templateUrl: './right-for-me-layout.html',
})

export class RightForMeComponent implements OnInit, OnDestroy {
  occClusterStore; /**Declare for storing the cluster text from store.*/
  OccSettingsText = new Subscription;  /** Declare to listen if any change occured.*/
  settingsText; /**Declare for storing the section names from store.*/
  settingsTextTab; /**Declare for storing the tab values from store.*/

  @Input() rightForMeData: any = {};
  constructor(private store: Store<AsmntCommonState>, private OCCPageStateStore: Store<OCCPageState>) {

    this.occClusterStore = store.select('OccPageText');
    this.OccSettingsText = store.select('OccSettingsText').subscribe((v) => {
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
  }
  ngOnInit() {
  }
  /**
    * This ngOnDestroy() function is call after Component destory.
    */
  ngOnDestroy() {
    this.OccSettingsText.unsubscribe();
  }
}
