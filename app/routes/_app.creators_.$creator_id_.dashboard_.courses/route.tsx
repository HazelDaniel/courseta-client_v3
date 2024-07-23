import { LoaderFunction } from "@remix-run/node";
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { courseData } from "~/data/course-list";
import "~/styles/creators-courses.css";
import { CourseEntryType } from "~/types";

export const loader: LoaderFunction = () => {
  const courses: CourseEntryType[] = courseData;
  return json({ courses });
};

export const CreatorsCourses: React.FC = () => {
  const { courses: loadedCourses } = useLoaderData<typeof loader>() as {
    courses: CourseEntryType[];
  };
  const navigate = useNavigate();

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
              key={course.id}
            >
              <div className="entry_left">
                <div className="course_avatar">
                  <img
                    src={course.imageUrl}
                    alt="image of a course entry in a list of courses created by a course creator"
                  />
                  <p>{course.title}</p>
                </div>

                <p className="date_text">
                  {new Date(course.createdAt).toDateString()}
                </p>
                <p className="date_text">
                  {new Date(course.updatedAt).toDateString()}
                </p>
                <p className="tags">{course.tags.join(", ")}</p>
              </div>
              <div className="entry_right">
                <span
                  onMouseDown={() => {
                    if (course.archived)  return;
                    navigate(`./${course.id}/edit`);
                  }}
                  >
                  <svg>
                    <use xlinkHref="#edit"></use>
                  </svg>
                </span>
                <span className="archive_button">
                  <svg>
                    <use xlinkHref="#archive"></use>
                  </svg>
                </span>
                <span>
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
