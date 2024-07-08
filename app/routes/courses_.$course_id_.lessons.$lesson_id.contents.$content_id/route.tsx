import { LoaderFunction, json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { LessonContentBody } from "~/components/lesson-content-body";
import { NotFound } from "~/components/not-found";
import { CourseLessonType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const contentID = params["content_id"];

  return json({ contentID: +(contentID as string) });
};

export const LessonContentPage: React.FC = () => {
  const res = useRouteLoaderData(
    "routes/courses_.$course_id_.lessons.$lesson_id.contents"
  ) as { lesson: CourseLessonType; contentID: string };

  const resContent = useLoaderData<typeof loader>();

  return (
    <LessonContentBody lesson={res.lesson} contentID={resContent.contentID} />
  );
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      default:
        return <h2>error fetching lesson content. {error.data.error}</h2>;
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default LessonContentPage;
