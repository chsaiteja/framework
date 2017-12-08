
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VolunteerCommunityServiceComponent } from './volunteer-community-service.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { VolunteerCommunityServiceModel } from './volunteer-community-service.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: VolunteerCommunityServiceComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [VolunteerCommunityServiceComponent],
    providers: [VolunteerCommunityServiceModel, ReflectionModel, PLPSharedService]
})
export class VolunteerCommunityServiceModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 