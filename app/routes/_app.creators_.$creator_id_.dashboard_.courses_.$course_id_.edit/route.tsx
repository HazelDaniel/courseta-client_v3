import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  Await,
  Form,
  Link,
  ShouldRevalidateFunction,
  defer,
  isRouteErrorResponse,
  json,
  useAsyncError,
  useAsyncValue,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useRouteError,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import React, {
  ChangeEvent,
  Suspense,
  lazy,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { CourseContentIcon } from "~/components/course-accordion";
import { DashboardFormInput } from "~/components/dashboard-form-input";
import { LessonItemAdditionBox } from "~/components/lesson-item-addition-box";
import { courseDataDetailed } from "~/data/course-list";
import "~/styles/course-creation-page.css";
import "~/styles/course-edit.css";

import {
  ActionButtonType,
  ActionResponseType,
  CourseDetailType,
  CourseEditActionIntentType,
  CourseEditPayloadType,
  CourseEditStateType,
  CourseEntryType,
  CourseExamType2,
  CourseInfoEditActionType,
  CourseItemDeletionActionType,
  CourseLessonType,
  CourseLessonType2,
  CreatorProfileType,
  DashboardCustomInputType,
  DefaultCourseFormDataType,
  DefaultDashboardFormDataType,
  DefaultFormDataType,
  LessonAdditionActionType,
  LessonAdditionPayloadType,
  LessonContentAdditionPayloadType,
  LessonContentCreationPayloadType,
  LoaderResponseType,
} from "~/types";
import {
  InitialModalState,
  ModalReducer,
  __hideModal,
  __showModal,
} from "~/reducers/modal.reducer";
import {
  ModalContext,
  ModalContextValueType,
  ModalProvider,
} from "~/contexts/modal.context";
import {
  InitialLessonUpdateState,
  LessonUpdateReducer,
  __addContent,
  __addQuiz,
  __reset,
  __updatePosition,
} from "~/reducers/lesson-update.reducer";
import {
  LessonUpdateContext,
  LessonUpdateContextValueType,
  LessonUpdateProvider,
} from "~/contexts/lesson-update.context";
import {
  InitialLessonCreationState,
  LessonCreationReducer,
  __addLesson,
  __updateTitle,
  __reset as __creationReset,
} from "~/reducers/lesson-creation.reducer";
import {
  LessonCreationContext,
  LessonCreationContextValueType,
  LessonCreationProvider,
} from "~/contexts/lesson-creation.context";
import { useDebounce } from "~/hooks/use-debounce";
import { NotFound } from "~/components/not-found";
import { FAKE_REQUEST_DELAY, v3Config } from "~/config/base";
import { NoContent } from "~/components/no-content";
import { serializeCourseEditState } from "~/serializers/course.serializer";
import { serializeLessonStateForAction } from "~/serializers/lesson.serializer";
import { serializeLessonContentForAction } from "~/serializers/lesson-content.serializer";
import { serializeLessonQuizForAction } from "~/serializers/quiz.serializer";
import { CreatorCourseEditViewType, ServerPayloadType } from "~/server.types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

export const courseTitleUpdateFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "update_title",
  form: {
    intent: "update_title",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [{ name: "title", title: "course title", type: "text" }],
  buttons: [],
  images: [],
};

export const courseDescriptionUpdateFormData: DashboardCustomInputType<string> =
  {
    heading: "",
    namespace: "update_description",
    form: {
      intent: "update_description",
      actions: ["/save"],
      variant: "none",
    },
    inputs: [{ name: "description", title: "description", type: "textarea" }],
    buttons: [],
    images: [],
  };

export const courseImageUpdateFormData: DashboardCustomInputType<string> = {
  heading: "update_image",
  namespace: "update_image",
  form: {
    intent: "update_image",
    actions: ["/save"],
    variant: "one-graphic-button",
  },
  inputs: [{ name: "avatar_url", title: "", type: "file" }],
  buttons: [{ text: "" }, { text: "replace image" }],
  images: [{ url: "", ref: {} }],
};

export const courseTagsUpdateFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "update_tags",
  form: {
    intent: "update_tags",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    { name: "tags", title: "course tags (space separated)", type: "text" },
  ],
  buttons: [],
  images: [],
};

