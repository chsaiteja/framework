import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';

import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { ReflectionComponent } from '../shared/reflection.component';
import { SupportNetworkModel } from './support-network.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'support-network',
  templateUrl: './support-network.layout.html',

})
export class SupportNetworkComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();
  @ViewChild(ReflectionComponent) public ReflectionComponent: ReflectionComponent;
  supportNetworkData: SupportNetworkModel[];

  sectionObject;
  questionObject;
  section = "SupportNetwork";
  field = "Network";

  constructor(private apiService: ServerApi, private apiJson: ApiCallClass, private utils: Utilities,
    private plpShared: PLPSharedService, fb: FormBuilder) {

  }


  ngOnInit() {
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.questionObject = this.plpShared.getQuestion(this.section);
  }
  saveChanges() {
    return this.ReflectionComponent.changesMade(this.section);
    // return true;
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event: any) {

    let change = this.saveChanges();
    if (change) {
      $event.returnValue = 'Your data will be lost!';
    }
  }
  //   changeView(evnt) {
  //   //  this.changeInrView.emit(evnt);

  //  if(evnt.result == "filled"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
  //         }
  //         else if(evnt.result == "empty"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");

  //  }
  //   }

  changeFilledStatus(evnt) {
    this.containResult.emit(evnt);
  }

  savedDataAssigning() {
    this.ReflectionComponent.savedDataAssigning(this.section);
  }

  changesMade() {
    return this.ReflectionComponent.changesMade(this.section);
  }
}
