import { Component, Input, ViewContainerRef, OnInit, ComponentFactoryResolver } from "@angular/core";

@Component({
    selector: 'dynamic-layout-tag',
    template: ''
})
export class DynamicLayout implements OnInit {
    @Input() componentTypes: any;
    @Input() FrameworkObj: any;
    @Input() ItemsList: any;


    constructor(private viewContainerRef: ViewContainerRef,
        private cfr: ComponentFactoryResolver) {

    }



    ngOnInit() {
        let ref = this;
        let compFactory = this.cfr.resolveComponentFactory(this.componentTypes);
        // this.viewContainerRef.createComponent(compFactory).instance['ItemsList'] = this.ItemsList;
        this.viewContainerRef.createComponent(compFactory).instance['FrameworkObj'] = this.FrameworkObj;


    }


}