export const courseLessonTitleCreateForm: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_lesson_title",
  form: {
    intent: "add_lesson_title",
    actions: ["/save"],
    variant: "one-dual-button",
  },
  inputs: [
    {
      name: "lesson_title",
      title: "Lesson Title",
      type: "text",
    },
  ],
  buttons: [],
  images: [],
};



export const loader: LoaderFunction = async ({ params, request }) => {
  const { creator_id: creatorID, course_id: courseID } = params;
  const cookieHeader = request.headers.get("Cookie");

  try {
    if (!courseID || !creatorID)
      throw json({ error: "no IDs in the request url" }, { status: 400 });
    const coursePromise: Promise<
      AxiosResponse<ServerPayloadType<CreatorCourseEditViewType>, any>
    > = axios.get(
      `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/edit`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    const examPromise: Promise<
      AxiosResponse<
        ServerPayloadType<Omit<CourseExamType2, "description">>,
        any
      >
    > = axios.get(
      `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/exam/edit`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    const lessonsPromise: Promise<
      AxiosResponse<ServerPayloadType<CourseLessonType2[]>, any>
    > = axios.get(
      `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    const allPromises = await Promise.all([
      coursePromise,
      lessonsPromise,
      examPromise,
    ]);
    let [course, lessons, exam] = allPromises;
    const resExam: Omit<CourseExamType2, "description"> | null | undefined =
      exam.status !== 200 ? null : exam.data.payload;

    if (course.status !== 200) {
      if (course.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching course data.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }
    if (!course.data.user || !lessons.data.user)
      throw redirect("/auth?type=sign_in");

    if (course.data.payload === null) {
      throw json(
        { error: "Course not found!" },
        { status: 404, statusText: "Not Found" }
      );
    }
    return json({
      course: course.data.payload,
      lessons: lessons.data.payload,
      exam: resExam,
    });
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    throw json(
      { error: (err as Error)?.message || "An unexpected error occurred" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

const LessonContentAdditionModal = lazy(
  () => import("~/components/lesson-content-addition-modal")
);

export const AccordionPromptbox: React.FC<{ position: number }> = React.memo(
  ({ position }) => {
    const { lessons } = useLoaderData<typeof loader>() as {
      lessons: CourseLessonType2[];
    };
    const { modalState, modalDispatch } = useContext(
      ModalContext
    ) as ModalContextValueType;
    const checkLessonQuizPresent = useCallback(() => {
      console.log("are the lessons being calculated again?");
      const resultLesson = lessons.find((el) => el.id === position);
      if (!resultLesson) return true;
      return !!resultLesson.quiz;
    }, []);
    const navigate = useNavigate();
    return (
      <div
        className={`item_addition_prompt_box${
          !modalState[`accordionModal${position}`] ? ` hidden` : ""
        }`}
      >
        <div className="prompt_box_top">
          <span
            onClick={(e) => {
              e.stopPropagation();
              modalDispatch(__hideModal(`accordionModal${position}`));
            }}
          >
            <svg>
              <use xlinkHref="#cancel"></use>
            </svg>
          </span>
        </div>

        <p>Choose an item to add</p>
        <div className="prompt_box_ctas">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`#lessonID.${position}`);
              modalDispatch(__showModal("lessonContentAdditionModal"));
            }}
          >
            Content
          </button>
          <button
            disabled={checkLessonQuizPresent()}
            onClick={() =>{
              if (checkLessonQuizPresent()) return;
              navigate(`../lessons/${position}/quizzes/new`, {
                relative: "path",
              })
            }
            }
          >
            Quiz
          </button>
        </div>
      </div>
    );
  }
);

const EditAccordionButtonToggler: React.FC<{ position: number }> = ({
  position,
}) => {
  const { modalDispatch } = useContext(ModalContext) as ModalContextValueType;
  return (
    <span
      className="course_item_add_cta"
      onClick={(e) => {
        e.stopPropagation();
        modalDispatch(__showModal(`accordionModal${position}`));
      }}
    >
      <svg>
        <use xlinkHref="#add"></use>
      </svg>

      <AccordionPromptbox position={position} />
    </span>
  );
};

