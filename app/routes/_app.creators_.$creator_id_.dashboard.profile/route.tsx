import { redirect } from "@remix-run/react";
import { LoaderFunction } from "react-router";

export const loader: LoaderFunction = ({ params }) => {
  const creatorID = params["creator_id"];
  throw redirect(`/creators/${creatorID}/dashboard`, {
    status: 301,
  });
};

export const Profile: React.FC = () => {
  return null;
};

export default Profile;
