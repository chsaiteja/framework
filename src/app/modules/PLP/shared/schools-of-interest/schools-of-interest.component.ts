import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CustomDate } from '../../../../shared/pipes/customPipes';
import { SchoolsOfInterestModel } from './schools-of-interest.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EndUrlArr } from '../../../../shared/constants/app.constants';

@Component({
  selector: 'schools-of-interest',
  templateUrl: './schools-of-interest.layout.html',
})
export class SchoolsOfInterestComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  schoolsOfInterestData: SchoolsOfInterestModel[];
  endurl;
  sectionObject;
  fileName;
  tableNoData;
  section = "SchoolsOfInterest";

  constructor(private plpShared: PLPSharedService, private serverApi: ServerApi, private apiJson: ApiCallClass, private utils: Utilities) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.endurl = EndUrlArr;
    this.getSchoolsOfInterestData();
  }

  getSchoolsOfInterestData() {
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
    // this.apiJson.endUrl="SavedFiles";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.moduleName = "PLP";
    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {

      // this.schoolsOfInterestData=response[0].Result;
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
      this.schoolsOfInterestData = testArr;
      if (this.schoolsOfInterestData.length != 0 && this.schoolsOfInterestData != null) {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }
      else {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }

      this.utils.hideLoading();
    }, this.utils.handleError);
  }

}
