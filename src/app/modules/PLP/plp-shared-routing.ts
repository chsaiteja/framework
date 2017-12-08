// import { provideRouter, RouterConfig } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthManager } from '../../shared/auth/authmanager';
import { ActivatingClass } from '../../shared/auth/activateGuard';
import { PLPSectionsModule } from './plp-shared-module';
import { PlpComponent } from "../../modules/PLP/PLP-sections/PLP-sections.component";
// import { ReportComponent } from '../../modules/PLP/report/report.component';
export const routes: Routes = [
    {
        path: 'plpcontent',
        component: PlpComponent,
        // children: [
        //           { path: 'report', component: ReportComponent,canActivate: [AuthManager] }
        //         ], canActivate: [AuthManager]
    },
    //   { path: '**', component: PageNotFoundComponent, pathMatch: "full" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class PLPSharedRoutingModule { }