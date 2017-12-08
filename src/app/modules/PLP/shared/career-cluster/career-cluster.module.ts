
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerClusterComponent } from './career-cluster.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { CareerClusterModel } from './career-cluster.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';

const routes: Routes = [{ path: '', component: CareerClusterComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [CareerClusterComponent],
    providers: [CareerClusterModel, ReflectionModel, PLPSharedService]
})
export class CareerClusterModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 