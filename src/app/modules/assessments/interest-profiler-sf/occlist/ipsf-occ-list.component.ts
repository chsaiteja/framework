/**Angular imports */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

/** Services */
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

/**Assessment constants */
import { pieColors } from '../../shared/constants/assessments-constants';

/**Components */
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { AsmntQuestionState } from '../../../../state-management/state/main-state';
import { Subscription } from 'rxjs/Subscription';

import { Store, Action } from '@ngrx/store';
declare const Pizza: any;

@Component({
    selector: 'ipsf-occlist',
    templateUrl: './ipsf-occ-list.layout.html',
})

export class IPSFOccListComponent implements OnInit, OnDestroy {
    ipsfOccListData = []; /**Declare for storing the areas result */
    pieDataInOcc = []; /**Declare for storing the result */
    reducerSub3 = new Subscription; /** Declare to listen if any change occured.*/
    reducerSub1 = new Subscription; /** Declare to listen if any change occured.*/
    ip_Areas_Res; /**Declare for storing the result value*/
    areaResult; /**Declare for storing the common intro text.*/
    interest; /**Declare for setting the interest */
    pieColor = {}; /**Declare for assigning the pieColors */
    area; /**Declare for selecting the particular area */
    lang; /**Declare for getting the langset value.*/

    @ViewChild(OccupationListComponent) public occListComp: OccupationListComponent;
    constructor(private router: Router, private utils: Utilities, private storageService: StorageService,
        private apiJson: ApiCallClass, private serverApi: ServerApi, private elementRef: ElementRef,
        private store: Store<AsmntQuestionState>, private dispatchStore: Store<Action>) {
        this.lang = this.storageService.sessionStorageGet('langset');
    }

    ngOnInit() {

        this.dispatchStore.dispatch({
            type: 'GET_PARTICULAR_AREA_TEXT', payload: {
                methodVal: 'GET', module_Name: 'Assessment/v1/',
                path_params: ['areas'], query_params: { 'lang': this.lang },
                body_Params: {}, endUrlVal: 'ShortIP'
            }
        });
        this.reducerSub3 = this.store.select('AsmntParAreaText').subscribe((res) => {
            this.ip_Areas_Res = res;
            if (this.ip_Areas_Res.commonIntroText.length != undefined) {
                this.areaResult = this.ip_Areas_Res.commonIntroText;
            }

        });
        try {
            this.storageService.sessionStorageSet('module', 'ip');
            this.pieDataInOcc = JSON.parse(this.storageService.sessionStorageGet('resultIP'));
            this.interest = this.storageService.sessionStorageGet('ipsfInterest');
            this.pieColor = pieColors;
            setTimeout(function () {
                this.displayPieChartInOccList(this);
            }.bind(this), 0);
        } catch (e) {
            console.log('ipsf occ list oninit exception:' + e.message);
        }
    }

    /** This method is to display the pie chart. */
    displayPieChartInOccList(ref) {

        try {
            Pizza.init();
            this.elementRef.nativeElement.querySelector('#' + ref.interest).click();
        } catch (e) {
            console.log('displayPieChartInOccList exception :' + e.message);
        }
    }
    ngOnDestroy() {
        this.reducerSub1.unsubscribe();
    }

    /**
     * This method is used for getting the data from the server when clicked on the pie-chart links
     * @param area contains the area of interest
     */
    getIPAreaOccListParent(area) {
        try {
            this.interest = area;
            this.utils.showLoading();
            this.area = area;
            this.dispatchStore.dispatch({
                type: 'GET_AREA_TEXT', payload: {
                    methodVal: 'GET', module_Name: 'Assessment/v1/',
                    path_params: ['occList', this.area], query_params: { 'lang': this.lang },
                    body_Params: {}, endUrlVal: 'ShortIP'
                }
            });
            this.reducerSub1 = this.store.select('AsmntAreaText').subscribe((res) => {
                this.storageService.sessionStorageSet('OccList', JSON.stringify(res));
                this.ipsfOccListData.push(res);
                /** The below call is for assigning the occ data to the alpha scroll */
                this.occListComp.getOccListData(res);
            });
        } catch (e) {
            console.log('IP area exception-->' + e.message);
        }
    }
}
