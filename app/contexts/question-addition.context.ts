import {
  InitialQuestionAdditionState,
  QuestionAdditionActionType,
} from "~/reducers/question-addition.reducer";
import React from "react";

export interface QuestionAdditionContextValueType {
  questionAdditionState: typeof InitialQuestionAdditionState;
  questionAdditionDispatch: React.Dispatch<QuestionAdditionActionType>;
}

export const questionAdditionContext =
  React.createContext<QuestionAdditionContextValueType | null>(null);
export const QuestionAdditionProvider = questionAdditionContext.Provider;
