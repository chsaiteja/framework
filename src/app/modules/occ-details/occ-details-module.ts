import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared-module';
import { ApiCallClass } from '../../shared/modal/apicall.modal';
import { ServerApi } from '../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../shared/outer-services/utilities.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OccDetailStaticHeaderComponent } from './occ-detail-header-component';
import { AtAGlanceComponent } from './occ-careers/at-a-glance/at-a-glance-component';
import { EduTrainingComponent } from './occ-careers/edu-and-training/edu-training-component';
import { EmpOutlookComponent } from './occ-careers/emp-and-outlook/emp-outlook-component';
import { JobDescriptionComponent } from './occ-careers/job-description/job-desc-component';
import { PersonalQualitiesComponent } from './occ-careers/personal-qualities/personal-qualities-component';
import { RelatedCareersComponent } from './occ-careers/related-careers/related-careers-component';
import { WagesComponent } from './occ-careers/wages/wages-component';
import { AtAGlanceClusterComponent } from './occ-clusters/at-a-glance/at-a-glance.component';
import { EducationComponent } from './occ-clusters/education/education.component';
import { PathwaysComponent } from './occ-clusters/pathways/pathways.component';
import { RelatedCareerClusterComponent } from './occ-clusters/related-careers/related-careers.component';
import { RightForMeComponent } from './occ-clusters/right-for-me/right-for-me-component';
import { AboutThisComponent } from './occ-emerg-careers/about-this-career/abt-this-career.component';
import { EduTrainingEmergComponent } from './occ-emerg-careers/edu-and-training/edu-and-training-component';
import { RelatedCareersEmergComponent } from './occ-emerg-careers/related-careers/related-careers.component';
import { OccCareerHeaderComponent } from './shared/occ-common-header/occ-career-header-component';
import { OccClusterHeaderComponent } from './shared/occ-common-header/occ-cluster-header-component';
import { OccEmergHeaderComponent } from './shared/occ-common-header/emergCareers-header-component';
import { StaticOccFooterComponent } from './shared/occ-common-footer/occ-footer-component';
import { OccIndexComponent } from './shared/occ-index/occ-index-component';
import { TextIteratorPipe } from './shared/text-custompipe';
import { OSCompareComponent } from '../assessments/occ-sort/compareOcc/compare-component';

@NgModule({
    imports: [HttpModule, FormsModule, CommonModule,
        RouterModule, NgbModule, ReactiveFormsModule, SharedModule],
    declarations: [OccCareerHeaderComponent, OccClusterHeaderComponent, OccEmergHeaderComponent, StaticOccFooterComponent, AtAGlanceComponent, EduTrainingComponent, EmpOutlookComponent, JobDescriptionComponent,
        PersonalQualitiesComponent, RelatedCareersComponent, WagesComponent, AtAGlanceClusterComponent,
        EducationComponent, PathwaysComponent, RelatedCareerClusterComponent, RightForMeComponent,
        AboutThisComponent, EduTrainingEmergComponent, RelatedCareersEmergComponent,
        OccDetailStaticHeaderComponent, TextIteratorPipe, OccIndexComponent, OSCompareComponent],
    providers: [
        ApiCallClass, ServerApi, Utilities
    ]
})

export class OccDetailModule {
}