import { CourseLessonType, LessonCreationPayloadType } from "~/types";

export const serializeLessonStateForAction: (
  lessonStates: Partial<Pick<CourseLessonType, "title" | "id">>[],
  courseID: number
) => LessonCreationPayloadType[] = (lessonStates, courseID) => {
  let resLessonsPayload: LessonCreationPayloadType[] = [];

  resLessonsPayload = lessonStates.map(lesson => {
    return {courseID, positionID: lesson.id, title: lesson.title} as LessonCreationPayloadType;
  })

  return resLessonsPayload;
};
