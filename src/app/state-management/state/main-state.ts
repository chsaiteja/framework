
export interface FrameworkConfigState {
  config: any
}
export const defaultFrameworkConfig: FrameworkConfigState = {
  config: {}
}

export interface AsmntCommonState {
  commonText: any
}
export interface OccIndexCommonState {
  commonText: any
}
export const defaultCommonText: AsmntCommonState = {
  commonText: {}
}

export interface AsmntQuestionState {
  commonIntroText: any
}
export const defaultQuestionText: AsmntQuestionState = {
  commonIntroText: {}
}
export interface AsmntResponseState {
  commonResponseText: any
}
export const defaultResponseText: AsmntResponseState = {
  commonResponseText: {}
}
export interface OCCPageState {
  occPage: any
}
export const defaultOccPage: OCCPageState = {
  occPage: [{}]
}


export interface SectionsFillStatusState {
  statusValues: any
}

export const defaultSectionsStatus: SectionsFillStatusState = {
  statusValues: [{}]
}