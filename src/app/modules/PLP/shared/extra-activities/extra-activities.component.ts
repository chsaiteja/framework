import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { ExtraActivitiesModel } from './extra-activities.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'extra-activities',
  templateUrl: './extra-activities.layout.html',
})

export class ExtraActivitiesComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  extraActivitiesData: ExtraActivitiesModel[];

  sectionObject;
  section = "ExtraActivities";
  endurl;
  tableNoData;
  constructor(private plpShared: PLPSharedService, private utils: Utilities, private serverApi: ServerApi, private apiJson: ApiCallClass) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.getExtraActivitiesData();
  }

  getExtraActivitiesData() {
    let testArr = [];
    let filledInfoStatus = "";
    let data = {
      accountID: this.utils.getAccountId()
    }
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    let nodata = this.plpShared.getTableNoData(this.section);
    this.tableNoData = nodata;
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      // this.extraActivitiesData = response[0].Result;
      response[0].Result.forEach((obj, key) => {
        // alert("coming in if");
        if (obj.Organization + "" == "null" && obj.Dates + "" == "null" && obj.Description + "" == "null") {

        }
        else {
          //filledInfoStatus = "filled";
          testArr.push(obj);
          // alert("coming in else"+JSON.stringify(obj));
          //  this.volunteerCommunityServiceData.push(obj);
        }
      })
      this.extraActivitiesData = testArr;
      //alert("response[0].Result--->"+response[0].Result);
      // if (filledInfoStatus == "filled") {
      //   this.containResult.emit({ "section": this.section, result: "filled" });
      // }
      // else {
      //   this.containResult.emit({ "section": this.section, result: "empty" });
      // }
      this.utils.hideLoading();
    }, this.utils.handleError);
  }
}
