import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CustomValidations } from '../shared/common-validation';
import { ReflectionModel } from './reflection.model';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { PLPSharedService } from './PLP-shared.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { CustomDate } from '../../../../shared/pipes/customPipes';

import { EndUrlArr } from '../../../../shared/constants/app.constants';
import { messages } from '../../../../shared/constants/messages';

@Component({
    selector: 'reflection',
    templateUrl: './reflection.layout.html',
})
export class ReflectionComponent {
    @Input() reflectionObj = "";
    @Input() fieldName = "";
    @Input() sectionName = "";
    @Input('question') question = "";
    @Input('report-status') report = "";
    @Output() containResult = new EventEmitter();

    reflectionInfoPara = "";
    reflectionInfo = new ReflectionModel();
    reflectionPostReq;//=new ReflectionModel();
    reflectionFieldName;
    endurl;
    sectionObject;
    errorMessage;
    successLabel;
    public edited = false;
    public errorVal = false;
    public userdata = {
        accountID: this.utils.getAccountId(),
        fieldName: ""
    };

    reflectionForm: FormGroup;
    ReflectionText: AbstractControl;
    constructor(private serverApi: ServerApi, private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass,
        private reflectionModel: ReflectionModel, private plpShared: PLPSharedService, fb: FormBuilder) {
        this.reflectionForm = fb.group({
            'ReflectionText': ["", Validators.compose([CustomValidations.noScript, CustomValidations.maxlengthCheck])]
        });
        this.ReflectionText = this.reflectionForm.controls['ReflectionText'];
        this.errorMessage = messages;

    }

    changeTextarea(event) {
        if (this.ReflectionText.hasError("maxlengthCheck")) {
            return event.which == 8;
        }
    }

    ngOnInit() {
        this.storageService.sessionStorageSet('edu_plan_Ref', '');
        this.utils.showLoading();
        this.endurl = EndUrlArr;
        this.getReflection();
    }

