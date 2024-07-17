import { useContext } from "react";
import { ModalContext, ModalContextValueType } from "~/contexts/modal.context";
import { ModalActionType, __showModal } from "~/reducers/modal.reducer";
import "~/styles/image-replace-button.css";

export const ImageReplaceButton: React.FC<{
  text: string;
  willDisable: boolean;
}> = ({ text, willDisable }) => {

  const {modalDispatch: setModalVisible } =
    useContext(ModalContext) as ModalContextValueType;
  return (
    <button
      className="input_button_secondary"
      disabled={willDisable}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setModalVisible(__showModal("uploadModal"));
      }}
    >
      {text}
    </button>
  );
};
