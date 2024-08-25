import { ActionFunction, json } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMemo, useReducer } from "react";
import { jsonWithError } from "remix-toast";
import { DashboardBody } from "~/components/dashboard-body";
import { v3Config } from "~/config/base";
import { ModalProvider } from "~/contexts/modal.context";
import { InitialModalState, ModalReducer } from "~/reducers/modal.reducer";
import { DashBoardActionWrapper } from "~/shared-actions.server";

// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { CreatorUserType } from "~/types";

export const DashboardIndex: React.FC = () => {
  const { profile } = useOutletContext() as { profile: CreatorUserType };
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

export const action: ActionFunction = async (args) => {
  try {
    return await DashBoardActionWrapper("creator", args);
  } catch (err) {
    if (err instanceof AxiosError) {
      return jsonWithError(
        null,
        err.response?.data.message || "couldn't proceed with action!"
      );
    }
    return jsonWithError(
      null,
      (err as any).message || "couldn't proceed with action!"
    );
  }
};
