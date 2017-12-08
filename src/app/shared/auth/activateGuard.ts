
/** Angular imports */
import {
    CanDeactivate, Router, CanActivate,
    ActivatedRouteSnapshot, RouterStateSnapshot,
    NavigationEnd, NavigationStart
} from '@angular/router';
import { Injectable } from '@angular/core';

/** rxjs imports */
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/first';

/** Custom imports */
import { AssessmentsService } from '../../modules/assessments/shared/services/assessments.service'
import { IPSFResultComponent } from '../../modules/assessments/interest-profiler-sf/result/ipsf-result.component'
import { StorageService } from '../outer-services/storage.service';
// import { Utilities } from './utilities.class';


@Injectable()
export class ActivatingClass implements CanActivate {
    authService;
    constructor(private _router: Router, private _authService: AssessmentsService, private storageService: StorageService) {
        this.authService = _authService;
        this._router.events.pairwise().subscribe((e) => {

            e.map((val) => {
                //console.log('route history is:' + val.url + ' string:' + val.toString());
            });
        });
    }

    canActivate(active: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        try {
            if (this.storageService.sessionStorageGet('isFrom') === 'intro') {
                return true;
            } else if (this.storageService.sessionStorageGet('isFrom') === 'result') {
                if (this.storageService.sessionStorageGet('mainPath') === 'intro') {
                    this._router.navigateByUrl(active.url + '/intro');
                } else if (this.storageService.sessionStorageGet('mainPath') === 'restore') {
                    this._router.navigateByUrl(active.url + '/restore');
                }
                return false;
            } else {
                return true;
            }


        } catch (e) {
            alert('canDeactivate exception=>' + e.message);
        }

    }
}