import { Link } from "@remix-run/react";
import { CourseViewType } from "~/server.types";
import smallCourseCardStyles from "~/styles/top-course-card.module.css";
import { CachableImage } from "./cachable-image";

export const TopCoursesCard: React.FC<{
  entry: Omit<CourseViewType, "lessonCount"> & {studentCount: number};
}> = ({ entry  }) => {
  return (
    <li
      className={`${smallCourseCardStyles.small_course_card_styled} ${smallCourseCardStyles.course_card_wrapper}`}
    >
      <div className={smallCourseCardStyles.course_card_small}>
        <div className={smallCourseCardStyles.top}>
          <CachableImage
            src={entry.avatar}
            alt="image representing a course card in a list of courses"
            metaData={entry.avatarMeta}
          />
          <Link to={`/courses/${entry.courseID}`}></Link>
        </div>
        <div className={smallCourseCardStyles.bottom}>
          <p className={smallCourseCardStyles.card_bottom_text}>
            {entry.title}
          </p>

          <div className={smallCourseCardStyles.course_info_cta_area}>
            <p>{entry.studentCount} students</p>
            {/** the students icon will go here */}
          </div>
        </div>
      </div>
    </li>
  );
};

