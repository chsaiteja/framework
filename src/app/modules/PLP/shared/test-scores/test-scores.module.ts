
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestScoresComponent } from './test-scores.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { TestScoresModel } from './test-scores.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';


const routes: Routes = [{ path: '', component: TestScoresComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [TestScoresComponent],
    providers: [TestScoresModel, ReflectionModel, PLPSharedService]
})
export class TestScoresModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 