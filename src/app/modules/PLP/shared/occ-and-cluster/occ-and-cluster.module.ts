
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccAndClusterComponent } from './occ-and-cluster.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { OccAndClusterModel } from './occ-and-cluster.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: OccAndClusterComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [OccAndClusterComponent],
    providers: [OccAndClusterModel, ReflectionModel, PLPSharedService]
})
export class OccAndClusterModule {
    constructor() {
        // alert('OccAndClusterModule module loaded');
    }
} 