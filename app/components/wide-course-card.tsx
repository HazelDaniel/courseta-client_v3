import { CSSProperties } from "react";
import type { CourseEntryType } from "~/types";
import { Link } from "react-router-dom";

import styles from "~/styles/wide-course-card.module.css";

export const WideCourseCard: React.FC<{
  entry: CourseEntryType;
}> = ({ entry }) => {
  return (
    <div className={`${styles.wide_course_card_styled} ${styles.course_card}`}>
      <div className={styles.card_left}>
        <img
          src={entry.imageUrl}
          alt="a thumbnail image of a course on an edtech platform"
        />
        <Link to={`/courses/${entry.id}`}></Link>
      </div>
      <div className={styles.card_right}>
        <h3>{entry.lessonCount} lessons</h3>
        <p className={styles.card_title}>{entry.title}</p>
        <div className={styles.card_progress_area}>
          <div className={styles.card_progress_bar}>
            <span
              className={styles.card_progress}
              style={
                { "--progress-here": `${entry.progress}%` } as CSSProperties
              }
            ></span>
          </div>
          <span className={styles.card_progress_count}>
            {Math.round(entry.progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};
