function addNewQuestion(
  newQuestion: Partial<AssessmentSubmissionStateType["questions"][number]>,
  payload: AnswerSelectionPayloadType,
  oldState: AssessmentSubmissionStateType
) {
  let newState: AssessmentSubmissionStateType;
  const existingQuestions = oldState.questions;
  const existingQuestionIDS = Array.from(oldState.questionIDs);
  newQuestion.answers = [payload];
  newQuestion.answerIDList = new Set([payload.answerID]);
  newQuestion.type = payload.questionType;
  newQuestion.id = payload.questionID;
  newState = {
    questions: [
      ...existingQuestions,
      newQuestion as AssessmentSubmissionStateType["questions"][number],
    ],
    questionIDs: new Set([...existingQuestionIDS, newQuestion.id as number]),
  };
  return newState;
}

const AssessmentSubmissionTypes = {
  addAnswer: "ADD_ANSWER",
  removeAnswer: "REMOVE_ANSWER",
  reset: "RESET",
};

export type AnswerSelectionType = keyof typeof AssessmentSubmissionTypes;

interface AnswerSelectionPayloadType {
  answerID: number;
  questionID: number;
  questionType: "multiple" | "single";
}

export interface AssessmentSubmissionStateType {
  questions: {
    type: AnswerSelectionPayloadType["questionType"];
    id: number;
    answerIDList: Set<number>;
    answers: AnswerSelectionPayloadType[];
  }[];
  questionIDs: Set<number>;
}

export const InitialAssessmentSubmissionState: AssessmentSubmissionStateType = {
  questions: [],
  questionIDs: new Set(),
};

export interface AssessmentSubmissionActionType {
  type: AnswerSelectionType;
  payload?: AnswerSelectionPayloadType;
}

export const AssessmentSubmissionReducer = (
  state = InitialAssessmentSubmissionState,
  action: AssessmentSubmissionActionType
) => {
  let newState: AssessmentSubmissionStateType;
  const payload: AnswerSelectionPayloadType =
    action.payload as AnswerSelectionPayloadType;
  switch (action.type) {
    case AssessmentSubmissionTypes.addAnswer: {
      if (!state.questionIDs.has(payload.questionID)) {
        const newQuestion: Partial<
          AssessmentSubmissionStateType["questions"][number]
        > = {};
        newState = addNewQuestion(newQuestion, payload, state);
        return newState;
      }
      newState = { ...state };
      const equivQuestion = newState.questions.find(
        (el) => el.id === payload.questionID
      ) as AssessmentSubmissionStateType["questions"][number];
      if (equivQuestion.answerIDList.has(payload.answerID)) return;
      if (equivQuestion.type === "multiple") {
        equivQuestion.answers.push(payload);
        equivQuestion.answerIDList.add(payload.answerID);
      } else {
        equivQuestion.answerIDList = new Set([payload.answerID]);
        equivQuestion.answers = [payload];
      }
      return newState;
    }
    case AssessmentSubmissionTypes.removeAnswer: {
      newState = { ...state };
      const equivQuestion = newState.questions.find(
        (el) => el.id === payload.questionID
      ) as AssessmentSubmissionStateType["questions"][number];
      if (equivQuestion.answerIDList.size === 1) {
        equivQuestion.answerIDList = new Set();
        equivQuestion.answers = [];
        return newState;
      }
      equivQuestion.answerIDList.delete(payload.answerID);
      equivQuestion.answers = equivQuestion.answers.filter(
        (ans) => ans.answerID !== payload.answerID
      );
      return newState;
    }
    case AssessmentSubmissionTypes.reset: {
      if (!state.questionIDs.size && !state.questions.length) return state;
      return {
        questions: [],
        questionIDs: new Set(),
      } as AssessmentSubmissionStateType;
    }
    default: {
      return state;
    }
  }
};

export const __addAnswer: (
  payload: AnswerSelectionPayloadType
) => AssessmentSubmissionActionType = (payload) => {
  return {
    type: AssessmentSubmissionTypes.addAnswer as AnswerSelectionType,
    payload,
  };
};

export const __removeAnswer: (
  payload: AnswerSelectionPayloadType
) => AssessmentSubmissionActionType = (payload) => {
  return {
    type: AssessmentSubmissionTypes.removeAnswer as AnswerSelectionType,
    payload,
  };
};

export const __reset: () => AssessmentSubmissionActionType = () => {
  return {
    type: AssessmentSubmissionTypes.reset as AnswerSelectionType,
  };
};
