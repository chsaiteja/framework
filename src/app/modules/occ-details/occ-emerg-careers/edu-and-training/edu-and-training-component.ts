/**import angular core packages */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

/**custom imports */
import { AsmntCommonState, OCCPageState } from "../../../../state-management/state/main-state";
import { StorageService } from '../../../../shared/outer-services/storage.service';

@Component({
  selector: 'edu-and-training-emerg',
  templateUrl: './edu-and-training-layout.html',
})

export class EduTrainingEmergComponent implements OnInit, OnDestroy {
  @Input() educationTraining: any = [];
  filter = 1; //Declare for assigning the value of valfil variable
  eduandtraining; //Declare for assigning the value of OccPageText state
  eduText; //Declare for assigning the value of OccText state
  settingsText; //Declare for assigning the subscribe value of OccsettingsText state
  settingsTextTab; //Declare for assigning the obj of settingsText
  subscription = new Subscription;
  occTextSettings = new Subscription;
  constructor(private store: Store<AsmntCommonState>, private storageService: StorageService, private OCCPageStateStore: Store<OCCPageState>) {
    //get the data from reducer states.
    this.eduandtraining = OCCPageStateStore.select('OccPageText');
    this.eduText = store.select('OccText');
    this.occTextSettings = store.select('OccSettingsText').subscribe((v) => {
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

  /**ngOnInit method is called when initializing the component */
  ngOnInit() {
    let val = JSON.parse(this.storageService.sessionStorageGet('Reducer_OccText'));
    if (val.commonText.common != undefined) {
      this.eduText = val;
    }
  }

  /**ngOnDestroy method is called when destroying the component */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.occTextSettings.unsubscribe();
  }

  /**methodfilter is for expandable and collapsible of divs */
  methodfilter(valfil) {
    this.filter = valfil;

  }
}