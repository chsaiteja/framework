import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { Utilities } from '../../../../shared/outer-services/utilities.service';
import { EmploymentHistoryModel } from './employment-history.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';

@Component({
  selector: 'employment-history',
  templateUrl: './employment-history.layout.html',

})
export class EmploymentHistoryComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();
  employmentHistoryData: EmploymentHistoryModel[];
  endurl;
  sectionObject;
  section = "EmploymentHistory";
  tableNoData;
  constructor(private plpShared: PLPSharedService, private utils: Utilities, private serverApi: ServerApi, private apiJson: ApiCallClass) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.getEmploymentHistoryData();
  }

  getEmploymentHistoryData() {
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

      //this.employmentHistoryData = response[0].Result;
      response[0].Result.forEach((obj, key) => {
        // alert("coming in if");
        if (obj.Employment + "" == "null" && obj.Title + "" == "null" && obj.Dates + "" == "null" && obj.Duties + "" == "null") {

        }
        else {
          // filledInfoStatus="filled";
          testArr.push(obj);
          // alert("coming in else"+JSON.stringify(obj));
          //  this.volunteerCommunityServiceData.push(obj);
        }
      })
      this.employmentHistoryData = testArr;
      // if (filledInfoStatus == "filled") {
      //   this.containResult.emit({ "section": this.section, result: "filled" });
      // }
      // else {
      //   this.containResult.emit({ "section": this.section, result: "empty" });
      // }

      this.utils.hideLoading();
    }, this.utils.handleError);
  }

  //   changeView(evnt) {
  //     //this.changeInrView.emit(evnt);
  //     if(evnt.result == "filled"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
  //         }
  //         else if(evnt.result == "empty"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");

  //  }
  //   }
}
