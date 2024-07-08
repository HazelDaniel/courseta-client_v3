import { useCallback } from "react";
import { CourseEntryType } from "~/types";
import { convertSecondsToHms } from "~/utils/conversion";

import styles from "~/styles/course-banner.module.css";
// import { LinksFunction } from "@remix-run/node";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const CourseBanner: React.FC<{ course: CourseEntryType }> = ({
  course,
}) => {
  const courseDurationString = useCallback(() => {
    const { hours, minutes, seconds } = convertSecondsToHms(course.duration);
    return `${hours}hr ${minutes}min ${seconds}s`;
  }, [course.duration]);

  return (
    <div className={styles.course_banner_styled}>
      <img
        src={course.imageUrl}
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
          <p>Beginners</p>
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
            4.2 {"\u0009"} {"\u0009"} (244)
          </p>
        </div>
      </div>
      <button className={styles.course_banner_cta}>enroll</button>
    </div>
  );
};
