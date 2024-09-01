//UTILS
const computeQuestionID: (state: QuestionAdditionStateType) => string = (
  state
) => {
  return new Date().getTime().toString();
};

import { StateAnswerType, StateQuestionType } from "~/types";
const QuestionAdditionActionTypes = {
  addQuestion: "ADD_QUESTION",
  addAnswers: "ADD_ANSWERS",
  trashQuestion: "TRASH_QUESTION",
  clearDraft: "CLEAR_DRAFT",
  reset: "RESET",
};

export type QuestionUpdateType = keyof typeof QuestionAdditionActionTypes;

interface ItemAdditionPayloadType {
  questionPositionID: number;
}
interface AnswersAdditionPayloadType {
  answers: Partial<StateAnswerType>[];
}

export interface QuestionAdditionStateType {
  questions: Partial<StateQuestionType>[];
  answers: Partial<StateAnswerType>[];
  trashedQuestions: Partial<StateQuestionType>[];
  draftQuestions: Partial<StateQuestionType>[];
}

export const InitialQuestionAdditionState: QuestionAdditionStateType = {
  answers: [],
  questions: [],
  trashedQuestions: [],
  draftQuestions: [],
};

export interface QuestionAdditionActionType {
  type: keyof typeof QuestionAdditionActionTypes;
  payload?:
    | Partial<StateQuestionType>
    | AnswersAdditionPayloadType
    | typeof InitialQuestionAdditionState;
}

export const QuestionAdditionReducer = (
  state = InitialQuestionAdditionState,
  action: QuestionAdditionActionType
) => {
  let newState: QuestionAdditionStateType;

  switch (action.type) {
    case QuestionAdditionActionTypes.addAnswers: {
      let payload: AnswersAdditionPayloadType =
        action.payload as AnswersAdditionPayloadType;
      payload.answers = payload.answers.filter((el) => {
        return Object.keys(el).length >= 3;
      }); // only answers having all their fields (or at least the required fields)

      if (!payload.answers.length) return state;
      else
        newState = {
          ...state,
          answers: [...state.answers, ...payload.answers],
        };
      return newState;
    }
    case QuestionAdditionActionTypes.addQuestion: {
      let payload: Partial<StateQuestionType> =
        action.payload as Partial<StateQuestionType>;
      newState = {
        ...state,
      };
      const resultQuestion = {
        id: computeQuestionID(state),
        position: +computeQuestionID(state),
        ...payload,
      };
      newState.questions.push(resultQuestion);
      if (!resultQuestion.loaded) newState.draftQuestions.push(resultQuestion);
      return newState;
    }
    case QuestionAdditionActionTypes.trashQuestion: {
      let payload: Partial<StateQuestionType> =
        action.payload as Partial<StateQuestionType>;
      const questionIndex = state.questions.findIndex(
        (el) => el.id === payload.id
      );
      if (questionIndex === -1) return state;
      const trashResult = state.questions[questionIndex];
      trashResult.trashed = true;

      newState = {
        ...state,
        questions: [
          ...state.questions.filter(
            (question) => question.id !== trashResult.id
          ),
        ],
        draftQuestions: [
          ...state.questions.filter(
            (question) => question.id !== trashResult.id && !question.loaded
          ),
        ],
      };
      if (trashResult.loaded) newState.trashedQuestions.push(trashResult);
      return newState;
    }
    case QuestionAdditionActionTypes.clearDraft: {
      if (!state.draftQuestions.length) return state;
      newState = { ...state, draftQuestions: [] };
      return newState;
    }
    case QuestionAdditionActionTypes.reset: {
      
      
      return { ...action.payload as typeof InitialQuestionAdditionState };
    }
    default: {
      return state;
    }
  }
};

export const __addQuestion: (
  payload: Partial<StateQuestionType>
) => QuestionAdditionActionType = (payload) => {
  return {
    type: QuestionAdditionActionTypes.addQuestion as keyof typeof QuestionAdditionActionTypes,
    payload,
  };
};

export const __addAnswers: (
  payload: AnswersAdditionPayloadType
) => QuestionAdditionActionType = (payload) => {
  return {
    type: QuestionAdditionActionTypes.addAnswers as keyof typeof QuestionAdditionActionTypes,
    payload,
  };
};

export const __trashQuestion: (
  payload: Partial<StateQuestionType>
) => QuestionAdditionActionType = (payload) => {
  return {
    type: QuestionAdditionActionTypes.trashQuestion as keyof typeof QuestionAdditionActionTypes,
    payload,
  };
};

export const __clearDraft: () => QuestionAdditionActionType = () => {
  return {
    type: QuestionAdditionActionTypes.clearDraft as keyof typeof QuestionAdditionActionTypes,
  };
};

export const __reset: (
  payload: typeof InitialQuestionAdditionState
) => QuestionAdditionActionType = (payload) => {
  return {
    type: QuestionAdditionActionTypes.reset as keyof typeof QuestionAdditionActionTypes,
    payload,
  };
};
