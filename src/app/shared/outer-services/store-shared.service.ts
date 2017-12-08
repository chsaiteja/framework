import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
// import { Subscription } from "rxjs/Subscription";

import { StorageService } from './storage.service';
import { Utilities } from './utilities.service';
import { Router } from '@angular/router';
import { clusterDetails } from '../../../app/modules/assessments/shared/constants/assessments-constants';
import { AssessmentsService } from '../../../app/modules/assessments/shared/services/assessments.service'
import { StoreService } from '../../state-management/services/store-service';

import { ApiCallClass } from '../modal/apicall.modal';
import { ServerApi } from '../outer-services/app.apicall.service';
import { Subscription } from 'rxjs/Subscription';
import { getRouteConfig } from '../../route.config';
@Injectable()
export class StoreSharedService {
  /*This constructor initializes values*/
  framework;
  subscription3 = new Subscription;
  subscription4 = new Subscription;

  constructor(private trackEvnt: AssessmentsService, private commonlang: StoreService, private apiJson: ApiCallClass, private loginauth: ServerApi, private assessStoreService: StoreService, private router: Router, private dispatchStore: Store<Action>, private utils: Utilities, private storageService: StorageService) {

  }
  callEffect() {
    let routerVal = this.router.url.split('&');
    let occID = routerVal[0].split('=');
    let outlook = this.storageService.sessionStorageGet('outlookStates');
    let wages = this.storageService.sessionStorageGet('wagesStates');
    if (outlook != null) {
      this.dispatchStore.dispatch({
        type: "EMP_OUTLOOK_TEXT", payload: {
          methodVal: 'GET', module_Name: 'Occ/v1/',
          path_params: ["occ", parseInt(occID[1]), this.utils.getAccountId()], query_params: { "sections": "MajorEmployers,OutlookInfo,OutlookRatings,TopOpeningLocations", "states": outlook, "lang": this.storageService.sessionStorageGet('langset') },
          body_Params: {}, endUrlVal: 'pages'
        }
      });
    }
    if (wages != null) {
      this.dispatchStore.dispatch({
        type: "WAGES_TEXT", payload: {
          methodVal: 'GET', module_Name: 'Occ/v1/',
          path_params: ["occ", parseInt(occID[1]), this.utils.getAccountId()], query_params: { "sections": "WageLevels", "states": wages, "lang": this.storageService.sessionStorageGet('langset') },
          body_Params: {}, endUrlVal: 'pages'
        }
      });
    }
  }

