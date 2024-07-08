import { useRouteLoaderData } from "@remix-run/react";
import { AssessmentBody } from "~/components/course-details";
import { CourseLessonType } from "~/types";

export const lessonContentIndexPage: React.FC = () => {
  const res = useRouteLoaderData(
    "routes/courses_.$course_id_.lessons.$lesson_id.assessments"
  ) as { lesson: CourseLessonType; contentID: string };
  return <AssessmentBody assessment={res.lesson?.assessment} />;
};

export default lessonContentIndexPage;
