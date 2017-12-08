import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginModule } from './modules/login/login-module';
import { LoginRoutingModule } from './modules/login/login.routing';
import { OccDetailModule } from '../app/modules/occ-details/occ-details-module';
import { OccDetailsRoutingModule } from '../app/modules/occ-details/occ-details-routing';
import { StorageService } from './shared/outer-services/storage.service';
import { Utilities } from './shared/outer-services/utilities.service';
import { ServerApi } from './shared/outer-services/app.apicall.service';
import { StoreSharedService } from './shared/outer-services/store-shared.service';

import { ApiCallClass } from './shared/modal/apicall.modal';
import { AuthManager } from './shared/auth/authmanager';
import { ActivatingClass } from './shared/auth/activateGuard';
import { EventDispatchService } from './shared/outer-services/event-dispatch.service';
import { NgbdModalContent, NgbdModalLoaderContent, AssessmentModalPopups, SnackBar } from './shared/modal/shared-modal-component';

import { GridModule } from './modules/framework/grid.module';
import { ListDynamicComponent } from './modules/framework/layouts/list.component';
import { TilesDynamicComponent } from './modules/framework/layouts/tiles.component';
import { WidgetDynamicComponent } from './modules/framework/layouts/widget.component';
import { TileDesignComponent } from './modules/framework/layouts/tiles-design/tiles-design.component';

import { AssessmentHeaderComponent } from './modules/assessments/shared/assessment-header/assessment-header.component';

import { EnterpreneurQuizComponent } from './modules/assessments/entrepreneur-quiz/entrepreneur-quiz.component';
import { EQIntroComponent } from './modules/assessments/entrepreneur-quiz/intro/eq-intro.component';
import { EQAssessmentComponent } from './modules/assessments/entrepreneur-quiz/assessment/eq-assessment.component';
import { EQResultComponent } from './modules/assessments/entrepreneur-quiz/result/eq-result.component';
import { EQRestoreComponent } from './modules/assessments/entrepreneur-quiz/restore/eq-restore.component';

import { InterestProfilerShComponent } from './modules/assessments/interest-profiler-sf/interest-profiler-sf.component';
import { IPSFIntroComponent } from './modules/assessments/interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from './modules/assessments/interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFResultComponent } from './modules/assessments/interest-profiler-sf/result/ipsf-result.component';
import { IPSFRestoreComponent } from './modules/assessments/interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFOccListComponent } from './modules/assessments/interest-profiler-sf/occlist/ipsf-occ-list.component';
import { OccSortComponent } from './modules/assessments/occ-sort/occ-sort.component';
import { OSIntroComponent } from './modules/assessments/occ-sort/intro/os-intro.component';
import { FactorsComparison } from './modules/assessments/occ-sort/factors-comparison/factors-comparison.component';
import { OSAssessmentComponent } from './modules/assessments/occ-sort/assessment/range/os-assessment-range.component';
import { OSFactorsAssessmentComponent } from './modules/assessments/occ-sort/assessment/factors/os-assessment-factors.component';
import { OSResultComponent } from './modules/assessments/occ-sort/result/os-result.component';
import { OSRestoreComponent } from './modules/assessments/occ-sort/restore/os-restore.component';

import { StaticFooterComponent } from './modules/assessments/shared/header-footer/footer.component';
import { StaticHeaderComponent } from './modules/assessments/shared/header-footer/header.component';

import { OccupationListComponent } from './modules/assessments/shared/occupation-list/occupation-list.component';

import { SharedModule } from './shared/shared-module';

import { AssesmentsSharedModule } from './modules/assessments/assessments-shared-module';
import { EnterpreneurQuizModule } from './modules/assessments/entrepreneur-quiz/entquiz.module';


import { PLPSectionsModule } from './modules/PLP/plp-shared-module';
import { AppSharedModule } from './app.sharedmodule';
import { StoreService } from './state-management/services/store-service';

import { UnSavedChangesCanActive } from './shared/auth/deactivateGuard';
import { MainEffects } from './state-management/effects/main-effects';
import {
  FrameworkConfigReducer, AsmntIntroText, OccIndexReducerText,
  GetAllOccList, OccFilterResponses, AsmntCommonText,
  OccPageText, OccSettingsText, OccText,
  AsmntQuestionsResponses, AsmntQuestionsText, AsmntRestoreText,
  AsmntAreaText, AsmntParAreaText, SectionsStatusValues
} from './state-management/reducers/main-reducer';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [
    AppComponent,
    NgbdModalContent,
    AssessmentModalPopups, SnackBar,
    NgbdModalLoaderContent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    ReactiveFormsModule,
    StoreModule.provideStore({
      FrameworkConfigReducer,
      OccFilterResponses, AsmntIntroText, GetAllOccList,
      OccIndexReducerText,
      OccSettingsText,
      AsmntCommonText, OccPageText, OccText, AsmntQuestionsResponses,
      AsmntQuestionsText, AsmntRestoreText, AsmntAreaText,
      AsmntParAreaText, SectionsStatusValues
    }),
    EffectsModule.run(MainEffects),
    FormsModule,
    NgbTooltipModule,
    GridModule.withComponents([
      WidgetDynamicComponent,
      TilesDynamicComponent,
      ListDynamicComponent]),
    SharedModule,
    CommonModule,
    RouterModule,
    LoginRoutingModule,
    OccDetailsRoutingModule,
    LoginModule,
    OccDetailModule,
    NgbModule.forRoot(),
    AssesmentsSharedModule,
    PLPSectionsModule,
    AppSharedModule.forRoot()
  ],
  providers: [
    EventDispatchService, Utilities, StorageService, NgbActiveModal,
    AuthManager, ActivatingClass, StoreSharedService,
    ServerApi, ApiCallClass, NgbdModalLoaderContent, UnSavedChangesCanActive, StoreService
  ],
  bootstrap: [AppComponent],
  entryComponents: [NgbdModalContent, NgbdModalLoaderContent, AssessmentModalPopups]
})


export class AppModule {
  constructor() {
  }
}
