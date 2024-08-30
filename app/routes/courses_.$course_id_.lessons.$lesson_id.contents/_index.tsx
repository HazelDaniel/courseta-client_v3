import {
  useOutletContext,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import { LessonContentBody } from "~/components/lesson-content-body";
import { CourseLessonType } from "~/types";

export const lessonContentIndexPage: React.FC = () => {
  const res = useOutletContext() as CourseLessonType[];
  const { content_id: contentID, lesson_id: lessonID } = useParams();
  const resLesson = res.find(el => el.id.toString() === (lessonID as string));
  if (!resLesson) return null;
  return <LessonContentBody lesson={resLesson} contentID={+(contentID as string)} />;
};

export default lessonContentIndexPage;
