import { Component, Input, OnInit, Renderer, OnDestroy } from "@angular/core";
import { RouterModule, Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationExtras } from '@angular/router';
import { EventDispatchService } from '../../../shared/outer-services/event-dispatch.service';
import { Subscription } from "rxjs/Subscription";
import { Utilities } from '../../../shared/outer-services/utilities.service';
import { NgbdModalContent, NgbdModalLoaderContent } from '../../../shared/modal/shared-modal-component';
import { routeObj } from '../../../shared/constants/app.constants';
import { Store, Action } from '@ngrx/store';
import { langData } from '../../../shared/constants/app.constants';
import { FrameworkConfigState } from "../../../state-management/state/main-state";
import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'tiles-dynamic-component',
    templateUrl: `./tiles.layout.html`,
})
export class TilesDynamicComponent implements OnInit, OnDestroy {
    @Input('FrameworkObj') frameworkObj;
    //  @Input() framework;
    // frameworkObj;
    subscription = new Subscription;
    subscription1 = new Subscription;
    tileView;
    ItemName = "";
    urlArr;
    constructor(private store: Store<FrameworkConfigState>, private loaderContent: NgbdModalLoaderContent, private renderer: Renderer, private dispatchStore: Store<Action>, private route: Router, private activeRoute: ActivatedRoute, private eventDispatcher: EventDispatchService) {
        let ref = this, activeRouteUrl = '';
        this.subscription = route.events.debounceTime(100).subscribe(event => {
            this.urlArr = window.location.pathname.split('/');
            if (this.urlArr[this.urlArr.length - 1] === 'tiles' || this.urlArr.length === 3) {
                window.sessionStorage.setItem('inTab', '');
                this.tileView = true;
                this.loaderContent.hideLoading();
            } else {
                this.tileView = false;
            }
        })


    }

    ngOnInit() {
        /* this.subscription1 = this.store.select('FrameworkConfigReducer').subscribe((frameworkResult) => {
             const path = (window.location.pathname).split('/');
             let moduleName = path[2];
             let framework = frameworkResult['config'].Result.tabItems.find((obj, inx) => {
                 return moduleName == obj.tabId;
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
         */
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription1.unsubscribe();
    }
    tileClicked(item) {
        window.sessionStorage.setItem('careerShow', '0');
        window.sessionStorage.setItem('assessmentheader', JSON.stringify(item.compId));
        this.loaderContent.showLoading();
        this.dispatchStore.dispatch({ type: "RESET_STORE" });
        document.title = item.compName;
        let Arr = this.route.url.split('./');
        this.ItemName = 'plpTile&' + item.name;
        var evnt = document.createEvent("CustomEvent");
        evnt.initEvent(this.ItemName, true, true);
        this.eventDispatcher.dispatch(evnt);
        if (item.name == "CCI Jr") {
            window.sessionStorage.setItem('CCIassessment', 'CCIJr');
        }
        else {
            window.sessionStorage.setItem('CCIassessment', 'CCIAdult');
        }
        setTimeout(function () {
            this.route.navigate([item.url], { relativeTo: this.activeRoute });
        }.bind(this), 50);

    }
}
