import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { StatusErrorElement } from "~/components/not-found";
import { courseDataDetailed } from "~/data/course-list";
import type {
  CourseCreatorViewType,
  CourseDetailType,
  CourseLessonType2,
  LoaderResponseType,
} from "~/types";
import { CourseBanner } from "./course-banner";
import { CourseInfo } from "./course-info";
import styles from "~/styles/course.module.css";
import { LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import axios, { AxiosResponse } from "axios";
import { CourseDetailViewType, ServerPayloadType } from "~/server.types";
import { v3Config } from "~/config/base";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const loader: LoaderFunction = async ({ params, request }) => {
  const { course_id: courseID } = params;
  const cookieHeader = request.headers.get("Cookie");

  try {
    //
    // return json({toast}, {headers});
    const coursePromise: Promise<
      AxiosResponse<ServerPayloadType<CourseDetailViewType>, any>
    > = axios.get(`${v3Config.apiUrl}/courses/${courseID}/`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const courseCreatorPromise: Promise<
      AxiosResponse<ServerPayloadType<CourseCreatorViewType[]>, any>
    > = axios.get(`${v3Config.apiUrl}/courses/${courseID}/creator/summary`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const courseLessonsPromise: Promise<
      AxiosResponse<ServerPayloadType<CourseLessonType2[]>, any>
    > = axios.get(`${v3Config.apiUrl}/courses/${courseID}/lessons`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const allPromises = await Promise.all([
      coursePromise,
      courseLessonsPromise,
      courseCreatorPromise,
    ]);
    let [courseInfo, lessons, creatorInfo] = allPromises;
    if (courseInfo.status !== 200) {
      if (courseInfo.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching course data.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }

    if (!courseInfo.data.payload) {
      throw json({ error: "course not found!" }, { status: 404 });
    }

    return json({
      course: courseInfo.data.payload,
      creator: creatorInfo.data.payload,
      lessons: lessons.data.payload,
      user: courseInfo.data.user,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Response) {
      throw err;
    }
    throw json(
      { error: (err as Error)?.message || "An unexpected error occurred" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

const Course: React.FC = () => {
  const { course }: { course: CourseDetailViewType } =
    useLoaderData<typeof loader>();

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
        return <StatusErrorElement />;
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
