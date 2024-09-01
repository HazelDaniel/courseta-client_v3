import { redirect, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "react-router";
import { creatorsData, studentsData } from "~/data/users";
import { Outlet } from "@remix-run/react";

import { CreatorProfileType, CreatorUserType } from "~/types";
import axios from "axios";
import { v3Config } from "~/config/base";
import { ServerPayloadType } from "~/server.types";
import { redirectWithError } from "remix-toast";

export const loader: LoaderFunction = async ({ params, request }) => {
  const creatorID = params["creator_id"];
  const cookieHeader = request.headers.get("Cookie");
  if (!creatorID) return redirectWithError("/auth?type=sign_in&role=creator", "you need to sign in first!");

  const profileRequest = await axios.get(
    `${v3Config.apiUrl}/creators/${creatorID}/me`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  if (profileRequest.status !== 200) {
      if (profileRequest.status - 500 >= 0)
        throw json({error: "something went wrong while fetching user profile."}, 500);
    return redirect("/auth?type=sign_up");
  }
  const profileData: ServerPayloadType<CreatorUserType> = profileRequest.data;
  return json({
    profile: profileData.payload,
  });
};

export const Dashboard: React.FC = () => {
  const { profile } = useLoaderData<typeof loader>() as {
    profile: CreatorProfileType;
  };

  return <Outlet context={{ profile: profile }} />;
};

export default Dashboard;
