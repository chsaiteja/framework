
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploymentHistoryComponent } from './employment-history.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { EmploymentHistoryModel } from './employment-history.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';


const routes: Routes = [{ path: '', component: EmploymentHistoryComponent }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [EmploymentHistoryComponent],
    providers: [EmploymentHistoryModel, ReflectionModel, PLPSharedService]
})
export class EmploymentHistoryModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 