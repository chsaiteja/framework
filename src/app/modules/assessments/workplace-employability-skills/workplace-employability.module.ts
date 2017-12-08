/** Angular imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/** Custom imports */
import { FrameworkModule } from '../../../modules/framework/framework.module';

/** import WES components */
import { WESStartComponent } from './workplace-employability.component';
import { WESIntroComponent } from './intro/wes-intro.component';
import { WESAssessmentComponent } from './assessment/wes-assessment.component';
import { WESResultComponent } from './result/wes-result.component';
import { WESRestoreComponent } from './restore/wes-restore.component';

import { AppSharedModule } from '../../../app.sharedmodule';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';

import { ActivatingClass } from '../../../shared/auth/activateGuard';


const routes: Routes = [{
    path: '', component: WESStartComponent,
    children: [
        { path: '', redirectTo: 'intro', pathMatch: 'prefix' },
        { path: 'intro', component: WESIntroComponent },
        {
            path: 'assessment', component: WESAssessmentComponent,
            canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass]
        },

        { path: 'result', component: WESResultComponent },
        { path: 'restore', component: WESRestoreComponent }
    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        WESStartComponent,
        WESAssessmentComponent,
        WESIntroComponent,
        WESRestoreComponent, WESResultComponent

    ],
    providers: []
})
export class WESModule { }
