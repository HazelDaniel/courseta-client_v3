import { LoaderFunction, MetaFunction, defer } from "@remix-run/node";
import { Await, json, useAsyncError, useLoaderData } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { Suspense } from "react";
import { NoContent } from "~/components/no-content";
import { UserCourses } from "~/components/user-courses";
import { v3Config } from "~/config/base";
import { courseData } from "~/data/course-list";
import { ServerPayloadType, StudentCourseViewType } from "~/server.types";
import { CourseEntryType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Courseta | Courses" },
    {
      name: "description",
      content: "personalized courses page for the Courseta edtech platform",
    },
  ];
};

export const loader: LoaderFunction = (args) => {
  try {
    const { request, params } = args;
    const searchParams = new URL(request.url).searchParams;
    const searchTerm: string | null = searchParams.get("search");
    const cookieHeader = request.headers.get("Cookie");
    const { student_id: studentID } = params;

    const axiosInstance = axios.create();
    axiosInstance.interceptors.response.use(
      function (response) {
        delete response.request;
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    // if (searchTerm) { // TODO: THIS FILTERING LOGIC WILL PROBABLY GO TO A CLIENT LOADER
    //   return json({
    //     courses: courseData.filter((course) => {
    //       return course.title.includes(searchTerm);
    //     }),
    //   });
    // }

    const enrolledCoursesPromise = axiosInstance.get(
      `${v3Config.apiUrl}/students/${studentID}/courses`,
      {
        headers: {
          Cookie: cookieHeader as any,
        },
      }
    );

    return defer({ courses: enrolledCoursesPromise });
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

const EnrolledCourseErrorElement: React.FC = () => {
  const error = useAsyncError();
  return <h2>error occurred fetching your unfinished courses!</h2>;
};


export const MyCourses: React.FC = () => {
  const loadedData = useLoaderData<typeof loader>() as {
    courses: Promise<
      AxiosResponse<ServerPayloadType<StudentCourseViewType[]>, any>
    >;
  };
  return (
    <Suspense
      fallback={<NoContent text="No courses to show!" variant="courses" />}
    >
      <Await
        resolve={loadedData.courses}
        errorElement={<EnrolledCourseErrorElement />}

      >
        {(courses) => {
          return (
            <UserCourses
              courses={courses.data.payload || []}
              isGeneric={false}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};

export default MyCourses;
