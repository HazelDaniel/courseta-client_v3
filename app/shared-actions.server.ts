import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import {
  ActionResponseType,
  DashboardAvatarUpdateFormStateType,
  DashboardEditActionIntentType,
  DashboardEmailUpdateFormStateType,
  DashboardNamesUpdateFormStateType,
  DashboardPassUpdateFormStateType,
  DashboardPasswordUpdateFormStateType,
} from "./types";
import { v3Config } from "./config/base";
import axios, { AxiosResponse } from "axios";
import {
  serializeAvatarUpdateFormInAction,
  serializeEmailUpdateFormInAction,
  serializeNamesUpdateFormInAction,
  serializePassUpdateFormInAction,
  serializePasswordUpdateFormInAction,
} from "./serializers/dashboard.serializer";
import { UserRoleType } from "./server.types";
import { jsonWithSuccess } from "remix-toast";

export const DashBoardActionWrapper: (
  role: UserRoleType,
  args: ActionFunctionArgs
) => any = (role, args) => {
  const action: ActionFunction = async ({ request, params }) => {
    try {
      const formData = await request.formData();
      const userID = params[`${role}_id`];
      const resData: { intent: DashboardEditActionIntentType } =
        Object.fromEntries(formData.entries()) as any;
      const cookieHeader = request.headers.get("Cookie");
      console.log("debug: cookie header is ", cookieHeader);

      let updateRequestURL: string = `${v3Config.apiUrl}/${role}s/${userID}/me`;
      let profileUpdateRequest: AxiosResponse<any, any>;

      switch (resData.intent) {
        case "UPDATE_NAMES": {
          const { payload } = serializeNamesUpdateFormInAction(
            resData as DashboardNamesUpdateFormStateType
          );
          profileUpdateRequest = await axios.put(updateRequestURL, payload, {
            headers: { Cookie: cookieHeader },
          });
          if (profileUpdateRequest.status !== 200) break;
          return jsonWithSuccess(null, "names updated successfully!");
        }
        case "UPDATE_AVATAR": {
          const { payload } = serializeAvatarUpdateFormInAction(
            resData as DashboardAvatarUpdateFormStateType
          );
          profileUpdateRequest = await axios.put(updateRequestURL, payload, {
            headers: { Cookie: cookieHeader },
          });
          if (profileUpdateRequest.status !== 200) break;
          return jsonWithSuccess(null, "image updated successfully!");
        }
        case "UPDATE_EMAIL": {
          const { payload } = serializeEmailUpdateFormInAction(
            resData as DashboardEmailUpdateFormStateType
          );
          profileUpdateRequest = await axios.put(updateRequestURL, payload, {
            headers: { Cookie: cookieHeader },
          });
          if (profileUpdateRequest.status !== 200) break;
          return jsonWithSuccess(null, "email updated successfully!");
        }
        case "REQUEST_NEW_PASS": {
          const { payload } = serializePassUpdateFormInAction(
            resData as DashboardPassUpdateFormStateType
          );
          profileUpdateRequest = await axios.put(updateRequestURL, payload, {
            headers: { Cookie: cookieHeader },
          });
          if (profileUpdateRequest.status !== 200) break;
          return jsonWithSuccess(null, "creator pass updated successfully!");
        }
        case "UPDATE_PASSWORD": {
          const { payload } = serializePasswordUpdateFormInAction(
            resData as DashboardPasswordUpdateFormStateType
          );
          profileUpdateRequest = await axios.put(updateRequestURL, payload, {
            headers: { Cookie: cookieHeader },
          });
          if (profileUpdateRequest.status !== 200) break;
          return jsonWithSuccess(null, "password updated successfully!");
        }
      }
      if (profileUpdateRequest.status !== 200) {
        if (profileUpdateRequest.status - 500 >= 0)
          throw json(
            { error: "something went wrong while updating user profile." },
            500
          );
        const actionResponse: ActionResponseType<null> = {
          data: null,
          error:
            profileUpdateRequest.data.message ||
            "failed to update names. please try again",
        };
        return json(actionResponse, { status: 400 });
      }
      return null;
    } catch (err) {
      throw err;
    }
  };
  return action(args);
};
