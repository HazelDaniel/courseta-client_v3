import {
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import { courseDataDetailed } from "~/data/course-list";
import {
  AssessmentSubmissionActionType,
  AssessmentVariantType,
  CourseDetailType,
  CourseExamType,
  CourseExamType2,
  CourseLessonType,
  CourseLessonType2,
  GenericAssessmentType,
  LessonQuizType,
  QuestionType,
} from "~/types";
import { NotFound } from "./not-found";
import { convertSecondsToHms } from "~/utils/conversion";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { CourseAccordion } from "./course-accordion";
import { Logo } from "./logo";
import { Quiz } from "./quiz";

import styles from "~/styles/course-details.module.css";

import assessmentStyles from "~/styles/assessment.module.css";
import assessmentFormStyles from "~styles/assessment-form.module.css";
import courseAccordionStyles from "~/styles/course-accordion.module.css";
import CountdownCircle from "./countdown-circle";
import { useGetLinkedResourceKeys } from "~/hooks/use-get-linked-resource-keys";
import { CourseDetailViewType, SessionUserType } from "~/server.types";
import { NoContent } from "./no-content";
import {
  AssessmentSubmissionReducer,
  AssessmentSubmissionStateType,
  InitialAssessmentSubmissionState,
  __addAnswer,
  __removeAnswer,
  __reset,
} from "~/reducers/assessment-submission.reducer";
import { serializeSubmissionStateForAction } from "~/serializers/submission.serializer";

export const CourseSideTab: React.FC<{
  course: CourseDetailViewType | null;
}> = ({ course }) => {
  const [expanded, expand] = useState(false);
  if (!course) {
    return null;
  }

  return (
    <aside 
      className={`${
        !expanded
          ? styles.course_side_tab_styled
          : styles.course_side_tab_styled + " " + styles.expanded
      }`}
    >
      <Logo />
      <div
        className={expanded ? styles["course_side_tab_toggler"] + " " + styles.flipped :  styles["course_side_tab_toggler"]}
        onClick={() => expand((prev) => !prev)}
      >
        <svg viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 8L8 1L1 8"
            stroke="#CAC8C8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1L8 8L15 1"
            stroke="#CAC8C8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div className={styles.course_side_tab_body}>
        <p>{course.title}</p>
        <CourseAccordion variant="details" course={course} />
      </div>
    </aside>
  );
};

export const AssessmentForm: React.FC<{
  variant: AssessmentVariantType;
}> = ({ variant }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { Form, submit } = useFetcher();
  const params = useParams();
  const location = useLocation();
  const loadedQuizResult = useLoaderData() as {
    quiz: LessonQuizType | null;
    questions: QuestionType[];
    user: SessionUserType | null;
  };
  const loadedExamResult = useLoaderData() as {
    exam: CourseExamType2;
    questions: QuestionType[];
    user: SessionUserType | null;
  };
  const currentUser = loadedExamResult?.user || loadedQuizResult?.user;
  let assessment: LessonQuizType | CourseExamType2 | null;
  let questions: QuestionType[];

  if (variant === "quiz") {
    assessment = loadedQuizResult.quiz;
    questions = loadedQuizResult.questions;
  } else {
    assessment = loadedExamResult.exam;
    questions = loadedExamResult.questions;
  }
  const assessmentID =
    variant === "exam"
      ? params["exam_id"]
      : variant === "quiz"
      ? params["assessment_id"]
      : "";
  if (!assessment) return <NotFound />;
  const [selectionState, selectionDispatch] = useReducer(
    AssessmentSubmissionReducer,
    InitialAssessmentSubmissionState
  );

  console.log("answer selection state is ", selectionState);

  // useEffect(() => {
  //   if (formRef.current) {
  //     formRef.current.reset();
  //   }
  // }, [location, formRef]);

  useEffect(() => {
    // console.log("we are mounting once");
    selectionDispatch(__reset());
  }, [location]);

  return (
    <form
      // ref={formRef}
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || currentUser.role === "creator") return;
        const payload = serializeSubmissionStateForAction(
          selectionState as AssessmentSubmissionStateType,
          assessmentID as string,
          variant
        );
        const submitPayload: AssessmentSubmissionActionType = {
          intent: "SUBMIT",
          payload,
        };
        submit(submitPayload as any, {
          action: "./",
          method: "post",
          encType: "application/json",
        });
      }}
    >
      <div className={assessmentStyles.accessment_wrapper}>
        {questions.length ? (
          questions.map((entry, idx) => {
            return (
              <Quiz
                value={entry}
                key={idx}
                key_={idx + 1}
                assessmentID={assessmentID as string}
                variant={variant}
                onSelectHandler={(answer) => {
                  selectionDispatch(
                    __addAnswer({ ...answer, questionType: "single" })
                  );
                }}
                onUnSelectHandler={(answer) => {
                  selectionDispatch(
                    __removeAnswer({ ...answer, questionType: "single" })
                  );
                }}
              />
            );
          })
        ) : (
          <NoContent
            text="no assessment questions to show!"
            variant="courses"
          />
        )}
      </div>

      {questions.length ? (
        <div className={assessmentStyles.quiz_cta_area}>
          <button
            className={assessmentStyles.button}
            type="submit"
            disabled={!currentUser || currentUser.role === "creator"}
            onClick={() => {
              if (!currentUser || currentUser.role === "creator") return;
            }}
          >
            SUBMIT
          </button>
        </div>
      ) : null}
    </form>
  );
};

