//UTILS
const computeQuestionID: (state: QuestionAdditionStateType) => string = (
  state
) => {
  if (state.questions.length > 0) {
    return (
      +(state.questions[state.questions.length - 1].id || "0") + 1
    ).toString();
  } else {
    return `${state.questions.length}`;
  }
};

import {
  QuestionType,
  QuizAnswerType,
  StateAnswerType,
  StateQuestionType,
} from "~/types";
const QuestionAdditionActionTypes = {
  addQuestion: "ADD_QUESTION",
  addAnswers: "ADD_ANSWERS",
  trashQuestion: "TRASH_QUESTION",
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
}

export const InitialQuestionAdditionState: QuestionAdditionStateType = {
  answers: [],
  questions: [],
  trashedQuestions: [],
};

export interface QuestionAdditionActionType {
  type: keyof typeof QuestionAdditionActionTypes;
  payload?: Partial<StateQuestionType> | AnswersAdditionPayloadType;
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
      newState.questions.push({
        id: computeQuestionID(state),
        position: state.questions.length,
        ...payload,
      });
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
      };
      newState.trashedQuestions.push(trashResult);
      return newState;
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
