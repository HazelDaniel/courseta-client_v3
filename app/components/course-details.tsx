import {
  Form,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import { courseDataDetailed } from "~/data/course-list";
import {
  CourseDetailType,
  CourseExamType,
  LessonAssessmentType,
} from "~/types";
import { NotFound } from "./not-found";
import { convertSecondsToHms } from "~/utils/conversion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CourseAccordion } from "./course-accordion";
import { Logo } from "./logo";
import { Quiz } from "./quiz";

import styles from "~/styles/course-details.module.css";

import assessmentStyles from "~/styles/assessment.module.css";
import assessmentFormStyles from "~styles/assessment-form.module.css";
import courseAccordionStyles from "~/styles/course-accordion.module.css";
import CountdownCircle from "./countdown-circle";
import { useGetLinkedResourceKeys } from "~/hooks/use-get-linked-resource-keys";

export const CourseSideTab: React.FC<{ course: CourseDetailType | null }> = ({
  course,
}) => {
  if (!course) {
    return null;
  }

  return (
    <aside className={styles.course_side_tab_styled}>
      <Logo />

      <div className={styles.course_side_tab_body}>
        <p>{course.title}</p>
        <CourseAccordion variant="details" course={course} />
      </div>
    </aside>
  );
};

export const AssessmentForm: React.FC<{
  assessment: LessonAssessmentType;
}> = ({ assessment }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [location.search, formRef]);

  return (
    <Form
      ref={formRef}
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        console.log(Object.fromEntries(formData));
        console.log("form submitted");
      }}
    >
      <div className={assessmentStyles.accessment_wrapper}>
        {assessment.questions.length ? (
          assessment.questions.map((entry, idx) => {
            return (
              <Quiz
                value={entry}
                key={idx}
                key_={idx + 1}
                assessmentID={assessment.id}
              />
            );
          })
        ) : (
          <div className={styles.no_content}>
            <span>
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M507.494,426.066L282.864,53.537c-5.677-9.415-15.87-15.172-26.865-15.172c-10.995,0-21.188,5.756-26.865,15.172
                  L4.506,426.066c-5.842,9.689-6.015,21.774-0.451,31.625c5.564,9.852,16.001,15.944,27.315,15.944h449.259
                  c11.314,0,21.751-6.093,27.315-15.944C513.508,447.839,513.336,435.755,507.494,426.066z M256.167,167.227
                  c12.901,0,23.817,7.278,23.817,20.178c0,39.363-4.631,95.929-4.631,135.292c0,10.255-11.247,14.554-19.186,14.554
                  c-10.584,0-19.516-4.3-19.516-14.554c0-39.363-4.63-95.929-4.63-135.292C232.021,174.505,242.605,167.227,256.167,167.227z
                  M256.498,411.018c-14.554,0-25.471-11.908-25.471-25.47c0-13.893,10.916-25.47,25.471-25.47c13.562,0,25.14,11.577,25.14,25.47
                  C281.638,399.11,270.06,411.018,256.498,411.018z"
                    />
                  </g>
                </g>
              </svg>
            </span>
            no assessment to show!
          </div>
        )}
      </div>

      {assessment.questions.length ? (
        <div className={assessmentStyles.quiz_cta_area}>
          <button className={assessmentStyles.button} type="submit">
            SUBMIT
          </button>
        </div>
      ) : null}
    </Form>
  );
};

export const AssessmentCountdown: React.FC<{ duration: number }> = ({
  duration,
}) => {
  const [countdownTime, setCountdownTime] = useState(duration);
  const countdownRef = useRef(null);
  const calcCountdownTime = useCallback(() => {
    return convertSecondsToHms(countdownTime);
  }, [countdownTime]);

  const calcDuration = useCallback(() => {
    return convertSecondsToHms(duration);
  }, [duration]);

  return (
    <>
      <CountdownCircle
        duration={20}
        setCountdownTime={setCountdownTime}
        countdownTime={countdownTime}
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
  assessment: LessonAssessmentType | CourseExamType | null;
}> = ({ assessment }) => {
  const [isLinkedResource] = useGetLinkedResourceKeys();

  if (!assessment && isLinkedResource) return <NotFound />;
  if (!isLinkedResource) {
    // assessmentID = +(params["assessment_id"] as string);
    assessment = courseDataDetailed[0].lessons[0]
      .assessment as LessonAssessmentType;
  }

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

      {!isLinkedResource ? (
        <div className={assessmentStyles.accessment_countdown_area}>
          <div className={assessmentStyles.countdown_area_left}>
            <p>{!isLinkedResource ? `Examination` : "Quiz"}</p>
          </div>
          <div className={assessmentStyles.countdown_area_right}>
            <AssessmentCountdown duration={100} />
          </div>
        </div>
      ) : null}

      <div className={assessmentStyles.accessment_description_area}>
        <p>
          {!isLinkedResource ? (
            <i>{(assessment as CourseExamType).description}</i>
          ) : (
            <i>
              This quiz tests your basic understanding of the current lesson
            </i>
          )}
        </p>
      </div>
      <AssessmentForm assessment={assessment as LessonAssessmentType} />
    </>
  );
};

export const CourseDetails: React.FC = () => {
  const res = useRouteLoaderData("routes/courses_.$course_id_.lessons") as {
    course: CourseDetailType;
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
