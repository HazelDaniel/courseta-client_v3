import { LoaderFunction, json, redirect } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { CourseDetails } from "~/components/course-details";
import { StatusErrorElement } from "~/components/not-found";
import { v3Config } from "~/config/base";
import { CourseDetailViewType, ServerPayloadType } from "~/server.types";
import { CourseLessonType2, LoaderResponseType } from "~/types";

export const loader: LoaderFunction = async ({ params, request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const { course_id: courseID } = params;
  try {
    // NOTE: this will be fetching the course data for its route tree because its not nested under the course_id route
    const coursePromise: Promise<
      AxiosResponse<ServerPayloadType<CourseDetailViewType>, any>
    > = axios.get(`${v3Config.apiUrl}/courses/${courseID}`, {
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
    ]);

    let [courseInfo, lessonsInfo] = allPromises;
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
      lessons: lessonsInfo.data.payload,
      user: courseInfo.data.user,
    });
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    throw json(
      { error: (err as Error)?.message || "An unexpected error occurred" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

export const LessonPage: React.FC = () => {
  return <CourseDetails />;
};

export default LessonPage;
