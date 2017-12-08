/**Import angular core packages */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { FrameworkModule } from '../../../modules/framework/framework.module';
import { GridModule } from '../../../modules/framework/grid.module';

/**Import LSS components */
import { LssStartComponent } from './learning-style.component';
import { LSSIntroComponent } from './intro/lss-intro.component';
import { LSSAssessmentComponent } from './assessment/lss-assessment.component';
import { LSSResultComponent } from './result/lss-result.component';
import { LSSRestoreComponent } from './restore/lss-restore.component';
import { StaticHeaderComponent } from '../shared/header-footer/header.component';
import { AssessmentHeaderComponent } from '../shared/assessment-header/assessment-header.component';
import { AppSharedModule } from '../../../app.sharedmodule';
import { UnSavedChangesCanActive } from '../../../shared/auth/deactivateGuard';
import { ActivatingClass } from '../../../shared/auth/activateGuard';
const routes: Routes = [{
    path: '', component: LssStartComponent,
    children: [
        { path: '', redirectTo: "intro", pathMatch: "full" },
        { path: 'intro', component: LSSIntroComponent },
        { path: 'assessment', component: LSSAssessmentComponent, canDeactivate: [UnSavedChangesCanActive], canActivate: [ActivatingClass] },//, canActivate: [ActivatingClass] },
        { path: 'result', component: LSSResultComponent },
        { path: 'restore', component: LSSRestoreComponent }


    ]
}];

@NgModule({
    imports: [
        AppSharedModule.forRoot(),
        FrameworkModule,
        RouterModule.forChild(routes)],
    declarations: [
        LssStartComponent,
        LSSAssessmentComponent,
        LSSIntroComponent,
        LSSRestoreComponent, LSSResultComponent

    ],
    providers: [

    ]
})
export class LSSModule { }