
/** Angular imports */
import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/** Custom imports */
import { StorageService } from '../outer-services/storage.service';
import { Subscription } from "rxjs/Subscription";
import { EventDispatchService } from '../outer-services/event-dispatch.service';
import { NgbModal, NgbModalOptions, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { NgbdModalContent } from '../modal/shared-modal-component';
import { Store } from '@ngrx/store';
import { AsmntCommonState, defaultCommonText } from '../../state-management/state/main-state';


@Injectable()
export class UnSavedChangesCanActive implements CanDeactivate<any>{

    subscription = new Subscription;
    commonModelText;
    options: NgbModalOptions = {
        backdrop: 'static',
    };
    constructor(private store: Store<AsmntCommonState>, private router: Router, private storageService: StorageService, private modalService: NgbModal) {

    }
    canDeactivate(component: any): any {
        let sessExp = this.storageService.sessionStorageGet('sessionExpired');
        //alert('inside canActive sessExp:' + sessExp);
        if (component.saveChanges() && sessExp != 'true') {

            return this.confirm();
        }
        this.storageService.sessionStorageRemove('sessionExpired');
        return true;
    }

    confirm() {
        //console.log('confirm')
        const modalRef = this.modalService.open(NgbdModalContent, this.options);
        if (this.storageService.sessionStorageGet('savePartial') == "yes") {
            modalRef.componentInstance.commonButtons = { unsavedTxt: 'quitMsg', headsection: 'alert', yesbtn: 'yes', nobtn: 'no' };
        } else {
            modalRef.componentInstance.commonButtons = { unsavedTxt: 'startOverMsg', headsection: 'alert', yesbtn: 'yes', nobtn: 'no' };

            // modalRef.componentInstance.unsavedTxt = this.commonModelText.startOverMsg
        }
        // modalRef.componentInstance.headsection = this.commonModelText.alert
        // modalRef.componentInstance.yesbtn = this.commonModelText.yes
        // modalRef.componentInstance.nobtn = this.commonModelText.no
        modalRef.componentInstance.valueofunchange = "unsavedcheck";
        return modalRef.result;
    }

}
