import {
  AssessmentVariantType,
  QuestionAdditionPayloadType,
  StateQuestionType,
} from "~/types";

export const serializeQuestionsForAction: (
  questionStates: Partial<StateQuestionType>[],
  assessmentID: string,
  assessmentType: AssessmentVariantType
) => QuestionAdditionPayloadType[] = (
  questionStates,
  assessmentID,
  assessmentType
) => {
  let resQuestionsPayload: QuestionAdditionPayloadType[] = [];

  resQuestionsPayload = questionStates
    .filter((question) => !question.loaded)
    .map((question) => {
      const { points, question: questionText, position } = question;
      return {
        points: points || 0,
        positionID: position,
        questionText,
        assessmentID,
        assessmentType: assessmentType || "quiz",
      } as QuestionAdditionPayloadType;
    });

  return resQuestionsPayload;
};

export const serializeTrashQuestionsForAction: (
  questionStates: Partial<StateQuestionType>[]
) => number[] = (questionStates) => {
  let resTrashQuestionsPayload: number[] = [];

  resTrashQuestionsPayload = questionStates.map((question) => {
    return +(question.id as string);
  });

  return resTrashQuestionsPayload;
};
