import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { RouterModule, Router } from '@angular/router';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
import { TilesDynamicComponent } from '../tiles.component';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
    selector: 'tile-component',
    template: ` 
    
      <dynamic-layout-tag [componentTypes]="componentType" [FrameworkObj]="FrameworkObj"></dynamic-layout-tag>
    `,
})
export class TileDesignComponent implements OnInit, OnDestroy {
    @Input('FrameworkObj') FrameworkObj = [];
    subscription = new Subscription;
    componentType = TilesDynamicComponent;
    constructor(private route: Router, private eventDispatcher: EventDispatchService, private storageService: StorageService) {
    }

    ngOnInit() {

        // let ref = this;
        // let items = this.storageService.sessionStorageGet('itemsList');

        // this.itemsList = JSON.parse(items);

    }

    ngOnDestroy() {

    }
}
