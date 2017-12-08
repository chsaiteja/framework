
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EducationPlansComponent } from './education-plans.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { EducationPlansModel } from './education-plans.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';

const routes: Routes = [{ path: '', component: EducationPlansComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [EducationPlansComponent],
    providers: [EducationPlansModel, ReflectionModel, PLPSharedService]
})
export class EducationPlansModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 