  convertJson(array, KeyString, ValueString, name) {
    let temp = {};
    let ref = this;
    array.forEach(function (obj, inx) {
      if (obj[KeyString] == 'ParentCluster') {
        let id = obj[ValueString].linkID
        let val = clusterDetails['cls_' + id];
        let iconValue = clusterDetails['cls_' + id].clusterIconValue;
        let bgValue = clusterDetails['cls_' + id].clusterBgColor;
        temp[obj[KeyString]] = obj[ValueString];
        temp[obj[KeyString]].parentClusterIcon = iconValue;
        temp[obj[KeyString]].parentClusterColor = bgValue;
      }
      else if (obj[KeyString] == 'WageLevels') {
        // temp[obj[KeyString]] = obj[ValueString];
        let headers = {};
        obj[ValueString].headers.forEach(function (obj1, inx1) {
          headers[obj1['type']] = obj1['header'];
        });
        temp[obj[KeyString]] = { 'headers': headers, 'periods': obj[ValueString].periods, 'notes': obj[ValueString].notes }

      }
      else {
        temp[obj[KeyString]] = obj[ValueString];
      }
    }.bind(this));
    if (name == 'common') {
      this.callEffect();
    }
    return temp;
  }
  filterListData(payload, val) {
    // getListForAll
    let Total_List
    if (val == 'index') {
      Total_List = JSON.parse(this.storageService.sessionStorageGet('OccIndexReducerText'));
    } else {
      Total_List = JSON.parse(this.storageService.sessionStorageGet('getListForAll'));
    }
    let list = [];
    let CluList = [];
    let ClusterIdList = [];

    let totalListValues = [];
    totalListValues = Total_List.commonText.occList.filter(function (obj, inx) {
      let filterchekcondition = true;
      if (payload.text != '') {
        //if (!(obj.title.indexOf(action.payload.text) > -1)) {
        let regExp = new RegExp(payload.text, 'gi');
        filterchekcondition = regExp.test(obj.title);
      }
      if (payload.rating.length > 0) {
        if (!(payload.rating.indexOf(obj.rating) > -1)) {
          filterchekcondition = false;
        }
      }
      if (payload.edu.length > 0) {
        if (!(payload.edu.indexOf(obj.edLevelID) > -1)) {
          filterchekcondition = false;
        }
      }
      if (payload.wages.length > 0) {
        if (!(payload.wages.indexOf(obj.wageID) > -1)) {
          filterchekcondition = false;
        }
      }

      return filterchekcondition;
    });
    Total_List.commonText.clusList.forEach(function (obj, inx) {
      totalListValues.forEach(function (obj1, inx1) {
        if (obj.clusterID == obj1.clusterID) {
          if ((ClusterIdList.indexOf(obj.clusterID) == -1)) {
            ClusterIdList.push(obj.clusterID);
            CluList.push(obj);
          }
        }
      }.bind(this));
    }.bind(this));

    let temp1 = {
      'clusList': [],
      'occList': []
    };
    temp1.clusList = CluList;
    temp1.occList = totalListValues;
    return { commonText: temp1 };


  }
  convertOCCFilterTextJson(array) {
    let filtemp = {
      "headers": {},
      "buttons": {},
      "filters": []

    };
    array.headers.forEach(function (obj, inx) {
      filtemp.headers[obj.type] = obj.header;
    });
    array.buttons.forEach(function (obj, inx) {
      filtemp.buttons[obj.button] = obj.title;
    });
    filtemp.filters = array.filters
    this.utils.showLoading();
    //console.log('convertOCCFilterTextJson store shared')
    return this.assessStoreService.getLangChange(this.storageService.sessionStorageGet('langset'), 'occFilter', filtemp);
  }
  convertOCCIndexTextJson(array) {
    // if (name == 'list') {
    // console.log('in convertOCCIndexTextJson')
    let temp = [];

    let temp1 = {
      'clusList': [],
      'occList': []
    };
    for (let j = 0; j < array.occs.length; j++) {
      temp.push(
        array.occs[j]
      );
    }
    for (let j = 0; j < array.emerging.length; j++) {
      temp.push(
        array.emerging[j]);
    }
    for (let i = 0; i < temp.length; i++) {
      for (let j = i + 1; j < temp.length; j++) {
        if (temp[i].title > temp[j].title) {
          const a = temp[i];
          temp[i] = temp[j];
          temp[j] = a;
        }
      }
      let str = temp[i].occID + '';
      if (str.substring(0, 2) == '14') {
        temp[i].check = false;
      }
      else {
        temp[i].check = true;
      }
    }
    for (let j = 0; j < array.clusters.length; j++) {

      temp1.clusList.push(array.clusters[j]);

    }
    temp1.occList = temp;

    if ((temp1.occList).length != 0) {
      this.storageService.sessionStorageSet('parentCnt', 'true');
    } else if ((temp1.occList).length == 0) {
      this.storageService.sessionStorageSet('parentCnt', 'false');
    }
    let setVal = this.assessStoreService.getLangChange(this.storageService.sessionStorageGet('langset'), 'OCC_index_list', temp1);
    return temp1;

  }
  oSNotOnMyList(array) {
    let temp = [];

    try {
      let temp = [];

      let temp1 = {
        'clusList': [],
        'occList': []
      };
      let resnotData = JSON.parse(this.storageService.sessionStorageGet('NotOccList'));
      if (resnotData != null && resnotData.length != 0) {
        for (let j = 0; j < array.occList.length; j++) {
          for (let i = 0; i < resnotData.length; i++) {
            if (resnotData[i].occID == array.occList[j].occID) {
              temp.push(
                array.occList[j]
              );
            }
          }
        }
        let ClusterIdList = [];
        for (let j = 0; j < array.clusList.length; j++) {
          for (let i = 0; i < temp.length; i++) {
            if ((ClusterIdList.indexOf(array.clusList[j].clusterID) == -1)) {
              if (temp[i].clusterID == array.clusList[j].clusterID) {
                temp1.clusList.push(array.clusList[j]);
                ClusterIdList.push(array.clusList[j].clusterID);
              }
            }
          }
        }
        temp1.occList = temp;
      }
      if ((temp1.occList).length != 0) {
        this.storageService.sessionStorageSet('parentCnt', 'true');
      } else if ((temp1.occList).length == 0) {
        this.storageService.sessionStorageSet('parentCnt', 'false');
      }
      let state = { commonText: temp1 }
      this.storageService.sessionStorageSet('OSNotOnMyList', JSON.stringify(state));
      this.utils.hideLoading();
    } catch (e) {
      console.log('convertOCCListTextJson OSNotOnMyList exception:' + e.message);
    }
  }
  convertOCCListTextJson(array, resData, module) {
    if (module == 'OSOnMyList') {
      this.oSNotOnMyList(array);
    }
    try {
      let temp = [];

      let temp1 = {
        'clusList': [],
        'occList': []
      };
      if (resData != null && resData.length != 0) {
        for (let j = 0; j < array.occList.length; j++) {
          for (let i = 0; i < resData.length; i++) {
            if (resData[i].occID == array.occList[j].occID) {
              temp.push(
                array.occList[j]
              );
            }
          }
        }
        let ClusterIdList = [];
        for (let j = 0; j < array.clusList.length; j++) {
          for (let i = 0; i < temp.length; i++) {
            if ((ClusterIdList.indexOf(array.clusList[j].clusterID) == -1)) {
              if (temp[i].clusterID == array.clusList[j].clusterID) {
                temp1.clusList.push(array.clusList[j]);
                ClusterIdList.push(array.clusList[j].clusterID);
              }
            }
          }
        }
        temp1.occList = temp;
      }
      if ((temp1.occList).length != 0) {
        this.storageService.sessionStorageSet('parentCnt', 'true');
      } else if ((temp1.occList).length == 0) {
        this.storageService.sessionStorageSet('parentCnt', 'false');
      }
      if (module != 'OSOnMyList') {
        this.dispatchStore.dispatch({ type: "OCC_LIST_STORE_EFFECT", payload: temp1 });
      }
      else if (module == 'OSOnMyList') {
        this.dispatchStore.dispatch({ type: "OCC_LIST_WHY_EFFECT", payload: temp1 });
      }
    } catch (e) {
      console.log('convertOCCListTextJson exception:' + e.message);
    }
  }
  convertSettingsTextJson(array) {
    let temp = {
      "topSections": [],
      "tabs": {},
      "allSections": {}

    };
    array.tabs.forEach(function (obj, inx) {
      let num: string = obj['tabId'] + ''
      temp.tabs['tab' + num] = obj;
    });
    temp.topSections = array.topSections;
    // temp.tabs = array.tabs;
    array.allSections.forEach(function (obj, inx) {
      temp.allSections[obj['section']] = obj['title'];
    });
    temp.tabs = array.tabs;
    return temp;
  }
  convertTextJson(array) {
    let temp = {
      "common": {},
      "filters": {},
      "select": {
        "intro": "",
        "states": []
      }
    };
    // array.buttons.forEach(function (obj, inx) {
    temp.common = array.common;

    array.filters.forEach(function (obj, inx) {
      temp.filters[obj['type']] = obj;
    });
    temp.select.intro = array.select.intro;
    temp.select.states = array.select.states;
    return temp;
  }


