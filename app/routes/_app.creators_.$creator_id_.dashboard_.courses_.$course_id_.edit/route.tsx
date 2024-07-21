import { LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  json,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import React, {
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
import { LessonContentAdditionModal } from "~/components/lesson-content-addition-modal";
import { LessonItemAdditionBox } from "~/components/lesson-item-addition-box";
import { courseData } from "~/data/course-list";
import "~/styles/course-creation-page.css";
import "~/styles/course-edit.css";

import {
  CourseEntryType,
  CourseLessonType,
  CreatorProfileType,
  DashboardCustomInputType,
  DefaultCourseFormDataType,
  DefaultDashboardFormDataType,
  DefaultFormDataType,
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
} from "~/reducers/lesson-creation.reducer";
import {
  LessonCreationContext,
  LessonCreationContextValueType,
  LessonCreationProvider,
} from "~/contexts/lesson-creation.context";
import { useDebounce } from "~/hooks/use-debounce";

export const courseTitleUpdateFormData: DashboardCustomInputType = {
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

export const courseDescriptionUpdateFormData: DashboardCustomInputType = {
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

export const courseImageUpdateFormData: DashboardCustomInputType = {
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

export const courseTagsUpdateFormData: DashboardCustomInputType = {
  heading: "",
  namespace: "update_tags",
  form: {
    intent: "update_tags",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    { name: "tags", title: "course tags (comma, separated)", type: "text" },
  ],
  buttons: [],
  images: [],
};

export const courseLessonTitleCreateForm: DashboardCustomInputType = {
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

export const loader: LoaderFunction = ({ params }) => {
  const courseID = params["course_id"];
  return json({
    course: courseData.find((el) => el.id === +(courseID as string)),
  });
};

export const AccordionPromptbox: React.FC<{ position: number }> = React.memo(
  ({ position }) => {
    const { modalState, modalDispatch } = useContext(
      ModalContext
    ) as ModalContextValueType;
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
              modalDispatch(__showModal("lessonContentAdditionModal"));
            }}
          >
            Content
          </button>
          <button
            onClick={() =>
              navigate("../lessons/0/quizzes/new", { relative: "path" })
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
}> = React.memo(({ detailVisible, setDetailVisible, position }) => {
  return (
    <div className="accordion_head">
      <h3>
        Getting started in the middle of the conversation. how will the
        blockchain move forward if you{" "}
      </h3>
      <p>41 contents</p>

      <EditAccordionButtonToggler position={position} />

      <span onClick={() => setDetailVisible((prevState) => !prevState)}>
        <svg className={detailVisible ? "flipped" : ""}>
          <use xlinkHref="#caret-up"></use>
        </svg>
      </span>
    </div>
  );
});

export const CourseEditAccordionEntry: React.FC<{ position: number }> =
  React.memo(({ position }) => {
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    return (
      <div className="accordion_section">
        <EditAccordionHead
          detailVisible={detailVisible}
          setDetailVisible={setDetailVisible}
          position={position}
        />
        <ul className={`accordion_details${detailVisible ? " visible" : ""}`}>
          <li>
            <CourseContentIcon type="text" />
            <p>what is blockchain and how does it work?</p>
            <button>
              <svg>
                <use xlinkHref="#delete"></use>
              </svg>
            </button>
          </li>
          <li>
            <CourseContentIcon type="text" />
            <p>what is blockchain and how does it work?</p>
            <button>
              <svg>
                <use xlinkHref="#delete"></use>
              </svg>
            </button>
          </li>

          <li>
            <CourseContentIcon type="quiz" />
            <p>what is blockchain and how does it work?</p>

            <div className={`accordion_content_badge`}>
              <p>20xp</p>
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
              to={"../lessons/0/quizzes/new"}
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

            <button>
              <svg>
                <use xlinkHref="#delete"></use>
              </svg>
            </button>
          </li>
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
  const { lessonCreationState } = useContext(
    LessonCreationContext
  ) as LessonCreationContextValueType;

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
                        itemID={quiz.id}
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
        <button>cancel</button>
        <button className="primary">save changes</button>
      </div>
    </LessonUpdateProvider>
  );
});

export const ExamEditArea: React.FC = React.memo(() => {
  return (
    <>
      <div className="exam_edit_area">
        <h2 className="section_header">course exam</h2>
        <div className="empty_exam_area" style={{ display: "none" }}>
          <p>no exams for this course yet!</p>{" "}
          <span>
            <button>add exam</button>
          </span>
        </div>
        <ul>
          <li>
            <span>Started At</span> 15/02/2022
          </li>
          <li>
            <span>Ended At</span> 10/03/2024
          </li>
          <li>
            <span>Pass Score</span> 70%
          </li>
          <li>
            <span>Duration</span> 120s
          </li>
        </ul>
        <div className="exam_update_cta_area">
          <Link to={"../exams/new"} relative="path" className="edit_link">
            edit exam{" "}
            <span>
              <svg>
                <use xlinkHref="#link"></use>
              </svg>
            </span>
          </Link>
          <button>
            delete exam
            <span>
              <svg>
                <use xlinkHref="#trash"></use>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </>
  );
});

export const CourseCreationArea: React.FC = React.memo(() => {
  const { course: loadedCourse } = useLoaderData<typeof loader>() as {
    course: CourseEntryType;
  };
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
        />

        <DashboardFormInput
          defaultData={
            {
              avatar_url: loadedCourse.imageUrl,
            } as DefaultCourseFormDataType
          }
          data={courseImageUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={
            {
              description: loadedCourse.description,
            } as DefaultCourseFormDataType
          }
          data={courseDescriptionUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={
            {
              tags: loadedCourse.tags.join(", "),
            } as DefaultCourseFormDataType
          }
          data={courseTagsUpdateFormData}
          asInput
        />
      </section>
      <div className="course_creation_cta_area">
        <button>cancel</button>
        <button className="primary">save changes</button>
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
  console.log("lesson addition area rendering");

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
          <CourseEditAccordionEntry position={0} />
          <CourseEditAccordionEntry position={1} />
        </div>
      </section>

      <LessonContentAdditionModal />

      <LessonAdditionArea />

      <ExamEditArea />
    </ModalProvider>
  );
};

export default CourseEditPage;
