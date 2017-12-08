import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AssessmentHeaderComponent } from './modules/assessments/shared/assessment-header/assessment-header.component';

import { OccupationListComponent } from './modules/assessments/shared/occupation-list/occupation-list.component';

import { StaticFooterComponent } from './modules/assessments/shared/header-footer/footer.component';
import { StaticHeaderComponent } from './modules/assessments/shared/header-footer/header.component';

import { LayoutConfigComponent } from './layout-config.component';

import { ReflectionComponent } from './modules/PLP/shared/shared/reflection.component';

import { SharedModule } from './shared/shared-module';
import { GridModule } from './modules/framework/grid.module';
import { FrameworkModule } from './modules/framework/framework.module';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { OccDetailModule } from '../app/modules/occ-details/occ-details-module';
import { PrintResultComponent } from './shared/common-print-results.component';
@NgModule({
    imports: [
        CommonModule,
        FrameworkModule, GridModule,
        SharedModule,
        HttpModule, FormsModule,
        NgbModule, ReactiveFormsModule,
        RouterModule, OccDetailModule,
    ],
    declarations: [
        AssessmentHeaderComponent,
        StaticHeaderComponent, OccupationListComponent,
        ReflectionComponent,
        LayoutConfigComponent, StaticFooterComponent, PrintResultComponent
    ],
    exports: [
        AssessmentHeaderComponent,
        StaticHeaderComponent,
        OccupationListComponent,
        CommonModule, SharedModule, GridModule, NgbModule, FormsModule, ReactiveFormsModule,
        ReflectionComponent, OccDetailModule,
        LayoutConfigComponent, StaticFooterComponent, PrintResultComponent
    ],
    providers: [

    ]
})
export class AppSharedModule {

    static forRoot() {
        return {
            ngModule: AppSharedModule,
            providers: [
                //services that you want to share across modules
                // SharedService,
                // SharedService2
            ]
        }
    }
}