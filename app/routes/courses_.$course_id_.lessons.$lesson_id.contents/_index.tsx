import { useRouteLoaderData } from "@remix-run/react";
import { LessonContentBody } from "~/components/lesson-content-body";
import { CourseLessonType } from "~/types";

export const lessonContentIndexPage: React.FC = () => {
  const res = useRouteLoaderData("routes/courses_.$course_id_.lessons.$lesson_id.contents") as {lesson: CourseLessonType, contentID: string};
  return <LessonContentBody lesson={res.lesson} contentID={+res.contentID}/>;
};

export default lessonContentIndexPage;