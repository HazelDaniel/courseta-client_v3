import {
  InitialAnswerCreationState,
  AnswerCreationActionType,
} from "./../reducers/question-creation.reducer";
import React from "react";

export interface AnswerCreationContextValueType {
  answerCreationState: typeof InitialAnswerCreationState;
  answerCreationDispatch: React.Dispatch<AnswerCreationActionType>;
}

export const answerCreationContext =
  React.createContext<AnswerCreationContextValueType | null>(null);
export const AnswerCreationProvider = answerCreationContext.Provider;
