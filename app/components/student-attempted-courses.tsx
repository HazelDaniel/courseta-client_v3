import { CourseEntryType } from "~/types";
import { WideCourseCard } from "./wide-course-card";

import "~/styles/student-attempted-courses.css";

export const StudentAttemptedCourses: React.FC<{
  courses: CourseEntryType[];
}> = ({ courses }) => {
  return (
    <div className="student_profile_middle_area">
      <div className="profile_bottom_title_div">
        <h2>Recently Attempted Courses</h2>
        <button>view all courses</button>
      </div>{" "}
      <div className="attempted_courses_area">
        <ul>
          {courses.map((entry, idx) => {
            return (
              <li key={idx}>
                <WideCourseCard entry={entry} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
