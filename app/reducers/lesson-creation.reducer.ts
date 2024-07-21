import { CourseLessonType } from "~/types";
import { isEqual } from "~/utils/comparison";
const LessonCreationActionTypes = {
  addLesson: "ADD_LESSON",
  updateTitle: "UPDATE_TITLE",
};

export type LessonCreationType = keyof typeof LessonCreationActionTypes;

export interface LessonCreationStateType {
  lessons: Partial<Pick<CourseLessonType, "title" | "id">>[];
}

export const InitialLessonCreationState: LessonCreationStateType = {
  lessons: [],
};

export interface LessonCreationActionType {
  type: keyof typeof LessonCreationActionTypes;
  payload?: Partial<Pick<CourseLessonType, "title" | "id">>;
}

export const LessonCreationReducer = (
  state = InitialLessonCreationState,
  action: LessonCreationActionType
) => {
  let newState: LessonCreationStateType;
  switch (action.type) {
    case LessonCreationActionTypes.addLesson: {
      let emptyLesson = state.lessons.find((el) => {
        return Object.keys(el).length === 1 && el.id !== undefined;
      }); // having no title fields set yet
      if (emptyLesson) return state;
      else
        newState = {
          ...state,
          lessons: [...state.lessons, { id: state.lessons.length }],
        };
      // console.log("new state after creating a new lesson");
      // console.log(newState);
      return newState;
    }
    case LessonCreationActionTypes.updateTitle: {
      newState = { ...state };
      const payload: Partial<Pick<CourseLessonType, "title" | "id">> =
        action.payload as Partial<Pick<CourseLessonType, "title" | "id">>;
      const lessonIndex = state.lessons.findIndex((el) => el.id === payload.id);
      const resultLesson: Partial<Pick<CourseLessonType, "title" | "id">> = {
        ...state.lessons[lessonIndex],
        ...payload,
        id: state.lessons[lessonIndex].id || payload.id,
      };
      newState.lessons[lessonIndex] = resultLesson;
      if (isEqual(state, newState)) return state;
      return newState;
    }
    default: {
      return state;
    }
  }
};

export const __addLesson: () => LessonCreationActionType = () => {
  return {
    type: LessonCreationActionTypes.addLesson as keyof typeof LessonCreationActionTypes,
  };
};

export const __updateTitle: (
  payload: Partial<Pick<CourseLessonType, "title" | "id">>
) => LessonCreationActionType = (payload) => {
  return {
    type: LessonCreationActionTypes.updateTitle as keyof typeof LessonCreationActionTypes,
    payload,
  };
};
