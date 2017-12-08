
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudyOfInterestComponent } from './study-of-interest.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { StudyOfInterestModel } from './study-of-interest.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: StudyOfInterestComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [StudyOfInterestComponent],
    providers: [StudyOfInterestModel, ReflectionModel, PLPSharedService]
})
export class StudyOfInterestModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 