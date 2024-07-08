import { useLocation, useParams } from "@remix-run/react";

type Combinable =
  | [true, { lessonID: string; courseID: string }]
  | [false, null];

export const useGetLinkedResourceKeys = () => {
  const location = useLocation();
  const params = useParams();
  const courseIDKey = params["course_id"];
  const lessonIDKey = params["lesson_id"];

  if (location.pathname.startsWith("/courses") && courseIDKey && lessonIDKey) {
    return [
      true,
      {
        courseID: courseIDKey,
        lessonID: lessonIDKey,
      },
    ] as Combinable;
  }
  return [false, null] as Combinable;
};
