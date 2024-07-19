import { isEqual } from "~/utils/comparison";
const CourseAccordionActionTypes = {
  showAccordion: "SHOW_ACCORDION",
  closeAccordion: "CLOSE_ACCORDION",
  hideAll: "HIDE_ALL",
};

export type AccordionType = string;

export interface AccordionStateType {
  [prop: string]: boolean;
}
export const InitialAccordionState: AccordionStateType = {};

export interface AccordionActionType {
  type: keyof AccordionStateType;
  payload?: Partial<AccordionStateType>;
}

export const AccordionReducer = (
  state = InitialAccordionState,
  action: AccordionActionType
) => {
  let newState: AccordionStateType;

  switch (action.type) {
    case CourseAccordionActionTypes.showAccordion: {
      let i: string;
      let payloadValue: boolean;
      let payloadKey: AccordionType;
      newState = { ...state };
      for (i of Object.keys(newState)) {
        newState[i as string] = false;
      }
      payloadValue = Object.values(
        action.payload as Partial<AccordionStateType>
      )[0]!;
      payloadKey = Object.keys(
        action.payload as Partial<AccordionStateType>
      )[0] as AccordionType;
      if (payloadValue) {
        newState = { ...newState, [payloadKey]: true };
        if (isEqual(newState, state)) return state;
        return newState;
      } else return state;
    }
    case CourseAccordionActionTypes.closeAccordion: {
      let payloadValue: boolean;
      let payloadKey: AccordionType;
      payloadValue = Object.values(
        action.payload as Partial<AccordionStateType>
      )[0]!;
      payloadKey = Object.keys(
        action.payload as Partial<AccordionStateType>
      )[0] as AccordionType;
      newState = { ...state };
      if (payloadValue) {
        newState = { ...newState, [payloadKey]: false };
        if (isEqual(newState, state)) return state;
        return newState;
      } else {
        return state;
      }
    }
    case CourseAccordionActionTypes.hideAll: {
      let i: string;
      const newState = { ...state };
      for (i of Object.keys(newState)) {
        newState[i as keyof AccordionStateType] = false;
      }
      if (isEqual(newState, state)) return state;
      return newState;
    }
    default:
      return state;
  }
};

export const __showAccordion: (
  accordionType: AccordionType
) => AccordionActionType = (accordionType) => {
  return {
    type: CourseAccordionActionTypes.showAccordion as keyof AccordionActionType,
    payload: { [accordionType]: true },
  };
};

export const __hideAccordion: (
  accordionType: AccordionType
) => AccordionActionType = (accordionType) => {
  return {
    type: CourseAccordionActionTypes.closeAccordion as keyof AccordionActionType,
    payload: { [accordionType]: true },
  };
};

export const __hideAll: () => AccordionActionType = () => {
  return {
    type: CourseAccordionActionTypes.hideAll as keyof AccordionActionType,
  };
};
