import { LoaderFunction } from "@remix-run/node";
import { Outlet, json } from "@remix-run/react";
import { courseDataDetailed } from "~/data/course-list";
import { CourseDetailType, CourseLessonType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const linkedCourseID = params["course_id"];
  const linkedLessonID = params["lesson_id"];
  const quizID = params["assessment_id"] || "0";
  let course: CourseDetailType;
  let lesson: Partial<CourseLessonType>;

  console.log("hitting the quizzes loader");

  if (!linkedCourseID) {
    throw json(
      { error: "no course id provided for quizzes!" },
      { status: 401 }
    );
  }
  if (!linkedLessonID) {
    throw json(
      { error: "no lesson id provided for quizzes!" },
      { status: 401 }
    );
  }

  course = courseDataDetailed.filter(
    (course) => course.id === +linkedCourseID
  )[0] as CourseDetailType;

  lesson = course.lessons.filter(
    (lesson) => lesson.id === +linkedLessonID
  )[0] as CourseLessonType;

  if (!course) {
    throw json({ error: "no course exists for quizzes!" }, { status: 404 });
  }
  if (!lesson) {
    throw json({ error: "no lesson exists for quizzes!" }, { status: 404 });
  }

  return json({ lesson, quizID });
};
export const QuizzesPage: React.FC = () => {
  return <Outlet />;
};

export default QuizzesPage;
