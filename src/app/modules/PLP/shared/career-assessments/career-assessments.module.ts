
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerAssessmentsComponent } from './career-assessments.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { CareerAssessmentsModel } from './career-assessments.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: CareerAssessmentsComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [CareerAssessmentsComponent],
    providers: [CareerAssessmentsModel, ReflectionModel, PLPSharedService]
})
export class CareerAssessmentsModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 