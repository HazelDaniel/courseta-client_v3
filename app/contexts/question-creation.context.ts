import React from "react";
import {
  InitialQuestionCreationState,
  QuestionCreationActionType,
} from "~/reducers/question-creation.reducer";

export interface QuestionCreationContextValueType {
  questionCreationState: typeof InitialQuestionCreationState;
  questionCreationDispatch: React.Dispatch<QuestionCreationActionType>;
}

export const questionCreationContext =
  React.createContext<QuestionCreationContextValueType | null>(null);
export const QuestionCreationProvider = questionCreationContext.Provider;
