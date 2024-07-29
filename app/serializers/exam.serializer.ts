import { AssessmentEditStateType, ExamCreationPayloadType } from "~/types";

export const serializeExamForCreateAction: (
  lessonExamState: Partial<AssessmentEditStateType>
) => Omit<ExamCreationPayloadType, "parentEntityID"> = (examState) => {
  let resExamPayload: Omit<ExamCreationPayloadType, "parentEntityID">;
  return examState;
};

