import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { ReflectionComponent } from '../shared/reflection.component';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CareerGoals } from '../career-goals/career-goals.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';


@Component({
    selector: 'career-goals',
    templateUrl: './career-goals.layout.html',
})

export class CareerGoalsComponent implements OnInit {
    @Input('report-status') report = "";
    // @Output() changeInrView = new EventEmitter();
    @Output() containResult = new EventEmitter();
    @ViewChild(ReflectionComponent) public ReflectionComponent: ReflectionComponent;
    sectionObject;
    questionObject;
    section = "CareerGoals";
    field = "CareerGoals";
    constructor(private apiService: ServerApi, private apiJson: ApiCallClass, private utils: Utilities,
        private plpShared: PLPSharedService, private careerGoals: CareerGoals, fb: FormBuilder) {

    }
    ngOnInit() {
        // this.changeInrView.emit(this.section);
        this.sectionObject = this.plpShared.getSectionObject(this.section);
        this.questionObject = this.plpShared.getQuestion(this.section);
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");

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
    // changeView(evnt) {
    //     this.changeInrView.emit(evnt);
    // }
    // changeFilledStatus(evnt) {
    //     // alert("evnt--"+evnt.section);
    //     // alert("evnt--"+(evnt.result == "empty"));
    //     // this.containResult.emit(evnt);
    //     if(evnt.result == "filled"){
    //         this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
    //     }
    //     else if(evnt.result == "empty"){
    //         this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
    //     }
    //     // 
    // }

    changesMade() {
        return this.ReflectionComponent.changesMade(this.section);
    }

    savedDataAssigning() {
        this.ReflectionComponent.savedDataAssigning(this.section);
    }

}
