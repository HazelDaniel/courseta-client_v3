import { useLoaderData } from "@remix-run/react";
import { useMemo, useReducer } from "react";
import { LoaderFunction, json } from "react-router";
import { DashboardBody } from "~/components/dashboard-body";
import { ModalProvider } from "~/contexts/modal.context";
import { studentsData } from "~/data/users";
import { InitialModalState, ModalReducer } from "~/reducers/modal.reducer";
// import profileStyles from "~/styles/profile.module.css";

// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { StudentProfileType } from "~/types";

export const loader: LoaderFunction = ({ params }) => {
  const studentID = params["student_id"];
  return json({
    profile: studentsData.filter((data) => data.user.id === studentID)[0],
  });
};

export const Dashboard: React.FC = () => {
  const { profile } = useLoaderData<typeof loader>() as {
    profile: StudentProfileType;
  };
  const [modalState, modalDispatch] = useReducer(
    ModalReducer,
    InitialModalState
  );

  const modalContextValue = useMemo(
    () => ({ modalState, modalDispatch }),
    [modalState, modalDispatch]
  );

  return (
    <ModalProvider value={modalContextValue}>
      <DashboardBody profile={profile} />
    </ModalProvider>
  );
};

export default Dashboard;
