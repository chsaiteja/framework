import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActionPlanModel } from './action-plan.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { ReflectionComponent } from '../shared/reflection.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'action-plan',
  templateUrl: './action-plan.layout.html',
})

export class ActionPlanComponent {
  @Input('report-status') report = "";
  // @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();
  @ViewChild(ReflectionComponent) public ReflectionComponent: ReflectionComponent;
  actionPlanData: ActionPlanModel[];
  sectionObject;
  questionObject;
  section = "ActionPlan";
  field = "ActionPlan";

  constructor(private apiService: ServerApi,
    private apiJson: ApiCallClass,
    private plpShared: PLPSharedService,
    private utils: Utilities,
    fb: FormBuilder) {

  }

  ngOnInit() {
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.questionObject = this.plpShared.getQuestion(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
  }
  // changeView(evnt) {
  //   this.changeInrView.emit(evnt);
  // }

  // changeFilledStatus(evnt) {
  //   //this.containResult.emit(evnt);
  //   if(evnt.result == "filled"){
  //           this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
  //       }
  //       else if(evnt.result == "empty"){
  //           this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
  //       }
  // }

  savedDataAssigning() {
    this.ReflectionComponent.savedDataAssigning(this.section);
  }


  changesMade() {
    return this.ReflectionComponent.changesMade(this.section);
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
}
