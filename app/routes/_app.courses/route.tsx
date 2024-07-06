import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { UserCourses } from "~/components/user-courses";
import { courseData } from "~/data/course-list";
import { CourseEntryType } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Courseta | Courses" },
    {
      name: "description",
      content: "courses page for the Courseta edtech platform",
    },
  ];
};

export const loader: LoaderFunction = (args) => {
  try {
    const { request } = args;
    const searchParams = new URL(request.url).searchParams;
    const searchTerm: string | null = searchParams.get("search");

    if (searchTerm) {
      return json(
        courseData.filter((course) => {
          return course.title.includes(searchTerm);
        })
      );
    }
    return json(courseData);
  } catch (err) {
    console.log("we hit this error route", err);
    throw new Response("not found", { status: 404 });
  }
};

export const Courses: React.FC = () => {
  const courses = useLoaderData<typeof loader>() as CourseEntryType[];
  return <UserCourses courses={courses} isGeneric={true} />;
};

export default Courses;
