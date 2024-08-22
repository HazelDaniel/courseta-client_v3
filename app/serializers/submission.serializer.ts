import { AssessmentSubmissionStateType } from "~/reducers/assessment-submission.reducer";
import { AssessmentVariantType } from "~/server.types";
import { AssessmentSubmissionPayloadType } from "~/types";

export const serializeSubmissionStateForAction: (
  submissionState: AssessmentSubmissionStateType,
  assessmentID: string,
  variant: AssessmentVariantType
) => AssessmentSubmissionPayloadType = (submissionState, assessmentID, variant) => {
  return {
    answerList: submissionState.questions.reduce((acc: {answer_id: number; question_id: number}[], question) => {
      acc = [...acc, ...question.answers.map(el => ({answer_id: el.answerID, question_id: el.questionID}))]
      return acc;
    } , []),
    assessmentID,
    questionIDList: Array.from(submissionState.questionIDs),
    assessmentType: variant,
  } as AssessmentSubmissionPayloadType;
};