export const AssessmentCountdown: React.FC<{ duration: number }> = ({
  duration,
}) => {
  const [countdownTime, setCountdownTime] = useState(duration);
  const countdownRef = useRef(null);
  const calcCountdownTime = () => convertSecondsToHms(countdownTime);

  const calcDuration = useCallback(() => {
    return convertSecondsToHms(duration);
  }, [duration]);

  return (
    <>
      <CountdownCircle
        duration={duration}
        setCountdownTime={setCountdownTime}
        countdownTime={duration}
      />

      <ul className={assessmentStyles.countdown_elapsed_area}>
        <li ref={countdownRef}>
          <span>time left</span>
          {`${calcCountdownTime().hours}hr ${calcCountdownTime().minutes}min ${
            calcCountdownTime().seconds
          }s`}
        </li>
        <li>
          <span>duration</span>
          {`${calcDuration().hours}hr ${calcDuration().minutes}min ${
            calcDuration().seconds
          }s`}
        </li>
      </ul>
    </>
  );
};

export const BackToCourseCTA: React.FC = () => {
  const navigate = useNavigate();
  const courseID = useParams()["course_id"];
  const courseURL = `/courses/${courseID}`;

  return (
    <button
      className={assessmentStyles.accessment_cta}
      onClick={() => {
        navigate(courseURL);
      }}
    >
      <span>
        <svg>
          <use xlinkHref="#return-back"></use>
        </svg>
      </span>
      back to course
    </button>
  );
};

export const AssessmentBody: React.FC<{
  // assessment: GenericAssessmentType | CourseExamType | null;
  variant: AssessmentVariantType;
}> = ({ variant }) => {
  const loadedQuizResult = useLoaderData() as {
    quiz: LessonQuizType | null;
  };
  const loadedExamResult = useLoaderData() as {
    exam: CourseExamType2;
  };
  let assessment: LessonQuizType | CourseExamType2 | null = null;

  if (variant === "quiz") {
    assessment = loadedQuizResult.quiz;
  } else {
    assessment = loadedExamResult.exam;
  }
  if (!assessment && variant === "quiz") return <NotFound />;

  return (
    <>
      <div className={assessmentStyles.accessment_cta_area}>
        <button className={assessmentStyles.accessment_cta}>
          <span>
            <svg>
              <use xlinkHref="#share"></use>
            </svg>
          </span>
          share
        </button>

        <BackToCourseCTA />
      </div>

      {variant === "exam" ? (
        <div className={assessmentStyles.accessment_countdown_area}>
          <div className={assessmentStyles.countdown_area_left}>
            <p>{variant === "exam" ? `Examination` : "Quiz"}</p>
          </div>
          <div className={assessmentStyles.countdown_area_right}>
            <AssessmentCountdown
              duration={(assessment as CourseExamType2).duration}
            />
          </div>
        </div>
      ) : null}

      <div className={assessmentStyles.accessment_description_area}>
        <p>
          {variant === "exam" ? (
            <i>{(assessment as CourseExamType | null)?.description}</i>
          ) : (
            <i>
              {assessment?.description ||
                "This quiz tests your basic understanding of the current lesson"}
            </i>
          )}
        </p>
      </div>
      <AssessmentForm variant={variant} />
    </>
  );
};

export const CourseDetails: React.FC = () => {
  const res = useLoaderData() as {
    course: CourseDetailViewType;
  };

  const { course } = res;

  return (
    <div className={styles.course_details_styled}>
      <CourseSideTab course={course} />
      <div className={`${assessmentStyles.course_assessment_area_styled}`}>
        <Outlet />
      </div>
    </div>
  );
};
