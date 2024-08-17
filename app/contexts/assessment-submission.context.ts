import React from "react";
import {
  AssessmentSubmissionActionType,
  AssessmentSubmissionStateType,
} from "~/reducers/assessment-submission.reducer";

export interface AssessmentSubmissionContextValueType {
  selectionState: AssessmentSubmissionStateType;
  selectionDispatch: React.Dispatch<AssessmentSubmissionActionType>;
}

export const AssessmentSubmissionContext =
  React.createContext<AssessmentSubmissionContextValueType | null>(null);
export const AssessmentSubmissionProvider = AssessmentSubmissionContext.Provider;
