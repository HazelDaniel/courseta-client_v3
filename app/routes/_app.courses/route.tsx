import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
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

export const loader: LoaderFunction = async ({request}) => {
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
    const coursesRequest: AxiosResponse<ServerPayloadType<CourseViewType[]>, any>
    = await axios.get(
      `${v3Config.apiUrl}/courses/`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    if (coursesRequest.status !== 200) {
      if (coursesRequest.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching courses data.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }

    return json(coursesRequest.data.payload);
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

export const Courses: React.FC = () => {
  const courses = useLoaderData<typeof loader>() as CourseViewType[];
  return <UserCourses courses={courses} isGeneric={true} />;
};

export default Courses;
