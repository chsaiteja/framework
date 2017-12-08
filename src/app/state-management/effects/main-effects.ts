import { Effect, Actions, toPayload } from "@ngrx/effects";

import { Injectable } from "@angular/core";
// import { Observable } from "rxjs/Rx";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/empty';
import { Http } from '@angular/http';
import { ServerApi } from '../../shared/outer-services/app.apicall.service';
import { ApiCallClass } from '../../shared/modal/apicall.modal';
import { Utilities } from '../../shared/outer-services/utilities.service';
import { EventDispatchService } from '../../shared/outer-services/event-dispatch.service';
import { StoreSharedService } from "../../shared/outer-services/store-shared.service";
import { StoreService } from '../../state-management/services/store-service';
@Injectable()
export class MainEffects {
  constructor(private action$: Actions, private utils: Utilities, private storeService: StoreSharedService, private assessStoreService: StoreService,
    private eventService: EventDispatchService, private http: Http, private server: ServerApi, private apiJson: ApiCallClass) {
  }


  @Effect() getFrameworkConfigHeaderEffect$ = this.action$
    .ofType('GET_HEADERFOOTER_TEXT')
    .map(toPayload)
    .switchMap(payload => {

      // console.log('in effects the payload effect was: ' + JSON.stringify(payload));
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      // console.log('before call');

      // console.log('pages--->')
      return this.server.callApi([this.apiJson])
        .switchMap(result => {
          // console.log('result of header footer:' + JSON.stringify(result[0]));
          return Observable.of({ type: "SET_HEADERFOOTER_TEXT", payload: result[0].Result })
        }
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })

    });
  @Effect() getFrameworkConfigTabsEffect$ = this.action$
    .ofType('GET_TABITEMS_TEXT')
    .map(toPayload)
    .switchMap(payload => {

      // console.log('in effects the payload effect was: ' + JSON.stringify(payload));
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      // console.log('before call');

      // console.log('pages--->')
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_TABITEMS_TEXT", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })

    });


  @Effect() getPayloadExample$ = this.action$
    .ofType('GET_ASMNT_COMMON_TEXT')
    .map(toPayload)
    .switchMap(payload => {

      // console.log('in effects the payload effect was: ' + JSON.stringify(payload));
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      //console.log('in GET_ASMNT_COMMON_TEXT effect');
      if (payload.endUrlVal == 'pageText/common') {
        // console.log('pageText/common--->')
        return this.server.callApi([this.apiJson])
          .switchMap(result =>
            Observable.of({ type: "SET_COMMON_TEXT", payload: result[0].Result })
          ).catch(error => {
            this.utils.handleError(error);
            return Observable.create();
          })
      }
      else if (payload.endUrlVal == 'pages') {
        // console.log('pages--->')
        return this.server.callApi([this.apiJson])
          .switchMap(result =>
            Observable.of({ type: "OCC_EFFECT", payload: this.storeService.convertJson(result[0].Result, 'sectionName', 'sectionResults', 'common') })

          ).catch(error => {
            this.utils.handleError(error);
            return Observable.create();
          })
      }
    });

  @Effect() empTextVar$ = this.action$
    .ofType('EMP_OUTLOOK_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      // console.log('in EMP_OUTLOOK_TEXT effect');

      if (payload.endUrlVal == 'pages') {
        return this.server.callApi([this.apiJson])
          .switchMap(result => {
            this.utils.hideLoading();
            return Observable.of({ type: "EMP_OUTLOOK_EFFECT", payload: this.storeService.convertJson(result[0].Result, 'sectionName', 'sectionResults', 'outlook') })
          }
          ).catch(error => {
            this.utils.handleError(error);
            return Observable.create();
          })
      }
    });

  @Effect() wagesTextVar$ = this.action$
    .ofType('WAGES_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      //console.log('in WAGES_TEXT effect');

      if (payload.endUrlVal == 'pages') {
        return this.server.callApi([this.apiJson])
          .switchMap(result => {
            this.utils.hideLoading();
            return Observable.of({ type: "WAGES_EFFECT", payload: this.storeService.convertJson(result[0].Result, 'sectionName', 'sectionResults', 'wages') })
          }
          ).catch(error => {
            this.utils.handleError(error);
            return Observable.create();
          })
      }
    });
  @Effect() occTextVar$ = this.action$
    .ofType('OCC_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;

      if (payload.endUrlVal == 'pages') {
        return this.server.callApi([this.apiJson])
          .switchMap(result =>
            Observable.of({ type: "OCC_TEXT_EFFECT", payload: this.storeService.convertTextJson(result[0].Result) })

          ).catch(error => {
            this.utils.handleError(error);
            return Observable.create();
          })
      }
    });
  /** OccIndex store text */

  @Effect() occIndexStoreTextVar$ = this.action$
    .ofType('OCC_INDEX_STORE_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      // console.log('OCC_INDEX_STORE_TEXT ')
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result => {
          // console.log('inside OCC_INDEX_TEXT:');
          return Observable.of({ type: "OCC_INDEX_STORE_EFFECT", payload: this.storeService.convertOCCIndexTextJson(result[0].Result) })

        }
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });
  @Effect() occFilterStoreTextVar$ = this.action$
    .ofType('OCC_FILTER_STORE_TEXT')
    .map(toPayload)
    .switchMap(payload => {

      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result => {
          // console.log('inside OCC_FILTER_TEXT:');
          return Observable.of({ type: "OCC_FILTER_STORE_EFFECT", payload: this.storeService.convertOCCFilterTextJson(result[0].Result) })

        }
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });
  /**Restore exist call */
  // @Effect() restoreExist$ = this.action$
  //   .ofType('RESTORE_EXIST_EFFECT')
  //   .map(toPayload)
  //   .switchMap(payload => {
  //     this.apiJson.method = payload.methodVal;
  //     this.apiJson.moduleName = payload.module_Name;
  //     const asess_Variable = {
  //       input_data: [
  //         {
  //           'param_type': 'path',
  //           'params': payload.path_params
  //         },
  //         {
  //           'param_type': 'query',
  //           'params': payload.query_params
  //         },
  //         {
  //           'param_type': 'body',
  //           'params': payload.body_Params
  //         }
  //       ]
  //     };
  //     const user = JSON.stringify(asess_Variable);
  //     this.apiJson.endUrl = payload.endUrlVal;
  //     this.apiJson.data = user;
  //     return this.server.callApi([this.apiJson])
  //       .switchMap(result => {
  //         return Observable.of({ type: "RESTORE_EXIST_REDUCER", payload: result[0].Result })
  //       }
  //       ).catch(error => {
  //         this.utils.handleError(error);
  //         return Observable.create();
  //       })
  //   });
  /** Occ settings text */

  @Effect() occSettingsTextVar$ = this.action$
    .ofType('OCC_SETTING_TEXT')
    .map(toPayload)
    .switchMap(payload => {

      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result => {
          // console.log('inside OCC_SETTING_TEXT:' + JSON.stringify(result[0]));
          return Observable.of({ type: "OCC_SETTING_EFFECT", payload: this.storeService.convertSettingsTextJson(result[0].Result) })
        }
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });
  /* starts assessments effect calls */

  @Effect() getIntroText$ = this.action$
    .ofType('GET_INTRO_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_INTRO_TEXT", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });


  @Effect() getQuestionsResponses$ = this.action$
    .ofType('GET_QUESTION_RESPONSES')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_QUESTION_RESPONSES", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });

  @Effect() getQuestionsText$ = this.action$
    .ofType('GET_QUESTION_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.sessionID = payload.sessionId;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_QUESTION_TEXT", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });
  @Effect() getRestoreText$ = this.action$
    .ofType('GET_RESTORE_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      //console.log('in GET_RESTORE_TEXT effect');

      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.sessionID = payload.sessionId;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_RESTORE_TEXT", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });

  @Effect() getAreaText$ = this.action$
    .ofType('GET_AREA_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_AREA_TEXT", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });

  @Effect() getParticularAreaText$ = this.action$
    .ofType('GET_PARTICULAR_AREA_TEXT')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': payload.query_params
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_PARTICULAR_AREA_TEXT", payload: result[0].Result.areas })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });


  @Effect() getSectionStateValues$ = this.action$
    .ofType('GET_SECTIONS_STATES')
    .map(toPayload)
    .switchMap(payload => {
      this.apiJson.method = payload.methodVal;
      this.apiJson.moduleName = payload.module_Name;
      // console.log('GET_SECTIONS_STATES payload.path_params:' + payload.path_params);
      const asess_Variable = {
        input_data: [
          {
            'param_type': 'path',
            'params': payload.path_params
          },
          {
            'param_type': 'query',
            'params': { 'accountID': this.utils.getAccountId() }
          },
          {
            'param_type': 'body',
            'params': payload.body_Params
          }
        ]
      };
      const user = JSON.stringify(asess_Variable);
      this.apiJson.endUrl = payload.endUrlVal;
      this.apiJson.data = user;
      return this.server.callApi([this.apiJson])
        .switchMap(result =>
          Observable.of({ type: "SET_SCTIONS_STATES", payload: result[0].Result })
        ).catch(error => {
          this.utils.handleError(error);
          return Observable.create();
        })
    });





}
