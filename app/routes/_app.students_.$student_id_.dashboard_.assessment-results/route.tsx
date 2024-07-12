import styles from "~/styles/assessment-results.module.css";
import {
  AssessmentDataType,
  CourseAssessmentType,
  ExamAssessmentType,
} from "~/types";

import { json, useLoaderData } from "@remix-run/react";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { assessmentData } from "~/data/assessments";

export const AssessmentCard: React.FC<{
  entry: CourseAssessmentType | ExamAssessmentType;
}> = ({ entry }) => {
  return (
    <div
      className={`${styles.assessment_result_item_styled} ${styles.course_assessment}`}
    >
      <span
        className={`${styles.assessment_badge} ${styles[entry.status]}`}
        title="assessment status"
      >
        {entry.status}
      </span>
      <div className={styles.assessment_card_items}>
        {!("examID" in entry) ? (
          <div className={styles.card_item}>
            <span className={styles.bullet}></span>
            <a href={`/courses/${entry.courseID}`}>course link</a>
          </div>
        ) : (
          <div className={styles.card_item}>
            <span className={styles.bullet}></span> <p>Exam ID</p>{" "}
            <span>{entry.examID}</span>
          </div>
        )}

        <div className={styles.card_item}>
          <span className={styles.bullet}></span> <p>date completed</p>{" "}
          <span>{entry.dateAttempted || "N/A"}</span>
        </div>
        <div className={styles.card_item}>
          <span className={styles.bullet}></span> <p>score</p>{" "}
          <span>{entry.percentScore}%</span>
        </div>
      </div>
    </div>
  );
};

const AssessmentListArea: React.FC<{
  data: AssessmentDataType;
  type: "exams" | "courses";
}> = ({ data, type }) => {
  const { average } = data;
  return (
    <div
      className={`${styles.assessment_result_area_styled} ${styles.assessments_area}`}
    >
      <p className={styles.assessment_type_title}>
        {type === "courses" ? "Quizzes" : "Exams"}
      </p>

      <div className={styles.average_score_area}>
        <h2>Average score</h2>
        <div className={styles.average_score_progress_area}>
          <div>
            <span className={styles.progress_parent}>
              <span
                className={styles.progress}
                style={{ width: `${average[type]}%` }}
              ></span>
            </span>
          </div>
          <p className={styles.average_score_count}>{average[type]}%</p>
        </div>
      </div>
      <ul className={styles.course_assessments_list}>
        {data[type].map((entry, idx) => {
          return <AssessmentCard entry={entry} key={idx} />;
        })}
      </ul>
    </div>
  );
};

export const loader: LoaderFunction = () => {
  try {
    return json({ data: assessmentData });
  } catch (err) {
    throw new Response("internal server error", { status: 500 });
  }
};

export const AssessmentResultPage: React.FC = () => {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div className={styles.assessment_result_styled}>
      <p className={styles.section_title}>All Assessments</p>
      <div className={styles.assessments_container}>
        <AssessmentListArea data={data} type="courses" />
        <AssessmentListArea data={data} type="exams" />
      </div>
    </div>
  );
};

export default AssessmentResultPage;
