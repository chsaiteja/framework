import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from '@angular/router';
import { Http } from '@angular/http';

import { DynamicLayout } from "./dynamicLayout.component";
import { ListDynamicComponent } from "./layouts/list.component";
import { TilesDynamicComponent } from "./layouts/tiles.component";
import { WidgetDynamicComponent } from "./layouts/widget.component";
import { TileDesignComponent } from './layouts/tiles-design/tiles-design.component';
import { SlimScrollModule } from 'ng2-slimscroll';
import { OccSortModule } from '../assessments/occ-sort/occsort.module';

import { PLPNavHeaderComponent } from '../PLP/shared/shared/PLP-nav-header.component';

@NgModule({
    imports: [
        //BrowserModule,
        CommonModule,

        FormsModule,
        RouterModule, SlimScrollModule
    ],
    declarations: [
        //  Grid,
        DynamicLayout, PLPNavHeaderComponent,
        WidgetDynamicComponent, TilesDynamicComponent, ListDynamicComponent,
        TileDesignComponent
    ],
    exports: [
        //  Grid,
        DynamicLayout, PLPNavHeaderComponent,
        TileDesignComponent
    ],
    entryComponents: [TileDesignComponent, DynamicLayout],
    providers: []
})
export class GridModule {
    static withComponents(components: any[]) {
        return {
            ngModule: GridModule,
            providers: [

                {
                    provide: ANALYZE_FOR_ENTRY_COMPONENTS,
                    useValue: components,
                    multi: true
                }
            ]
        }
    }
}

