import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CoursePlanModel } from './course-plan.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

import { EndUrlArr } from '../../../../shared/constants/app.constants';
@Component({
  selector: 'course-plan',
  templateUrl: './course-plan.layout.html',
})
export class CoursePlanComponent {
  testModel;
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  sectionObject;
  section = "CoursePlan";
  endurl;
  coursePlan = new CoursePlanModel;
  constructor(private plpShared: PLPSharedService, private utils: Utilities, private coursePlanData: CoursePlanModel,
    private serverApi: ServerApi, private apiJson: ApiCallClass) {
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");

  }

  ngOnInit() {
    this.utils.showLoading();
    this.endurl = EndUrlArr;
    this.getCoursePlanData();
  }

  getCoursePlanData() {
    let testArr = [];
    let data = {
      accountID: this.utils.getAccountId()
    }
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      //this.testModel = response[0].Result;
      response[0].Result.forEach((obj, key) => {
        if (obj.Subject + "" == "Total Credits") {
          testArr.push();
        }
        else {
          testArr.push(obj);
          // alert("coming in else"+JSON.stringify(obj));
          //  this.volunteerCommunityServiceData.push(obj);
        }
      })
      this.testModel = testArr;
      // if (response[0].Result != null) {
      //   this.containResult.emit({ "section": this.section, result: "filled" });
      // }
      // else {
      //   this.containResult.emit({ "section": this.section, result: "empty" });
      // }

      this.utils.hideLoading();
    }, this.utils.handleError);
  }

  //   changeView(evnt) {
  //    // this.changeInrView.emit(evnt);
  //    if(evnt.result == "filled"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
  //         }
  //         else if(evnt.result == "empty"){
  //             this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");

  //  }
  //   }
}
