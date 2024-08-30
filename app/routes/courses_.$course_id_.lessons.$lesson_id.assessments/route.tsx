import { LoaderFunction } from "@remix-run/node";
import { Outlet, json } from "@remix-run/react";
import { courseDataDetailed } from "~/data/course-list";
import { CourseDetailViewType } from "~/server.types";
import { CourseDetailType, CourseLessonType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  return {};
};
// export const loader: LoaderFunction = ({ params }) => {
//   const { course_id: linkedCourseID, lesson_id: linkedLessonID, assessment_id: quizID } = params;
//   let course: CourseDetailViewType;
//   let lesson: Partial<CourseLessonType>;

//   if (!linkedCourseID) {
//     throw json(
//       { error: "no course id provided for quizzes!" },
//       { status: 401 }
//     );
//   }
//   if (!linkedLessonID) {
//     throw json(
//       { error: "no lesson id provided for quizzes!" },
//       { status: 401 }
//     );
//   }

//   course = courseDataDetailed.filter(
//     (course) => course.id === +linkedCourseID
//   )[0] as CourseDetailType;

//   lesson = course.lessons.filter(
//     (lesson) => lesson.id === +linkedLessonID
//   )[0] as CourseLessonType;

//   if (!course) {
//     throw json({ error: "course not found!" }, { status: 404 });
//   }
//   if (!lesson) {
//     throw json({ error: "lesson not found!" }, { status: 404 });
//   }

//   return json({ lesson, quizID });
// };

export const QuizzesPage: React.FC = () => {
  return <Outlet />;
};

export default QuizzesPage;
