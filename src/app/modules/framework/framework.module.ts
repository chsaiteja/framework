import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule, Input } from '@angular/core';
import { RouterStateSnapshot, Routes, RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { GridModule } from './grid.module';
import { FrameworkComponent } from './framework.component';


import { InterestProfilerShComponent } from '../assessments/interest-profiler-sf/interest-profiler-sf.component';
import { IPSFIntroComponent } from '../assessments/interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from '../assessments/interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFResultComponent } from '../assessments/interest-profiler-sf/result/ipsf-result.component';
import { IPSFRestoreComponent } from '../assessments/interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFOccListComponent } from '../assessments/interest-profiler-sf/occlist/ipsf-occ-list.component';

import { StaticHeaderComponent } from '../assessments/shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../assessments/shared/assessment-header/assessment-header.component';

import { ApiCallClass } from '../../shared/modal/apicall.modal';
import { ServerApi } from '../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../shared/outer-services/utilities.service';

import { AssessmentsService } from '../assessments/shared/services/assessments.service';

import { SharedModule } from '../../shared/shared-module';

import { OccupationListComponent } from '../assessments/shared/occupation-list/occupation-list.component';

const routes: Routes = [
    { path: '', component: FrameworkComponent }
];


@NgModule({
    imports: [
        GridModule, NgbModule, RouterModule,
        SharedModule, CommonModule, NgbModule, ReactiveFormsModule],
    declarations: [FrameworkComponent],
    providers: [AssessmentsService, ApiCallClass, ServerApi, Utilities],
    entryComponents: [FrameworkComponent]

})

export class FrameworkModule {
}
