
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursePlanComponent } from './course-plan.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { CoursePlanModel } from './course-plan.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: CoursePlanComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [CoursePlanComponent],
    providers: [CoursePlanModel, ReflectionModel, PLPSharedService]
})
export class CoursePlanModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 