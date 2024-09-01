import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import { AssessmentAdditionSection } from "~/components/assessment-addition-section";
import {
  ActionButtonType,
  ActionResponseType,
  ExamCreationActionIntentType,
  ExamCreationPayloadType,
  RedirectPayloadType,
} from "~/types";

import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { commitSession, getSession } from "~/cookie.server";
import axios, { AxiosResponse } from "axios";
import { ServerPayloadType } from "~/server.types";
import { v3Config } from "~/config/base";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const mutationRedirectLocation = session.get("X-Remix-Location");
  const mutationReplaceCondition = session.get("X-Remix-Replace");
  const shouldRedirectReplace =
    mutationReplaceCondition === true && !!mutationRedirectLocation?.length; // should also check if the redirect location is the current pathname
  const sessionResult = await commitSession(session);
  if (shouldRedirectReplace) {
    return json(
      {
        redirectPayload: {
          location: mutationRedirectLocation,
          replace: shouldRedirectReplace,
        },
      },
      {
        headers: {
          "Set-Cookie": sessionResult,
        },
      }
    );
  }
  return json(
    { redirectPayload: {} },
    {
      headers: {
        "Set-Cookie": sessionResult,
      },
    }
  );
};

export const ExamAdditionPage: React.FC = () => {
  const { redirectPayload }: { redirectPayload: RedirectPayloadType } =
    useLoaderData<typeof loader>() as { redirectPayload: RedirectPayloadType };
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectPayload.location && redirectPayload.replace) {
      navigate(redirectPayload.location, { replace: true });
    }
  }, [redirectPayload]);
  return <AssessmentAdditionSection variant="exam" />;
};

export default ExamAdditionPage;

export const action: ActionFunction = async ({ params, request }) => {
  try {
    const reqJson = (await request.json()) as ActionButtonType<object>;
    const session = await getSession(request.headers.get("Cookie"));
    const { creator_id: creatorID, course_id: courseID } = params;
    const cookieHeader = request.headers.get("Cookie");
    let requestURL: string;
    let actionRequest: AxiosResponse<ServerPayloadType<string>, any>;

    switch (reqJson.intent as ExamCreationActionIntentType) {
      case "ADD_EXAM": {
        let payloadJson: ExamCreationPayloadType = {
          ...(reqJson.payload as ExamCreationPayloadType),
        };
        payloadJson.parentEntityID = +(params["course_id"] as string);

        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/exams`;
        actionRequest = await axios.post(requestURL, payloadJson, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 201) break;
        session.flash(
          "X-Remix-Location",
          `/creators/${creatorID}/dashboard/assessments/${actionRequest.data.payload}/edit`
        );
        session.flash("X-Remix-Replace", true);
        // 
        // 

        return json(
          `/creators/${creatorID}/dashboard/assessments/${actionRequest.data.payload}/edit`,
          {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          }
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
    console.error(err);
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};