const EditAccordionHead: React.FC<{
  detailVisible: boolean;
  setDetailVisible: React.Dispatch<React.SetStateAction<boolean>>;
  position: number;
  lesson: CourseLessonType2;
}> = React.memo(({ detailVisible, setDetailVisible, position, lesson }) => {
  const submit = useSubmit();
  return (
    <div className="accordion_head">
      <h3>{lesson.title}</h3>
      <p>{lesson.contents.length} contents</p>

      <EditAccordionButtonToggler position={position} />

      <span
        onClick={() => {
          //TODO: this deletes the corresponding lesson
          const payload: CourseItemDeletionActionType = {
            intent: "DELETE_LESSON",
            payload: { lessonID: lesson.id },
          };
          submit(payload as any, {
            method: "post",
            action: "./",
            encType: "application/json",
            navigate: false,
          });
        }}
      >
        <svg className={"flipped"}>
          <use xlinkHref="#trash"></use>
        </svg>
      </span>

      <span onClick={() => setDetailVisible((prevState) => !prevState)}>
        <svg className={detailVisible ? "flipped" : ""}>
          <use xlinkHref="#caret-up"></use>
        </svg>
      </span>
    </div>
  );
});

export const CourseEditAccordionEntry: React.FC<{ lesson: CourseLessonType2 }> =
  React.memo(({ lesson }) => {
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const submit = useSubmit();
    return (
      <div className="accordion_section">
        <EditAccordionHead
          detailVisible={detailVisible}
          setDetailVisible={setDetailVisible}
          position={lesson.id}
          lesson={lesson}
        />
        <ul className={`accordion_details${detailVisible ? " visible" : ""}`}>
          {lesson.contents.map((content, idx) => {
            return (
              <li key={content.id}>
                <CourseContentIcon type={content.contentType || "text"} />
                <p>{content.title}</p>
                <button
                  onClick={() => {
                    const payload: CourseItemDeletionActionType = {
                      intent: "DELETE_CONTENT",
                      payload: { contentID: content.id, lessonID: lesson.id },
                    };
                    submit(payload as any, {
                      method: "post",
                      action: "./",
                      encType: "application/json",
                      navigate: false,
                    });
                  }}
                >
                  <svg>
                    <use xlinkHref="#delete"></use>
                  </svg>
                </button>
              </li>
            );
          })}

          {lesson.quiz ? (
            <li>
              <CourseContentIcon type="quiz" />
              <p>{lesson.quiz.title || `Quiz - testing your knowledge`}</p>

              <div className={`accordion_content_badge`}>
                <p>{lesson.quiz?.totalPoints}XP</p>
                <svg
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5 14C0.367392 14 0.240215 13.9473 0.146447 13.8536C0.0526785 13.7598 0 13.6326 0 13.5V1.12906C3.57728e-05 0.998057 0.0343858 0.869347 0.0996304 0.755744C0.164875 0.642142 0.258738 0.547611 0.371875 0.481562C0.75 0.261875 1.51188 0 3 0C4.16281 0 5.46344 0.459688 6.61094 0.865C7.535 1.19156 8.40781 1.5 9 1.5C9.76233 1.49769 10.5166 1.34366 11.2188 1.04688C11.3043 1.01078 11.3974 0.996406 11.4898 1.00503C11.5822 1.01366 11.671 1.04502 11.7484 1.09632C11.8257 1.14762 11.8892 1.21726 11.9331 1.29904C11.977 1.38082 12 1.47218 12 1.565V8.42C11.9999 8.5415 11.9643 8.66033 11.8977 8.76196C11.8311 8.86358 11.7364 8.94359 11.625 8.99219C11.3528 9.11125 10.3591 9.5 9 9.5C8.24563 9.5 7.30062 9.27688 6.30031 9.04031C5.17594 8.77469 4.01344 8.5 3 8.5C1.84781 8.5 1.25813 8.67437 1 8.78469V13.5C1 13.6326 0.947321 13.7598 0.853553 13.8536C0.759785 13.9473 0.632608 14 0.5 14Z"
                    fill="#2D6B10"
                  />
                </svg>
              </div>

              <Link
                to={`../../../assessments/${lesson.quiz?.id}/edit`}
                relative="path"
                className="edit_link"
              >
                edit quiz{" "}
                <span>
                  <svg>
                    <use xlinkHref="#link"></use>
                  </svg>
                </span>
              </Link>

              <button
                onClick={() => {
                  const payload: CourseItemDeletionActionType = {
                    intent: "DELETE_QUIZ",
                    payload: {
                      quizID: lesson.quiz?.id.toString(),
                      lessonID: lesson.id,
                    },
                  };
                  submit(payload as any, {
                    method: "post",
                    action: "./",
                    encType: "application/json",
                    navigate: false,
                  });
                }}
              >
                <svg>
                  <use xlinkHref="#delete"></use>
                </svg>
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    );
  });

export const LessonTitleInput: React.FC<{
  pos: number;
}> = ({ pos }) => {
  const [lessonTitleState, setLessonTitleState] = useState<string>("");
  const debouncedLessonTitle = useDebounce<string>(lessonTitleState, 1000);
  const { lessonCreationDispatch } = useContext(
    LessonCreationContext
  ) as LessonCreationContextValueType;
  const { lessonUpdateDispatch } = useContext(
    LessonUpdateContext
  ) as LessonUpdateContextValueType;

  useEffect(() => {
    if (debouncedLessonTitle)
      lessonCreationDispatch(
        __updateTitle({ title: debouncedLessonTitle, id: pos })
      );
  }, [debouncedLessonTitle, lessonCreationDispatch]);

  useEffect(() => {
    lessonUpdateDispatch(__updatePosition(pos));
  }, []);

  return (
    <input
      type="text"
      id={`lesson${pos}.lesson_title`}
      name={`lesson${pos}.lesson_title`}
      value={lessonTitleState}
      onChange={(e) => setLessonTitleState(e.target.value)}
    />
  );
};

export const LessonContentAdditionArea: React.FC = React.memo(() => {
  const [lessonUpdateState, lessonUpdateDispatch] = useReducer(
    LessonUpdateReducer,
    InitialLessonUpdateState
  );
  const lessonUpdateContextValue = useMemo(
    () => ({ lessonUpdateState, lessonUpdateDispatch }),
    [lessonUpdateState, lessonUpdateDispatch]
  );
  const { lessonCreationState, lessonCreationDispatch } = useContext(
    LessonCreationContext
  ) as LessonCreationContextValueType;
  const submit = useSubmit();
  const courseID = useParams()["course_id"];
  const lessonUpdateStateDefault = useMemo(
    () => ({
      lessonContents: [],
      lessonQuizCount: 0,
      lessonQuizzes: [],
    }),
    []
  );
  const lessonCreationStateDefault = useMemo(
    () => ({
      lessons: [],
    }),
    []
  );

  // console.log("the lesson update state is ", lessonUpdateState);
  // console.log("the lesson creation<> state is ", lessonCreationState); //BUGFIX: FIND OUT WHY THE CANCEL BUTTON FOR ADDING LESSONS TO COURSE IS CAUSING A RE-RENDER

  return (
    <LessonUpdateProvider value={lessonUpdateContextValue}>
      {lessonCreationState.lessons.map((lesson, idx) => {
        return (
          <section className="lesson_content_addition_area" key={idx}>
            <div className="lesson_addition_top">
              <Form className="input_form none">
                <div className="input_form_bottom">
                  <div className="input_wrapper lesson_title">
                    <label htmlFor="add_lesson_title.lesson_title">
                      Lesson title
                    </label>
                    <LessonTitleInput pos={lesson.id as number} />
                  </div>
                </div>
              </Form>

              <div className="lesson_addition_cta_area">
                <button
                  onClick={() =>
                    lessonUpdateDispatch(
                      __addContent({ lessonPositionID: lesson.id as number })
                    )
                  }
                >
                  <span>
                    <svg>
                      <use xlinkHref="#add"></use>
                    </svg>
                  </span>{" "}
                  add content
                </button>

                <button
                  onClick={() =>
                    lessonUpdateDispatch(
                      __addQuiz({ lessonPositionID: lesson.id as number })
                    )
                  }
                >
                  <span>
                    <svg>
                      <use xlinkHref="#add"></use>
                    </svg>
                  </span>{" "}
                  add quiz
                </button>
              </div>
            </div>

            <ul className="content_addition_area">
              <>
                {lessonUpdateState.lessonContents
                  .filter((content) => content.lessonPosition === lesson.id)
                  .map((content, contentIdx) => {
                    return (
                      <LessonItemAdditionBox
                        lessonPositionID={idx}
                        itemType="content"
                        key={contentIdx}
                        itemID={content.id}
                        withUpdate
                      />
                    );
                  })}
                {lessonUpdateState.lessonQuizzes
                  .filter((quiz) => quiz.lessonPosition === lesson.id)
                  .map((quiz, quizIdx) => {
                    return (
                      <LessonItemAdditionBox
                        lessonPositionID={idx}
                        itemType="quiz"
                        key={quizIdx}
                        itemID={+(quiz.id as string)}
                        withUpdate
                      />
                    );
                  })}
              </>
            </ul>
          </section>
        );
      })}

      <div className="course_creation_cta_area">
        <button
          onClick={() => {
            lessonUpdateDispatch(__reset(lessonUpdateStateDefault));
            lessonCreationDispatch(__creationReset(lessonCreationStateDefault));
          }}
        >
          cancel
        </button>
        <button
          className="primary"
          onClick={() => {
            const lessonData = serializeLessonStateForAction(
              lessonCreationState.lessons,
              +(courseID as string)
            );
            const lessonContentData = serializeLessonContentForAction(
              lessonUpdateState.lessonContents
            );
            const lessonQuizData = serializeLessonQuizForAction(
              lessonUpdateState.lessonQuizzes
            );
            const resPayload: LessonAdditionActionType = {
              intent: "ADD_LESSONS",
              payload: { lessonData, lessonContentData, lessonQuizData },
            };
            lessonUpdateDispatch(
              __reset({
                lessonContents: [],
                lessonQuizCount: 0,
                lessonQuizzes: [],
              })
            );
            lessonCreationDispatch(__creationReset({ lessons: [] }));
            submit(resPayload as any, {
              method: "post",
              action: "./",
              encType: "application/json",
              navigate: false,
            });
          }}
        >
          save changes
        </button>
      </div>
    </LessonUpdateProvider>
  );
});

export const ExamEditArea: React.FC = React.memo(() => {
  const submit = useSubmit();
  const { course_id: courseID } = useParams();
  const { exam } = useLoaderData<typeof loader>() as {
    exam: Omit<CourseExamType2, "description"> | null | undefined;
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="exam_edit_area">
        <h2 className="section_header">course exam</h2>
        {exam ? (
          <>
            <ul>
              <li>
                <span>Started At</span>{" "}
                {new Date(exam.startDate).toLocaleDateString()}
              </li>
              <li>
                <span>Ended At</span>{" "}
                {new Date(exam.endDate).toLocaleDateString()}
              </li>
              <li>
                <span>Pass Score</span> {exam.passScore}%
              </li>
              <li>
                <span>Duration</span> {exam.duration}s
              </li>
            </ul>
            <div className="exam_update_cta_area">
              <Link
                to={`../../../assessments/${exam.id}/edit`}
                relative="path"
                className="edit_link"
              >
                edit exam{" "}
                <span>
                  <svg>
                    <use xlinkHref="#link"></use>
                  </svg>
                </span>
              </Link>
              <button
                onClick={() => {
                  const payload: CourseItemDeletionActionType = {
                    intent: "DELETE_EXAM",
                    payload: { examID: exam.id.toString() },
                  };
                  submit(payload as any, {
                    method: "post",
                    action: "./",
                    encType: "application/json",
                    navigate: false,
                  });
                }}
              >
                delete exam
                <span>
                  <svg>
                    <use xlinkHref="#trash"></use>
                  </svg>
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="empty_exam_area">
            <p>no exams for this course yet!</p>{" "}
            <span>
              <button
                onClick={() => {
                  navigate(`../exams/new`, { relative: "path" });
                }}
              >
                add exam
              </button>
            </span>
          </div>
        )}
      </div>
    </>
  );
});

export const CourseCreationArea: React.FC = React.memo(() => {
  const { course: loadedCourse } = useLoaderData<typeof loader>() as {
    course: CreatorCourseEditViewType;
  };
  const navigate = useNavigate();
  const defaultCourse = useMemo(() => {
    return {
      description: loadedCourse.description,
      tags: loadedCourse.tags.join(" "),
      thumbnail: loadedCourse.avatar,
      title: loadedCourse.title,
    } as CourseEditStateType;
  }, [loadedCourse]);
  const [courseEditState, setCourseEditState] =
    useState<CourseEditStateType>(defaultCourse);

  const [uploadImageState, setUploadImageState] = useState<
    [string | null, string | null]
  >([null, null]);

  const submit = useSubmit();

  const courseEditStateHandler = useCallback(
    (
      source: ChangeEvent,
      setFunction: React.Dispatch<React.SetStateAction<CourseEditStateType>>,
      keySelector: keyof CourseEditStateType
    ) => {
      const target: HTMLInputElement = source.target as HTMLInputElement;
      setFunction((prevState) => {
        if (target.value === prevState[keySelector]) {
          return prevState;
        }
        return {
          ...prevState,
          [keySelector]: target.value || target,
        };
      });
    },
    []
  );

  return (
    <>
      <section className="course_creation_area">
        <DashboardFormInput
          defaultData={
            {
              title: loadedCourse.title,
            } as DefaultCourseFormDataType
          }
          data={courseTitleUpdateFormData}
          asInput
          onChangeHandler={(e) => {
            courseEditStateHandler(e, setCourseEditState, "title");
          }}
        />

        <DashboardFormInput
          defaultData={
            {
              avatar_url: loadedCourse.avatar,
            } as DefaultCourseFormDataType
          }
          data={courseImageUpdateFormData}
          asInput
          onUploadHandler={(state) => {
            setUploadImageState(state);
          }}
        />

        <DashboardFormInput
          defaultData={
            {
              description: loadedCourse.description,
            } as DefaultCourseFormDataType
          }
          data={courseDescriptionUpdateFormData}
          asInput
          onChangeHandler={(e) => {
            courseEditStateHandler(e, setCourseEditState, "description");
          }}
        />

        <DashboardFormInput
          defaultData={
            {
              tags: loadedCourse.tags.join(" "),
            } as DefaultCourseFormDataType
          }
          data={courseTagsUpdateFormData}
          asInput
          onChangeHandler={(e) => {
            courseEditStateHandler(e, setCourseEditState, "tags");
          }}
        />
      </section>
      <div className="course_creation_cta_area">
        <button
          onClick={() => navigate("../..", { relative: "path", replace: true })}
        >
          cancel
        </button>
        <button
          className="primary"
          onClick={() => {
            const resCourseEditPayload = serializeCourseEditState(
              courseEditState,
              uploadImageState
            );
            const payload: CourseInfoEditActionType = {
              intent: "UPDATE_INFO",
              payload: resCourseEditPayload,
            };

            submit(payload as any, {
              method: "post",
              encType: "application/json",
              action: "./",
              navigate: false,
            });
          }}
        >
          save changes
        </button>
      </div>
    </>
  );
});

export const LessonAdditionArea: React.FC = () => {
  const [lessonCreationState, lessonCreationDispatch] = useReducer(
    LessonCreationReducer,
    InitialLessonCreationState
  );
  const lessonCreationContextValue = useMemo(
    () => ({ lessonCreationState, lessonCreationDispatch }),
    [lessonCreationState, lessonCreationDispatch]
  );

  return (
    <LessonCreationProvider value={lessonCreationContextValue}>
      <div className="lesson_add_cta_area">
        <button onClick={() => lessonCreationDispatch(__addLesson())}>
          <span>
            <svg>
              <use xlinkHref="#add"></use>
            </svg>
          </span>{" "}
          add lesson
        </button>
      </div>

      <LessonContentAdditionArea />
    </LessonCreationProvider>
  );
};

export const CourseEditPage: React.FC = () => {
  const contextData = useOutletContext() as { profile: CreatorProfileType };
  const { lessons: loadedLessons, course: loadedCourse } = useLoaderData<
    typeof loader
  >() as {
    lessons: CourseLessonType2[];
    course: CreatorCourseEditViewType;
  };

  const [modalState, modalDispatch] = useReducer(
    ModalReducer,
    InitialModalState
  );

  const modalContextValue = useMemo(
    () => ({ modalState, modalDispatch }),
    [modalState, modalDispatch]
  );

  void contextData; // BUGFIX: undefined because this is not nested under the dashboard route. we should use this later for verification of the creator (client side)
  return (
    <ModalProvider value={modalContextValue}>
      <CourseCreationArea />
      <section className="course_interaction_area">
        <h2 className="section_header">course lessons</h2>
        <div className="interaction_accordion">
          {loadedLessons.length ? (
            loadedLessons.map((lesson, idx) => (
              <CourseEditAccordionEntry lesson={lesson} key={idx} />
            ))
          ) : (
            <NoContent text="NO LESSONS FOR THIS COURSE" variant="courses" />
          )}
        </div>
      </section>

      <Suspense
        fallback={
          <div style={{ display: "none" }}>
            {" "}
            loading lesson content modal ...
          </div>
        }
      >
        <LessonContentAdditionModal />
      </Suspense>

      <LessonAdditionArea />

      <ExamEditArea />
    </ModalProvider>
  );
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      default:
        return <h2>error fetching course. {error.data.error}</h2>;
    }
  } else {
    if (error instanceof Error)
      return (
        <h2>
          something went wrong! {error.message} {error.stack}
        </h2>
      );
    return <h2>something went wrong! unknown error</h2>;
  }
};

