import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { redirectWithError } from "remix-toast";
import { UserCourses } from "~/components/user-courses";
import { v3Config } from "~/config/base";
import { courseData } from "~/data/course-list";
import { CourseViewType, ServerPayloadType } from "~/server.types";
import { CourseEntryType, LoaderResponseType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Courseta | Courses" },
    {
      name: "description",
      content: "courses page for the Courseta edtech platform",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const searchParams = new URL(request.url).searchParams;
    const searchTerm: string | null = searchParams.get("search");
    const cookieHeader = request.headers.get("Cookie");

    if (searchTerm) {
      return json(
        courseData.filter((course) => {
          return course.title.includes(searchTerm);
        })
      );
    }
    const coursesRequest: AxiosResponse<
      ServerPayloadType<CourseViewType[]>,
      any
    > = await axios.get(`${v3Config.apiUrl}/courses/`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (coursesRequest.status !== 200) {
      if (coursesRequest.status - 500 >= 0)
        return redirectWithError(
          "/",
          "an error occurred while fetching courses data.",
          { status: coursesRequest.status }
        );
      return redirectWithError(
        "/auth?type=sign_in",
        coursesRequest.data.message ||
          "an error occurred!. try signing in first"
      );
    }

    return json(coursesRequest.data.payload);
  } catch (err) {
    console.error(err);
    if (err instanceof Response) {
      return redirectWithError("/", "an unexpected error occurred!", {
        status: 500,
      });
    }
    if (err instanceof Error)
      return redirectWithError(
        "/home",
        err.message || "an unexpected error occurred!",
        { status: 500 }
      );
  }
};

export const Courses: React.FC = () => {
  const courses = useLoaderData<typeof loader>() as CourseViewType[];
  return <UserCourses courses={courses} isGeneric={true} />;
};

export default Courses;
