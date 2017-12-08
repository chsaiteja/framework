
/** Angular imports */
import { NgModule, Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Custom imports */
import { FrameworkModule } from '../../../modules/framework/framework.module';
import { AppSharedModule } from '../../../app.sharedmodule';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';
import { ActivatingClass } from '../../../shared/auth/activateGuard';
import { SharedModule } from '../../../shared/shared-module';

/**import IP components */
import { InterestProfilerShComponent } from './interest-profiler-sf.component';
import { IPSFIntroComponent } from './intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from './assessment/ipsf-assessment.component';
import { IPSFResultComponent } from './result/ipsf-result.component';
import { IPSFRestoreComponent } from './restore/ipsf-restore.component';
import { IPSFOccListComponent } from './occlist/ipsf-occ-list.component';
import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';
import { AssessmentsService } from '../shared/services/assessments.service';
import { OccupationListComponent } from '../shared/occupation-list/occupation-list.component';
import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';

const routes: Routes = [{
    path: '', component: InterestProfilerShComponent,
    children: [
        { path: '', redirectTo: 'intro', pathMatch: 'prefix' },
        { path: 'intro', component: IPSFIntroComponent },
        {
            path: 'assessment', component: IPSFAssessmentComponent, canDeactivate: [UnSavedChangesCanActive],
            canActivate: [ActivatingClass]
        },
        { path: 'result', component: IPSFResultComponent },
        { path: 'restore', component: IPSFRestoreComponent },
        { path: 'occlist', component: IPSFOccListComponent },
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
        IPSFAssessmentComponent,
        IPSFIntroComponent, IPSFOccListComponent,
        IPSFRestoreComponent, IPSFResultComponent,
        InterestProfilerShComponent
    ],
    providers: []
})
export class InterestProfilerShModule { }