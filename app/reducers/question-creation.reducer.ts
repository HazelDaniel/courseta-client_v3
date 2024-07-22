import { QuizAnswerType } from "~/types";
import { isEqual } from "~/utils/comparison";
const AnswerCreationActionTypes = {
  addAnswer: "ADD_ANSWER",
  updateAnswer: "UPDATE_ANSWER",
};

export type AnswerUpdateType = keyof typeof AnswerCreationActionTypes;

interface StateAnswerType extends Partial<Omit<QuizAnswerType, "quizID">> {
  questionPosition: number;
}

interface ItemAdditionPayloadType {
  questionPositionID: number;
}

export interface AnswerCreationStateType {
  answers: Partial<StateAnswerType>[];
}

export const InitialAnswerCreationState: AnswerCreationStateType = {
  answers: [],
};

export interface AnswerCreationActionType {
  type: keyof typeof AnswerCreationActionTypes;
  payload?:
    | Partial<StateAnswerType>
    | Partial<StateAnswerType>
    | ItemAdditionPayloadType;
}

export const AnswerCreationReducer = (
  state = InitialAnswerCreationState,
  action: AnswerCreationActionType
) => {
  let newState: AnswerCreationStateType;
  console.log(
    "we hit the question addition reducer with a state ",
    state,
    " and an action of ",
    action.type,
    " type"
  );

  const payload: ItemAdditionPayloadType =
    action.payload as ItemAdditionPayloadType;
  switch (action.type) {
    case AnswerCreationActionTypes.addAnswer: {
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
              id: `${state.answers.length}`,
              questionPosition: payload.questionPositionID,
            },
          ],
        };
      return newState;
    }
    case AnswerCreationActionTypes.updateAnswer: {
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
) => AnswerCreationActionType = (payload) => {
  return {
    type: AnswerCreationActionTypes.addAnswer as keyof typeof AnswerCreationActionTypes,
    payload,
  };
};

export const __updateAnswer: (
  payload: Partial<StateAnswerType>
) => AnswerCreationActionType = (payload) => {
  return {
    type: AnswerCreationActionTypes.updateAnswer as keyof typeof AnswerCreationActionTypes,
    payload,
  };
};
