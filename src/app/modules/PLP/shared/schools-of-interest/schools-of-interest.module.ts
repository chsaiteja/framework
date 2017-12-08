
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolsOfInterestComponent } from './schools-of-interest.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { SchoolsOfInterestModel } from './schools-of-interest.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: SchoolsOfInterestComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [SchoolsOfInterestComponent],
    providers: [SchoolsOfInterestModel, ReflectionModel, PLPSharedService]
})
export class SchoolsOfInterestModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 