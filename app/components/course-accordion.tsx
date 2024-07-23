import { useLocation, useParams } from "@remix-run/react";
import { useCallback, useContext, useMemo, useReducer } from "react";
import { Link } from "react-router-dom";
import { CourseDetailType, CourseLessonType } from "~/types";
import { convertSecondsToHms } from "~/utils/conversion";
import { NoContent } from "./no-content";

import styles from "~/styles/course-accordion.module.css";
import {
  AccordionReducer,
  InitialAccordionState,
  __hideAccordion,
  __showAccordion,
} from "~/reducers/accordion-reducer";
import {
  AccordionContext,
  AccordionContextValueType,
  AccordionProvider,
} from "~/contexts/accordion-context";

export const CourseContentIcon: React.FC<{
  type: "video" | "text" | "quiz";
}> = ({ type }) => {
  if (type === "video")
    return (
      <svg viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 4.33333L14.7942 2.43667C14.9212 2.3732 15.0623 2.34323 15.2042 2.34962C15.346 2.35601 15.4839 2.39854 15.6047 2.47317C15.7255 2.5478 15.8252 2.65206 15.8944 2.77606C15.9636 2.90006 15.9999 3.03967 16 3.18167V8.81833C15.9999 8.96033 15.9636 9.09994 15.8944 9.22394C15.8252 9.34794 15.7255 9.4522 15.6047 9.52683C15.4839 9.60146 15.346 9.64399 15.2042 9.65038C15.0623 9.65677 14.9212 9.6268 14.7942 9.56333L11 7.66667V4.33333ZM1 2.66667C1 2.22464 1.17559 1.80072 1.48816 1.48816C1.80072 1.17559 2.22464 1 2.66667 1H9.33333C9.77536 1 10.1993 1.17559 10.5118 1.48816C10.8244 1.80072 11 2.22464 11 2.66667V9.33333C11 9.77536 10.8244 10.1993 10.5118 10.5118C10.1993 10.8244 9.77536 11 9.33333 11H2.66667C2.22464 11 1.80072 10.8244 1.48816 10.5118C1.17559 10.1993 1 9.77536 1 9.33333V2.66667Z"
          stroke="var(--content-icon-color-here)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (type === "text")
    return (
      <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.42 5.29004L10.45 0.430042C10.3122 0.292377 10.1484 0.183471 9.96816 0.109652C9.7879 0.0358341 9.59478 -0.00142449 9.4 4.1646e-05H2.5C1.83696 4.1646e-05 1.20107 0.263434 0.732233 0.732275C0.263392 1.20112 0 1.837 0 2.50004V17.38C0.00184718 18.0425 0.265832 18.6773 0.734273 19.1458C1.20271 19.6142 1.83753 19.8782 2.5 19.88H13.37C14.0325 19.8782 14.6673 19.6142 15.1357 19.1458C15.6042 18.6773 15.8682 18.0425 15.87 17.38V6.36004C15.8698 6.16074 15.83 5.96347 15.7527 5.77975C15.6754 5.59603 15.5623 5.42955 15.42 5.29004ZM14.15 5.44004H11.81C11.4122 5.44004 11.0306 5.28201 10.7493 5.0007C10.468 4.7194 10.31 4.33787 10.31 3.94004V1.69004L14.15 5.44004ZM14.87 17.38C14.87 17.7779 14.712 18.1594 14.4307 18.4407C14.1494 18.722 13.7678 18.88 13.37 18.88H2.5C2.10218 18.88 1.72064 18.722 1.43934 18.4407C1.15804 18.1594 1 17.7779 1 17.38V2.50004C1 2.10222 1.15804 1.72069 1.43934 1.43938C1.72064 1.15808 2.10218 1.00004 2.5 1.00004H9.31V3.94004C9.31 4.60308 9.57339 5.23897 10.0422 5.70781C10.5111 6.17665 11.147 6.44004 11.81 6.44004H14.87V17.38Z"
          fill="var(--content-icon-color-here)"
        />
      </svg>
    );

  if (type === "quiz")
    return (
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.86875 15L4.0875 9.45395L0 5.72368L5.4 5.23026L7.5 0L9.6 5.23026L15 5.72368L10.9125 9.45395L12.1312 15L7.5 12.0592L2.86875 15Z"
          fill="#FD7427"
        />
      </svg>
    );

  return null;
};

const CourseLessonLayout: React.FC<{
  lesson: CourseLessonType;
  variant: "outline" | "details";
  position: number;
}> = ({ lesson, variant, position }) => {
  const lessonDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(lesson.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [lesson.duration]);
  const params = useParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const courseIDParam = params["course_id"];
  const courseID = courseIDParam || search.get("course_id");
  const lessonIDParam = params["lesson_id"] || search.get("lesson_id") || "";
  const { accordionState, accordionDispatch } = useContext(
    AccordionContext
  ) as AccordionContextValueType;

  return (
    <>
      <div
        className={`${styles.accordion_head}${
          position === 0 ? ` ${styles.first}` : ""
        }`}
        onClick={() => {
          if (accordionState[`accordion${position}`]) {
            accordionDispatch(__hideAccordion(`accordion${position}`));
            return;
          }
          accordionDispatch(__showAccordion(`accordion${position}`));
        }}
      >
        <p>{lesson.title}</p>
        <div className={styles.head_right}>
          {variant !== "details" ? (
            <div className={styles.duration_details}>
              <p>{lesson.contents.length} contents</p>
              <span></span>
              <p>{`${lessonDurationString()}`}</p>
            </div>
          ) : null}
          <span
            className={
              variant === "details"
                ? `${styles.accordion_controller} ${styles.shrinked}${
                    accordionState[`accordion${position}`]
                      ? ""
                      : ` ${styles.flipped}`
                  }`
                : `${styles.accordion_controller}${
                    accordionState[`accordion${position}`]
                      ? ""
                      : ` ${styles.flipped}`
                  }`
            }
          >
            <svg
              viewBox="0 0 16 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.304691 8.6704C0.109588 8.47622 0 8.21301 0 7.93858C0 7.66415 0.109588 7.40094 0.304691 7.20677L7.25031 0.302861C7.44566 0.108929 7.71046 -4.47518e-07 7.98655 -4.47518e-07C8.26264 -4.47518e-07 8.52744 0.108929 8.72278 0.302861L15.6684 7.20677C15.7708 7.30158 15.8529 7.4159 15.9098 7.54294C15.9668 7.66997 15.9974 7.8071 15.9998 7.94614C16.0023 8.08519 15.9766 8.22331 15.9242 8.35226C15.8718 8.48121 15.7938 8.59835 15.6949 8.69668C15.5959 8.79502 15.4781 8.87254 15.3483 8.92463C15.2186 8.97671 15.0797 9.00229 14.9398 8.99984C14.7999 8.99739 14.6619 8.96695 14.5341 8.91035C14.4063 8.85375 14.2913 8.77214 14.1959 8.6704L7.98655 2.4983L1.77716 8.6704C1.58182 8.86433 1.31702 8.97326 1.04093 8.97326C0.764837 8.97326 0.500037 8.86433 0.304691 8.6704Z"
                fill="var(--text-color)"
              />
            </svg>
          </span>
        </div>
      </div>
      <ul
        className={`${styles.accordion_content_list}${
          accordionState[`accordion${position}`] ? ` ${styles.visible}` : ""
        }`}
      >
        {lesson.contents.map((content) => {
          return (
            // <></> don't forget that there's an active class functionality on the li item
            <li
              className={
                +lessonIDParam === lesson.id
                  ? `${styles.accordion_content} ${styles.active}`
                  : styles.accordion_content
              }
              key={content.id}
            >
              <span className={styles.content_icon_wrapper}>
                <CourseContentIcon type={content.type || "text"} />
              </span>
              <Link
                className={styles.accordion_content_text}
                to={`/courses/${courseID}/lessons/${lesson.id}/contents/${content.id}`}
              >
                {content.title}
              </Link>
            </li>
          );
        })}

        {!lesson.assessment.completed ? (
          <li
            className={
              +lessonIDParam === lesson.id
                ? `${styles.accordion_content} ${styles.active}`
                : styles.accordion_content
            }
          >
            <span className={styles.content_icon_wrapper}>
              <CourseContentIcon type="quiz" />
            </span>
            <Link
              className={styles.accordion_content_text}
              to={`/courses/${courseID}/lessons/${lesson.id}/assessments/${lesson.assessment.id}`}
            >
              {`Quiz: ${lesson.title}`}
            </Link>
            <div className={styles.accordion_content_badge}>
              <p>{lesson.assessment.availablePoints}xp</p>
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
          </li>
        ) : null}
      </ul>
    </>
  );
};

export const CourseAccordion: React.FC<{
  variant: "outline" | "details";
  course: CourseDetailType;
}> = ({ variant, course }) => {
  const [accordionState, accordionDispatch] = useReducer(
    AccordionReducer,
    InitialAccordionState
  );

  const accordionContextValue = useMemo(
    () => ({
      accordionState,
      accordionDispatch,
    }),
    [accordionState, accordionDispatch]
  );

  return (
    <AccordionProvider value={accordionContextValue}>
      <div
        className={`${styles.course_outline_accordion} ${
          styles.course_variant
        }${
          variant === "details"
            ? ` ${styles.details} ${styles.lesson_variant}`
            : ""
        }`}
      >
        {course.lessons.length >= 1 && course.lessonCount >= 1 ? (
          course.lessons.map((lesson, idx) => {
            lesson = { ...lesson, courseTitle: course.title };
            return (
              <CourseLessonLayout
                lesson={lesson as CourseLessonType}
                variant={variant}
                key={lesson.id}
                position={idx}
              />
            );
          })
        ) : (
          <NoContent
            text="No Lessons For This Course"
            variant={"course_outline"}
          />
        )}
      </div>
    </AccordionProvider>
  );
};
