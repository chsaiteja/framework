import { ActionReducer, Action } from "@ngrx/store";
import {
  FrameworkConfigState, defaultFrameworkConfig, OccIndexCommonState, AsmntResponseState, AsmntCommonState, OCCPageState, defaultCommonText, AsmntQuestionState, defaultQuestionText, defaultResponseText,
  defaultOccPage, SectionsFillStatusState, defaultSectionsStatus
} from "../state/main-state";
import { INCREMENT, EVENT_FROM_EFFECT } from "../actions/main-action-creator";


export const FrameworkConfigReducer: ActionReducer<FrameworkConfigState> =
  (state = defaultFrameworkConfig, action: Action) => {
    try {
      let checknull = window.sessionStorage.getItem('loginFrameworkConfiguration');
      if (checknull != null && checknull != undefined) {
        state = JSON.parse(checknull);

      }

    } catch (e) {
      console.log('FrameworkConfigReducer reducer exception:' + e.message);
    }
    switch (action.type) {
      case "SET_FRAMEWORK_CONFIG": {
        // console.log('Assessments common text:' + JSON.stringify(action.payload));
        state = { config: action.payload }
        return state;
      }
      case "SET_HEADERFOOTER_TEXT": {
        try {
          state.config['Result']['headerFooter'] = action.payload;
          window.sessionStorage.setItem('loginFrameworkConfiguration', JSON.stringify(state));
        } catch (e) {
          console.log('Setting header text exception occured:' + e.message);
        }
        //console.log('In reducers SET_HEADERFOOTER_TEXT after data update:' + JSON.stringify(state));

        return state;
      }
      case "SET_TABITEMS_TEXT": {
        try {
          state.config['Result']['tabItems'] = action.payload;
          window.sessionStorage.setItem('loginFrameworkConfiguration', JSON.stringify(state));
        } catch (e) {
          console.log('Setting tabItems text exception occured:' + e.message);
        }
        // console.log('In reducers SET_TABITEMS_TEXT after data update:' + JSON.stringify(state));
        return state;
      }
      default: {
        return state;
      }
    }
  }


export const AsmntCommonText: ActionReducer<AsmntCommonState> =
  (state = defaultCommonText, action: Action) => {
    try {
      let checknull = window.sessionStorage.getItem('AsmntCommonTextStorage');
      if (checknull != null && checknull != undefined) {
        state = JSON.parse(checknull);

      }

    } catch (e) {
      console.log('AsmntCommonText reducer exception:' + e.message);
    }
    switch (action.type) {
      case "SET_COMMON_TEXT": {
        window.sessionStorage.setItem('AsmntCommonTextStorage', JSON.stringify(action.payload));
        // console.log('Assessments common text:' + JSON.stringify(action.payload));
        return action.payload;
      }
      default: {
        return state;
      }
    }
  }

export const OccPageText: ActionReducer<OCCPageState> =
  (state = defaultOccPage, action: Action) => {
    switch (action.type) {
      case "OCC_EFFECT": {
        // console.log('OCC_EFFECT:--' + JSON.stringify(action.payload.id));

        state = action.payload
        return state;
      }
      case "EMP_OUTLOOK_EFFECT": {
        state['MajorEmployers'] = action.payload.MajorEmployers;
        state['OpportunityRating'] = action.payload.OpportunityRating;
        state['OutlookInfo'] = action.payload.OutlookInfo;
        state['OutlookRatings'] = action.payload.OutlookRatings;
        // console.log("state in reducer--->" + JSON.stringify(state) + "------------------")
        return state;
      }
      case "WAGES_EFFECT": {
        state['WageLevels'] = action.payload.WageLevels;
        return state;
      }
      case "RESET_OCC_PAGE": {
        //console.log('AsmntParAreaText RESET_IPRESULT store:---->');

        state = { occPage: '' };
        return state;
      }
      default: {
        return state;
      }
    }
  }

export const OccText: ActionReducer<AsmntCommonState> =
  (state = defaultCommonText, action: Action) => {
    switch (action.type) {
      case "OCC_TEXT_EFFECT": {
        state = { commonText: action.payload }
        window.sessionStorage.setItem('Reducer_OccText', JSON.stringify(state));
        return state;
      };
      default: {
        return state;
      }
    }
  }
export const OccSettingsText: ActionReducer<AsmntCommonState> =
  (state = defaultCommonText, action: Action) => {
    switch (action.type) {
      case "OCC_SETTING_EFFECT": {
        state = { commonText: action.payload }
        return state;
      };
      case "RESET_OccSettingsText": {
        //console.log('AsmntParAreaText RESET_IPRESULT store:---->');

        state = { commonText: '' };
        return state;
      }
      default: {
        return state;
      }
    }
  }

export const AsmntIntroText: ActionReducer<AsmntCommonState> =
  (state = defaultCommonText, action: Action) => {
    try {
      let checknull = window.sessionStorage.getItem('AsmntIntroText');
      if (checknull != null && checknull != undefined) {
        state = JSON.parse(checknull);

      }

    } catch (e) {
      console.log('asmntintrotext reducer exception:' + e.message);
    }
    switch (action.type) {
      case "SET_INTRO_TEXT": {
        state = { commonText: action.payload }

        window.sessionStorage.setItem('AsmntIntroText', JSON.stringify(state));

        // console.log("AsmntIntroText intro text--->");
        return state;
      }
      case "RESET_STORE": {
        window.sessionStorage.removeItem('AsmntIntroText');
        state = { commonText: '' };
        return state;
      }
      default: {
        return state;
      }
    }
  }

