
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlpComponent } from './PLP-sections/PLP-sections.component';

import { PLPNavHeaderComponent } from '../PLP/shared/shared/PLP-nav-header.component';
import { AppSharedModule } from '../../app.sharedmodule';
import { Utilities } from '../../shared/outer-services/utilities.service';

import { PLPSharedService } from './shared/shared/PLP-shared.service';

const routes: Routes = [{ path: '', component: PlpComponent }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AppSharedModule.forRoot()
  ],
  declarations: [
    // PLPNavHeaderComponent,
    PlpComponent
  ],
  exports: [
    // PLPNavHeaderComponent,
    PlpComponent
  ],
  providers: [PLPSharedService]
})
export class PLPSectionsModule {
  constructor() {
    //alert('plp shared module loaded');
  }
}
