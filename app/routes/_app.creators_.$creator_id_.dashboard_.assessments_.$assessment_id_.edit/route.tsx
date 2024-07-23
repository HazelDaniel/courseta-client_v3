import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useContext, useMemo, useReducer, useState } from "react";
import { QuestionAdditionModal } from "~/components/question-addition-modal";
import {
  ModalContext,
  ModalContextValueType,
  ModalProvider,
} from "~/contexts/modal.context";
import {
  QuestionAdditionContextValueType,
  QuestionAdditionProvider,
  questionAdditionContext,
} from "~/contexts/question-addition.context";
import { questionData } from "~/data/accessment";
import {
  InitialModalState,
  ModalReducer,
  __showModal,
} from "~/reducers/modal.reducer";
import {
  InitialQuestionAdditionState,
  QuestionAdditionReducer,
  QuestionAdditionStateType,
  __trashQuestion,
} from "~/reducers/question-addition.reducer";
import "~/styles/assessment-update.css";
import { QuestionType, StateAnswerType, StateQuestionType } from "~/types";

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

export const QuestionUpdateEntry: React.FC<{
  question: QuestionType | Partial<StateQuestionType>;
  variant: "draft" | "full";
}> = ({ question, variant }) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const { questionAdditionDispatch } = useContext(
    questionAdditionContext
  ) as QuestionAdditionContextValueType;
  return (
    <li className={`assessment_table_entry${isOpened ? " current" : ""}`}>
      <div className="entry_main">
        <div className="entry_left">
          <p className="date_text">{question.question}</p>
          <p className="points_text">{question.points}</p>
        </div>
        <div className="entry_right">
          <span
            onClick={() =>
              questionAdditionDispatch(__trashQuestion({ id: question.id }))
            }
          >
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
        {variant === "full"
          ? (question as QuestionType).options.map((option) => {
              return (
                <div className="answer_detail" key={option.id}>
                  <span>
                    <AnswerStatusIcon
                      correct={option.correct}
                      key={option.id}
                    />
                  </span>
                  {option.text}
                </div>
              );
            })
          : null}
      </div>
    </li>
  );
};

export const AssessmentEditTable: React.FC = React.memo(() => {
  const loadedResult = useLoaderData<typeof loader>() as {
    questions: QuestionType[];
  };
  const { questionAdditionState } = useContext(
    questionAdditionContext
  ) as QuestionAdditionContextValueType;

  const trashed = useMemo(
    () => new Set(questionAdditionState.trashedQuestions.map((el) => el.id)),
    [questionAdditionState]
  );

  return (
    <ul className="assessment_table_body">
      {loadedResult.questions
        .filter((question) => !trashed.has(question.id))
        .map((question) => {
          return (
            <QuestionUpdateEntry
              question={question}
              key={question.id}
              variant="full"
            />
          );
        })}
    </ul>
  );
});

export const AssessmentDraftEditTable: React.FC = React.memo(() => {
  const { questionAdditionState } = useContext(
    questionAdditionContext
  ) as QuestionAdditionContextValueType;

  return (
    <ul className="assessment_table_body">
      {questionAdditionState.questions
        .filter((e) => !e.loaded)
        .map((question) => {
          return (
            <QuestionUpdateEntry
              question={question}
              key={"draft" + question.id}
              variant={"draft"}
            />
          );
        })}
    </ul>
  );
});

export const AssessmentTableHead: React.FC = React.memo(() => {
  return (
    <div className="assessment_table_head">
      <div className="table_head_left">
        <h3>question</h3>
        <h3>points</h3>
      </div>
      <div className="table_head_right">
        <AddQuestionButton />
      </div>
    </div>
  );
});

export const AssessmentEditCtaArea: React.FC = React.memo(() => {
  return (
    <div className="assessment_edit_cta_area">
      <button>cancel</button>
      <button className="primary">save changes</button>
    </div>
  );
});

export const AssessmentTableNavigation: React.FC = React.memo(() => {
  return (
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
  );
});

export const AssessmentEditArea: React.FC = React.memo(() => {
  const loadedResult = useLoaderData<typeof loader>() as {
    questions: QuestionType[];
  };
  const transformedQuestions: StateQuestionType[] = useMemo(
    () =>
      loadedResult.questions.map((el, idx) => {
        const { id, points, question } = el;
        return {
          position: idx,
          question,
          points,
          id: id,
          loaded: true,
        } as StateQuestionType;
      }),
    [loadedResult]
  );

  const transformedAnswers: StateAnswerType[] = useMemo(
    () =>
      loadedResult.questions.reduce((acc, curr) => {
        const answerArr = curr.options.map((el) => {
          const { correct, id, text } = el;
          return {
            correct,
            id,
            text,
            questionPosition: +curr.id,
          } as StateAnswerType;
        });
        let resAcc = [...acc, ...(answerArr as StateAnswerType[])];
        return resAcc;
      }, [] as StateAnswerType[]),
    [loadedResult]
  );

  const [questionState, questionDispatch] = useReducer(
    QuestionAdditionReducer,
    {
      answers: transformedAnswers,
      questions: transformedQuestions,
      trashedQuestions: [],
    } as QuestionAdditionStateType
  );
  const questionAdditionContextValue = useMemo(
    () => ({
      questionAdditionState: questionState,
      questionAdditionDispatch: questionDispatch,
    }),
    [questionState, questionDispatch]
  );


  return (
    <div className="edit_area">
      <QuestionAdditionProvider value={questionAdditionContextValue}>
        <AssessmentEditCtaArea />
        <AssessmentTableHead />
        <AssessmentEditTable />
        <QuestionAdditionModal />
        <h2 className="section_header">Assessment draft questions</h2>
        <AssessmentDraftEditTable />
      </QuestionAdditionProvider>

      <AssessmentTableNavigation />
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
