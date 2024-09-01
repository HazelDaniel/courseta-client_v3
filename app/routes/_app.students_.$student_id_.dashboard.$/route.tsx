import { ActionFunction, defer, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { useMemo, useReducer } from "react";
import { LoaderFunction, json } from "react-router";
import { redirectWithError } from "remix-toast";
import { DashboardBody } from "~/components/dashboard-body";
import { v3Config } from "~/config/base";
import { ModalProvider } from "~/contexts/modal.context";
import { InitialModalState, ModalReducer } from "~/reducers/modal.reducer";
import { ServerPayloadType, StudentCourseViewType } from "~/server.types";
import { DashBoardActionWrapper } from "~/shared-actions.server";
// import profileStyles from "~/styles/profile.module.css";
// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { StudentUserType } from "~/types";

export const loader: LoaderFunction = async ({ params, request }) => {
  try {
    const studentID = params["student_id"];
    const cookieHeader = request.headers.get("Cookie");

    if (!studentID) return redirectWithError("/auth?type=sign_in&role=student", "you need to sign in first!");

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

    const unfinishedCoursesPromise = axiosInstance.get(
      `${v3Config.apiUrl}/students/${studentID}/courses/unfinished`,
      {
        headers: {
          Cookie: cookieHeader as any,
        },
      }
    );

    const profileRequest = await axios.get(
      `${v3Config.apiUrl}/students/${studentID}/me`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    if (profileRequest.status !== 200) {
      if (profileRequest.status - 500 >= 0)
        throw json(
          { error: "something went wrong while fetching user profile." },
          500
        );
      return redirect("/auth?type=sign_up");
    }
    return defer({
      unfinishedCourses: unfinishedCoursesPromise,
      profile: profileRequest.data.payload,
    });
  } catch (err) {

  }
};

export const Dashboard: React.FC = () => {
  const { profile } = useLoaderData<typeof loader>() as {
    profile: StudentUserType;
  };
  const [modalState, modalDispatch] = useReducer(
    ModalReducer,
    InitialModalState
  );

  const modalContextValue = useMemo(
    () => ({ modalState, modalDispatch }),
    [modalState, modalDispatch]
  );

  return (
    <ModalProvider value={modalContextValue}>
      <DashboardBody profile={profile} />
    </ModalProvider>
  );

};

export default Dashboard;

export const action: ActionFunction = async (args) => {
  try {
    return await DashBoardActionWrapper("student", args);
  } catch (err) {
    console.error((err as any).message);
    return null;
  }
};
