import { QuizAnswerType } from "~/types";
import { isEqual } from "~/utils/comparison";

//UTILS
const computeAnswerID: (state: QuestionCreationStateType) => string = (
  state
) => {
  if (state.answers.length > 0) {
    return (
      +(state.answers[state.answers.length - 1].id || "0") + 1
    ).toString();
  } else {
    return `${state.answers.length}`;
  }
};

const QuestionCreationActionTypes = {
  addAnswer: "ADD_ANSWER",
  updateAnswer: "UPDATE_ANSWER",
};

export type AnswerUpdateType = keyof typeof QuestionCreationActionTypes;

interface StateAnswerType extends Partial<Omit<QuizAnswerType, "quizID">> {
  questionPosition: number;
}

interface ItemAdditionPayloadType {
  questionPositionID: number;
}

export interface QuestionCreationStateType {
  answers: Partial<StateAnswerType>[];
}

export const InitialQuestionCreationState: QuestionCreationStateType = {
  answers: [],
};

export interface QuestionCreationActionType {
  type: keyof typeof QuestionCreationActionTypes;
  payload?:
    | Partial<StateAnswerType>
    | Partial<StateAnswerType>
    | ItemAdditionPayloadType;
}

export const QuestionCreationReducer = (
  state = InitialQuestionCreationState,
  action: QuestionCreationActionType
) => {
  let newState: QuestionCreationStateType;

  const payload: ItemAdditionPayloadType =
    action.payload as ItemAdditionPayloadType;
  switch (action.type) {
    case QuestionCreationActionTypes.addAnswer: {
      let emptyAnswer = state.answers.find(
        (el) =>
          Object.keys(el).length === 2 &&
          el.id !== undefined &&
          el.questionPosition !== undefined
      ); // having only the id field
      if (emptyAnswer) return state;
      else
        newState = {
          ...state,
          answers: [
            ...state.answers,
            {
              id: computeAnswerID(state),
              questionPosition: payload.questionPositionID,
            },
          ],
        };
      return newState;
    }
    case QuestionCreationActionTypes.updateAnswer: {
      newState = { ...state };
      const payload = action.payload as StateAnswerType;
      const answerIndex = state.answers.findIndex((el) => el.id === payload.id);
      const resultAnswer: StateAnswerType = {
        ...state.answers[answerIndex],
        ...payload,
        id: state.answers[answerIndex].id || payload.id,
      };
      newState.answers[answerIndex] = resultAnswer;
      if (isEqual(state, newState)) return state;
      return newState;
    }
    default: {
      return state;
    }
  }
};

export const __addAnswer: (
  payload: ItemAdditionPayloadType
) => QuestionCreationActionType = (payload) => {
  return {
    type: QuestionCreationActionTypes.addAnswer as keyof typeof QuestionCreationActionTypes,
    payload,
  };
};

export const __updateAnswer: (
  payload: Partial<StateAnswerType>
) => QuestionCreationActionType = (payload) => {
  return {
    type: QuestionCreationActionTypes.updateAnswer as keyof typeof QuestionCreationActionTypes,
    payload,
  };
};
