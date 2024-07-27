import { CourseCreationPayloadType, CourseEditStateType } from "~/types";

export const serializeCourseCreationState: (
  courseCreationState: Partial<CourseEditStateType>,
  uploadImageState: CourseCreationPayloadType["images"]
) => CourseCreationPayloadType = (courseCreationState, uploadImageState) => {
  const resCourseCreationPayload: CourseCreationPayloadType = {};
  resCourseCreationPayload.info = courseCreationState;
  resCourseCreationPayload.images = uploadImageState;

  return resCourseCreationPayload;
};

export const serializeCourseEditState: (
  courseCreationState: Partial<CourseEditStateType>,
  uploadImageState: CourseCreationPayloadType["images"]
) => CourseCreationPayloadType = (courseCreationState, uploadImageState) => {
  const resCourseCreationPayload: CourseCreationPayloadType = {};
  resCourseCreationPayload.info = courseCreationState;
  resCourseCreationPayload.images = uploadImageState;

  return resCourseCreationPayload;
};
