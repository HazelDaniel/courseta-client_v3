import "~/styles/image-replace-button.css";

export const ImageReplaceButton: React.FC<{
  text: string;
  willDisable: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ text, willDisable, setModalVisible }) => {
  return (
    <button
      className="input_button_secondary"
      disabled={willDisable}
      onClick={(e) => {
        e.preventDefault();
        setModalVisible(true);
      }}
    >
      {text}
    </button>
  );
};