export const GetAllOccList: ActionReducer<AsmntCommonState> =
  (state = defaultCommonText, action: Action) => {
    switch (action.type) {
      case "OCC_LIST_STORE_EFFECT": {
        state = { commonText: action.payload };
        window.sessionStorage.setItem('getListForAll', JSON.stringify(state));
        return state;

      }
      case 'OCC_LIST_WHY_EFFECT': {
        state = { commonText: action.payload };
        window.sessionStorage.setItem('getListForAll', JSON.stringify(state));
        window.sessionStorage.setItem('OSOnMyList', JSON.stringify(state));
        return state;

      }
      case 'OCC_LIST_WHYNOT_EFFECT': {
        state = { commonText: action.payload };
        window.sessionStorage.setItem('getListForAll', JSON.stringify(state));
        window.sessionStorage.setItem('OSNotOnMyList', JSON.stringify(state));
        return state;

      }
      case "RESET_STORE": {
        window.sessionStorage.removeItem('AsmntIntroText');
        state = { commonText: '' };
        return state;
      }
      default: {

      }
    }
  }
export const OccIndexReducerText: ActionReducer<OccIndexCommonState> =
  (state = defaultCommonText, action: Action) => {
    try {
      let checknull = window.sessionStorage.getItem('OccIndexReducerText');
      if (checknull != null && checknull != undefined) {
        state = JSON.parse(checknull);

      }

    } catch (e) {
      console.log('OccIndexReducerText reducer exception:' + e.message);
    }
    switch (action.type) {
      case "OCC_INDEX_STORE_EFFECT": {
        state = { commonText: action.payload }
        console.log('OccIndexReducerText');
        window.sessionStorage.setItem('OccIndexReducerText', JSON.stringify(state));
        return state;
      };
      default: {
        // return state;
      }
    }
  }

export const OccFilterResponses: ActionReducer<AsmntCommonState> =
  (state = defaultCommonText, action: Action) => {
    try {
      let checknull = window.sessionStorage.getItem('OccFilterResponses');
      if (checknull != null && checknull != undefined) {
        state = JSON.parse(checknull);

      }

    } catch (e) {
      console.log('OccFilterResponses reducer exception:' + e.message);
    }
    switch (action.type) {
      case "OCC_FILTER_STORE_EFFECT": {
        state = { commonText: action.payload }
        window.sessionStorage.setItem('OccFilterResponses', JSON.stringify(state));
        return state;
      }
      default: {
        return state;
      }
    }
  }
export const AsmntQuestionsResponses: ActionReducer<AsmntResponseState> =
  (state = defaultResponseText, action: Action) => {
    try {
      let checknull = window.sessionStorage.getItem('AsmntQuestionsResponses');
      if (checknull != null && checknull != undefined) {
        state = JSON.parse(checknull);

      }

    } catch (e) {
      console.log('asmntintrotext reducer exception:' + e.message);
    }
    // console.log('AsmntQuestionsResponses:');
    switch (action.type) {
      case "SET_QUESTION_RESPONSES": {

        state = { commonResponseText: action.payload }
        window.sessionStorage.setItem('AsmntQuestionsResponses', JSON.stringify(state));

        //  console.log('Assessments questions responses:' + JSON.stringify(action.payload));
        return state;
      }
      case "RESET_STORE": {
        window.sessionStorage.removeItem('AsmntQuestionsResponses');
        state = { commonResponseText: '' };
        return state;
      }
      default: {
        return state;
      }
    }
  }
export const AsmntQuestionsText: ActionReducer<AsmntQuestionState> =
  (state = defaultQuestionText, action: Action) => {
    // console.log('AsmntQuestionsResponses:');
    switch (action.type) {
      case "SET_QUESTION_TEXT": {
        //  console.log('Assessments questions text:' + JSON.stringify(action.payload));
        state = { commonIntroText: action.payload };
        return state;
      }
      case "RESET_STORE": {
        state = { commonIntroText: '' };
        return state;
      }
      default: {
        return state;
      }
    }
  }
export const AsmntRestoreText: ActionReducer<AsmntQuestionState> =
  (state = defaultQuestionText, action: Action) => {
    // console.log('AsmntQuestionsResponses:');
    switch (action.type) {
      case "SET_RESTORE_TEXT": {
        //  console.log('Assessments restore text:' + JSON.stringify(action.payload));
        return action.payload;
      }
      default: {
        return state;
      }
    }
  }
export const AsmntAreaText: ActionReducer<AsmntQuestionState> =
  (state = defaultQuestionText, action: Action) => {
    // console.log('AsmntQuestionsResponses:');
    switch (action.type) {
      case "SET_AREA_TEXT": {
        // console.log('Assessments Area text:' + JSON.stringify(action.payload));
        return action.payload;

      }
      default: {
        return state;
      }
    }
  }


export const AsmntParAreaText: ActionReducer<AsmntQuestionState> =
  (state = defaultQuestionText, action: Action) => {
    // console.log('AsmntQuestionsResponses:');
    switch (action.type) {
      case "SET_PARTICULAR_AREA_TEXT": {

        state = { commonIntroText: action.payload }
        //console.log('Assessments Area text:' + JSON.stringify(action.payload));
        return state;
      } case "RESET_RESULT": {
        // console.log('AsmntParAreaText RESET_IPRESULT store:---->');

        state = { commonIntroText: '' };
        return state;
      }

      default: {
        return state;
      }
    }
  }

export const SectionsStatusValues: ActionReducer<SectionsFillStatusState> =
  (state = defaultSectionsStatus, action: Action) => {
    switch (action.type) {
      case "SET_SCTIONS_STATES": {
        state = { statusValues: action.payload }
        return state;
      }
      case "RESET_SCTIONS_STATES": {
        state = { statusValues: '' };
        return state;
      }
      default: {
        return state;
      }
    }
  }
