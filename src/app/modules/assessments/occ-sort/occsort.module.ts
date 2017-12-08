/** Angular imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** import external shared Components */
import { AppSharedModule } from '../../../app.sharedmodule';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';
import { ActivatingClass } from '../../../shared/auth/activateGuard';

/** import OS Components */
import { OccSortComponent } from './occ-sort.component';
import { OSIntroComponent } from './intro/os-intro.component';
import { FactorsComparison } from './factors-comparison/factors-comparison.component';
import { OSAssessmentComponent } from './assessment/range/os-assessment-range.component';
import { OSFactorsAssessmentComponent } from './assessment/factors/os-assessment-factors.component';
import { OSResultComponent } from './result/os-result.component';
import { OSRestoreComponent } from './restore/os-restore.component';
import { OSCompareComponent } from './compareOcc/compare-component';

/** import Components occdetails */
import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';

const routes: Routes = [{
    path: '',
    component: OccSortComponent,
    children: [
        { path: '', redirectTo: 'intro', pathMatch: 'prefix' },
        { path: 'intro', component: OSIntroComponent },
        { path: 'comparison', component: FactorsComparison },
        {
            path: 'assessment', component: OSAssessmentComponent,
            canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]
        },
        { path: 'factors', component: OSFactorsAssessmentComponent },
        { path: 'restore', component: OSRestoreComponent },
        { path: 'result', component: OSResultComponent },
        { path: 'occCareer', component: OccCareerHeaderComponent },
        { path: 'occCluster', component: OccClusterHeaderComponent },
        { path: 'occEmergCareer', component: OccEmergHeaderComponent },
        { path: 'occIndex', component: OccIndexComponent },
        { path: 'compare', component: OSCompareComponent },
        { path: '**', redirectTo: 'intro', pathMatch: 'prefix' },
    ]
}];

@NgModule({
    imports: [AppSharedModule.forRoot(),
    RouterModule.forChild(routes)],
    declarations: [OccSortComponent, OSIntroComponent, FactorsComparison,
        OSFactorsAssessmentComponent, OSAssessmentComponent, OSRestoreComponent,
        OSResultComponent
    ]
})
export class OccSortModule { }
