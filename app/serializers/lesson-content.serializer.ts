import { LessonContentCreationPayloadType, StateContentType } from "~/types";

export const serializeLessonContentForAction: (
  lessonContentStates: Partial<StateContentType>[]
) => LessonContentCreationPayloadType[] = (lessonContentStates) => {
  let resContentsPayload: LessonContentCreationPayloadType[] = [];

  resContentsPayload = lessonContentStates.map((content) => {
    return {
      title: content.title,
      contentType: content.type,
      duration: content.duration,
      href: content.href,
      lessonPositionID: content.lessonPosition,
    } as LessonContentCreationPayloadType;
  });

  return resContentsPayload;
};
