/** Angular imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Custom imports */
import { ActivatingClass } from '../../../shared/auth/activateGuard';
import { AppSharedModule } from '../../../app.sharedmodule';
import { FrameworkModule } from '../../../modules/framework/framework.module';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';

/** import CCI components */
import { CCIJrComponent } from './career-cluster.component';
import { CCIJrIntroComponent } from '../career-cluster-inventory/intro/cci-intro.component';
import { CCIJrAssessmentComponent } from '../career-cluster-inventory/assessment/cci-assessment.component';
import { CCIJrResultComponent } from '../career-cluster-inventory/result/cci-result.component';
import { CCIJrRestoreComponent } from '../career-cluster-inventory/restore/cci-restore.component';
import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';

const routes: Routes = [{
    path: '', component: CCIJrComponent,
    children: [
        { path: '', redirectTo: 'intro', pathMatch: 'prefix' },
        { path: 'intro', component: CCIJrIntroComponent },
        {
            path: 'assessment', component: CCIJrAssessmentComponent,
            canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]
        },
        { path: 'result', component: CCIJrResultComponent },
        { path: 'restore', component: CCIJrRestoreComponent },
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
        CCIJrAssessmentComponent,
        CCIJrIntroComponent,
        CCIJrRestoreComponent, CCIJrResultComponent,
        CCIJrComponent
    ],
    providers: [
    ]
})
export class CCIModule {
}