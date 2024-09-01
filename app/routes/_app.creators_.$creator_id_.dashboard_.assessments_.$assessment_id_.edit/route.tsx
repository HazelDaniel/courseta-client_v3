import {
  ActionFunction,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { ContextButtonHOC } from "~/components/context-button";
import { QuestionAdditionModal } from "~/components/question-addition-modal";
import { v3Config } from "~/config/base";
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
import {
  InitialModalState,
  ModalReducer,
  __showModal,
} from "~/reducers/modal.reducer";
import {
  QuestionAdditionReducer,
  QuestionAdditionStateType,
  __clearDraft,
  __reset,
  __trashQuestion,
} from "~/reducers/question-addition.reducer";
import { serializeAnswersForAction } from "~/serializers/answer.serializer";
import {
  serializeQuestionsForAction,
  serializeTrashQuestionsForAction,
} from "~/serializers/question.serializer";
import { ServerPayloadType } from "~/server.types";
import "~/styles/assessment-update.css";
import {
  ActionButtonType,
  ActionResponseType,
  AssessmentEditActionIntentType,
  AssessmentEditActionType,
  AssessmentEditPayloadType,
  CourseExamType,
  CourseLessonType,
  CreatorAssessmentEditViewType,
  GenericAssessmentType,
  LoaderResponseType,
  QuestionType,
  StateAnswerType,
  StateQuestionType,
} from "~/types";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { assessment_id: assessmentID, creator_id: creatorID } = params;
  const cookieHeader = request.headers.get("Cookie");
  try {
    if (!assessmentID || !creatorID)
      throw json({ error: "no IDs in the request url" }, { status: 400 });
    const requestQuestions: AxiosResponse<
      ServerPayloadType<CreatorAssessmentEditViewType>,
      any
    > = await axios.get(
      `${v3Config.apiUrl}/creators/${creatorID}/assessments/${assessmentID}/edit`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    if (requestQuestions.status !== 200) {
      if (requestQuestions.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching assessment data.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }
    return json({
      assessment: {
        id: assessmentID,
        questions: requestQuestions.data.payload?.questions || [],
        assessmentType: requestQuestions.data.payload?.assessmentType,
        parentID: requestQuestions.data.payload?.parentID,
      } as CreatorAssessmentEditViewType,
    });
  } catch (err) {
    if (err instanceof Response) {
      console.error(err);
      throw err;
    }
    console.error((err as Error).message);
    throw json(
      { error: (err as Error)?.message || "An unexpected error occurred" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
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
  const { questionAdditionState, questionAdditionDispatch } = useContext(
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
            onClick={() => {
              questionAdditionDispatch(__trashQuestion({ id: question.id }));
            }}
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
    assessment: CreatorAssessmentEditViewType;
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
      {loadedResult.assessment.questions
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
      {questionAdditionState.draftQuestions.map((question) => {
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


const AssessmentEditButton: React.FC = () => {
  const { questionAdditionState } = useContext(
    questionAdditionContext
  ) as QuestionAdditionContextValueType;
  const submit = useSubmit();
  let loadedResult: { assessment: CreatorAssessmentEditViewType } =
    useLoaderData<typeof loader>();
  const { assessment } = loadedResult;
  const { assessment_id: assessmentID } = useParams();

  const MutationButtonContent = ContextButtonHOC(() => <> save changes </>)({
    classes: ["primary"],
    onClick: () => {
      const questionDataList = serializeQuestionsForAction(
        questionAdditionState.draftQuestions,
        assessmentID as string,
        assessment.assessmentType || "quiz"
      );
      const answerDataList = serializeAnswersForAction(
        questionAdditionState.answers
      );
      const trashQuestionIDList = serializeTrashQuestionsForAction(
        questionAdditionState.trashedQuestions
      );
      const payload = {
        answerDataList,
        questionDataList,
        trashQuestionIDList,
        parentEntityID: assessment.parentID,
      } as AssessmentEditPayloadType;

      const submitPayload: AssessmentEditActionType = {
        intent:
          assessment.assessmentType === "exam" ? "UPDATE_EXAM" : "UPDATE_QUIZ",
        payload,
      };

      submit(submitPayload as any, {
        method: "post",
        action: "./",
        encType: "application/json",
        navigate: false,
        fetcherKey: "assessment-update",
      });
    },
  });
  return MutationButtonContent;
};

export const AssessmentEditCtaArea: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { creator_id: creatorID } = useParams();

  return (
    <div className="assessment_edit_cta_area">
      <button
        onClick={() => {
          navigate(`/creators/${creatorID}/dashboard/courses`, {
            replace: true,
          });
        }}
      >
        cancel
      </button>
      <AssessmentEditButton />
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

export const AssessmentEditArea: React.FC = () => {
  const loadedResult = useLoaderData<typeof loader>() as {
    assessment: CreatorAssessmentEditViewType;
  };
  

  const transformedQuestions: StateQuestionType[] = useMemo(
    () =>
      loadedResult.assessment.questions.map((el, idx) => {
        const { id, points, question } = el;
        return {
          position: +id,
          question,
          points,
          id,
          loaded: true,
        } as StateQuestionType;
      }),
    [loadedResult]
  );

  const transformedAnswers: StateAnswerType[] = useMemo(
    () =>
      loadedResult.assessment.questions.reduce((acc, curr) => {
        const answerArr = curr.options.map((el) => {
          const { correct, id, text } = el;
          return {
            correct,
            id,
            text,
            questionPosition: +curr.id,
            loaded: true,
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
      draftQuestions: [],
    } as QuestionAdditionStateType
  );

  const questionAdditionContextValue = useMemo(
    () => ({
      questionAdditionState: questionState,
      questionAdditionDispatch: questionDispatch,
    }),
    [questionState, questionDispatch]
  );

  useEffect(() => {
    questionDispatch(
      __reset({
        answers: transformedAnswers,
        questions: transformedQuestions,
        trashedQuestions: [],
        draftQuestions: [],
      } as QuestionAdditionStateType)
    );
  }, [loadedResult, transformedAnswers, transformedQuestions]);

  // BUGFIX: there's a mismatch here. fix it
  // 
  // 
  // 

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
};

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

export const action: ActionFunction = async ({ params, request }) => {
  const reqJson = (await request.json()) as ActionButtonType<object>;
  const { creator_id: creatorID, assessment_id: assessmentID } = params;
  const cookieHeader = request.headers.get("Cookie");
  let requestURL: string;
  let actionRequest: AxiosResponse<ServerPayloadType<any>, any>;
  try {
    switch (reqJson.intent as AssessmentEditActionIntentType) {
      case "UPDATE_EXAM":
      case "UPDATE_QUIZ": {
        let payloadJson: AssessmentEditPayloadType =
          reqJson.payload as AssessmentEditPayloadType;
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/assessments/${assessmentID}/`;
        actionRequest = await axios.put(requestURL, payloadJson, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 201) break;
        return jsonWithSuccess(
          null,
          actionRequest.data.message || "assessment updated successfully!"
        );
      }
    }
    if (actionRequest.status - 500 >= 0)
      throw json({ error: "something went wrong" }, 500);
    else
      return json({
        data: null,
        error: `couldn't proceed with action. REASON: ${actionRequest.data.message}`,
      } as ActionResponseType<null>);
  } catch (err) {
    if (err instanceof AxiosError)
      return jsonWithError(
        null,
        "could not proceed with action! REASON: " +
          (`${err.response?.data.message}` || "unknown")
      );
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};
