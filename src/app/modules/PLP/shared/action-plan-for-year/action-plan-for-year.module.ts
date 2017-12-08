import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionPlanComponent } from './action-plan.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { ActionPlanModel } from './action-plan.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';

const routes: Routes = [{ path: '', component: ActionPlanComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [ActionPlanComponent],
    providers: [ActionPlanModel, ReflectionModel, PLPSharedService]
})
export class ActionPlansModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 