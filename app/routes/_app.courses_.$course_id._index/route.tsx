import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { CourseAccordion } from "~/components/course-accordion";
import { v3Config } from "~/config/base";
import { jsonWithSuccess } from "remix-toast";
import { CourseDetailViewType, ServerPayloadType } from "~/server.types";
import {
  ActionResponseType,
  CourseDetailType,
  StudentCourseActionType,
  StudentEnrollActionType,
  StudentEnrollPayloadType,
} from "~/types";


export const CourseIndex: React.FC = () => {
  const outletCourse = useOutletContext() as CourseDetailViewType;
  return <CourseAccordion variant="outline" course={outletCourse} />;
};

export default CourseIndex;

export const action: ActionFunction = async ({ params, request }) => {
  try {
    const { course_id: courseID } = params;
    const reqJson = (await request.json()) as StudentEnrollActionType;
    const cookieHeader = request.headers.get("Cookie");
    let actionRequest: AxiosResponse<ServerPayloadType<void>, any>;
    let requestURL: string;
    switch (reqJson.intent) {
      case "ENROLL": {
        const { studentID } = reqJson.payload;
        requestURL = `${v3Config.apiUrl}/courses/${courseID}/enroll`;
        actionRequest = await axios.post(
          requestURL,
          { studentID } as StudentEnrollPayloadType,
          {
            headers: {
              Cookie: cookieHeader,
            },
          }
        );
        if (actionRequest.status !== 200) break;
        return jsonWithSuccess(null, "enrolled successfully!");
        // return json({
        //   data: { message: "enrollment successful!" },
        //   error: null,
        // } as ActionResponseType<{ message: string }>);
      }
      case "UNENROLL": {
        const { studentID } = reqJson.payload;
        requestURL = `${v3Config.apiUrl}/courses/${courseID}/unenroll`;
        actionRequest = await axios.post(
          requestURL,
          { studentID } as StudentEnrollPayloadType,
          {
            headers: {
              Cookie: cookieHeader,
            },
          }
        );
        if (actionRequest.status !== 200) break;
        return jsonWithSuccess(null, "unenrolled successfully!");
      }
    }
    if (actionRequest.status - 500 >= 0)
      throw json({ error: "something went wrong" }, 500);
    else
      return json({
        data: null,
        error: `couldn't proceed with action. REASON: ${actionRequest.data.message}`,
      } as ActionResponseType<null>);
  } catch (err) {
    if (err instanceof Response && err.status >= 300 && err.status < 400)
      throw err;
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};
