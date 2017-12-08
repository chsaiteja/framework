/** Angular imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Custom imports */
import { ActivatingClass } from '../../../shared/auth/activateGuard';
import { AppSharedModule } from '../../../app.sharedmodule';
import { FrameworkModule } from '../../../modules/framework/framework.module';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';

/** import CCI components */
import { CCIQuickComponent } from './cci-quick.component';
import { CCIQuickIntroComponent } from './intro/cci-quick-intro.component';
import { CCIQuickAssessmentComponent } from './assessment/cci-quick-assessment.component';
import { CCIQuickResultComponent } from './result/cci-quick-result.component';
import { CCIQuickRestoreComponent } from './restore/cci-quick-restore.component';
import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';

const routes: Routes = [{
    path: '', component: CCIQuickComponent,
    children: [
        { path: '', redirectTo: 'intro', pathMatch: 'prefix' },
        { path: 'intro', component: CCIQuickIntroComponent },
        {
            path: 'assessment', component: CCIQuickAssessmentComponent,
            canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]
        },
        { path: 'result', component: CCIQuickResultComponent },
        { path: 'restore', component: CCIQuickRestoreComponent },
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
        CCIQuickAssessmentComponent,
        CCIQuickIntroComponent,
        CCIQuickRestoreComponent, CCIQuickResultComponent,
        CCIQuickComponent
    ],
    providers: [
    ]
})
export class CCIModule {
}