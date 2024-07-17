import { useCallback, useRef } from "react";
import { CourseAccordion } from "~/components/course-accordion";
import { CourseDetailType } from "~/types";
import { convertSecondsToHms } from "~/utils/conversion";
import { CourseStatInfo } from "./course-stat-info";

import styles from "~/styles/course-info.module.css";
import { Link, Outlet, useLocation } from "@remix-run/react";

export const CourseInfo: React.FC<{ course: CourseDetailType }> = ({
  course,
}) => {
  const courseDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(course.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [course.duration]);

  const { pathname } = useLocation();

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
              <Link
                to=""
                className={
                  /^\/courses\/\d+(\/)?$/gi.test(pathname)
                    ? `${styles.active}`
                    : ""
                }
              >
                <span>Outline</span>
              </Link>
            </li>
            <li>
              <Link
                to="./reviews"
                className={
                  /^\/courses\/\d+\/reviews(\/)?$/gi.test(pathname)
                    ? `${styles.active}`
                    : ""
                }
              >
                <span>Reviews (980)</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/courses/${course.id}/exams/${
                  course.exam ? course.exam.id : -1
                }`}
              >
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
                <h2>
                  {/^\/courses\/\d+(\/)?$/gi.test(pathname)
                    ? "Course Outline"
                    : "Course Reviews"}
                </h2>
                {/^\/courses\/\d+(\/)?$/gi.test(pathname) ? (
                  <div className={styles.course_outline_stat_div}>
                    <p>{course.lessonCount} lessons</p> <span></span>
                    <p>{courseDurationString()} Total length</p>
                  </div>
                ) : null}
                {/^\/courses\/\d+\/reviews(\/)?$/gi.test(pathname) ? (
                  <div className={styles.reviews_pagination_area}>
                    <p>1 of 30</p>
                    <div className={styles.reviews_pagination}>
                      <button disabled>
                        <svg>
                          <use xlinkHref="#arrow-left"></use>
                        </svg>
                      </button>

                      <button>
                        <svg>
                          <use xlinkHref="#arrow-left"></use>
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={styles.coa_bottom}>
              <Outlet context={course} />
            </div>
          </div>
        </div>
        <CourseStatInfo />
      </div>
    </section>
  );
};
