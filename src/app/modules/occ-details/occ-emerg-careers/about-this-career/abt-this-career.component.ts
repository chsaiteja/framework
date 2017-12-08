/**Import angular packages */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**custom imports  */
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";
import { StorageService } from '../../../../shared/outer-services/storage.service';

@Component({
  selector: 'about-this-career',
  templateUrl: './abt-this.layout.html',
})

export class AboutThisComponent implements OnInit, OnDestroy {

  @Input() aboutJsonValue: any = [];
  aboutthiscareer; //Declare for storing the OccPageText state
  aboutText; //Declare for storing the OccText state
  settingsTextTab; //Declare for obj value of settingsText state
  settingsText; //Declare for storing the value of OccSettingsText state

  subscription = new Subscription;
  occTextSettings = new Subscription;
  constructor(private store: Store<AsmntCommonState>, private storageService: StorageService, private OCCPageStateStore: Store<OCCPageState>) {
    this.aboutthiscareer = store.select('OccPageText');
    this.aboutText = store.select('OccText');
    this.occTextSettings = store.select('OccSettingsText').subscribe((v) => {
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
  }
  /**ngOnInit method called when initializing the component*/
  ngOnInit() {
    let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
    if (val.commonText.common != undefined) {
      this.aboutText = val;
    }

  }
  /**ngOnDestroy method called when destroying the component */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.occTextSettings.unsubscribe();
  }
}