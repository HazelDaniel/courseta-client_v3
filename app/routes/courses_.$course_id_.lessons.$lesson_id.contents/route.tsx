import { LoaderFunction } from "@remix-run/node";
import { Outlet, json, useParams, useRouteLoaderData } from "@remix-run/react";
import { NotFound } from "~/components/not-found";
import { courseDataDetailed } from "~/data/course-list";
import { CourseDetailType, CourseLessonType, CourseLessonType2 } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  return json({});
};
export const LessonContentsPage: React.FC = () => {
  const { lesson_id: lessonID } = useParams();
  const loadedData = useRouteLoaderData(
    "routes/courses_.$course_id_.lessons.$lesson_id"
  ) as { lessons: CourseLessonType2[] };
  const lesson = loadedData.lessons.find(
    (el) => el.id.toString() === lessonID
  );
  if (!lesson) return <NotFound />;
  return <Outlet context={{ lesson }} />;
};

export default LessonContentsPage;
