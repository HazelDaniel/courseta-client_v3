import {
  LessonQuizCreationPayloadType,
  QuizCreationPayloadType,
  StateQuizType,
} from "~/types";

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

export const serializeQuizForCreateAction: (
  lessonQuizState: Partial<StateQuizType>
) => Omit<QuizCreationPayloadType, "parentEntityID"> = (quizState) => {
  let resQuizPayload: Omit<QuizCreationPayloadType, "parentEntityID">;

  const { description, passScore, title } = quizState;
  resQuizPayload = { description, passScore, quizTitle: title as string };

  return resQuizPayload;
};