  pugLogin(resp) {
    try {
      let apiJson1 = new ApiCallClass;
      apiJson1.method = 'GET';
      apiJson1.endUrl = 'framework';
      apiJson1.moduleName = 'Settings/v1/';
      const data = {
        input_data: [

          {
            'param_type': 'path',
            'params': [resp.acctId]
          },
        ]
      };
      apiJson1.method = 'GET';
      apiJson1.data = JSON.stringify(data);
      this.subscription4 = this.loginauth.callApi([apiJson1]).subscribe(respSetting => {
        this.storageService.sessionStorageSet("savedValId", '');
        let data = {};
        this.storageService.sessionStorageSet('langDataStore', JSON.stringify(data));
        this.framework = respSetting[0];

        this.dispatchStore.dispatch({
          type: "SET_FRAMEWORK_CONFIG", payload: this.framework
        });
        this.storageService.sessionStorageSet('loginFrameworkConfiguration', JSON.stringify({ config: this.framework }));
        this.storageService.sessionStorageSet('langset', this.framework.Result.user.prefLang);
        this.trackEvnt.callCommonText();
        let payloadjson = {
          type: "OCC_INDEX_STORE_TEXT", payload: {
            methodVal: 'GET', module_Name: 'Occ/v1/',
            path_params: ['index', this.utils.getAccountId()], query_params: { "lang": this.framework.Result.user.prefLang },
            body_Params: {}, endUrlVal: 'pages'
          }
        }

        this.commonlang.commonLanguageChange(this.framework.Result.user.prefLang, 'OCC_index_list', payloadjson);

        this.dispatchStore.dispatch({
          type: "OCC_TEXT", payload: {
            methodVal: 'GET', module_Name: 'Occ/v1/',
            path_params: ["text"], query_params: { "lang": this.framework.Result.user.prefLang },
            body_Params: {}, endUrlVal: 'pages'
          }
        });
        let newtemproute = getRouteConfig(this.framework);
        this.router.resetConfig([]);
        this.router.dispose();
        this.router.config = newtemproute;

        setTimeout(function () {
          this.router.navigateByUrl('framework');
        }.bind(this), 0);
        this.storageService.sessionStorageSet('langAssArr', JSON.stringify(this.framework.Result.user.langList));
      });
      this.utils.setAccountId(resp.acctId);
    } catch (e) {
      console.log('Login success routeLogin exception:' + e.message);
    }
  }
}
