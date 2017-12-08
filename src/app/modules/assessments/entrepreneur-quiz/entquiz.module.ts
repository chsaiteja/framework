/**Import angular core packages */
import { NgModule, Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes, RouterOutlet } from '@angular/router';

/**Import shared modules */
import { AppSharedModule } from '../../../app.sharedmodule';
import { SharedModule } from '../../../shared/shared-module';

/**Import Directives */
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';
import { ActivatingClass } from '../../../shared/auth/activateGuard';

/**Import EQ component */
import { EnterpreneurQuizComponent } from './entrepreneur-quiz.component';
import { EQIntroComponent } from './intro/eq-intro.component';
import { EQAssessmentComponent } from './assessment/eq-assessment.component';
import { EQResultComponent } from './result/eq-result.component';
import { EQRestoreComponent } from './restore/eq-restore.component';

const routes: Routes = [{
    path: '', component: EnterpreneurQuizComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "prefix" },
        { path: 'intro', component: EQIntroComponent },
        { path: 'assessment', component: EQAssessmentComponent, canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass] },//, canActivate: [ActivatingClass] },
        { path: 'result', component: EQResultComponent },
        { path: 'restore', component: EQRestoreComponent }

    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        RouterModule.forChild(routes),
    ],
    declarations: [
        EnterpreneurQuizComponent, EQIntroComponent,
        EQAssessmentComponent, EQResultComponent,
        EQRestoreComponent
    ],
    providers: [
    ],
})
export class EnterpreneurQuizModule {
}