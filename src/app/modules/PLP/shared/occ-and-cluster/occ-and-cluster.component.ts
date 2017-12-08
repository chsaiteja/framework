import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ApiCallClass } from '../../../../shared/modal/apicall.modal';
import { CustomDate } from '../../../../shared/pipes/customPipes';
import { OccAndClusterModel } from './occ-and-cluster.model';
import { PLPNavHeaderComponent } from '../shared/PLP-nav-header.component';
import { PLPSharedService } from '../shared/PLP-shared.service';
import { ServerApi } from '../../../../shared/outer-services/app.apicall.service';
import { Utilities } from '../../../../shared/outer-services/utilities.service';

@Component({
  selector: 'occ-and-cluster',
  templateUrl: './occ-and-cluster.layout.html',
})
export class OccAndClusterComponent {
  @Input('report-status') report = "";
  @Output('changeView') changeInrView = new EventEmitter();
  @Output() containResult = new EventEmitter();

  occAndClusterData: OccAndClusterModel[];
  endurl;
  sectionObject;
  section = "OccAndCluster";
  fileName;
  tableNoData;

  constructor(private plpShared: PLPSharedService, private serverApi: ServerApi, private apiJson: ApiCallClass, private utils: Utilities) {
  }

  ngOnInit() {
    this.utils.showLoading();
    this.sectionObject = this.plpShared.getSectionObject(this.section);
    this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&PLPSections");
    this.getOccAndClusterData();
  }

  getOccAndClusterData() {
    let testArr = [];
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
    //this.apiJson.endUrl="SavedFiles";
    this.apiJson.sessionID = this.utils.getAuthKey();
    let dat = JSON.stringify(data);
    this.apiJson.moduleName = "PLP";
    this.apiJson.data = dat;
    this.serverApi.callApi([this.apiJson]).subscribe((response) => {
      response[0].Result.forEach((obj, key) => {
        if (obj.Title + "" == "null" && obj.UserNotes + "" == "null" && obj.UpdatedTimeStamp + "" == "null") {

        }
        else {
          testArr.push(obj);
        }
      })
      this.occAndClusterData = testArr;
      if (this.occAndClusterData.length != 0 && this.occAndClusterData.length != null) {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Filled");
      }
      else {
        this.utils.dispatchSectionLoad(this.sectionObject.routerLink + "&Empty");
      }
      this.utils.hideLoading();
    }, this.utils.handleError);
  }


}
