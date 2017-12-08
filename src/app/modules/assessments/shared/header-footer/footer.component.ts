import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { FrameworkConfigState } from '../../../../state-management/state/main-state';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
@Component({
    selector: 'static-footer',
    template: `<footer id="fhid" class="common-footer w-100"  *ngIf="showFooter">
              <section class="copyright">
                <div class="container w-100">
                  <div class="row">
                    <div class="col-sm-12 text-center">
                  <div class="footer-text-desktop">
                    <p class="desktop-design-display">{{footervaluetext}}</p>
                   </div>     
                  <div class="mobile-design-display">
                  <p>
                    <span>© 1971-2016 University of Oregon. All rights reserved.</span>                           
                             <span class="tooltip-footer">
                     <span class="footer-mobile-text">Read more...</span>
                      <span class="tooltiptext">{{footervaluetext}}
                       </span>
                   </span>
                   </p>
                 </div>
                  </div>
                </div>
                </div>
              </section>
              <section class="footer-bottom"> </section>
            </footer>`,

})
export class StaticFooterComponent {
    footervaluetext = '';
    footervalposition = '';
    viewval = 0;
    footervaliptext = '';
    asmntname = '';
    subscription = new Subscription;
    endurl = '';
    showFooter = true;
    constructor(private store: Store<FrameworkConfigState>, private route: Router, private utils: Utilities) {
        // route.events.subscribe(event => {
        try {
            this.subscription = this.store.select('FrameworkConfigReducer').subscribe((res) => {
                const frameConfig = res['config'];//this.utils.sessionStorageGet('loginFrameworkConfiguration');

                // console.log('footer text:' + JSON.stringify(frameConfig));
                if (frameConfig !== undefined && frameConfig !== null && frameConfig !== '') {


                    const foorJson = (frameConfig);

                    this.footervaluetext = foorJson.Result.headerFooter.copyright;

                }
            });
            //  }
        } catch (e) {
            console.log('footer exception:' + e.message);
        }
        //  });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
