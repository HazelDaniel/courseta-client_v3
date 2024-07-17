import { useOutletContext } from "@remix-run/react";
import { CourseAccordion } from "~/components/course-accordion";
import { CourseDetailType } from "~/types";

export const CourseIndex: React.FC = () => {
  const outletCourse = useOutletContext() as CourseDetailType;
  return <CourseAccordion variant="outline" course={outletCourse} />;
};

export default CourseIndex;
