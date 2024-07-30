import {
  LessonContentAdditionPayloadType,
  LessonContentAdditionStateType,
  LessonContentCreationPayloadType,
  StateContentType,
} from "~/types";

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

export const serializeLessonContentForCreateAction: (
  lessonContentState: LessonContentAdditionStateType,
  lessonID: number
) => LessonContentAdditionPayloadType = (lessonContentState, lessonID) => {
  const { duration, href, title, type } = lessonContentState;
  const resContentPayload = {
    title,
    href,
    duration,
    contentType: type || "text",
    lessonID
  };

  return resContentPayload;
};
