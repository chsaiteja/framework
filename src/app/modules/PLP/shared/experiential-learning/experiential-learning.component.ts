import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ExperientialLearningModel } from './experiential-learning.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { ExperientialLearningArr } from '../../../../shared/constants/app.constants';
import { CustomValidations } from '../shared/common-validation';
import { StorageService } from '../../../../shared/outer-services/storage.service';

@Component({
  selector: 'experiential-learning',
  templateUrl: './experiential-learning.layout.html',
})

export class ExperientialLearningComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();
  experLearningData: ExperientialLearningModel[];
  sectionObject;
  section = "ExperientialLearning";
  endUrl;
  experientialLearningArr;
  experientialLearningData = [];
  TotalExperientialLearning = [];
  SubTotalExperientialLearning = [];
  checkListEx = "";
  CheckName = "";
  chkList;
  Myself;
  Careers;
  Future;
  Try;
  currentValue = "";
  errorMessage;
  ExperientialLearningPost = {

  }
  text = "";
  public expLearn = "";
  ExperientialLearningForm: FormGroup;
  //ExpLearning = new FormControl;
  successLabel;
  public edited = false;
  public errorVal = false;
  constructor(private plpShared: PLPSharedService, private utils: Utilities, private storageService: StorageService,
    private apiJson: ApiCallClass, private serverApi: ServerApi, private fb: FormBuilder) {
    this.expFormControlValidations();
    this.errorMessage = this.utils.getMessages();
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.experientialLearningArr = ExperientialLearningArr;
    //  let expFormGroup: FormGroup = new FormGroup({}, (expFormGroup: FormGroup) => {
    //   return this.validateDays(expFormGroup);
    // });
    this.expFormControlValidations();
    this.getExperLearningData();
  }
  saveChanges() {
    if (this.plpShared.isJsonChanged(JSON.parse(this.storageService.sessionStorageGet("expLearnTmp")), this.TotalExperientialLearning)) {
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
  check(event) {
    document.onkeypress = function (event) {
      event.preventDefault();
    }
  }

  expFormControlValidations() {
    let expFormGroup: FormGroup = new FormGroup({});
    for (let d of this.TotalExperientialLearning) {
      let control1: FormControl = new FormControl(d.name, Validators.compose([CustomValidations.maxlengthCheck]));
      let control2: FormControl = new FormControl(d.Myself);
      let control3: FormControl = new FormControl(d.Careers);
      let control4: FormControl = new FormControl(d.Future);
      let control5: FormControl = new FormControl(d.Try);
      expFormGroup.addControl(d.name, control1);
      expFormGroup.addControl(d.Myself, control2);
      expFormGroup.addControl(d.Careers, control3);
      expFormGroup.addControl(d.Future, control4);
      expFormGroup.addControl(d.Try, control5);
    }
    this.ExperientialLearningForm = this.fb.group({
      expLearning: expFormGroup
    });
  }

  // private validateDays(ExperientialLearningForm: FormGroup) {
  //   for (let key in ExperientialLearningForm.controls) {
  //     if (ExperientialLearningForm.controls.hasOwnProperty(key)) {
  //       let control: FormControl = <FormControl>ExperientialLearningForm.controls[key];
  //       if (control.value != null && control.value.length > 50) {
  //         //alert("coming in if");
  //         return null;
  //       }
  //     }
  //   }

  //   return {
  //     validateDays: {
  //       valid: false
  //     }
  //   };
  // }
  formVal = "";
  changeTextarea(event, inxVal) {
    this.experientialLearningArr.forEach((v, k) => {
      if (k == inxVal) {
        this.formVal = v.name;
      }
    });

    //   //invalidText
    //   console.log(this.checkListEx);
    //   if(this.ExpLearning.hasError("invalidText")&&this.checkListEx==undefined){
    //   this.indexVal = inxVal;
    //   this.checkListEx = true;
    //   }
    //   else if(this.ExpLearning.hasError("maxlengthCheck")&&this.maxlengthCheckwrite==undefined){
    //   this.indexVal = inxVal;
    //   this.maxlengthCheckwrite = true;
    //   }
    //  if(this.ExpLearning.hasError("invalidText")){
    //     this.textInvalid = true;
    //     //console.log(event.key=="Backspace");
    //     this.check(event);
    //  }
    //  else{
    //    this.textInvalid = false;
    //    this.checkListEx = undefined;

    //  }
    //  if(this.ExpLearning.hasError("maxlengthCheck"))
    //  {
    //   this.maxlengthCheckError = true;
    //   this.check(event);
    //  }
    //  else{
    //    this.maxlengthCheckError = false;
    //    this.maxlengthCheckwrite = undefined;

    //  }
    //   if(this.textInvalid == false && this.maxlengthCheckError == false){
    //      document.onkeypress = null;
    //   } 
  }

  getExperLearningData() {
    let filledStatus = "";
    let filledcnt = 0;
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    let userdata = {
      accountID: this.utils.getAccountId()
    };
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let user = JSON.stringify(userdata);
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      try {
        let expLearnTmp = response[0].Result;
        this.experientialLearningData.push(expLearnTmp);
        //this.experientialLearningData.push(response[0].Result);
        if (this.experientialLearningData.length > 0) {
          this.experientialLearningData.forEach((obj, key) => {
            this.experientialLearningArr.forEach((v, k) => {
              this.chkList = [];
              this.Myself = false;
              this.Careers = false;
              this.Future = false;
              this.Try = false;
              let hoverTextVal = "";
              // alert("obj[v.subNameList]"+obj[v.subNameList]);
              if (obj[v.subNameList] != "" && obj[v.subNameList] != null) {
                filledcnt++;
                filledStatus = "filled";

                this.chkList = obj[v.subNameList].split(',');
                if (this.chkList.indexOf("Myself") > -1) {
                  this.Myself = true;
                }
                if (this.chkList.indexOf("Careers") > -1) {
                  this.Careers = true;
                }
                if (this.chkList.indexOf("Future") > -1) {
                  this.Future = true;
                }
                if (this.chkList.indexOf("Try") > -1) {
                  this.Try = true;
                }
              }
              else if (obj[v.subName] != "" && obj[v.subName] != null) {
                filledcnt++;
              }

              this.TotalExperientialLearning.push({
                'name': v.name,
                'text': obj[v.subName],
                'Myself': this.Myself,
                'Careers': this.Careers,
                'Future': this.Future,
                'Try': this.Try,
                'hoverTextVal': v.hoverText
              })

            })
          })
          this.storageService.sessionStorageSet("expLearnTmp", JSON.stringify(this.TotalExperientialLearning));
        }
        this.expFormControlValidations();
        if (filledcnt > 0) {
          // this.containResult.emit({ "section": this.section, result: "filled" });
          filledcnt = 0;

        }
        else {
          if (this.report == "") {
            this.expLearn = "data";
          }
          else {
            this.expLearn = "nodata";
          }
          //  this.containResult.emit({ "section": this.section, result: "empty" });
        }
      }
      catch (e) {
        alert("exception:experiential learning exception:" + e.message);
      }

      this.utils.hideLoading();
    }, this.utils.handleError);

  }

  //the below is to svae the experiential learning text and the list of checked values
  SaveExperientialLearning() {
    this.utils.showLoading();
    let postDataCheck = "";
    let filledcnt = 0;
    let ExperientialLearningPost = {};
    ExperientialLearningPost = {
      "AccountID": this.utils.getAccountId()
    }
    //alert(JSON.stringify(this.TotalExperientialLearning));
    this.TotalExperientialLearning.forEach((obj, key) => {
      let tmp = [];
      let tmpobj = {};
      if (obj.Myself == true) {
        tmp.push("Myself");
      }
      if (obj.Careers == true) {
        tmp.push("Careers");

      }
      if (obj.Future == true) {
        tmp.push("Future");

      }
      if (obj.Try == true) {
        tmp.push("Try");
      }
      ExperientialLearningPost[this.experientialLearningArr[key].subName] = obj.text;
      ExperientialLearningPost[this.experientialLearningArr[key].subNameList] = tmp.join(',');
      if (obj.text != "" && obj.text != null) {
        filledcnt++;
      }
      else if (tmp.length != 0) {
        filledcnt++;
      }
    })
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    this.apiJson.method = "POST";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let user = JSON.stringify(ExperientialLearningPost);
    this.apiJson.data = user;
    //alert("json--->"+JSON.stringify(ExperientialLearningPost));
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      if (response.Result + "" == "true") {
        // alert("res===>"+response.Result);
        this.storageService.sessionStorageSet("expLearnTmp", JSON.stringify(this.TotalExperientialLearning));
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.save;
        this.edited = true;
        //wait 5 Seconds and hide
        // alert("filledcnt--->"+filledcnt);
        if (filledcnt > 0) {
          //  this.containResult.emit({ "section": this.section, result: "filled" });
          this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
          filledcnt = 0;
        }
        else {
          this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
          this.expLearn = "true";
          //   this.containResult.emit({ "section": this.section, result: "empty" });
        }
        setTimeout(function () {
          this.edited = false;
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

  changeFilledStatus(evnt) {
    //this.containResult.emit(evnt);
  }

  savedDataAssigning() {
    for (let name in this.ExperientialLearningForm.controls) {
      //(<Control>this.ExperientialLearningForm.controls[name]).updateValue('');
      this.ExperientialLearningForm.controls[name].setErrors(null);
    }
    this.TotalExperientialLearning = JSON.parse(this.storageService.sessionStorageGet("expLearnTmp"));
    //this.experientialLearningArr=JSON.parse(sessionStorageGet("expLearnArr"));
    //alert(JSON.stringify(this.experientialLearningData));
  }

  changesMade() {
    if (this.plpShared.isJsonChanged(JSON.parse(this.storageService.sessionStorageGet("expLearnTmp")), this.TotalExperientialLearning)) {
      return true;
    } else {
      return false;
    }
  }
}
