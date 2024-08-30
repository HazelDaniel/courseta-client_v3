import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { AssessmentBody } from "~/components/course-details";
import { NotFound } from "~/components/not-found";
import { v3Config } from "~/config/base";
import {
  CourseDetailViewType,
  ServerPayloadType,
  SessionUserType,
} from "~/server.types";
import {
  ActionResponseType,
  AssessmentSubmissionActionType,
  AssessmentSubmissionPayloadType,
  CourseLessonType,
  CourseLessonType2,
  LessonQuizType,
  LoaderResponseType,
  QuestionType,
} from "~/types";

export const loader: LoaderFunction = async ({ request, params }) => {
  const cookieHeader = request.headers.get("Cookie");
  const { assessment_id: assessmentID } = params;
  try {
    const quizPromise: Promise<
      AxiosResponse<ServerPayloadType<LessonQuizType | null>, any>
    > = axios.get(`${v3Config.apiUrl}/quizzes/${assessmentID}`, {
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

    const allPromises = await Promise.all([quizPromise, questionsPromise]);
    const [quizInfo, questionsInfo] = allPromises;
    if (quizInfo.status !== 200) {
      if (quizInfo.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching quiz data.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }

    if (!quizInfo.data.payload) {
      throw json({ error: "quiz not found!" }, { status: 404 });
    }
    if (!quizInfo.data.user) {
      throw redirect("/auth?type=sign_in");
    }

    return {
      quiz: quizInfo.data.payload,
      questions: questionsInfo.data.payload,
      user: quizInfo.data.user,
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

export const QuizPage: React.FC = () => {
  const res = useRouteLoaderData(
    "routes/courses_.$course_id_.lessons.$lesson_id.assessments"
  ) as { lesson: CourseLessonType; contentID: string };

  return <AssessmentBody variant="quiz" />;
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      default:
        return <h2>error fetching quiz. {error.data.error}</h2>;
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default QuizPage;

export const action: ActionFunction = async ({ params, request }) => {
  try {
    const { assessment_id: assessmentID } = params;
    const reqJson = (await request.json()) as AssessmentSubmissionActionType;
    const cookieHeader = request.headers.get("Cookie");
    let actionRequest: AxiosResponse<ServerPayloadType<void>, any>;
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
              // "Cache-Control": "no-store"
            },
          }
        );
        if (actionRequest.status !== 200) break;
        return json({
          data: { message: "submission successful!" },
          error: null,
        } as ActionResponseType<{ message: string }>);
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
