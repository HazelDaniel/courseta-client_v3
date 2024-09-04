import styles from "~/styles/assessment.module.css";
import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { AssessmentBody } from "~/components/course-details";
import { StatusErrorElement } from "~/components/not-found";
import {
  AssessmentSubmissionActionType,
  AssessmentSubmissionPayloadType,
  CourseExamType2,
  LoaderResponseType,
  QuestionType,
} from "~/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ServerPayloadType } from "~/server.types";
import { v3Config } from "~/config/base";
import { redirectWithToast } from "remix-toast";
import { getLocalTimestamp } from "~/utils/conversion";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { exam_id: assessmentID } = params;
  const cookieHeader = request.headers.get("Cookie");
  try {
    const examPromise: Promise<
      AxiosResponse<ServerPayloadType<CourseExamType2 | null>, any>
    > = axios.get(`${v3Config.apiUrl}/exams/${assessmentID}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const questionsPromise: Promise<
      AxiosResponse<ServerPayloadType<QuestionType[]>, any>
    > = axios.get(`${v3Config.apiUrl}/assessments/${assessmentID}/questions`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const allPromises = await Promise.all([examPromise, questionsPromise]);
    const [examInfo, questionsInfo] = allPromises;
    if (examInfo.status !== 200) {
      if (examInfo.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching exam data.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }

    if (!examInfo.data.payload) {
      throw json({ error: "exam not found!" }, { status: 404 });
    }
    if (!examInfo.data.user) {
      throw redirect("/auth?type=sign_in");
    }
    examInfo.data.payload.ready =
      new Date(getLocalTimestamp()).getTime() >=
      new Date(getLocalTimestamp(examInfo.data.payload.startDate)).getTime();
    if (!examInfo.data.payload?.ready) {
      return redirectWithToast("/", {
        type: "info",
        description: "you will be notified when it's ready",
        message: "this exam hasn't started yet!",
      });
    }

    return {
      exam: examInfo.data.payload,
      questions: questionsInfo.data.payload,
      user: examInfo.data.user,
    };
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

export const ExamPage: React.FC = () => {
  return (
    <div
      className={`${styles.course_accessment_area} ${styles.course_assessment_area_styled}`}
    >
      <AssessmentBody variant="exam" />;
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
        return <h2>error fetching exam. {error.data.error}</h2>;
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default ExamPage;

export const action: ActionFunction = async ({ params, request }) => {
  let actionRequest: AxiosResponse<ServerPayloadType<void>, any> | null = null;
  try {
    const { exam_id: assessmentID } = params;
    const reqJson = (await request.json()) as AssessmentSubmissionActionType;
    const cookieHeader = request.headers.get("Cookie");
    let requestURL: string;
    switch (reqJson.intent) {
      case "SUBMIT": {
        requestURL = `${v3Config.apiUrl}/assessments/${assessmentID}/submit`;
        actionRequest = await axios.post(
          requestURL,
          {
            ...reqJson.payload,
            submissionTime: new Date().toISOString(),
          } as AssessmentSubmissionPayloadType,
          {
            headers: {
              Cookie: cookieHeader,
            },
          }
        );
        if (actionRequest?.status !== 200) break;
        return redirectWithToast(`/`, {
          message: "exam submission success!",
          type: "info",
          description:
            "you can now check your results in the 'assessment results' tab ",
        });
      }
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      return redirectWithToast(`/`, {
        message: `couldn't proceed with action. REASON: ${
          err.response?.data?.message || "unknown"
        }`,
        type: "error",
      });
    }
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
