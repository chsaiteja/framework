import { Component, Renderer, Input, Inject } from "@angular/core";
import { RouterModule, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { sectionsArr } from '../../../shared/constants/app.constants';
import { EventDispatchService } from '../../../shared/outer-services/event-dispatch.service';

import { ISlimScrollOptions } from 'ng2-slimscroll';
import { routeObj } from '../../../shared/constants/app.constants';
import { Store, Action } from '@ngrx/store';
import { langData } from '../../../shared/constants/app.constants';
import { FrameworkConfigState } from "../../../state-management/state/main-state";
import { PLPSharedService } from '../../PLP/shared/shared/PLP-shared.service';
import { Utilities } from '../../../shared/outer-services/utilities.service';
import { StoreService } from '../../../state-management/services/store-service';
@Component({
    selector: 'widget-dynamic-component',
    template: `
   
  
        <div class="container content-box-shadow tiles-top-spacing"><!--  -->
  
          <div class="d-block">
  
          <PLP-nav-header class="w-100" *ngIf='!tileView' [header]="sectionObject" [FrameworkObj]='FrameworkObj' (changeInrView)="changeViewHeader($event)" [report-status]="reportState"></PLP-nav-header>
         
         
        <div class="side-menu">

           <a href="#" class="widget-side-menu" (click)="$event.preventDefault();menuToggle()"  >
                <div class="icon-none-m" data-toggle="collapse" data-target=".nav-collapse.in"> 
                <i class="fa-micon-menu fa icon" [class.fa-close]="menuState" [class.fa-bars]="!menuState"></i> 
                </div>
                <div class="side-menu-text"> <span>Personal Learning Plan</span> </div>
            </a>
           
  <div class="scrollbar"   (click)="menuClose()">
    <nav class="main-menu sidemenu-t" [class.expanded]="menuState">

      <div  class="side-menu-scroll-bar" >
        <div class="scroll-innter">
          <ul>
            <li *ngFor="let item of FrameworkObj?.compList" 
            [ngClass]="(item.SectionComplete)? 'menu-filled':''"
            [class.menu-active]="(viewMode == item.url)" 
             
                       class="white-color"  > <a [routerLink]="item.url">
                        <span  [ngClass]="(item.SectionComplete )? 'menu-span-bg-box':'menu-not-filled'"> <i class="fa-micon {{item.icon}} fa"></i> </span>
                        
                        <span class="nav-text">{{item.compName}}</span> <i *ngIf = "item.SectionComplete==true" class="fa-micon fa fa-check"></i> </a> 
                         </li>
          </ul>
        </div> 
      </div>

    </nav>
  </div>

</div>
<div (click)="menuClose()"  >
  <router-outlet></router-outlet>
</div>
</div>
</div>

    `,
})


export class WidgetDynamicComponent {
    @Input('FrameworkObj') FrameworkObj;
    ItemName = "";
    viewMode;
    menuState = false;
    opts;
    Highlight;
    filledStatus;
    // frameworkObj;
    sectionObject;
    subscription = new Subscription;
    subscription1 = new Subscription;
    // subscription = new Subscription();
    constructor(// @Inject(Utilities) private utils,
        private common: StoreService,
        private renderer: Renderer,
        private router: Router,
        private plpShared: PLPSharedService,
        private eventService: EventDispatchService,
        private store: Store<FrameworkConfigState>) {
        // console.log("menuitems------------>" + JSON.stringify(this.ItemsList));
        this.subscription = this.eventService.listen().subscribe((e) => {
            try {
                //   let name = e.type;
                /* if (e.type.indexOf('&PLPSections') != -1) {
                     let name = e.type.split('&');
                     this.viewMode = './' + name[0];
                 }
                 else if (e.type.indexOf('&Filled') != -1) {
                     let name = e.type.split('&');
                     this.viewMode = './' + name[0];
                     // this.filledStatus = true;
                     let ref = this;
                     this.ItemsList['menuItems'].forEach(function (obj, inx) {
                         if (obj.url == ref.viewMode) {
                             obj['fillStatus'] = true;
                         }
                     });
                 }
                 else if (e.type.indexOf('&Empty') != -1) {
                     let name = e.type.split('&');
                     this.viewMode = './' + name[0];
                     // this.filledStatus = false;
                     let ref = this;
                     this.ItemsList['menuItems'].forEach(function (obj, inx) {
                         if (obj.url == ref.viewMode) {
                             obj['fillStatus'] = false;
                         }
                     });
                 }*/
            } catch (e) {
                alert('widget constructor inside exception:' + e.message);
            }
        });

        this.opts = {
            position: 'right',
            barBackground: '#555',
            gridBackground: '#016269',
            barWidth: '6',
            gridWidth: '0',
            barBorderRadius: '2'
        }

    }
    ngOnInit() {
        this.sectionObject = this.plpShared.getSectionObject("PersonalInfo");
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
                     // console.log("widget------->" + JSON.stringify(this.frameworkObj));
                 }
             } catch (e) {
                 console.log('assessment entry exception:' + e.message);
             }
 
 
         });*/

        let payloadjson = {
            type: "GET_SECTIONS_STATES", payload: {
                methodVal: 'GET', module_Name: 'PLP/api',
                path_params: ['CompletionStatus'], query_params: {},
                body_Params: {}, endUrlVal: ''
            }
        }
        this.common.commonLanguageChange("en", 'sectionsstatus', payloadjson);

        this.subscription1 = this.store.select('SectionsStatusValues').subscribe((sectionsResult) => {
            // console.log('Inside widget component SectionsStatusValues:' + JSON.stringify(sectionsResult));
            this.FrameworkObj.compList.forEach(function (obj, inx) {
                sectionsResult['statusValues'].find((inrObj) => {
                    if (obj.apiName == inrObj.SectionCode) {
                        obj['SectionComplete'] = inrObj.SectionComplete;
                        return true;
                    }

                })
            });
            // console.log('Inside widget component FrameworkObj:' + JSON.stringify(this.FrameworkObj));

        });
        this.subscription = this.router.events.debounceTime(100).subscribe(event => {
            let urlArr = window.location.pathname.split('/');
            this.viewMode = './' + urlArr[urlArr.length - 1]

        })
    }
    menuToggle() {
        this.menuState = !this.menuState;
        // alert('menu toggle clicked:' + this.menuState);
    }
    menuClose() {
        this.menuState = false;
    }
    // widgetClicked(name) {
    //     this.ItemName = 'plpWidget&' + name;
    //     var evnt = document.createEvent("CustomEvent");
    //     evnt.initEvent(this.ItemName, true, true);
    //     this.eventService.dispatch(evnt);
    // }

    trackevnt() {
    }
    changeViewHeader(evnt) {
        try {
            let name = evnt;
            this.sectionObject = this.plpShared.getSectionObject(name);
        }
        catch (e) {
            console.log("Exception in PlpComponent oninit" + e.message);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription1.unsubscribe();
    }
}
