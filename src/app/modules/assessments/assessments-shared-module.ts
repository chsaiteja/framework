import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutConfigComponent } from '../../layout-config.component';

import { AppSharedModule } from '../../app.sharedmodule';

import { GridModule } from '../framework/grid.module';
import { FrameworkModule } from '../framework/framework.module';
const routes: Routes = [{ path: '', component: LayoutConfigComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes), GridModule
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: []
})
export class AssesmentsSharedModule { }
