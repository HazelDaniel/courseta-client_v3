import { LoaderFunction, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useOutletContext,
  useParams,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { LessonContentBody } from "~/components/lesson-content-body";
import { StatusErrorElement } from "~/components/not-found";
import { CourseLessonType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const contentID = params["content_id"];

  return json({ contentID: +(contentID as string) });
};

export const LessonContentPage: React.FC = () => {
  const { content_id: contentID, lesson_id: lessonID } = useParams();
  const res = useOutletContext() as { lesson: CourseLessonType };
  return (
    <LessonContentBody lesson={res.lesson} contentID={+(contentID as string)} />
  );
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <StatusErrorElement />;
      default:
        return <h2>error fetching lesson content. {error.data.error}</h2>;
    }
  } else {
    return (
      <h2>
        something went wrong! {(error as Error)?.message} {error as any}
      </h2>
    );
  }
};

export default LessonContentPage;
