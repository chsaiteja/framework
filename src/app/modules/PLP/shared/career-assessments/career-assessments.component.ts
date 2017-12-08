import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CareerAssessmentsModel } from './career-assessments.model';
import { CustomDate } from '../../../../shared/pipes/customPipes';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { EndUrlArr } from '../../../../shared/constants/app.constants';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'career-assessments',
  templateUrl: './career-assessments.layout.html',

})
export class CareerAssessmentsComponent {
  careerAssessmentsData: CareerAssessmentsModel[];
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  sectionObject;
  section = "CareerAssessments";
  endurl;
  tableNoData;
  constructor(private plpShared: PLPSharedService, private serverApi: ServerApi,
    private apiJson: ApiCallClass, private utils: Utilities) {

  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.endurl = EndUrlArr;
    this.getCareerAssessmentsData();
  }

  getCareerAssessmentsData() {
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

      this.careerAssessmentsData = response[0].Result;
      // console.log("this.careerAssessmentsData---->" + this.careerAssessmentsData.length);
      if (this.careerAssessmentsData.length != 0 && this.careerAssessmentsData != null) {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }
      else {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }
      this.utils.hideLoading();
    }, this.utils.handleError);
  }

  postCareerAssessmentsData() {

  }

  changeView(evnt) {
    this.changeInrView.emit(evnt);
  }
  // changeFilledStatus(evnt) {
  //   //this.containResult.emit(evnt);
  //   if(evnt.result == "filled"){
  //           this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
  //       }
  //       else if(evnt.result == "empty"){
  //           this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
  //       }
  // }

}
