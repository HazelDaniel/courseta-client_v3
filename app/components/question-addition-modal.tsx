import "~/styles/question-addition-modal.css";
import "~/styles/question-item-addition-box.css";
import { QuestionItemAdditionBox } from "./question-item-addition-box";
import { DashboardFormInput } from "./dashboard-form-input";
import {
  DashboardCustomInputType,
  QuestionModalStateType,
  QuestionType,
  StateAnswerType,
} from "~/types";
import { useContext, useMemo, useState } from "react";
import { ModalContext, ModalContextValueType } from "~/contexts/modal.context";
import { __hideModal } from "~/reducers/modal.reducer";
import { Form } from "@remix-run/react";
import { useUpdateQuestionValue } from "~/hooks/use-update-question-value";
import {
  QuestionAdditionContextValueType,
  questionAdditionContext,
} from "~/contexts/question-addition.context";
import {
  __addAnswers,
  __addQuestion,
} from "~/reducers/question-addition.reducer";

export const AnswerAdditionFormData: DashboardCustomInputType<string> = {
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

export const AnswerAdditionInput: React.FC<{
  type: "text" | "checkbox";
  id: string;
  modalQuestion: QuestionModalStateType;
  setModalQuestion: React.Dispatch<
    React.SetStateAction<QuestionModalStateType>
  >;
  questionPosition: number;
}> = ({ type, modalQuestion, setModalQuestion, id, questionPosition }) => {
  const { dispatch } = useUpdateQuestionValue(
    modalQuestion,
    1000,
    setModalQuestion
  );
  const answerIndex = modalQuestion.answers.findIndex((ans) => ans.id === id);
  const answerEntry = modalQuestion.answers[answerIndex];

  const [inputPicked, setInputPicked] = useState<boolean>(
    answerEntry?.correct || false
  );
  const [inputText, setInputText] = useState<string>(answerEntry?.text || "");
  if (type === "text")
    return (
      <input
        type={type}
        id={`answer${id}`}
        name="add_answer.answer_text"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          if (e.target.value === answerEntry.text) return;
          const newState = { ...modalQuestion };
          newState.answers[answerIndex].text = e.target.value;
          newState.answers[answerIndex].questionPosition = questionPosition;
          dispatch(newState);
        }}
      />
    );
  return (
    <input
      type={type}
      id={`answer${id}_is_correct`}
      name="add_answer.is_correct"
      checked={inputPicked}
      onChange={() => {
        setInputPicked(!inputPicked);
        if (!inputPicked === modalQuestion.answers[answerIndex].correct) {
          return modalQuestion;
        }
        const newState = { ...modalQuestion };
        newState.answers[answerIndex].correct = !inputPicked;
        newState.answers[answerIndex].questionPosition = questionPosition;
        dispatch(newState);
      }}
    />
  );
};

export const AnswerAdditionForm: React.FC<{
  modalQuestion: QuestionModalStateType;
  setModalQuestion: React.Dispatch<
    React.SetStateAction<QuestionModalStateType>
  >;
  answerID: string;
  questionPosition: number;
}> = ({ modalQuestion, setModalQuestion, answerID, questionPosition }) => {
  return (
    <Form method="get" action="/save" className="input_form one-uni-checkbox">
      <div className="input_form_top"></div>
      <div className="input_form_bottom">
        <div className="input_wrapper answer_text">
          <label htmlFor={`answer${answerID}`}>answer text</label>
          <AnswerAdditionInput
            type="text"
            modalQuestion={modalQuestion}
            setModalQuestion={setModalQuestion}
            id={answerID}
            questionPosition={questionPosition}
          />
        </div>
        <div className="input_wrapper is_correct">
          <label htmlFor={`answer${answerID}_is_correct`}>is correct</label>
          <AnswerAdditionInput
            type="checkbox"
            modalQuestion={modalQuestion}
            setModalQuestion={setModalQuestion}
            id={answerID}
            questionPosition={questionPosition}
          />
        </div>
      </div>
    </Form>
  );
};

export const QuestionAdditionModal: React.FC = () => {
  const { modalState, modalDispatch } = useContext(
    ModalContext
  ) as ModalContextValueType;

  const { questionAdditionState, questionAdditionDispatch } = useContext(
    questionAdditionContext
  ) as QuestionAdditionContextValueType;
  const emptyQuestion = {
    question: {
      points: 0,
      position: new Date().getTime(),
    },
    answers: [],
  } as QuestionModalStateType;

  const [modalQuestion, setModalQuestion] =
    useState<QuestionModalStateType>(emptyQuestion);

  return (
    <div
      className={`question_addition_modal${
        modalState.questionAdditionModal ? "" : " hidden"
      }`}
    >
      <div className="question_addition_modal_top">
        <h2>Add new question</h2>
        <span
          onClick={() => modalDispatch(__hideModal("questionAdditionModal"))}
        >
          <svg
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26 2L2 26M2 2L26 26"
              stroke="var(--icon-fill-here)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div className="question_addition_modal_middle">
        <QuestionItemAdditionBox
          modalQuestion={modalQuestion}
          setModalQuestion={setModalQuestion}
        />
        <h2>
          question answers{" "}
          <button
            onClick={() => {
              setModalQuestion((prev) => {
                const newState = {
                  ...prev,
                  answers: [...prev.answers, { id: `${prev.answers.length}` }],
                };
                return newState;
              });
            }}
          >
            <svg>
              <use xlinkHref="#add"></use>
            </svg>
          </button>
        </h2>
        <ul className="content_addition_area">
          {modalQuestion.answers.map((answer) => {
            return (
              <AnswerAdditionForm
                key={answer.id}
                modalQuestion={modalQuestion}
                setModalQuestion={setModalQuestion}
                answerID={answer.id as string}
                questionPosition={modalQuestion.question.position}
              />
            );
          })}
        </ul>
      </div>
      <div className="question_addition_modal_bottom">
        <button
          onClick={() => {
            setModalQuestion({
              ...emptyQuestion,
              question: { points: 0, position: new Date().getTime() },
            });
            modalDispatch(__hideModal("questionAdditionModal"));
          }}
        >
          {" "}
          Cancel{" "}
        </button>
        <button
          onClick={() => {
            if (
              !modalQuestion.question.question ||
              modalQuestion.answers.filter((e) => !e.text).length
            )
              return;
            setModalQuestion({
              ...emptyQuestion,
              question: { points: 0, position: new Date().getTime() },
            });
            questionAdditionDispatch(__addQuestion(modalQuestion.question));
            questionAdditionDispatch(
              __addAnswers({ answers: modalQuestion.answers })
            );
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