    //This function is used to get data from server 
    getReflection() {
        this.apiJson.method = "GET";
        this.apiJson.moduleName = "PLP";
        let filledstatus = "";
        let urlObj = this.plpShared.getUrlObject(this.sectionName);
        this.apiJson.endUrl = urlObj.endUrl;
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.userdata.fieldName = this.fieldName;
        let user = JSON.stringify(this.userdata);
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            let reflectTmp = response[0].Result;
            this.storageService.sessionStorageSet("'" + this.sectionName + "'", JSON.stringify(reflectTmp));
            this.reflectionInfo = reflectTmp;
            this.sectionObject = this.plpShared.getSectionObject(this.sectionName);
            if (response[0].Result.UserNotes != null && response[0].Result.UserNotes.trim() != "") {
                this.reflectionInfo.UserNotes = (response[0].Result.UserNotes);
                this.reflectionInfoPara = (response[0].Result.UserNotes).replace(/\n/g, "<br/>");
                filledstatus = "filled";
            }
            else {
                filledstatus = "";
            }
            if (filledstatus == "filled") {
                if (this.sectionName == 'EducationPlans') {
                    this.storageService.sessionStorageSet('edu_plan_Ref', 'fill');
                }
                this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
            }
            else {
                if (this.sectionName == 'EducationPlans') {
                    this.storageService.sessionStorageSet('edu_plan_Ref', 'empty');
                    if (this.storageService.sessionStorageGet('edu_plan_Chk') == 'empty') {
                        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
                    }
                }
                else {
                    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
                }
            }
            this.utils.hideLoading();
        }, this.utils.handleError);
    }

    //This function is used to post data to server
    saveReflectionInfo() {
        this.utils.showLoading();
        this.apiJson.method = "POST";
        this.apiJson.moduleName = "PLP";
        let urlObj = this.plpShared.getUrlObject(this.sectionName);
        if (urlObj.section == "EducationPlans") {
            this.reflectionFieldName = urlObj.fieldNameRef;
            //alert("coming in educarion palns");
        }
        else {
            this.reflectionFieldName = urlObj.fieldName;
        }
        this.apiJson.endUrl = urlObj.endUrl;

        this.apiJson.sessionID = this.utils.getAuthKey();
        this.reflectionPostReq = {
            "AccountID": this.utils.getAccountId(),
            "FieldName": this.reflectionFieldName,
            "UserNotes": this.reflectionInfo.UserNotes
        };

        let user = JSON.stringify(this.reflectionPostReq);
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            //alert("response===>"+response.Result);
            if (response.Result + "" == "true") {
                this.storageService.sessionStorageSet("'" + this.sectionName + "'", JSON.stringify(this.reflectionInfo));
                this.reflectionInfo.UserNotes = this.reflectionPostReq.UserNotes;
                this.utils.hideLoading();
                let dd = new Date();
                this.reflectionInfo.UpdatedTimeStamp = dd.toISOString();
                //alert("date value is--->"+dd);
                let successMsg = this.plpShared.getSuccessMessage(this.sectionName);
                this.successLabel = successMsg.save;
                // alert(successMsg.error);
                this.edited = true;
                //wait 3 Seconds and hide
                //alert("this.reflectionInfo.UserNotes"+this.reflectionInfo.UserNotes);

                if (this.reflectionInfo.UserNotes.trim() != null && this.reflectionInfo.UserNotes.trim() != "") {
                    if (this.sectionName == 'EducationPlans') {
                        this.storageService.sessionStorageSet('edu_plan_Ref', 'fill');
                    }
                    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
                }
                else {
                    this.storageService.sessionStorageSet('edu_plan_Ref', 'empty');
                    if (this.sectionName == 'EducationPlans') {
                        if (this.storageService.sessionStorageGet('edu_plan_Chk') == 'empty') {
                            this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
                        }
                    }
                    else {
                        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
                    }

                    // this.containResult.emit({ "section": this.sectionName, result: "empty" });
                }
                setTimeout(function () {
                    this.edited = false;
                    // console.log(this.edited);
                }.bind(this), 5000);
            }
            else {
                this.utils.hideLoading();
                let successMsg = this.plpShared.getSuccessMessage(this.sectionName);
                this.successLabel = successMsg.error;
                this.errorVal = true;
                //wait 3 Seconds and hide
                setTimeout(function () {
                    this.errorVal = false;
                    // console.log(this.edited);
                }.bind(this), 5000);
            }
        }, error => this.logError(error));


    }

    logError(error: any) {
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.sectionName);
        this.successLabel = successMsg.error;
        this.errorVal = true;
        //wait 3 Seconds and hide
        setTimeout(function () {
            this.errorVal = false;
            // console.log(this.edited);
        }.bind(this), 5000);
    }

    InsertReflectionInfo() {
        try {
            let dt = new Date();
            let day = dt.getDate();
            let monthIndex = dt.getMonth() + 1;  //January is 0!
            let year = dt.getFullYear();
            let mm = monthIndex + "";
            let dd = day + "";
            if (day < 10) {
                dd = '0' + day;
            }
            if (monthIndex < 10) {
                mm = '0' + monthIndex;
            }
            let todayDate = mm + "/" + dd + "/" + year;
            this.reflectionInfo.UserNotes = todayDate + "\n" + this.reflectionInfo.UserNotes;
        }
        catch (e) {
            alert("insert date exception:" + e.message);

        }
    }

    savedDataAssigning(componentName) {
        try {
            if (this.storageService.sessionStorageGet("'" + componentName + "'") + "" == "null" || this.storageService.sessionStorageGet("'" + componentName + "'") + "" == "") {
                this.reflectionInfo.UserNotes = "";
            } else {
                let refobj = JSON.parse(this.storageService.sessionStorageGet("'" + componentName + "'"));
                for (let name in this.reflectionForm.controls) {
                    // (<Control>this.reflectionForm.controls[name]).updateValue('');
                    this.reflectionForm.controls[name].setErrors(null);
                }
                this.reflectionInfo.UserNotes = refobj.UserNotes;

            }
        } catch (e) {
            alert("exception reflection=>" + e.message);
        }

    }

    changesMade(section) {
        if (this.reflectionInfo.UserNotes != JSON.parse(this.storageService.sessionStorageGet("'" + section + "'")).UserNotes) {
            return true;
        } else {
            return false;
        }
    }



}