import React from "react";
import {
  AccordionActionType,
  AccordionStateType,
} from "~/reducers/accordion-reducer";

export interface AccordionContextValueType {
  accordionState: AccordionStateType;
  accordionDispatch: React.Dispatch<AccordionActionType>;
}

export const AccordionContext =
  React.createContext<AccordionContextValueType | null>(null);
export const AccordionProvider = AccordionContext.Provider;
