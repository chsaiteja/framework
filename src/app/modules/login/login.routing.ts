// import { provideRouter, RouterConfig } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pageNotFound.component';


export const routes: Routes = [
    { path: '', component: PageNotFoundComponent }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class LoginRoutingModule { }
