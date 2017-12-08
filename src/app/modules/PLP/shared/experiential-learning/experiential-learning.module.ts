
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExperientialLearningComponent } from './experiential-learning.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { ExperientialLearningModel } from './experiential-learning.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';


const routes: Routes = [{ path: '', component: ExperientialLearningComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [ExperientialLearningComponent],
    providers: [ExperientialLearningModel, ReflectionModel, PLPSharedService]
})
export class ExperientialLearningModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 