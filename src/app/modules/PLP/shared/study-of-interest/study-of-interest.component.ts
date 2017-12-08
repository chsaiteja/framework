import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { StudyOfInterestModel } from './study-of-interest.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { CustomDate } from '../../../../shared/pipes/customPipes';


@Component({
  selector: 'study-of-interest',
  templateUrl: './study-of-interest.layout.html',
})
export class StudyOfInterestComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  studyOfInterestData: StudyOfInterestModel[];
  endurl;
  fileName;
  sectionObject;
  tableNoData;
  section = "StudyOfInterest";

  constructor(private plpShared: PLPSharedService, private utils: Utilities, private serverApi: ServerApi, private apiJson: ApiCallClass) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.getStudyOfInterestData();
  }

  getStudyOfInterestData() {
    let testArr = [];
    let filledInfoStatus = "";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    let nodata = this.plpShared.getTableNoData(this.section);
    this.tableNoData = nodata;

    let data = {
      accountID: this.utils.getAccountId(),
      fileName: urlObj.fileName
    }
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    // this.apiJson.endUrl="SavedFiles";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);

    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      // response[0].Result.UpdatedTimeStamp=this.utils.changeDate(response[0].Result.UpdatedTimeStamp);
      // this.studyOfInterestData=response[0].Result;
      response[0].Result.forEach((obj, key) => {
        // alert("coming in if");
        if (obj.Title + "" == "null" && obj.UserNotes + "" == "null" && obj.UpdatedTimeStamp + "" == "null") {

        }
        else {
          // filledInfoStatus="filled";
          testArr.push(obj);
          // alert("coming in else"+JSON.stringify(obj));
          //  this.volunteerCommunityServiceData.push(obj);
        }
      })
      this.studyOfInterestData = testArr;
      if (this.studyOfInterestData.length != 0 && this.studyOfInterestData != null) {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }
      else {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }

      this.utils.hideLoading();
    }, this.utils.handleError);
  }


}
