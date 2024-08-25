import type { CourseEntryType } from "~/types";
import { SmallCourseCard } from "./small-course-card";
import { CourseFilter } from "../components/course-filter";
import { NoContent } from "./no-content";

import userCoursesStyles from "~/styles/user-courses.module.css";
import { CourseViewType } from "~/server.types";


export const UserCourses: React.FC<{
  isGeneric: boolean;
  courses: CourseViewType[];
}> = ({ isGeneric, courses }) => {
  return (
    <section className={userCoursesStyles.user_courses_styled}>
      <h2>{isGeneric ? "All Courses" : "My Courses"}</h2>
      <div className={userCoursesStyles.courses_bottom}>
        {/* <ClientOnly>
          {() => {
            return ( */}
              <ul className={userCoursesStyles.courses_list_container}>
                {courses.length ? (
                  courses.map((entry) => {
                    return (
                      <SmallCourseCard
                        entry={entry}
                        withCTA={isGeneric}
                        variant="others"
                        key={entry.courseID}
                      />
                    );
                  })
                ) : (
                  <NoContent text="No courses to show" variant="courses" />
                )}
              </ul>
            {/* );
          }}
        </ClientOnly> */}
      </div>
      <div
        className={`${userCoursesStyles.courses_top}${
          isGeneric ? ` ${userCoursesStyles.vacuumed}` : ""
        }`}
      >
        {isGeneric ? <CourseFilter /> : null}
      </div>

      <div className={userCoursesStyles.navigation_ctas}>
        <button>
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
          previous
        </button>

        <button className={userCoursesStyles.flipped}>
          next
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
        </button>
      </div>
    </section>
  );
};
