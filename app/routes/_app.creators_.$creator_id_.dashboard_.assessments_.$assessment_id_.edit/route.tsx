import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useContext, useMemo, useReducer, useState } from "react";
import { QuestionAdditionModal } from "~/components/question-addition-modal";
import {
  ModalContext,
  ModalContextValueType,
  ModalProvider,
} from "~/contexts/modal.context";
import { questionData } from "~/data/accessment";
import {
  InitialModalState,
  ModalReducer,
  __showModal,
} from "~/reducers/modal.reducer";
import "~/styles/assessment-update.css";
import { QuestionType } from "~/types";

export const loader: LoaderFunction = () => {
  return json({ questions: questionData });
};
const AddQuestionButton: React.FC = () => {
  const { modalDispatch } = useContext(ModalContext) as ModalContextValueType;
  return (
    <button onClick={() => modalDispatch(__showModal("questionAdditionModal"))}>
      <span>
        <svg>
          <use xlinkHref="#add"></use>
        </svg>
      </span>
      Add Question
    </button>
  );
};

const AnswerStatusIcon: React.FC<{ correct?: boolean }> = ({ correct }) => {
  if (!correct)
    return (
      <svg>
        <use xlinkHref="#cancel"></use>
      </svg>
    );
  return (
    <svg>
      <use xlinkHref="#check"></use>
    </svg>
  );
};

export const QuestionUpdateEntry: React.FC<{ question: QuestionType }> = ({
  question,
}) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  return (
    <li className={`assessment_table_entry${isOpened ? " current" : ""}`}>
      <div className="entry_main">
        <div className="entry_left">
          <p className="date_text">{question.question}</p>
          <p className="points_text">{question.points}</p>
        </div>
        <div className="entry_right">
          <span>
            <svg>
              <use xlinkHref="#trash"></use>
            </svg>
          </span>

          <span onClick={() => setOpened((prev) => !prev)}>
            <svg>
              <use xlinkHref="#caret-up"></use>
            </svg>
          </span>
        </div>
      </div>
      <div className="entry_detail">
        <p>Answers</p>
        {question.options.map((option) => {
          return (
            <div className="answer_detail">
              <span>
                <AnswerStatusIcon correct={option.correct} key={option.id}/>
              </span>
              {option.text}
            </div>
          );
        })}
      </div>
    </li>
  );
};

export const AssessmentEditTable: React.FC = React.memo(() => {
  const loadedResult = useLoaderData<typeof loader>() as {
    questions: QuestionType[];
  };
  return (
    <ul className="assessment_table_body">
      {loadedResult.questions.map((question) => {
      return <QuestionUpdateEntry question={question} key={question.id} />
      })}
    </ul>
  );
});

export const AssessmentEditArea: React.FC = React.memo(() => {
  return (
    <div className="edit_area">
      <div className="assessment_edit_cta_area">
        <button>cancel</button>
        <button className="primary">save changes</button>
      </div>
      <div className="assessment_table_head">
        <div className="table_head_left">
          <h3>question</h3>
          <h3>points</h3>
        </div>
        <div className="table_head_right">
          <AddQuestionButton />
        </div>
      </div>

      <AssessmentEditTable />
      <QuestionAdditionModal />

      <div className="assessment_table_navigation">
        <button>
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
          previous
        </button>

        <button className="flipped">
          next
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
        </button>
      </div>
    </div>
  );
});

export const AssessmentEditPage: React.FC = () => {
  const [modalState, modalDispatch] = useReducer(
    ModalReducer,
    InitialModalState
  );

  const modalContextValue = useMemo(
    () => ({ modalState, modalDispatch }),
    [modalState, modalDispatch]
  );

  return (
    <ModalProvider value={modalContextValue}>
      <div className="assessment_edit_body">
        <h2 className="section_header">Assessment questions</h2>
        <AssessmentEditArea />
      </div>
    </ModalProvider>
  );
};

export default AssessmentEditPage;
