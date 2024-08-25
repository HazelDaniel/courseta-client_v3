import { useCallback } from "react";
import { CourseEntryType } from "~/types";
import { convertSecondsToHms } from "~/utils/conversion";

import styles from "~/styles/course-banner.module.css";
import { CourseDetailViewType } from "~/server.types";
// import { LinksFunction } from "@remix-run/node";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const CourseBanner: React.FC<{ course: CourseDetailViewType }> = ({
  course,
}) => {
  const courseDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(course.courseLength);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [course.courseLength]);

  return (
    <div className={styles.course_banner_styled}>
      <img
        src={course.avatar}
        alt="the course banner image"
        className={styles.banner_image}
      />
      <h3 className={styles.course_creator_name_text}>Courseta Edtech's</h3>
      <h2 className={styles.course_banner_title}>{course.title}</h2>
      <div className={styles.course_banner_stat_div}>
        <div className={styles.stat_part}>
          <span>
            <svg>
              <use xlinkHref="#levels"></use>
            </svg>
          </span>
          <p>All Levels</p>
        </div>

        <div className={styles.stat_part}>
          <span>
            <svg>
              <use xlinkHref="#clock"></use>
            </svg>
          </span>
          <p>{courseDurationString()}</p>
        </div>

        <div className={styles.stat_part}>
          <span>
            <svg>
              <use xlinkHref="#star-filled"></use>
            </svg>
          </span>
          <p>
            {course.averageRating} {"\u0009"} {"\u0009"} ({course.reviewCount})
          </p>
        </div>
      </div>
      <span className={styles.course_banner_cta}>{course.isEnrolled ? "enrolled" : "not enrolled"}</span>
    </div>
  );
};