export default CourseEditPage;

export const action: ActionFunction = async ({ params, request }) => {
  try {
    const reqJson = await request.json() as ActionButtonType<object>;
    const { creator_id: creatorID, course_id: courseID } = params;
    const cookieHeader = request.headers.get("Cookie");
    let requestURL: string;
    let actionRequest: AxiosResponse<ServerPayloadType<any>, any>;

    switch (reqJson.intent as CourseEditActionIntentType) {
      case "ADD_LESSONS": {
        let payloadJson: LessonAdditionPayloadType =
          reqJson.payload as LessonAdditionPayloadType;
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons`;
        actionRequest = await axios.post(requestURL, payloadJson, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 201) break;
        return jsonWithSuccess(null, "lessons added successfully!")
      }
      case "ADD_LESSON_CONTENT": {
        let payloadJson: LessonContentAdditionPayloadType =
          reqJson.payload as LessonContentAdditionPayloadType;
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons/${payloadJson.lessonID}/contents`;
        actionRequest = await axios.post(requestURL, payloadJson, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 201) break;
        return jsonWithSuccess(null, "lesson content added successfully!")

      }
      case "DELETE_CONTENT": {
        let payloadJson: CourseItemDeletionActionType["payload"] =
          reqJson.payload as CourseItemDeletionActionType["payload"];
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons/${payloadJson.lessonID}/contents/${payloadJson.contentID}`;
        actionRequest = await axios.delete(requestURL, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 204) break;
        return jsonWithSuccess(null, "lesson content deleted successfully!")
      }
      case "DELETE_QUIZ": {
        let payloadJson: CourseItemDeletionActionType["payload"] =
          reqJson.payload as CourseItemDeletionActionType["payload"];
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons/${payloadJson.lessonID}/quizzes/${payloadJson.quizID}`;
        actionRequest = await axios.delete(requestURL, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 204) break;
        return jsonWithSuccess(null, "quiz deleted successfully!")
      }
      case "DELETE_EXAM": {
        let payloadJson: CourseItemDeletionActionType["payload"] =
          reqJson.payload as CourseItemDeletionActionType["payload"];
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/exams/${payloadJson.examID}`;
        actionRequest = await axios.delete(requestURL, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 204) break;
        return jsonWithSuccess(null, "quiz deleted successfully!")
      }
      case "UPDATE_INFO": {
        let payloadJson: CourseEditPayloadType =
          reqJson.payload as CourseEditPayloadType;
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}`;
        if (payloadJson.images && payloadJson.images.length) {
          console.log("original image size is ", payloadJson.images[0]?.length || 0);
          console.log("thumbnail image size is ", payloadJson.images[1]?.length || 0);
        }

        actionRequest = await axios.put(requestURL, payloadJson, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 200) break;
        return jsonWithSuccess(null, "course updated successfully!")
      }
      case "DELETE_LESSON": {
        let payloadJson: CourseItemDeletionActionType["payload"] =
          reqJson.payload as CourseItemDeletionActionType["payload"];
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${courseID}/lessons/${payloadJson.lessonID}`;
        actionRequest = await axios.delete(requestURL, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 204) break;
        return jsonWithSuccess(null, "lesson deleted successfully!")
      }
    }
  } catch (err) {
    if (err instanceof AxiosError)
      return jsonWithError(null, "could not proceed with action! REASON: " + (`${err.response?.data.message}` || "unknown"))
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};
