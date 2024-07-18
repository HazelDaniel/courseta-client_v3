import { useOutletContext } from "@remix-run/react";
import { useMemo, useReducer } from "react";
import { DashboardBody } from "~/components/dashboard-body";
import { ModalProvider } from "~/contexts/modal.context";
import { InitialModalState, ModalReducer } from "~/reducers/modal.reducer";

// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { CreatorProfileType } from "~/types";

export const DashboardIndex: React.FC = () => {
  const { profile } = useOutletContext() as { profile: CreatorProfileType };
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
      <DashboardBody profile={profile} />;
    </ModalProvider>
  );
};

export default DashboardIndex;
