import { redirect, useLoaderData, useSearchParams } from "@remix-run/react";
import { LoaderFunction, json } from "react-router";
import { DashboardBody } from "~/components/dashboard-body";
import { creatorsData, studentsData } from "~/data/users";
// import profileStyles from "~/styles/profile.module.css";

// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { StudentProfileType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const splat = params["*"];
  const creatorID = params["creator_id"];
  if (splat !== "profile") {
    if (splat === "") {
      throw redirect(`/creators/${creatorID}/dashboard/profile`, {
        status: 307,
      });
    }
    throw json({ error: "not found!" }, { status: 404 });
  }
  return json({
    profile: creatorsData.filter((data) => data.user.id === creatorID)[0],
  });
};

export const Dashboard: React.FC = () => {
  const { profile } = useLoaderData<typeof loader>() as {
    profile: StudentProfileType;
  };

  return <DashboardBody profile={profile} />;
};

export default Dashboard;
