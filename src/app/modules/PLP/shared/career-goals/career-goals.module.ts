
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerGoalsComponent } from './career-goals.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { CareerGoals } from './career-goals.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';

import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';

const routes: Routes = [{ path: '', component: CareerGoalsComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [CareerGoalsComponent],
    providers: [CareerGoals, ReflectionModel, PLPSharedService]
})
export class CareerGoalsModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 