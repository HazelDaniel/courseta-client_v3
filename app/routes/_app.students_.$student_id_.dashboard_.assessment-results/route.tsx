import styles from "~/styles/assessment-results.module.css";
import {
  AssessmentDataType,
  QuizResultType,
  ExamResultType,
  AssessmentReportType,
} from "~/types";

import { json, useLoaderData } from "@remix-run/react";
import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { assessmentData } from "~/data/assessments";
import { useMemo } from "react";
import axios, { AxiosResponse } from "axios";
import { v3Config } from "~/config/base";
import { ServerPayloadType } from "~/server.types";
import { NoContent } from "~/components/no-content";

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const { student_id: studentID } = params;

    const reportsRequest: AxiosResponse<
      ServerPayloadType<AssessmentReportType>,
      any
    > = await axios.get(`${v3Config.apiUrl}/students/${studentID}/reports`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return json({ report: reportsRequest.data.payload });
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

export const AssessmentCard: React.FC<{
  entry: QuizResultType | ExamResultType;
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
        {/* {!("examID" in entry) ? (
          <div className={styles.card_item}>
            <span className={styles.bullet}></span> <p>Exam ID</p>{" "}
            <span>{entry.examID}</span>
          </div>
        ) : ( */}
        <div className={styles.card_item}>
          <span className={styles.bullet}></span>
          <a href={`/courses/${entry.courseID}`}>course link</a>
        </div>

        {/* )} */}

        <div className={styles.card_item}>
          <span className={styles.bullet}></span> <p>date completed</p>{" "}
          <span>{new Date(entry.dateAttempted).toDateString() || "N/A"}</span>
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
  type: "exams" | "quizzes";
}> = ({ type }) => {
  const loaderData = useLoaderData() as { report: AssessmentReportType };
  const {
    report: { quizzes, exams },
  } = loaderData;
  const average = useMemo(() => {
    return {
      exams: Math.round(
        exams.reduce((acc, curr) => {
          acc += curr.percentScore;
          return acc;
        }, 0) / Math.max(exams.length, 1)
      ),
      quizzes: Math.round(
        quizzes.reduce((acc, curr) => {
          acc += curr.percentScore;
          return acc;
        }, 0) / Math.max(quizzes.length, 1)
      ),
    };
  }, [loaderData]);
  const data = type === "exams" ? exams : quizzes;
  return (
    <div
      className={`${styles.assessment_result_area_styled} ${styles.assessments_area}`}
    >
      <p className={styles.assessment_type_title}>{type}</p>

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
        {data.length ? (
          data.map((entry, idx) => {
            return <AssessmentCard entry={entry} key={idx} />;
          })
        ) : (
          <NoContent
            text="No reports for this assessment yet!"
            variant="course_outline"
          />
        )}
      </ul>
    </div>
  );
};

export const AssessmentResultPage: React.FC = () => {
  return (
    <div className={styles.assessment_result_styled}>
      <div className={styles.assessments_container}>
        <AssessmentListArea type="quizzes" />
        <AssessmentListArea type="exams" />
      </div>
    </div>
  );
};

export default AssessmentResultPage;
