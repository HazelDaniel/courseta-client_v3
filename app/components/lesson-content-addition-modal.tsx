import "~/styles/lesson-content-addition-modal.css";
import { LessonItemAdditionBox } from "./lesson-item-addition-box";
import React, { useContext } from "react";
import { ModalContext, ModalContextValueType } from "~/contexts/modal.context";
import { __hideModal } from "~/reducers/modal.reducer";

export const LessonContentAdditionModal: React.FC = React.memo(() => {
  const { modalState, modalDispatch } = useContext(
    ModalContext
  ) as ModalContextValueType;
  return (
    <div
      className={`lesson_content_addition_modal${
        modalState.lessonContentAdditionModal ? " visible" : ""
      }`}
    >
      <div className="lesson_content_addition_modal_top">
        <h2>add lesson content</h2>
        <span
          onClick={() => {
            modalDispatch(__hideModal("lessonContentAdditionModal"));
          }}
        >
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

      <div className="lesson_content_addition_modal_middle">
        <ul className="content_addition_area">
          <LessonItemAdditionBox lessonPositionID={0} itemType="content" />
        </ul>
      </div>
      <div className="lesson_content_addition_modal_bottom">
        <button> Cancel </button>
        <button>Continue</button>
      </div>
    </div>
  );
});
