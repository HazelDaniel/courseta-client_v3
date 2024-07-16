import "~/styles/lesson-content-addition-modal.css";
import { LessonItemAdditionBox } from "./lesson-item-addition-box";

export const LessonContentAdditionModal: React.FC = () => {
  return (
    <div className="lesson_content_addition_modal">
      <div className="lesson_content_addition_modal_top">
        <h2>add lesson contents</h2>
        <span>
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
};