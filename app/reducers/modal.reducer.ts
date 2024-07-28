import {isEqual} from "~/utils/comparison";
const ModalActionTypes = {
  showModal: "SHOW_MODAL",
  closeModal: "CLOSE_MODAL",
  hideAll: "HIDE_ALL",
};

export type ModalTypes =
  | "uploadModal"
  | `accordionModal${string}`
  | "questionAdditionModal"
  | "lessonContentAdditionModal";

export const InitialModalState: { [prop: string]: boolean } = {};

export interface ModalActionType {
  type: keyof typeof ModalActionTypes;
  payload?: Partial<typeof InitialModalState>;
}

export const ModalReducer = (
  state = InitialModalState,
  action: ModalActionType
) => {
  let newState: typeof InitialModalState;

  switch (action.type) {
    case ModalActionTypes.showModal: {
      let i: string;
      let payloadValue: boolean;
      let payloadKey: ModalTypes;
      newState = { ...state };
      for (i of Object.keys(newState)) {
        newState[i as string] = false;
      }
      payloadValue = Object.values(
        action.payload as Partial<typeof InitialModalState>
      )[0]!;
      payloadKey = Object.keys(
        action.payload as Partial<typeof InitialModalState>
      )[0] as ModalTypes;
      if (payloadValue) {
        newState = { ...newState, [payloadKey]: true };
        if (isEqual(newState, state)) return state;
        return newState;
      } else return state;
    }
    case ModalActionTypes.closeModal: {
      let payloadValue: boolean;
      let payloadKey: ModalTypes;
      payloadValue = Object.values(
        action.payload as Partial<typeof InitialModalState>
      )[0]!;
      payloadKey = Object.keys(
        action.payload as Partial<typeof InitialModalState>
      )[0] as ModalTypes;
      newState = { ...state };
      if (payloadValue) {
        newState = { ...newState, [payloadKey]: false };
        if (isEqual(newState, state)) return state;
        return newState;
      } else {
        return state;
      }
    }
    case ModalActionTypes.hideAll: {
      let i: string;
      const newState = { ...state };
      for (i of Object.keys(newState)) {
        newState[i as keyof typeof InitialModalState] = false;
      }
      if (isEqual(newState, state)) return state;
      return newState;
    }
    default:
      return state;
  }
};

export const __showModal: (modalType: ModalTypes) => ModalActionType = (
  modalType
) => {
  return {
    type: ModalActionTypes.showModal as keyof typeof ModalActionTypes,
    payload: { [modalType]: true },
  };
};

export const __hideModal: (modalType: ModalTypes) => ModalActionType = (
  modalType
) => {
  return {
    type: ModalActionTypes.closeModal as keyof typeof ModalActionTypes,
    payload: { [modalType]: true },
  };
};

export const __hideAll: () => ModalActionType = () => {
  return {
    type: ModalActionTypes.hideAll as keyof typeof ModalActionTypes,
  };
};
