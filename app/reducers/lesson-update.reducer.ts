import {
  LessonAssessmentType,
  LessonContentFormType,
  LessonContentType,
  QuizFormType,
} from "~/types";
import { isEqual } from "~/utils/comparison";
const LessonUpdateActionTypes = {
  addContent: "ADD_CONTENT",
  addQuiz: "ADD_QUIZ",
  updateContent: "UPDATE_CONTENT",
  updateQuiz: "UPDATE_QUIZ",
  updatePosition: "UPDATE_POSITION",
};

export type LessonUpdateType = keyof typeof LessonUpdateActionTypes;
interface StateContentType extends Partial<LessonContentType> {
  lessonPosition: number;
}
interface ItemAdditionPayloadType {
  lessonPositionID: number;
}
interface StateQuizType extends LessonAssessmentType {
  lessonPosition: number;
}

export interface LessonUpdateStateType {
  position?: number;
  // lessonTitle: string;
  lessonQuizCount: number;
  lessonContents: Partial<StateContentType>[];
  lessonQuizzes: Partial<StateQuizType>[];
}

export const InitialLessonUpdateState: LessonUpdateStateType = {
  // lessonTitle: "",
  lessonQuizCount: 0,
  lessonContents: [],
  lessonQuizzes: [],
};

export interface LessonUpdateActionType {
  type: keyof typeof LessonUpdateActionTypes;
  payload?:
    | string
    | number
    | Partial<LessonContentFormType>
    | Partial<QuizFormType>;
}

export const LessonUpdateReducer = (
  state = InitialLessonUpdateState,
  action: LessonUpdateActionType
) => {
  let newState: LessonUpdateStateType;
  // console.log(
  //   "we hit the reducer with a state ",
  //   state,
  //   " and an action of ",
  //   action.type,
  //   " type"
  // );
  const payload: ItemAdditionPayloadType =
    action.payload as ItemAdditionPayloadType;
  switch (action.type) {
    case LessonUpdateActionTypes.addContent: {
      if (state.position === undefined) return state; // we need a lesson position
      let emptyContent = state.lessonContents.find(
        (el) =>
          Object.keys(el).length === 2 &&
          el.id !== undefined &&
          el.lessonPosition !== undefined
      ); // having only the id field
      if (emptyContent) return state;
      else
        newState = {
          ...state,
          lessonContents: [
            ...state.lessonContents,
            {
              id: state.lessonContents.length,
              lessonPosition: payload.lessonPositionID,
            },
          ],
        };
      return newState;
    }
    case LessonUpdateActionTypes.addQuiz: {
      if (state.position === undefined) return state; // we need a lesson position
      let emptyQuiz = state.lessonQuizzes.find(
        (el) =>
          Object.keys(el).length === 2 &&
          el.id !== undefined &&
          el.lessonPosition !== undefined
      ); //again, having only the id field
      if (
        emptyQuiz ||
        state.lessonQuizzes.filter((el) => {
          // console.log("found a matching quiz : ", el);
          return el.id === payload.lessonPositionID;
        }).length
      )
        return state;
      else {
        newState = {
          ...state,
          lessonQuizzes: [
            ...state.lessonQuizzes,
            {
              id: state.lessonQuizzes.length,
              lessonPosition: payload.lessonPositionID,
            },
          ],
        };
        return newState;
      }
    }
    case LessonUpdateActionTypes.updateContent: {
      if (state.position === undefined) return state; // we need a lesson position
      newState = { ...state };
      const payload = action.payload as StateContentType;
      const contentIndex = state.lessonContents.findIndex(
        (el) => el.id === payload.id
      );
      // console.log("content index is ", contentIndex);
      const resultContent: StateContentType = {
        ...state.lessonContents[contentIndex],
        ...payload,
        id: state.lessonContents[contentIndex].id || payload.id,
      };
      newState.lessonContents[contentIndex] = resultContent;
      if (isEqual(state, newState)) return state;
      return newState;
    }
    case LessonUpdateActionTypes.updateQuiz: {
      if (state.position === undefined) return state; // we need a lesson position
      newState = { ...state };
      const payload = action.payload as StateQuizType;
      const quizIndex = state.lessonQuizzes.findIndex(
        (el) => el.id === payload.id
      );
      const resultQuiz: StateQuizType = {
        ...state.lessonQuizzes[quizIndex],
        ...payload,
        id: state.lessonQuizzes[quizIndex].id || payload.id,
      };
      newState.lessonQuizzes[quizIndex] = resultQuiz;
      if (isEqual(state, newState)) return state;
      return newState;
    }
    case LessonUpdateActionTypes.updatePosition: {
      let payload: number = action.payload as number;
      if (state.position === action.payload) return state;
      newState = { ...state, position: payload };
      // console.log("new state is ", newState);
      return newState;
    }
    default: {
      return state;
    }
  }
};

// updatePosition: "UPDATE_POSITION",

export const __addContent: (
  payload: ItemAdditionPayloadType
) => LessonUpdateActionType = (payload) => {
  return {
    type: LessonUpdateActionTypes.addContent as keyof typeof LessonUpdateActionTypes,
    payload,
  };
};

export const __addQuiz: (
  payload: ItemAdditionPayloadType
) => LessonUpdateActionType = (payload) => {
  return {
    type: LessonUpdateActionTypes.addQuiz as keyof typeof LessonUpdateActionTypes,
    payload,
  };
};

export const __updateContent: (
  payload: Partial<LessonContentFormType>
) => LessonUpdateActionType = (payload) => {
  return {
    type: LessonUpdateActionTypes.updateContent as keyof typeof LessonUpdateActionTypes,
    payload,
  };
};

export const __updateQuiz: (
  payload: Partial<QuizFormType>
) => LessonUpdateActionType = (payload) => {
  return {
    type: LessonUpdateActionTypes.updateQuiz as keyof typeof LessonUpdateActionTypes,
    payload,
  };
};

export const __updatePosition: (payload: number) => LessonUpdateActionType = (
  payload
) => {
  return {
    type: LessonUpdateActionTypes.updatePosition as keyof typeof LessonUpdateActionTypes,
    payload,
  };
};
