
import { Component, Input, OnInit, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { ReflectionComponent } from '../shared/reflection.component';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { EducationPlansModel } from '../education-plans/education-plans.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { CustomDate } from '../../../../shared/pipes/customPipes';
import { educationFieldsArr } from '../../../../shared/constants/app.constants';

@Component({
    selector: 'education-plans',
    templateUrl: './education-plans.layout.html',

})
export class EducationPlansComponent {
    @Input('report-status') report = "";
    @Output('changeView') changeInrView = new EventEmitter();
    @Output() containResult = new EventEmitter();
    @ViewChild(ReflectionComponent) public ReflectionComponent: ReflectionComponent;
    sectionObject;
    questionObject;
    educationFieldList;
    section = "EducationPlans";
    field = "PSPlans";

    currentFlag = "";
    endurl;
    selectedList = [];
    education = [];
    public filledstatus = "";
    //educationForm: ControlGroup;
    educationPlanCheck = new EducationPlansModel();
    educationSavedDt = "";
    public educationCompa = [

    ];
    public saveOnchangeVal = [

    ];
    public educationPlanRef = {
        "LastSaved": new Date,
        "userNotes": ""
    };

    public educationPostReq = {
        "accountID": "",
        "fieldName": "",
        "userNotes": ""
    };
    userNotesPost = "";
    successLabel;
    public edited = false;
    public errorVal = false;
    constructor(private serverApi: ServerApi, private utils: Utilities, private storageService: StorageService, private apiJson: ApiCallClass,
        private apiJson1: ApiCallClass, private plpShared: PLPSharedService,
        private educationPlansModel: EducationPlansModel,
        private fb: FormBuilder) {

    }
    ngOnInit() {
        this.utils.showLoading();
        this.storageService.sessionStorageSet('edu_plan_Chk', '');
        this.sectionObject = this.plpShared.getSectionObject(this.section);
        this.questionObject = this.plpShared.getQuestion(this.section);
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
        let t = educationFieldsArr;
        this.educationFieldList = t;
        // this.educationForm = this.fb.group({
        //   userNotes: ['', Validators.required]
        // });
        if (this.educationFieldList.length > 0) {
            this.educationFieldList.forEach((obj, key) => {
                obj.selected = false;
            })
        }
        this.getEducationPlans();
    }
    saveChanges() {
        let prev = JSON.parse(this.storageService.sessionStorageGet('educationFieldList'));
        let latest = this.educationFieldList;
        if ((this.plpShared.isJsonChanged(prev, latest) == true) || this.ReflectionComponent.changesMade(this.section)) {
            return true;
        } else {
            return false;
        }
        // return true;
    }
    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHander($event: any) {

        let change = this.saveChanges();
        if (change) {
            $event.returnValue = 'Your data will be lost!';
        }
    }
    getEducationPlans() {
        this.apiJson = new ApiCallClass();

        let urlObj = this.plpShared.getUrlObject(this.section);
        this.apiJson.endUrl = urlObj.endUrl;

        let userdata = {
            accountID: this.utils.getAccountId(),
            fieldName: urlObj.fieldNameCheck
        };
        this.apiJson.method = "GET";
        this.apiJson.moduleName = "PLP";
        this.apiJson.sessionID = this.utils.getAuthKey();
        let user = JSON.stringify(userdata);
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            this.educationPlanCheck = response[0].Result;
            // alert("this.educationPlanCheck----"+JSON.stringify(this.educationPlanCheck));
            this.educationSavedDt = response[0].Result.UpdatedTimeStamp;
            if (this.educationPlanCheck.UserNotes != null) {
                this.selectedList = this.educationPlanCheck.UserNotes.split(',');
                for (let i = 0; i < this.selectedList.length; i++) {
                    this.educationCompa.push({ 'usernotes': this.selectedList[i] });
                }
            }
            if (this.educationFieldList.length > 0) {
                this.educationFieldList.forEach((obj, key) => {
                    this.educationCompa.forEach((k, v) => {
                        if (obj.value == k.usernotes) {
                            // alert("yes");
                            obj.selected = true;
                        }
                    })
                })
            }
            this.storageService.sessionStorageSet('educationFieldList', JSON.stringify(this.educationFieldList));
            if (response[0].Result.UserNotes != '' && response[0].Result.UserNotes != null) {
                this.utils.dispatchSectionLoad(this.sectionObject.routerLink + '&Filled');
                this.storageService.sessionStorageSet('edu_plan_Chk', 'fill');
            }
            else {
                this.storageService.sessionStorageSet('edu_plan_Chk', 'empty');
            }

            this.utils.hideLoading();
        }, this.utils.handleError);
    }

    insertEducationPlanRef() {
        this.educationPlansModel.Today = new Date();
        let day = this.educationPlansModel.Today.getDate();
        let monthIndex = this.educationPlansModel.Today.getMonth();
        let year = this.educationPlansModel.Today.getFullYear();
        let todayDate = day + "/" + monthIndex + "/" + year;
        this.educationPlanRef.userNotes = todayDate + "\n" + this.educationPlanRef.userNotes;
    }

    saveEducationPlanCheck() {
        let tmp = [];
        this.utils.showLoading();
        let cnt = 0;
        //alert("sdfsdg---"+JSON.stringify(this.educationFieldList));
        if (this.educationFieldList.length > 0) {
            this.educationFieldList.forEach((obj, key) => {
                if (obj.selected == true) {
                    tmp.push(obj.value);
                }
                cnt++;
            })

        }
        // alert("currentValue--->"+currentValue);
        let urlObj = this.plpShared.getUrlObject(this.section);
        this.apiJson.endUrl = urlObj.endUrl;
        this.apiJson.method = "POST";
        this.apiJson.moduleName = "PLP";
        this.apiJson.sessionID = this.utils.getAuthKey();
        this.educationPostReq = {
            "accountID": this.utils.getAccountId(),
            "fieldName": urlObj.fieldNameCheck,
            "userNotes": tmp.join(',')
        };
        let user = JSON.stringify(this.educationPostReq);
        // alert("user-->"+urlObj.fieldNameCheck+"-----"+JSON.stringify(tmp));
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            //alert(response.Result);
            if (response.Result + "" == "true") {
                this.storageService.sessionStorageSet("educationFieldList", JSON.stringify(this.educationFieldList));
                this.utils.hideLoading();
                let dd = new Date();
                this.educationSavedDt = dd.toISOString();
                let successMsg = this.plpShared.getSuccessMessage(this.section);
                this.successLabel = successMsg.save;
                this.edited = true;
                let tmpjson;
                if (tmp.length != 0) {
                    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + '&Filled');
                    this.storageService.sessionStorageSet('edu_plan_Chk', 'fill');
                }
                else {
                    this.storageService.sessionStorageSet('edu_plan_Chk', 'empty');
                    if (this.storageService.sessionStorageGet('edu_plan_Ref') == 'empty') {
                        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + '&Empty');
                    }
                }
                // this.changeFilledStatus(tmpjson);
                //wait 5 Seconds and hide
                setTimeout(function () {
                    this.edited = false;
                    // console.log(this.edited);
                }.bind(this), 5000);
            }
            else {
                this.utils.hideLoading();
                let successMsg = this.plpShared.getSuccessMessage(this.section);
                this.successLabel = successMsg.error;
                this.errorVal = true;
                //wait 5 Seconds and hide
                setTimeout(function () {
                    this.errorVal = false;
                    // console.log(this.edited);
                }.bind(this), 5000);
            }
        }, error => this.logError(error));
    }

    logError(error: any) {
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.error;
        this.errorVal = true;
        //wait 5 Seconds and hide
        setTimeout(function () {
            this.errorVal = false;
            // console.log(this.edited);
        }.bind(this), 5000);
    }

    changeView(evnt) {
        this.changeInrView.emit(evnt);
    }

    // changeFilledStatus(evnt) {

    //   if (this.filledstatus == "filled" && evnt.result == "filled") {
    //      this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");

    //   }
    //   else if (this.filledstatus == "empty" && evnt.result == "empty") {
    //    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");

    //   }
    //   else {
    //    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
    //   }
    // }

    changesMade() {
        let prev = JSON.parse(this.storageService.sessionStorageGet('educationFieldList'));
        let latest = this.educationFieldList;
        if ((this.plpShared.isJsonChanged(prev, latest) == true) || this.ReflectionComponent.changesMade(this.section)) {
            return true
        } else {
            return false;
        }

    }

    savedDataAssigning() {
        this.educationFieldList = JSON.parse(this.storageService.sessionStorageGet("educationFieldList"));
        this.ReflectionComponent.savedDataAssigning(this.section);
    }
}
