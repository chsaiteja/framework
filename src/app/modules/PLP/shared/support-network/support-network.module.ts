
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportNetworkComponent } from './support-network.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { SupportNetworkModel } from './support-network.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';


const routes: Routes = [{ path: '', component: SupportNetworkComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [SupportNetworkComponent],
    providers: [SupportNetworkModel, ReflectionModel, PLPSharedService]
})
export class SupportNetworkModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 