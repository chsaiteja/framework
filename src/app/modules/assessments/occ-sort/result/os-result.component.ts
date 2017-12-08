/** Angular imports */
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

/** Custom imports */
import { Subscription } from 'rxjs/Subscription';

/** import shared Components */
import { AssessmentsService } from '../../shared/services/assessments.service';
import { OccupationListComponent } from '../../shared/occupation-list/occupation-list.component';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../../../shared/outer-services/event-dispatch.service';

@Component({
    selector: 'os-result',
    templateUrl: './os-result.layout.html',
})
export class OSResultComponent implements OnInit, OnDestroy {
    @ViewChild(OccupationListComponent) public occListComp: OccupationListComponent;

    occsort = [];
    listlength = -1;
    inList = '';
    inNotList = '';
    subscription = new Subscription;
    constructor(private trackEvnt: AssessmentsService, private storageService: StorageService,
        private router: Router, private utils: Utilities,
        private apiJson: ApiCallClass, private serverApi: ServerApi,
        private eventService: EventDispatchService) {
		/** Below code block listens broadcasted event and
		* calls respective functionality for this assessment */
        this.subscription = eventService.listen().subscribe((e) => {

            if (e.type == 'save_Complete') {
                this.saveUserNotes();
            } else if (e.type == 'print_occSort') {
                this.printResult();
            } else if (e.type == 'saveAnswerSet') {

            }
        });
    }

    /**This function is for getting into the Occ-sort result page. */
    ngOnInit() {
        this.storageService.sessionStorageSet('isAssessment', '');
        this.storageService.sessionStorageSet('isFrom', 'result');
        this.inList = this.storageService.sessionStorageGet('isWhy');
        this.inNotList = this.storageService.sessionStorageGet('isNotWhy');
        this.getSaveOccList();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**This function is for displaying the saved occlist. */
    getSaveOccList() {
        let ref = this;
        setTimeout(function () {
            if (ref.inList == 'true' || ref.inNotList == 'true') {
                ref.occListComp.inListOcc(this.inList);
            } else {
                ref.occListComp.getOccListData(JSON.parse(this.storageService.sessionStorageGet('OccList')));
            }
        }.bind(this), 1);
        this.occsort = JSON.parse(this.storageService.sessionStorageGet('OccList'));
    }

    /** This function is for saving the usernotes when user clicked on the save button. */
    saveUserNotes() {
        this.apiJson.method = 'POST';
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.apiJson.moduleName = 'Assessment/v1/';
        let SaveUserNotes = {};
        SaveUserNotes = {
            input_data: [
                {
                    'param_type': 'path',
                    'params': [this.storageService.sessionStorageGet('logID')]
                },
                {
                    'param_type': 'query',
                    'params': {}
                },
                {
                    'param_type': 'body',
                    'params': 'added'
                }
            ]
        };
        const user = JSON.stringify(SaveUserNotes);
        this.apiJson.endUrl = 'users/saveUserNotes';
        this.apiJson.data = user;
        this.trackEvnt.showSaveDialog(this.apiJson, 'OS');
    }

    printResult() {
        document.getElementById('openModalButton').click();
    }

	/**This function is for printing the result page when we click
	 * on done button in popup, that displays when print button is clicked  */
    printResultPage(divName) {
        try {
            let sOption = 'toolbar=no,location=no,directories=yes,menubar=no,';
            sOption += 'scrollbars=yes,width=775,height=600,left=10,top=25';
            const winprint = window.open('', '', sOption);
            winprint.document.open();
            winprint.document.write('<html>');
            winprint.document.write(`
             <head>
                        <style>
                 .alphanav-list li a {
                border-bottom: 1px solid #d6d6d6;
                display: block;
                padding: 15px 0 13px 51px;
                text-transform: capitalize;
                 }
                 .close,.print-btn-popup{
                display:none;
                 }
            </style>
             </head>`);
            winprint.document.write('<body onload="window.print()"><div id="print">');
            winprint.document.write(document.getElementById(divName).innerHTML);
            winprint.document.write('               ');
            winprint.document.write('</div></body></html>');
            winprint.document.close();
            winprint.focus();
        } catch (e) {
            alert('exception:' + e.message);
        }
    }
}
