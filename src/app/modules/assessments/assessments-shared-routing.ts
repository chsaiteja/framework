import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouterOutlet } from '@angular/router';
import { AuthManager } from '../../shared/auth/authmanager';
import { EnterpreneurQuizComponent } from '../../modules/assessments/entrepreneur-quiz/entrepreneur-quiz.component';
import { EQIntroComponent } from '../../modules/assessments/entrepreneur-quiz/intro/eq-intro.component';
import { EQAssessmentComponent } from '../../modules/assessments/entrepreneur-quiz/assessment/eq-assessment.component';
import { EQResultComponent } from '../../modules/assessments/entrepreneur-quiz/result/eq-result.component';
import { EQRestoreComponent } from '../../modules/assessments/entrepreneur-quiz/restore/eq-restore.component';
import { WESStartComponent } from '../../modules/assessments/workplace-employability-skills/workplace-employability.component';
import { WESIntroComponent } from '../../modules/assessments/workplace-employability-skills/intro/wes-intro.component';
import { WESAssessmentComponent } from '../../modules/assessments/workplace-employability-skills/assessment/wes-assessment.component';
import { WESResultComponent } from '../../modules/assessments/workplace-employability-skills/result/wes-result.component';
import { WESRestoreComponent } from '../../modules/assessments/workplace-employability-skills/restore/wes-restore.component';

import { InterestProfilerShComponent } from '../../modules/assessments/interest-profiler-sf/interest-profiler-sf.component';
import { IPSFIntroComponent } from '../../modules/assessments/interest-profiler-sf/intro/ipsf-intro.component';
import { IPSFAssessmentComponent } from '../../modules/assessments/interest-profiler-sf/assessment/ipsf-assessment.component';
import { IPSFResultComponent } from '../../modules/assessments/interest-profiler-sf/result/ipsf-result.component';
import { IPSFRestoreComponent } from '../../modules/assessments/interest-profiler-sf/restore/ipsf-restore.component';
import { IPSFOccListComponent } from '../../modules/assessments/interest-profiler-sf/occlist/ipsf-occ-list.component';
import { OccSortComponent } from '../../modules/assessments/occ-sort/occ-sort.component';
import { OSIntroComponent } from '../../modules/assessments/occ-sort/intro/os-intro.component';
import { FactorsComparison } from './occ-sort/factors-comparison/factors-comparison.component';
import { OSAssessmentComponent } from '../../modules/assessments/occ-sort/assessment/range/os-assessment-range.component';
import { OSFactorsAssessmentComponent } from '../../modules/assessments/occ-sort/assessment/factors/os-assessment-factors.component';
import { OSResultComponent } from '../../modules/assessments/occ-sort/result/os-result.component';
import { OSRestoreComponent } from '../../modules/assessments/occ-sort/restore/os-restore.component';
import { ActivatingClass } from '../../shared/auth/activateGuard';
import { CCIJrComponent } from '../../modules/assessments/career-cluster-inventory/career-cluster.component';
import { CCIJrIntroComponent } from '../../modules/assessments/career-cluster-inventory/intro/cci-intro.component';
import { CCIJrAssessmentComponent } from '../../modules/assessments/career-cluster-inventory/assessment/cci-assessment.component';
import { CCIJrResultComponent } from '../../modules/assessments/career-cluster-inventory/result/cci-result.component';
import { CCIJrRestoreComponent } from '../../modules/assessments/career-cluster-inventory/restore/cci-restore.component';
import { CCIQuickComponent } from '../../modules/assessments/cci-quick/cci-quick.component';
import { CCIQuickIntroComponent } from '../../modules/assessments/cci-quick/intro/cci-quick-intro.component';
import { CCIQuickAssessmentComponent } from '../../modules/assessments/cci-quick/assessment/cci-quick-assessment.component';
import { CCIQuickResultComponent } from '../../modules/assessments/cci-quick/result/cci-quick-result.component';
import { CCIQuickRestoreComponent } from '../../modules/assessments/cci-quick/restore/cci-quick-restore.component';
import { WILStartComponent } from '../../modules/assessments/work-importance-locator/work-importance.component';
import { WILIntroComponent } from '../../modules/assessments/work-importance-locator/intro/wil-intro.component';
import { WILAssessmentComponent } from '../../modules/assessments/work-importance-locator/assessment/wil-assessment.component';
import { WILResultComponent } from '../../modules/assessments/work-importance-locator/result/wil-result.component';
import { WILRestoreComponent } from '../../modules/assessments/work-importance-locator/restore/wil-restore.component';
import { LssStartComponent } from '../../modules/assessments/learning-style-survey/learning-style.component';
import { LSSIntroComponent } from '../../modules/assessments/learning-style-survey/intro/lss-intro.component';
import { LSSAssessmentComponent } from '../../modules/assessments/learning-style-survey/assessment/lss-assessment.component';
import { LSSResultComponent } from '../../modules/assessments/learning-style-survey/result/lss-result.component';
import { LSSRestoreComponent } from '../../modules/assessments/learning-style-survey/restore/lss-restore.component';

