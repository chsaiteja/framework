import { Injectable, OnDestroy, Inject } from '@angular/core';
import { langData } from '../../shared/constants/app.constants';
import { Store, Action } from '@ngrx/store';
import { StorageService } from '../../shared/outer-services/storage.service'
import { NgbdModalLoaderContent } from "../../shared/modal/shared-modal-component";
@Injectable()
export class StoreService {
    constructor(private loaderContent: NgbdModalLoaderContent, private storageService: StorageService, private dispatchStore: Store<Action>) {

    }
    getLangChange(langVal, key, result) {
        let val = JSON.parse(this.storageService.sessionStorageGet('langDataStore'));
        if (Object.keys(val[langVal]).indexOf(key) != -1) {
            return result;
        }
        else {
            val[langVal][key] = result;
            this.storageService.sessionStorageSet('langDataStore', JSON.stringify(val));
            return result;
        }
    }

    commonLanguageChange(langVal, key, payload) {
        try {
            let val = JSON.parse(this.storageService.sessionStorageGet('langDataStore'));
            if (Object.keys(val).indexOf(langVal) == -1) {
                console.log('inside commonLanguageChange:');
                this.loaderContent.showLoading();
                val[langVal] = {};
                this.storageService.sessionStorageSet('langDataStore', JSON.stringify(val));
                this.dispatchStore.dispatch(payload);

            } else {
                if (Object.keys(val[langVal]).indexOf(key) == -1) {
                    this.dispatchStore.dispatch(payload);
                }
                else {
                    if (key == 'OCC_index_list') {
                        this.storageService.sessionStorageSet('OccIndexReducerText', JSON.stringify({ commonText: val[langVal][key] }));
                    }
                }
            }

        } catch (e) {
            console.log("exception in commonLanguageChange " + e.message);
        }
    }

    ngOnDestroy() {
    }

}