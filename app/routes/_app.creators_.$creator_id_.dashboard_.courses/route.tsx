import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { jsonWithSuccess } from "remix-toast";
import { toast } from "sonner";
import { CachableImage } from "~/components/cachable-image";
import { v3Config } from "~/config/base";
import { courseData } from "~/data/course-list";
import { CreatorCourseViewType, ServerPayloadType } from "~/server.types";
import "~/styles/creators-courses.css";
import {
  ActionResponseType,
  CourseArchiveActionType,
  CourseDeletionActionType,
  CourseEntryType,
  CreatorCoursesActionType,
} from "~/types";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const userRequest = await axios.get(`${v3Config.apiUrl}/users/current`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    if (userRequest.status === 200) {
      type T = ServerPayloadType<CreatorCourseViewType[]>["user"];
      const responseUser: T = (
        userRequest.data as ServerPayloadType<CreatorCourseViewType[]>
      ).user;
      if (!responseUser) throw redirect("/auth?type=sign_in");
      const userCoursesRequest = await axios.get(
        `${v3Config.apiUrl}/creators/${responseUser.id}/courses`,
        {
          headers: {
            Cookie: cookieHeader,
          },
        }
      );
      if (userCoursesRequest.status !== 200) {
        if (userCoursesRequest.status - 500 >= 0)
          throw json(
            { error: "something went wrong while fetching your courses." },
            500
          );

        throw json(
          { error: "couldn't fetch courses!" },
          { status: userCoursesRequest.status }
        );
      }
      const courses: ServerPayloadType<CreatorCourseViewType[]>["payload"] = (
        userCoursesRequest.data as ServerPayloadType<CreatorCourseViewType[]>
      ).payload;
      return json({ courses: courses || [] });
    } else {
      throw json({ error: "couldn't fetch courses!" }, { status: 500 });
    }
  } catch (err) {
    throw json({ error: (err as Error).message || "" }, { status: 500 });
  }
};

export const CreatorsCourses: React.FC = () => {
  const { courses: loadedCourses } = useLoaderData<typeof loader>() as {
    courses: CreatorCourseViewType[];
  };
  const navigate = useNavigate();
  const submit = useSubmit();

  return (
    <section className="creator_courses_section">
      <h2 className="section_title">My courses</h2>
      <div className="course_table_head">
        <div className="table_head_left">
          <h3>title</h3>
          <h3>Date Created</h3>
          <h3>Date Updated</h3>
          <h3>Tags</h3>
        </div>
        <div className="table_head_right">
          <button
            onMouseDown={() => {
              navigate(`./new`);
            }}
          >
            <span>
              <svg>
                <use xlinkHref="#add"></use>
              </svg>
            </span>
            Add Course
          </button>
        </div>
      </div>
      <ul className="course_table_body">
        {/* has state */}
        {loadedCourses.map((course) => {
          return (
            <li
              className={`course_table_entry${
                course.archived ? ` archived` : ""
              }`}
              key={course.courseID}
            >
              <div className="entry_left">
                <div className="course_avatar">
                  <CachableImage
                    src={course.avatar}
                    alt="image of a course entry in a list of courses created by a course creator"
                    metaData={course.avatarMeta}
                  />
                  <p>{course.title}</p>
                </div>

                <p className="date_text">
                  {new Date(course.createdAt).toDateString()}
                </p>
                <p className="date_text">
                  {new Date(course.updatedAt).toDateString()}
                </p>
                <p className="tags">{course.tags.join(" ")}</p>
              </div>
              <div className="entry_right">
                <span
                  onMouseDown={() => {
                    navigate(`./${course.courseID}/edit`);
                  }}
                >
                  <svg>
                    <use xlinkHref="#edit"></use>
                  </svg>
                </span>
                <span
                  className="archive_button"
                  onClick={() => {
                    const payload: CourseArchiveActionType = {
                      payload: { courseID: course.courseID },
                      intent: !course.archived ? "ARCHIVE" : "UNARCHIVE",
                    };
                    submit(payload as any, {
                      method: "post",
                      action: "./",
                      encType: "application/json",
                      navigate: false,
                    });
                  }}
                >
                  <svg>
                    <use xlinkHref="#archive"></use>
                  </svg>
                </span>
                <span
                  onClick={() => {
                    const payload: CourseDeletionActionType = {
                      payload: { courseID: course.courseID },
                      intent: "DELETE",
                    };

                    if (course.studentCount > 0) {
                      if (course.archived) return;
                      toast.error("you cannot delete a course with students", {
                        className: "courses_edit_toast",
                        action: (
                          <button
                            onClick={() => {
                              ((payload as any).intent = "ARCHIVE"),
                                submit(payload as any, {
                                  method: "post",
                                  action: "./",
                                  encType: "application/json",
                                  navigate: false,
                                });
                              toast.dismiss();
                            }}
                          >
                            archive instead
                          </button>
                        ),
                      });
                      //TODO: this should display message: "you cannot delete a course with students enrolled in it. archive it instead!"
                      return;
                    }
                    submit(payload as any, {
                      method: "post",
                      action: "./",
                      encType: "application/json",
                      navigate: false,
                    });
                  }}
                >
                  <svg>
                    <use xlinkHref="#trash"></use>
                  </svg>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="course_table_navigation">
        <button>
          <span>
            <svg>
              <use xlinkHref="#arrow-left"></use>
            </svg>
          </span>{" "}
          previous
        </button>

        <button className="flipped">
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

export default CreatorsCourses;

export const action: ActionFunction = async ({ params, request }) => {
  try {
    const reqJson: CreatorCoursesActionType = await request.json();
    const { creator_id: creatorID } = params;
    const cookieHeader = request.headers.get("Cookie");
    let requestURL: string;
    let actionRequest: AxiosResponse<any, any>;

    switch (reqJson.intent) {
      case "DELETE": {
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${reqJson.payload.courseID}`;
        actionRequest = await axios.delete(requestURL, {
          headers: {
            Cookie: cookieHeader,
          },
        });

        if (actionRequest.status !== 204) break;
        return json({
          data: { message: actionRequest.data.message || "course deleted!" },
        } as ActionResponseType<{ message: string }>);
      }
      case "ARCHIVE": {
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${reqJson.payload.courseID}/archive`;
        actionRequest = await axios.post(requestURL, null, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 204) break;
        return json({
          data: { message: actionRequest.data.message || "course archived!" },
        } as ActionResponseType<{ message: string }>);
      }
      case "UNARCHIVE": {
        requestURL = `${v3Config.apiUrl}/creators/${creatorID}/courses/${reqJson.payload.courseID}/unarchive`;
        actionRequest = await axios.post(requestURL, null, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 200) break;
        return jsonWithSuccess(
          null,
          "course unarchived successfully and ready for the world!"
        );
      }
    }
    if (actionRequest.status - 500 >= 0)
      throw json({ error: "something went wrong" }, 500);
    else
      return json({
        data: null,
        error: `couldn't proceed with action. REASON: ${actionRequest.data.message}`,
      } as ActionResponseType<null>);
  } catch (err) {
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};
