import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input, Pipe, PipeTransform, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';

import { AbilityExplorerComponent } from './ability-explorer.component';
import { AbilityExplorerIntroComponent } from './intro/ae-intro.component';
import { AbilityExplorerAssessmentComponent } from './assessment/ae-assessment.component';
import { AbilityExplorerRestoreComponent } from './restore/ae-restore.component';
import { AbilityExplorerResultComponent } from './result/ae-result.component';
import { AbilityExplorerListComponent } from './abilityexplorerlist/ae-occ-list.component';

import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';
import { Utilities } from '../../../shared/outer-services/utilities.service';
import { ServerApi } from '../../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../../shared/modal/apicall.modal';
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
    path: '', component: AbilityExplorerComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "full" },
        { path: 'intro', component: AbilityExplorerIntroComponent },
        {
            path: 'assessment', component: AbilityExplorerAssessmentComponent,
             canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]
        },//, canActivate: [ActivatingClass] },
        { path: 'result', component: AbilityExplorerResultComponent },
        { path: 'restore', component: AbilityExplorerRestoreComponent },
        { path: 'occCareer', component: OccCareerHeaderComponent },
        { path: 'occCluster', component: OccClusterHeaderComponent },
        { path: 'occEmergCareer', component: OccEmergHeaderComponent },
        { path: 'occIndex', component: OccIndexComponent },
        { path: 'compare', component: OSCompareComponent },
        { path: 'occlist', component: AbilityExplorerListComponent }

    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        AbilityExplorerAssessmentComponent,
        AbilityExplorerIntroComponent,
        AbilityExplorerResultComponent,
        AbilityExplorerRestoreComponent,
        AbilityExplorerComponent, AbilityExplorerListComponent
    ],
    providers: [
        /*, AssessmentsService,
        SharedService, ApiCallClass,
        ServerApi, Utilities*/
    ]
})
export class AbilityModule {

}
