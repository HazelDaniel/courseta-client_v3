import { InitialLessonUpdateState, LessonUpdateActionType } from '~/reducers/lesson-update.reducer';
import React from "react";

export interface LessonUpdateContextValueType {
  lessonUpdateState: typeof InitialLessonUpdateState;
  lessonUpdateDispatch: React.Dispatch<LessonUpdateActionType>;
}

export const LessonUpdateContext = React.createContext<LessonUpdateContextValueType | null>(null);
export const LessonUpdateProvider = LessonUpdateContext.Provider;
