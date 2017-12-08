import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CustomValidations } from '../shared/common-validation';
import { PersonalInfoModel } from '../personal-info/personal-info.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
@Component({
    selector: 'personal-info',
    templateUrl: './personal-info.layout.html',
})


export class PersonalInfoComponent implements OnInit {
    @Input('report-status') report = "";
    @Output('changeView') changeInrView = new EventEmitter();
    @Output() containResult = new EventEmitter();
    // @Output() userDataChanged = new EventEmitter();
    errorMessage: any;
    section = "PersonalInfo";
    sectionObject;
    endURL;
    isLoading = true;
    userInfo = new PersonalInfoModel;
    imageUrl;
    personalForm: FormGroup;
    endurl;
    sub;
    successLabel;
    public edited = false;
    public errorVal = false;
    constructor(private serverApi: ServerApi, private utils: Utilities,
        private personalInfoModel: PersonalInfoModel, private storageService: StorageService,
        private apiJson: ApiCallClass,
        private apiJson1: ApiCallClass, private plpShared: PLPSharedService,
        fb: FormBuilder) {
        // alert("coming in personal info");

        try {
            this.personalForm = fb.group({
                lastName: ["", Validators.compose([Validators.required, Validators.maxLength(50), CustomValidations.noScript])],
                firstName: ["", Validators.compose([Validators.required, Validators.maxLength(50), CustomValidations.noScript])],
                middleName: ["", Validators.compose([Validators.maxLength(50), CustomValidations.noScript])],
                email: ["", Validators.compose([Validators.required, CustomValidations.mailFormat, Validators.maxLength(50)])],
                gradYear: ["", Validators.compose([Validators.required, CustomValidations.containOnlyNumerals])]
            });
            this.errorMessage = this.utils.getMessages();
        }
        catch (e) {
            alert("error----->" + e.message);
        }

    }

    changeView(evnt) {
        this.changeInrView.emit(evnt);
    }
    //The method is called when the component is initialized 
    ngOnInit() {
        this.utils.showLoading();
        this.sectionObject = this.plpShared.getSectionObject(this.section);
        //console.log("sectionObject---->" + JSON.stringify(this.sectionObject));
        //  this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");

        this.getPersonalInfo();
    }
    saveChanges() {
        let prev = JSON.parse(this.storageService.sessionStorageGet('personalInfo'));
        let latest = this.userInfo;
        let prevNotImg = this.formJson(prev);
        let latestNotImg = this.formJson(latest);
        if (this.plpShared.isJsonChanged(prevNotImg, latestNotImg)) {
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

    changeText(event) {
        if (this.personalForm.controls['lastName'].hasError("maxlength") || this.personalForm.controls['firstName'].hasError("maxlength")) {
            return event.which == 8;
        }
        if (this.personalForm.controls['middleName'].hasError("maxlength") || this.personalForm.controls['email'].hasError("maxlength")) {
            return event.which == 8;
        }
    }

    //The below method is used to get the data from server.
    getPersonalInfo() {
        let userdata = {
            accountID: this.utils.getAccountId()
        };
        this.apiJson.method = "GET";
        let urlObj = this.plpShared.getUrlObject(this.section);
        this.apiJson.endUrl = urlObj.endUrl;
        this.apiJson.moduleName = "PLP";
        //this.apiJson.endUrl = "Account";
        // this.apiJson.sessionID = this.utils.getAuthKey();
        let user = JSON.stringify(userdata);
        this.apiJson.data = user;
        //console.log("personal info----->" + JSON.stringify(this.apiJson))
        // alert("data---->" + user);
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            let tmp = response[0].Result;
            this.storageService.sessionStorageSet('personalInfo', JSON.stringify(tmp));
            this.userInfo = tmp;
            this.userInfo.UserFullName = this.userInfo.FirstName + " " + this.userInfo.LastName;
            if (this.userInfo.Avatar == null) {
                this.userInfo.Avatar = "./assets/images/no-profile-image.jpg";
            }

            if ((this.userInfo.LastName.trim() != "") && (this.userInfo.FirstName.trim() != "") && (this.userInfo.GradYear.trim() != "") && (this.userInfo.Email.trim() != "")) {
                this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
            }
            else {
                this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
            }

            this.utils.hideLoading();
            // this.isLoading = false;
        }, this.utils.handleError);
    }


    //The below method is used to send the data to the server
    SavePersonalInfo() {
        this.utils.showLoading();
        this.apiJson.method = "POST";
        this.apiJson.endUrl = "Account";
        this.apiJson.moduleName = "PLP";
        let email = this.userInfo.Email;
        if (email == null) {
            email = "";
        }
        let data = {
            "AccountID": this.utils.getAccountId(),
            "FirstName": this.userInfo.FirstName,
            "LastName": this.userInfo.LastName,
            "MiddleName": this.userInfo.MiddleName,
            "GradYear": this.userInfo.GradYear,
            "Email": email
        };
        this.apiJson.sessionID = this.utils.getAuthKey();
        let user = JSON.stringify(data);
        this.apiJson.data = user;
        this.serverApi.callApi([this.apiJson]).subscribe((response) => {
            if (response.Result + "" == "true") {
                this.storageService.sessionStorageSet('personalInfo', JSON.stringify(this.userInfo));
                this.utils.hideLoading();
                let successMsg = this.plpShared.getSuccessMessage(this.section);
                this.successLabel = successMsg.update;
                // alert(successMsg.error);
                this.edited = true;
                // alert( this.sectionObject);
                if ((this.userInfo.LastName.trim() != "") && (this.userInfo.FirstName.trim() != "") && (this.userInfo.GradYear.trim() != "") && (this.userInfo.Email.trim() != "")) {
                    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
                }
                else {
                    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
                }
                //wait 3 Seconds and hide
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
                //wait 3 Seconds and hide
                setTimeout(function () {
                    this.errorVal = false;
                    // console.log(this.edited);
                }.bind(this), 5000);
            }
            this.userInfo.UserFullName = this.userInfo.FirstName + " " + this.userInfo.LastName;
            // this.userDataChanged.emit({ "username": this.userInfo.UserFullName });
            this.utils.dispatchSectionLoad(this.userInfo.UserFullName + "&PLPSectionName");
        }, error => this.logError(error));
    }


    logError(error: any) {
        // alert(error);
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.error;
        this.errorVal = true;
        //wait 3 Seconds and hide
        setTimeout(function () {
            this.errorVal = false;
            // console.log(this.edited);
        }.bind(this), 5000);
    }


    savedDataAssigning() {
        for (let name in this.personalForm.controls) {
            // (<Control>this.personalForm.controls[name]).updateValue('');
            this.personalForm.controls[name].setErrors(null);
        } this.userInfo = JSON.parse(this.storageService.sessionStorageGet('personalInfo'));
    }

    changesMade() {
        let prev = JSON.parse(this.storageService.sessionStorageGet('personalInfo'));
        let latest = this.userInfo;
        let prevNotImg = this.formJson(prev);
        let latestNotImg = this.formJson(latest);
        if (this.plpShared.isJsonChanged(prevNotImg, latestNotImg)) {
            return true;
        } else {
            return false;
        }
    }

    formJson(jsonObj) {
        let returnObj = {}
        for (let key in jsonObj) {
            if (key + "" != "Avatar" && key + "" != "UserFullName") {
                returnObj[key] = jsonObj[key];
            }
        }
        return returnObj;
    }
}
