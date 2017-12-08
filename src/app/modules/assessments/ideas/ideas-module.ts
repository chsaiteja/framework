
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';

import { IdeasComponent } from './ideas-component';
import { IdeasIntroComponent } from './intro/ideas-intro.component';
import { IdeasAssessmentComponent } from './assessment/ideas-assessment.component';
import { IdeasResultComponent } from './result/ideas-result.component';
import { IdeasRestoreComponent } from './restore/ideas-restore.component';
import { IdeasGradeComponent } from './grades/ideas-grade.component'
import { IDEASOccListComponent } from './ideaslist/ideas-occ-list.component'

import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';


import { ApiCallClass } from '../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../shared/outer-services/utilities.service';

import { AssessmentsService } from '../shared/services/assessments.service';

import { AppSharedModule } from '../../../app.sharedmodule';

import { SharedModule } from '../../../shared/shared-module';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';
import { ActivatingClass } from '../../../shared/auth/activateGuard';
import { OccupationListComponent } from '../shared/occupation-list/occupation-list.component';
import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';
const routes: Routes = [{
    path: '', component: IdeasComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: IdeasIntroComponent },
        { path: 'assessment', component: IdeasAssessmentComponent, canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass] },//, canActivate: [ActivatingClass] },
        { path: 'result', component: IdeasResultComponent },
        { path: 'restore', component: IdeasRestoreComponent },
        { path: 'grade', component: IdeasGradeComponent, canDeactivate: [UnSavedChangesCanActive] },
        { path: 'occlist', component: IDEASOccListComponent },
        { path: 'occCareer', component: OccCareerHeaderComponent },
        { path: 'occCluster', component: OccClusterHeaderComponent },
        { path: 'occEmergCareer', component: OccEmergHeaderComponent },
        { path: 'occIndex', component: OccIndexComponent },
        { path: 'compare', component: OSCompareComponent },
    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        IdeasAssessmentComponent,
        IdeasIntroComponent,
        IdeasRestoreComponent, IdeasResultComponent,
        IdeasComponent, IdeasGradeComponent, IDEASOccListComponent
    ],
    providers: [
        /*, AssessmentsService,
        SharedService, ApiCallClass,
        ServerApi, Utilities*/
    ]
})
export class IdeasModule {

}