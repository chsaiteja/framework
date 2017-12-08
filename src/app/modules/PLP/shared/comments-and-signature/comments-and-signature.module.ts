
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommentsAndSignatureComponent } from './comments-and-signature.component';
import { PLPSectionsModule } from '../../plp-shared-module';
import { AppSharedModule } from '../../../../app.sharedmodule';
import { CommentsAndSignatureModel } from './comments-and-signature.model';
import { ReflectionModel } from '../shared/reflection.model';

import { PLPSharedService } from '../shared/PLP-shared.service';
import { UnSavedChangesCanActive } from '../../../../shared/auth/deactivateGuard';

const routes: Routes = [{ path: '', component: CommentsAndSignatureComponent, canDeactivate: [UnSavedChangesCanActive] }];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
        //PLPSectionsModule
    ],
    declarations: [CommentsAndSignatureComponent],
    providers: [CommentsAndSignatureModel, ReflectionModel, PLPSharedService]
})
export class CommentsAndSignatureModule {
    constructor() {
        // alert('plp personal info module loaded');
    }
} 