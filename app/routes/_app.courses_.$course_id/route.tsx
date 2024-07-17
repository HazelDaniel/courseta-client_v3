import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { NotFound } from "~/components/not-found";
import { courseDataDetailed } from "~/data/course-list";
import type { CourseDetailType } from "~/types";
import { CourseBanner } from "./course-banner";
import { CourseInfo } from "./course-info";
import styles from "~/styles/course.module.css";
import { LinksFunction, LoaderFunction } from "@remix-run/node";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const loader: LoaderFunction = ({ params }) => {
  const courseID = params["course_id"];

  const course = courseDataDetailed.filter(
    (course) => course.id === +(courseID as string)
  )[0];

  if (!course) {
    throw json({ error: "course not found!" }, { status: 404 });
  }

  return json({ course });
};

const Course: React.FC = () => {
  const { course } = useLoaderData<typeof loader>();

  return (
    <div className={styles.course_styled}>
      <CourseBanner course={course} />
      <CourseInfo course={course} />
    </div>
  );
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      default:
        return (
          <h2>
            error fetching course. {error.data.error} {error.statusText}
          </h2>
        );
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default Course;
