import { useOutletContext } from "@remix-run/react";
import { DashboardBody } from "~/components/dashboard-body";

// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { CreatorProfileType } from "~/types";

export const DashboardIndex: React.FC = () => {
  const { profile } = useOutletContext() as { profile: CreatorProfileType };
  console.log("hit here");

  return <DashboardBody profile={profile} />;
};

export default DashboardIndex;
