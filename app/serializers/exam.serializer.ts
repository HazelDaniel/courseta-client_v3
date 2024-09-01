import { getLocalTimestamp } from './../utils/conversion';
import { AssessmentEditStateType, ExamCreationPayloadType } from "~/types";

export const serializeExamForCreateAction: (
  lessonExamState: Partial<AssessmentEditStateType>
) => Omit<ExamCreationPayloadType, "parentEntityID"> = (examState) => {
  let resExamPayload: Omit<ExamCreationPayloadType, "parentEntityID">;
  examState.startDate = getLocalTimestamp(examState.startDate); // we are using the remix server time for the dates calculation so as to correctly compute the ready property on the loaders
  examState.endDate = getLocalTimestamp(examState.endDate);
  return examState;
};

