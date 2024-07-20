import { InitialLessonCreationState, LessonCreationActionType, LessonCreationReducer } from "~/reducers/lesson-creation.reducer";
import React from "react";

export interface LessonCreationContextValueType {
  lessonCreationState: typeof InitialLessonCreationState;
  lessonCreationDispatch: React.Dispatch<LessonCreationActionType>;
}

export const LessonCreationContext = React.createContext<LessonCreationContextValueType | null>(null);
export const LessonCreationProvider = LessonCreationContext.Provider;

