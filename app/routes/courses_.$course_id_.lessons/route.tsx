import { LoaderFunction, json } from "@remix-run/node";
import App from "../_app/route";
import { courseDataDetailed } from "~/data/course-list";

export const loader: LoaderFunction = ({ params }) => {
  const courseID = params["course_id"];

  const course = courseDataDetailed.filter(
    (course) => course.id === +(courseID as string)
  )[0];


  return json({ course });
};

export const LessonPage: React.FC = () => {
  return <App variant="no-side-tab" />;
};

export default LessonPage;
