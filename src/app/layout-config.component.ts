import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';

import { WidgetDynamicComponent } from './modules/framework/layouts/widget.component';
import { Subscription } from 'rxjs/Subscription';
import { Utilities } from './shared/outer-services/utilities.service';
import { routeObj } from './shared/constants/app.constants';

import { FrameworkConfigState } from './state-management/state/main-state';
@Component({
    selector: 'layout-config-component',
    template: `
              <div id="wrapper-body">
                <div id="main-wrapper-body">
                    <div id="main-body" tabindex="-1">
                        <dynamic-layout-tag [componentTypes]="componentType" [FrameworkObj]="frameworkObj">
                        </dynamic-layout-tag>

                        <static-footer class="footerheightlength" ></static-footer>
                    </div> 
                </div> 
            </div>
            `
})
export class LayoutConfigComponent implements OnInit, OnDestroy {
    componentType = WidgetDynamicComponent;

    moduleName = '';
    frameworkObj;

    subscription = new Subscription;
    constructor(private store: Store<FrameworkConfigState>, private utils: Utilities,
        private actRoute: ActivatedRoute, private router: Router) {
        const path = (window.location.pathname).split('/');
        this.moduleName = path[2];
    }

    ngOnInit() {
        let frame: any;
        let test = {};
        // this.utils.showLoading();
        frame = this.utils.getFrameworkComponent(this.moduleName);
        try {
            this.componentType = frame.component;
            this.subscription = this.store.select('FrameworkConfigReducer').subscribe((frameworkResult) => {
                const path = (window.location.pathname).split('/');
                let moduleName = path[2];
                let framework = frameworkResult['config'].Result.tabItems.find((obj, inx) => {
                    return (moduleName == obj.tabId);
                });
                try {
                    let list = [], result = {};
                    if (framework + '' != 'undefined') {

                        framework.compList.forEach(function (obj, inx) {
                            if (routeObj[obj.compId] !== undefined) {
                                let result = Object.assign({}, routeObj[obj.compId].itemConfig, obj);
                                framework.compList[inx] = result;
                            }
                        }.bind(this));

                        framework['menuHighlightStatus'] = false;
                        if (framework.tabId + '' == '1') {
                            framework.image = '../assets/images/career-landing.jpg';
                        } else {
                            framework.image = '../assets/images/assessments-landing.jpg';

                        }
                        this.frameworkObj = framework;

                    }
                } catch (e) {
                    console.log('assessment entry exception:' + e.message);
                }
            });
        } catch (e) {
            console.log('assessment entry exception:' + e.message);
        }

    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
