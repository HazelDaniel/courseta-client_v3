import styles from "~/styles/assessment.module.css";
import { LoaderFunction, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { AssessmentBody } from "~/components/course-details";
import { NotFound } from "~/components/not-found";
import { courseDataDetailed } from "~/data/course-list";
import { CourseDetailType, CourseExamType } from "~/types";


export const loader: LoaderFunction = ({ params }) => {
  const examID = params["exam_id"];
  const courseID = params["course_id"];

  const course = courseDataDetailed.filter(
    (course) => course.id === +(courseID as string)
  )[0];

  if (!course) {
    throw json({ error: "course not found!" }, { status: 404 });
  }

  return json({ course, examID: +(examID as string) });
};

export const ExamPage: React.FC = () => {
  const res = useLoaderData<typeof loader>() as {
    examID: string;
    course: CourseDetailType;
  };
  return <div className={`${styles.course_accessment_area} ${styles.course_assessment_area_styled}`}>
    <AssessmentBody assessment={res.course?.exam as CourseExamType} />;
  </div>;
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      default:
        return <h2>error fetching exam. {error.data.error}</h2>;
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default ExamPage;
