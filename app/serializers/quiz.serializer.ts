import { LessonQuizCreationPayloadType, StateQuizType } from "~/types";

export const serializeLessonQuizForAction: (
  lessonQuizStates: Partial<StateQuizType>[]
) => LessonQuizCreationPayloadType[] = (lessonQuizStates) => {
  let resQuizzesPayload: LessonQuizCreationPayloadType[] = [];

  resQuizzesPayload = lessonQuizStates.map((quiz) => {
    return {
      description: quiz.description,
      lessonPositionID: quiz.lessonPosition,
      passScore: quiz.passScore,
      quizTitle: quiz.title,
    } as LessonQuizCreationPayloadType;
  });

  return resQuizzesPayload;
};
