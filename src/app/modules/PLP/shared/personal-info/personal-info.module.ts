
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInfoComponent } from './personal-info.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { PersonalInfoModel } from './personal-info.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';


const routes: Routes = [{ path: '', component: PersonalInfoComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [PersonalInfoComponent],
    providers: [PersonalInfoModel, PLPSharedService]
})
export class PersonalInfoModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 