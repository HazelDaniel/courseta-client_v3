const ModalActionTypes = {
  showModal: "SHOW_MODAL",
  closeModal: "CLOSE_MODAL",
  hideAll: "HIDE_ALL",
};

export type ModalTypes =
  | "uploadModal"
  | "accordionModal"
  | "questionAdditionModal"
  | "lessonContentAdditionModal";

export const InitialModalState = {
  uploadModal: false,
  accordionModal: false,
  questionAdditionModal: false,
  lessonContentAdditionModal: false
};

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
      newState = { ...state };
      for (i of Object.keys(newState)) {
        newState[i as keyof typeof InitialModalState] = false;
      }
      if (action.payload?.accordionModal)
        newState = { ...newState, accordionModal: true };
      else if (action.payload?.uploadModal)
        newState = { ...newState, uploadModal: true };
      else if (action.payload?.questionAdditionModal)
        newState = { ...newState, questionAdditionModal: true };
      else if (action.payload?.lessonContentAdditionModal)
        newState = { ...newState, lessonContentAdditionModal: true };
      else return state;
      return newState;
    }
    case ModalActionTypes.closeModal: {
      if (action.payload?.accordionModal) {
        newState = { ...state, accordionModal: false };
        return newState;
      } else if (action.payload?.uploadModal) {
        newState = { ...state, uploadModal: false };
        return newState;
      } else if (action.payload?.questionAdditionModal) {
        newState = { ...state, questionAdditionModal: false };
        return newState;
      } else if (action.payload?.lessonContentAdditionModal) {
        newState = { ...state, lessonContentAdditionModal: false };
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
    payload: {[modalType]: true}
  };
};

export const __hideModal: (modalType: ModalTypes) => ModalActionType = (
  modalType
) => {
  return {
    type: ModalActionTypes.closeModal as keyof typeof ModalActionTypes,
    payload: {[modalType]: true}
  };
};

export const __hideAll: () => ModalActionType = () => {
  return {
    type: ModalActionTypes.hideAll as keyof typeof ModalActionTypes,
  };
};
