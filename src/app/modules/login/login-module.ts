import { NgModule } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ServerApi } from '../../shared/outer-services/app.apicall.service';

import { Utilities } from '../../shared/outer-services/utilities.service';
import { ApiCallClass } from '../../shared/modal/apicall.modal';
import { PageNotFoundComponent } from './pageNotFound.component';

@NgModule({
    imports: [
        HttpModule, CommonModule, FormsModule,
        ReactiveFormsModule, RouterModule
    ],
    declarations: [
        PageNotFoundComponent
    ],
    providers: [
        ApiCallClass, ServerApi, Utilities
    ]
})

export class LoginModule { }