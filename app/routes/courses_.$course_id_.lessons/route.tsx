import { LoaderFunction, json, redirect } from "@remix-run/node";
import App from "../_app/route";
import { courseDataDetailed } from "~/data/course-list";
import axios, { AxiosResponse } from "axios";
import { CourseDetailViewType, ServerPayloadType } from "~/server.types";
import { v3Config } from "~/config/base";
import { CourseLessonType2, LoaderResponseType } from "~/types";

export const loader: LoaderFunction = () => {
  return {};
};

export const LessonPage: React.FC = () => {
  return <App variant="no-side-tab" />;
};

export default LessonPage;
