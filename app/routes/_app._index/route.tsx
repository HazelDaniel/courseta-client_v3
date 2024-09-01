import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { AppMain } from "../_app/app-main";
import {
  defer,
  json,
  redirect,
  useNavigate,
  useRouteLoaderData,
} from "@remix-run/react";
import { LoaderResponseType, SessionUserType } from "~/types";
import axios, { AxiosResponse } from "axios";
import {
  CourseViewType,
  ServerPayloadType,
  StudentCourseViewType,
} from "~/server.types";
import { v3Config } from "~/config/base";
import { redirectWithError } from "remix-toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Courseta | Home" },
    {
      name: "description",
      content: "home page for the Courseta edtech platform",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const userRequest: AxiosResponse<
      ServerPayloadType<SessionUserType | undefined>
    > = await axios.get(`${v3Config.apiUrl}/users/current`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    let globalUser: SessionUserType | undefined;
    if (userRequest.status === 200) globalUser = userRequest.data.user;
    else globalUser = undefined;
    if (!globalUser) throw redirect("/home");

    let coursesListPromise: Promise<
      AxiosResponse<
        ServerPayloadType<
          | CourseViewType[]
          | (Omit<CourseViewType, "lessonCount"> & { studentCount: number })[]
        >
      >
    >;
    let lastCoursePromise: Promise<
      AxiosResponse<ServerPayloadType<StudentCourseViewType[]>>
    > | null = null;

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

    switch (globalUser.role) {
      case "creator": {
        coursesListPromise = axiosInstance.get(
          `${v3Config.apiUrl}/creators/${globalUser.id}/courses/top`,
          {
            headers: {
              Cookie: cookieHeader,
            },
          }
        );
        break;
      }
      case "student": {
        coursesListPromise = axiosInstance.get(
          `${v3Config.apiUrl}/students/${globalUser.id}/courses/recommended`,
          {
            headers: {
              Cookie: cookieHeader,
            },
          }
        );
        const unfinishedCoursesRes = (await axios.get(
          `${v3Config.apiUrl}/students/${globalUser.id}/courses/unfinished`,
          {
            headers: {
              Cookie: cookieHeader,
            },
          }
        )) as AxiosResponse<ServerPayloadType<StudentCourseViewType[]>>;

        if (unfinishedCoursesRes.status !== 200) {
          if (unfinishedCoursesRes.status - 500 >= 0)
            return redirectWithError("/", "an error occurred while fetching unfinished course.", {status: 500})
          throw redirect("/auth?type=sign_in");
        }

        return defer({
          unfinishedCourse: unfinishedCoursesRes.data.payload || [],
          courses: coursesListPromise,
        });
      }
    }

    return defer({
      courses: coursesListPromise,
    });
  } catch (err) {
    if (err instanceof Response) {
      return redirectWithError("/", err.statusText || "an unknown error occurred!", {status: 500})
    }
    return redirectWithError("/", "an unknown error occurred!", {status: 500})
  }
};

export default function Index() {
  const authData = useRouteLoaderData("root") as { user: SessionUserType };
  const { user } = authData;
  const navigate = useNavigate();
  if (!user) {
    navigate("/auth?type=sign_in");
  }
  return <AppMain />;
}
