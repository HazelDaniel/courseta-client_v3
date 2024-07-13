import { ChangeEvent } from "react";
import { handleFileSelect } from "~/utils/image-convert.client";
import "~/styles/file-upload-form-modal.css";

export const FileUploadFormModal: React.FC<{
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setImageState: React.Dispatch<React.SetStateAction<[string, string]>>;
  inputType: string;
  originalImage: string;
}> = ({
  modalVisible,
  setModalVisible,
  setImageState,
  inputType,
  originalImage,
}) => {
  return (
    <div className={`input_form_modal${modalVisible ? " visible" : ""}`}>
      <div className="input_form_modal_top">
        <h2>upload image</h2>
        <span onMouseDown={() => setModalVisible(false)}>
          <svg
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 2L2 26M2 2L26 26"
              stroke="var(--icon-fill-here)"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
      {/* has state */}
      <div className="input_form_modal_middle">
        <div className="modal_upload_area">
          <svg
            className="modal_upload_icon"
            viewBox="0 0 46 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M31.0079 26.9986L23.0086 18.9975M23.0086 18.9975L15.0094 26.9986M23.0086 18.9975V37M39.7871 31.7793C41.7376 30.7157 43.2784 29.0327 44.1664 26.9959C45.0544 24.9591 45.239 22.6845 44.691 20.5311C44.1431 18.3778 42.8938 16.4682 41.1403 15.1039C39.3868 13.7396 37.229 12.9982 35.0075 12.9967H32.4878C31.8824 10.6549 30.7542 8.48078 29.188 6.63784C27.6217 4.79491 25.6581 3.3311 23.4448 2.35648C21.2315 1.38187 18.8261 0.921792 16.4095 1.01085C13.9928 1.09991 11.6278 1.73579 9.49223 2.87067C7.35665 4.00556 5.50607 5.60992 4.07962 7.56314C2.65317 9.51637 1.68798 11.7676 1.2566 14.1477C0.825218 16.5277 0.938879 18.9746 1.58903 21.3044C2.23919 23.6342 3.40892 25.7862 5.01029 27.5987"
              stroke="var(--icon-fill-here)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div className="modal_input_parent">
            <input
              type={inputType}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                (async () => {
                  await handleFileSelect(e, setImageState);
                })();
              }}
            />
            <div>Drag image here or </div>
            <span>choose file</span>
          </div>
        </div>
        <div className="modal_info_area">
          <p>Supported formats: jpeg, png, webp</p>
          <p>
            Max size: <span>2MB</span>
          </p>
        </div>
      </div>
      <div className="input_form_modal_bottom">
        <button
          onClick={() => {
            setImageState(() => [originalImage, ""]);
            setModalVisible(false);
          }}
        >
          Cancel
        </button>
        <button onClick={() => setModalVisible(false)}>Continue</button>
      </div>
    </div>
  );
};
