/** Angualr2 Libaries **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Modules and Components **/
import { FrameworkModule } from '../../../modules/framework/framework.module';
import { AppSharedModule } from '../../../app.sharedmodule';

import { WILStartComponent } from './work-importance.component';
import { WILIntroComponent } from './intro/wil-intro.component';
import { WILAssessmentComponent } from './assessment/wil-assessment.component';
import { WILResultComponent } from './result/wil-result.component';
import { WILRestoreComponent } from './restore/wil-restore.component';

import { OccCareerHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from '../../../modules/occ-details/shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from '../../../modules/occ-details/shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../occ-sort/compareOcc/compare-component';

/* Services**/
import { WILOccListComponent } from './occlist/wil-occ-list.component';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';
import { ActivatingClass } from '../../../shared/auth/activateGuard';

const routes: Routes = [{
    path: '', component: WILStartComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: WILIntroComponent },
        {
            path: 'assessment', component: WILAssessmentComponent,
            canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]
        },
        { path: 'result', component: WILResultComponent },
        { path: 'restore', component: WILRestoreComponent },
        { path: 'occlist', component: WILOccListComponent },
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
        WILAssessmentComponent,
        WILIntroComponent, WILOccListComponent,
        WILRestoreComponent, WILResultComponent,
        WILStartComponent
    ],
    providers: []
})
export class WILModule { }