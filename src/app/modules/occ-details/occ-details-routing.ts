import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OccCareerHeaderComponent } from './shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from './shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from './shared/occ-common-header/emergCareers-header-component';
import { OccIndexComponent } from './shared/occ-index/occ-index-component';
import { OSCompareComponent } from '../assessments/occ-sort/compareOcc/compare-component';
import { LayoutConfigComponent } from '../../layout-config.component';

export const routes: Routes = [
    { path: 'occCareer', component: OccCareerHeaderComponent },
    { path: 'occCluster', component: OccClusterHeaderComponent },
    { path: 'occEmergCareer', component: OccEmergHeaderComponent },
    { path: 'occIndex', component: OccIndexComponent },
    { path: 'compare', component: OSCompareComponent },
    { path: '', component: LayoutConfigComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OccDetailsRoutingModule { }