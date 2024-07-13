import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "react-router";
import { creatorsData, studentsData } from "~/data/users";
import { Outlet } from "@remix-run/react";

import { CreatorProfileType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const creatorID = params["creator_id"];
  return json({
    profile: creatorsData.filter((data) => data.user.id === creatorID)[0],
  });
};

export const Dashboard: React.FC = () => {
  const { profile } = useLoaderData<typeof loader>() as {
    profile: CreatorProfileType;
  };

  return <Outlet context={{profile: profile}} />;
};

export default Dashboard;
