import { useParams } from "@remix-run/react";
import { NotFound } from "~/components/not-found";
import { courseDataDetailed } from "~/data/course-list";
import type { CourseDetailType } from "~/types";
import { CourseBanner } from "./course-banner";
import { CourseInfo } from "./course-info";
import styles from "~/styles/course.css";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Course: React.FC = () => {
  const UrlParams = useParams();
  const courseID = UrlParams["course_id"];
  let course: CourseDetailType | null = null;
  if (courseID) {
    course = courseDataDetailed.filter((course) => course.id === +courseID)[0];
  }

  if (course) {
    return (
      <div className="course-styled">
        <CourseBanner course={course} />
        <CourseInfo course={course} />
      </div>
    );
  } else {
    return <NotFound />;
  }
};

export default Course;
