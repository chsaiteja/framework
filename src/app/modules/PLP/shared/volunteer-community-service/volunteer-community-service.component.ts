import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { VolunteerCommunityServiceModel } from './volunteer-community-service.model';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'volunteer-community-service',
  templateUrl: './volunteer-community-service.layout.html',
})
export class VolunteerCommunityServiceComponent {

  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  volunteerCommunityServiceData: VolunteerCommunityServiceModel[];
  sectionObject;
  tableNoData;
  section = "VolunteerCommunityService";

  constructor(private plpShared: PLPSharedService, private serverApi: ServerApi, private apiJson: ApiCallClass, private utils: Utilities) {
  }

  //ngOnInit is called just after constructor calling, we are initializing variable values here
  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.getVolunteerCommunityServiceData();
  }

  //Below function is for getting data from server 
  getVolunteerCommunityServiceData() {
    let testArr = [];
    let filledInfoStatus = "";
    let urlObj = this.plpShared.getUrlObject(this.section);
    this.apiJson.endUrl = urlObj.endUrl;
    let nodata = this.plpShared.getTableNoData(this.section);
    this.tableNoData = nodata;
    let data = {
      accountID: this.utils.getAccountId()
    }
    this.apiJson.method = "GET";
    this.apiJson.moduleName = "PLP";
    // this.apiJson.endUrl="VolunteerExperiences";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      response[0].Result.forEach((obj, key) => {
        // alert("coming in if");
        if (obj.Organization + "" == "null" && obj.Dates + "" == "null" && obj.Description + "" == "null") {

        }
        else {
          //filledInfoStatus="filled";
          testArr.push(obj);
          // alert("coming in else"+JSON.stringify(obj));
          //  this.volunteerCommunityServiceData.push(obj);
        }
      })
      this.volunteerCommunityServiceData = testArr;
      if (this.volunteerCommunityServiceData.length != 0 && this.volunteerCommunityServiceData != null) {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }
      else {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }

      this.utils.hideLoading();
    }, this.utils.handleError);
  }

}
