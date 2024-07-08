import { useCallback } from "react";
import { CourseAccordion } from "~/components/course-accordion";
import { CourseDetailType } from "~/types";
import { convertSecondsToHms } from "~/utils/conversion";
import { CourseStatInfo } from "./course-stat-info";

import styles from "~/styles/course-info.module.css";
// import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const CourseInfo: React.FC<{ course: CourseDetailType }> = ({
  course,
}) => {
  const courseDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(course.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [course.duration]);

  return (
    <section className={styles.course_info_styled}>
      <h2 className={styles.course_desc_title}>About this course</h2>
      <p className={styles.course_desc}>
        {course.description || "No description provided for this course"}
      </p>

      <div className={styles.course_info_area}>
        <div className={styles.area_left}>
          <ul className={styles.horizontal_file_tab}>
            <li>
              <a href="" className={styles.active}>
                <span>outline</span>
              </a>
            </li>
            <li>
              <Link to="">
                <span>Reviews (980)</span>
              </Link>
            </li>
            <li>
              <Link to={`/courses/${course.id}/exams/${course.exam ? course.exam.id : -1}`}>
                <span>Exam Link</span>
              </Link>
            </li>
          </ul>

          <div className={styles.course_outline_area}>
            <div className={styles.coa_top}>
              <div className={styles.coa_top_left}>
                <div>
                  <span>
                    <svg>
                      <use xlinkHref="#star-stroked"></use>
                    </svg>
                  </span>
                </div>
              </div>
              <div className={styles.coa_top_right}>
                <h2>Course Outline</h2>
                <div className={styles.course_outline_stat_div}>
                  <p>{course.lessonCount} lessons</p> <span></span>
                  <p>{courseDurationString()} Total length</p>
                </div>
              </div>
            </div>

            <div className={styles.coa_bottom}>
              <CourseAccordion variant="outline" course={course} />
            </div>
          </div>
        </div>
        <CourseStatInfo />
      </div>
    </section>
  );
};
