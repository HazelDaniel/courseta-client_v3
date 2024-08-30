import { ActionFunction, json, redirect } from "@remix-run/node";
import axios, { AxiosResponse } from "axios";
import { AssessmentAdditionSection } from "~/components/assessment-addition-section";
import { v3Config } from "~/config/base";
import { ServerPayloadType } from "~/server.types";
import {
  ActionButtonType,
  ActionResponseType,
  QuizCreationActionIntentType,
  QuizCreationPayloadType,
} from "~/types";

export const QuizAdditionPage: React.FC = () => {
  return <AssessmentAdditionSection variant="quiz" />;
};

export default QuizAdditionPage;

export const action: ActionFunction = async ({ params, request }) => {
  try {
    const reqJson = (await request.json()) as ActionButtonType<object>;
    const { creator_id: creatorID, course_id: courseID } = params;
    const cookieHeader = request.headers.get("Cookie");
    let requestURL: string;
    let actionRequest: AxiosResponse<ServerPayloadType<string>, any>;

    switch (reqJson.intent as QuizCreationActionIntentType) {
      case "ADD_QUIZ": {
        let payloadJson: QuizCreationPayloadType = {
          ...(reqJson.payload as QuizCreationPayloadType),
        };
        payloadJson.parentEntityID = +(params["lesson_id"] as string);

        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons/${payloadJson.parentEntityID}/quizzes`;
        actionRequest = await axios.post(requestURL, payloadJson, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 201) break;
        return redirect(
          `/creators/${creatorID}/dashboard/assessments/${actionRequest.data.payload}/edit`
        );
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
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};