export const routes: Routes = [
  {
    path: 'entrepreneurQuiz',
    component: EnterpreneurQuizComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: EQIntroComponent },
      { path: 'assessment', component: EQAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: EQResultComponent },
      { path: 'restore', component: EQRestoreComponent }
    ], canActivate: [AuthManager]
  },
  {
    path: 'interestProfilerSf',
    component: InterestProfilerShComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: IPSFIntroComponent },
      { path: 'assessment', component: IPSFAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: IPSFResultComponent },
      { path: 'restore', component: IPSFRestoreComponent },
      { path: 'occlist', component: IPSFOccListComponent }

    ], canActivate: [AuthManager]
  },
  {
    path: 'occSort',
    component: OccSortComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: OSIntroComponent },
      { path: 'comparison', component: FactorsComparison },
      { path: 'assessment', component: OSAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'factors', component: OSFactorsAssessmentComponent },
      { path: 'restore', component: OSRestoreComponent },
      { path: 'result', component: OSResultComponent }
    ], canActivate: [AuthManager]
  },
  {
    path: 'cciJr',
    component: CCIJrComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: CCIJrIntroComponent },
      { path: 'assessment', component: CCIJrAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: CCIJrResultComponent },
      { path: 'restore', component: CCIJrRestoreComponent }

    ], canActivate: [AuthManager]
  },
  {
    path: 'cciQuick',
    component: CCIQuickComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: CCIQuickIntroComponent },
      { path: 'assessment', component: CCIQuickAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: CCIQuickResultComponent },
      { path: 'restore', component: CCIQuickRestoreComponent }

    ], canActivate: [AuthManager]
  },
  {
    path: 'wesAsessment',
    component: WESStartComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: WESIntroComponent },
      { path: 'assessment', component: WESAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: WESResultComponent },
      { path: 'restore', component: WESRestoreComponent }

    ], canActivate: [AuthManager]
  },
  {
    path: 'lssAsessment',
    component: LssStartComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: LSSIntroComponent },
      { path: 'assessment', component: LSSAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: LSSResultComponent },
      { path: 'restore', component: LSSRestoreComponent }

    ], canActivate: [AuthManager]
  },
  {
    path: 'wilAsessment',
    component: WILStartComponent,
    children: [
      { path: '', redirectTo: "intro", pathMatch: "full" },
      { path: 'intro', component: WILIntroComponent },
      { path: 'assessment', component: WILAssessmentComponent, canActivate: [ActivatingClass] },
      { path: 'result', component: WILResultComponent },
      { path: 'restore', component: WILRestoreComponent }

    ], canActivate: [AuthManager]
  },
  { path: 'eq', redirectTo: "entrepreneurQuiz/intro", pathMatch: "full" },
  { path: 'ip', redirectTo: "interestProfilerSf/intro", pathMatch: "full" },
  { path: 'os', redirectTo: "occSort/intro", pathMatch: "full" },
  { path: 'ls', redirectTo: "lssAsessment/intro", pathMatch: "full" },
  { path: 'lti/eq', redirectTo: "entrepreneurQuiz/intro", pathMatch: "full" },
  { path: 'lti/ip', redirectTo: "interestProfilerSf/intro", pathMatch: "full" },
  { path: 'lti/os', redirectTo: "occSort/intro", pathMatch: "full" },
  { path: 'lti/ls', redirectTo: "lssAsessment/intro", pathMatch: "full" }
  // { path: '**', component: PageNotFoundComponent, pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AssessmentSharedRouting { }