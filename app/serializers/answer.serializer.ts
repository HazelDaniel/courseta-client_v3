import { AnswerAdditionPayloadType, StateAnswerType } from "~/types";

export const serializeAnswersForAction: (
  answerStates: Partial<StateAnswerType>[]
) => AnswerAdditionPayloadType[] = (answerStates) => {
  let resAnswersPayload: AnswerAdditionPayloadType[] = [];

  resAnswersPayload = answerStates
    .filter((answer) => !answer.loaded)
    .map((answer) => {
      const { correct, questionPosition, text } = answer;
      return {
        answerText: text,
        isCorrect: correct || false,
        questionPositionID: questionPosition,
      } as AnswerAdditionPayloadType;
    });

  return resAnswersPayload;
};
