import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';


import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CustomDate } from '../../../../shared/pipes/customPipes';
import { CareerClusterModel } from './career-cluster.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { EndUrlArr } from '../../../../shared/constants/app.constants';
import { StorageService } from '../../../../shared/outer-services/storage.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'career-cluster',
  templateUrl: './career-cluster.layout.html',
})
export class CareerClusterComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  careerClusterData: CareerClusterModel[];
  careerClusterCheck = "";
  clusterId = [];
  sectionObject;
  questionObject;
  section = "CareerCluster";
  endurl;

  careerFieldName;
  reflection;
  successLabel;
  public edited = false;
  public errorVal = false;
  selectedList = [];
  constructor(private plpShared: PLPSharedService, private utils: Utilities, private storageService: StorageService, private serverApi: ServerApi,
    private apiJson: ApiCallClass, private apiJson1: ApiCallClass) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.questionObject = this.plpShared.getQuestion(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.endurl = EndUrlArr;
    this.getCareerClusterData();
  }
  saveChanges() {
    if (this.plpShared.isJsonChanged(JSON.parse(this.storageService.sessionStorageGet("careerClus")), this.careerClusterData)) {
      return true;
    } else {
      return false;
    }
  } @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event: any) {

    let change = this.saveChanges();
    if (change) {
      $event.returnValue = 'Your data will be lost!';
    }
  }


  public educationPostReq = {
    "accountID": "",
    "fieldName": "",
    "userNotes": ""
  };
  getCareerClusterData() {
    this.apiJson = new ApiCallClass();
    let data = {
      accountID: this.utils.getAccountId()
    }
    let education = [];
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";

    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.secondRef;
    this.careerFieldName = urlObj.fieldName;
    this.reflection = urlObj.endUrl;

    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.data = dat;
    education[0] = this.apiJson;
    //var apiJson1:ApiCallClass;  
    let data1 = {
      accountID: this.utils.getAccountId(),
      fieldName: this.careerFieldName
    };
    this.apiJson1 = new ApiCallClass();
    this.apiJson1.method = "GET";
    this.apiJson1.moduleName = "PLP";
    this.apiJson1.endUrl = this.reflection;
    this.apiJson1.sessionID = this.utils.getAuthKey();

    let user1 = JSON.stringify(data1);
    this.apiJson1.data = user1;
    education[1] = this.apiJson1;
    this.serverApi.callApi(education).subscribe((response) => {

      this.careerClusterData = response[0].Result;
      //  alert(JSON.stringify(this.careerClusterData));
      this.careerClusterCheck = response[1].Result.UpdatedTimeStamp;
      if (response[1].Result.UserNotes != null) {
        this.selectedList = response[1].Result.UserNotes.split(' ');
        for (let i = 0; i < this.selectedList.length; i++) {
          this.clusterId.push({ "ClusterID": this.selectedList[i] });
        }
      }

      if (this.careerClusterData.length > 0) {
        this.careerClusterData.forEach((obj, key) => {
          this.clusterId.forEach((k, v) => {
            if (obj.ClusterID == k.ClusterID) {
              this.careerClusterData[key].selected = true;
            }
          })
        })
        this.storageService.sessionStorageSet("careerClus", JSON.stringify(this.careerClusterData));
      }
      //  alert("value----->"+response[1].Result.UserNotes);
      if ((response[1].Result.UserNotes !== null && response[1].Result.UserNotes.trim() == "0000000000000000") || response[1].Result.UserNotes == null) {
        // alert("coming in if");
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }
      else {
        // alert("coming in else");
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }

      this.utils.hideLoading();

    }, this.utils.handleError);
  }

  SaveCareerCluster() {
    let currentValue = "";
    let cnt = 0;
    this.utils.showLoading();
    if (this.careerClusterData.length > 0) {

      this.careerClusterData.forEach((obj, key) => {
        if (obj.selected == true) {
          if (cnt == 0) {
            currentValue = 1 + " " + obj.ClusterID;
          }
          else {
            currentValue = 1 + "" + currentValue + " " + obj.ClusterID;
          }
        }
        else {
          currentValue = 0 + "" + currentValue;
        }
        cnt++;
      })
    }
    //alert(" this.currentValue---->"+currentValue);
    this.apiJson.method = "POST";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    this.careerFieldName = urlObj.fieldName;
    this.apiJson.moduleName = "PLP";
    this.apiJson.sessionID = this.utils.getAuthKey();
    this.educationPostReq = {
      "accountID": this.utils.getAccountId(),
      "fieldName": this.careerFieldName,
      "userNotes": currentValue
    };
    let user = JSON.stringify(this.educationPostReq);
    this.apiJson.data = user;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      if (response.Result + "" == "true") {
        this.storageService.sessionStorageSet("careerClus", JSON.stringify(this.careerClusterData));
        // console.log("careerClus submit=>"+JSON.stringify(this.careerClusterData));
        this.utils.hideLoading();
        if ((response[1].Result.UserNotes !== null && response[1].Result.UserNotes.trim() == "0000000000000000") || currentValue == null) {
          // this.containResult.emit({ "section": this.section, result: "empty" });
          this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
        }
        else {
          // this.containResult.emit({ "section": this.section, result: "filled" });
          this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
        }
        let dd = new Date();
        this.careerClusterCheck = dd.toISOString();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.update;
        this.edited = true;
        setTimeout(function () {
          this.edited = false;
        }.bind(this), 5000);
      }
      else {
        this.utils.hideLoading();
        let successMsg = this.plpShared.getSuccessMessage(this.section);
        this.successLabel = successMsg.error;
        this.errorVal = true;
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
    setTimeout(function () {
      this.errorVal = false;
    }.bind(this), 5000);
  }

  changeView(evnt) {
    this.changeInrView.emit(evnt);
  }

  //   changeFilledStatus(evnt) {
  //     //this.containResult.emit(evnt);
  //     if(evnt.result == "filled"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
  //         }
  //         else if(evnt.result == "empty"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");

  //  }

  //   }

  savedDataAssigning() {
    this.careerClusterData = JSON.parse(this.storageService.sessionStorageGet("careerClus"));

  }

  changesMade() {
    if (this.plpShared.isJsonChanged(JSON.parse(this.storageService.sessionStorageGet("careerClus")), this.careerClusterData)) {
      return true;
    } else {
      return false;
    }
  }
}
