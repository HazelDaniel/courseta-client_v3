import type { CourseEntryType } from "~/types";
import { SmallCourseCard } from "./small-course-card";
import { CourseFilter } from "../components/course-filter";
import { NoContent } from "./no-content";

import userCoursesStyles from "~/styles/user-courses.module.css";

export const UserCourses: React.FC<{
  isGeneric: boolean;
  courses: CourseEntryType[];
}> = ({ isGeneric, courses }) => {
  return (
    <section className={userCoursesStyles.user_courses_styled}>
      <div className={userCoursesStyles.courses_top}>
        <h2>{isGeneric ? "All Courses" : "My Courses"}</h2>
        {isGeneric ? <CourseFilter /> : null}
      </div>
      <div className={userCoursesStyles.courses_bottom}>
        <ul className={userCoursesStyles.courses_list_container}>
          {courses.length ? (
            courses.map((entry) => {
              return (
                <SmallCourseCard
                  entry={entry}
                  withCTA={isGeneric}
                  variant="others"
                  key={entry.id}
                />
              );
            })
          ) : (
            <NoContent text="No courses to show" variant="courses"/>
          )}
        </ul>

        {/* <div className="courses_pagination_area">
          <Pagination itemsPerPage={5} key={1}/>
        </div> */}
      </div>
    </section>
  );
};
