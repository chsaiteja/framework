import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {ChildComponent} from './child-component'
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {ParentComponent} from './parent.component';
import {ChildOneComponent} from './childone.component';
import {ChildTwoComponent} from './childtwo.component'
@NgModule({
  declarations: [
    AppComponent,ChildComponent,ParentComponent,ChildOneComponent,ChildTwoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [ParentComponent]
})
export class AppModule { }
