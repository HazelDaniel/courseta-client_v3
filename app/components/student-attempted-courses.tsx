import { CourseEntryType } from "~/types";
import { WideCourseCard } from "./wide-course-card";

import "~/styles/student-attempted-courses.css";
import { NoContent } from "./no-content";
import { useAsyncValue } from "@remix-run/react";
import { ServerPayloadType, StudentCourseViewType } from "~/server.types";
import { AxiosResponse } from "axios";

export const StudentAttemptedCourses: React.FC<{courses: StudentCourseViewType[]}> = ({courses}) => {
  return (
    <div className="student_profile_middle_area">
      <div className="profile_bottom_title_div">
        <h2>Recently Attempted Courses</h2>
        <button>view all courses</button>
      </div>
      <div className="attempted_courses_area">
        <ul>
          {courses.length ? (
            courses.map((entry, idx) => {
              return (
                <li key={idx}>
                  <WideCourseCard entry={entry} />
                </li>
              );
            })
          ) : (
            <NoContent
              text="No unfinished courses to display"
              variant="course_outline"
            />
          )}
        </ul>
      </div>
    </div>
  );
};
