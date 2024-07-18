import React from "react";
import { InitialModalState, ModalActionType } from "../reducers/modal.reducer";

export interface ModalContextValueType {
  modalState: typeof InitialModalState;
  modalDispatch: React.Dispatch<ModalActionType>;
}

export const ModalContext = React.createContext<ModalContextValueType | null>(null);
export const ModalProvider = ModalContext.Provider;