
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraActivitiesComponent } from './extra-activities.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { ExtraActivitiesModel } from './extra-activities.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: ExtraActivitiesComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [ExtraActivitiesComponent],
    providers: [ExtraActivitiesModel, ReflectionModel, PLPSharedService]
})
export class ExtraActivitiesModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 