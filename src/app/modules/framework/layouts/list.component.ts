import { Component, Input } from "@angular/core";
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'list-dynamic-component',
    template: `


    <div class="row" style="padding-top:50px;">
            <button *ngFor="let item of ItemsList.menuItems" (click)="navTo(item.url)"  class="" 
             [ngStyle]="{'background-color':item.color}" style="margin: 5px">
                {{item.displayName}}
                {{item.name}}
            </button> 
        </div> 
    <router-outlet></router-outlet>
    `,
})
export class ListDynamicComponent {
    @Input() ItemsList;
    constructor(private router: Router, private activeRoute: ActivatedRoute) {

    }
    navTo(url) {
        try {
            this.router.navigate([url], { relativeTo: this.activeRoute });
        } catch (e) {
            console.log('Exception occured while navigating to the route:' + e.message);
        }
    }
}
