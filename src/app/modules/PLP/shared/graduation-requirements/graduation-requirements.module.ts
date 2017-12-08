
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraduationRequirementsComponent } from './graduation-requirements.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { GraduationRequirementsModel } from './graduation-requirements.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: GraduationRequirementsComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [GraduationRequirementsComponent],
    providers: [GraduationRequirementsModel, ReflectionModel, PLPSharedService]
})
export class GraduationRequirementsModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 