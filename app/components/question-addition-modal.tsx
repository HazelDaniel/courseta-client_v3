import "~/styles/question-addition-modal.css";
import "~/styles/question-item-addition-box.css";
import { QuestionItemAdditionBox } from "./question-item-addition-box";
import { DashboardFormInput } from "./dashboard-form-input";
import { DashboardCustomInputType } from "~/types";

export const AnswerAdditionFormData: DashboardCustomInputType = {
  heading: "",
  namespace: "add_answer",
  form: {
    intent: "add_answer",
    actions: ["/save"],
    variant: "one-uni-checkbox",
  },
  inputs: [
    {
      name: "answer_text",
      title: "answer text",
      type: "text",
    },
    {
      name: "is_correct",
      title: "is correct",
      type: "checkbox",
    },
  ],
  buttons: [],
  images: [],
};

export const QuestionAdditionModal: React.FC = () => {
  return (
    <div className="lesson_content_addition_modal">
      <div className="lesson_content_addition_modal_top">
        <h2>Add new question</h2>
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
        <QuestionItemAdditionBox />
        <h2>
          question answers{" "}
          <button>
            <svg>
              <use xlinkHref="#add"></use>
            </svg>
          </button>
        </h2>
        <ul className="content_addition_area">
          <DashboardFormInput
            data={AnswerAdditionFormData}
            key={AnswerAdditionFormData.namespace}
            defaultData={{}}
            asInput
          />

          <DashboardFormInput
            data={AnswerAdditionFormData}
            key={AnswerAdditionFormData.namespace}
            defaultData={{}}
            asInput
          />
        </ul>
      </div>
      <div className="lesson_content_addition_modal_bottom">
        <button> Cancel </button>
        <button>Continue</button>
      </div>
    </div>
  );
};
