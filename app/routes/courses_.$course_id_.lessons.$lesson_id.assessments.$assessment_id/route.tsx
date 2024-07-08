import { LoaderFunction, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { AssessmentBody } from "~/components/course-details";
import { NotFound } from "~/components/not-found";
import { CourseLessonType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const contentID = params["content_id"];

  return json({ contentID: +(contentID as string) });
};

export const QuizPage: React.FC = () => {
  const res = useRouteLoaderData(
    "routes/courses_.$course_id_.lessons.$lesson_id.assessments"
  ) as { lesson: CourseLessonType; contentID: string };
  // "routes/courses_.$course_id_.lessons.$lesson_id.assessments"

  return <AssessmentBody assessment={res.lesson?.assessment} />;
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      default:
        return <h2>error fetching quiz. {error.data.error}</h2>;
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default QuizPage;
