import { redirect } from "@remix-run/react";
import { LoaderFunction } from "react-router";

export const loader: LoaderFunction = ({ params }) => {
  const studentID = params["student_id"];
  throw redirect(`/students/${studentID}/dashboard`, {
    status: 301,
  });
};

export const Profile: React.FC = () => {
  return null;
};

export default Profile;
