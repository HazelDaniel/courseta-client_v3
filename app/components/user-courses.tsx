import type { CourseEntryType } from "~/types";
import { SmallCourseCard } from "./small-course-card";
import { CourseFilter } from "../components/course-filter";
import { NoContent } from "./no-content";

import { LinksFunction } from "@remix-run/node";
import userCoursesStyles from "~/styles/user-courses.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: userCoursesStyles }];
};

export const UserCourses: React.FC<{
  isGeneric: boolean;
  courses: CourseEntryType[];
}> = ({ isGeneric, courses }) => {
  return (
    <section className="user-courses-styled">
      <div className="courses-top">
        <h2>{isGeneric ? "All Courses" : "My Courses"}</h2>
        {isGeneric ? <CourseFilter /> : null}
      </div>
      <div className="courses-bottom">
        <ul className="courses-list-container">
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
            <NoContent text="No courses to show" />
          )}
        </ul>

        {/* <div className="courses-pagination-area">
          <Pagination itemsPerPage={5} key={1}/>
        </div> */}
      </div>
    </section>
  );
};
