import { LoaderFunction } from "@remix-run/node";
import { Link, json, useLoaderData, useOutletContext } from "@remix-run/react";
import { CourseContentIcon } from "~/components/course-accordion";
import { DashboardFormInput } from "~/components/dashboard-form-input";
import { courseData } from "~/data/course-list";
import "~/styles/course-creation-page.css";
import "~/styles/course-edit.css";

import {
  CourseEntryType,
  CreatorProfileType,
  DashboardCustomInputType,
  DefaultCourseFormDataType,
  DefaultDashboardFormDataType,
  DefaultFormDataType,
} from "~/types";

export const courseTitleUpdateFormData: DashboardCustomInputType = {
  heading: "",
  namespace: "update_title",
  form: {
    intent: "update_title",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [{ name: "title", title: "course title", type: "text" }],
  buttons: [],
  images: [],
};

export const courseDescriptionUpdateFormData: DashboardCustomInputType = {
  heading: "",
  namespace: "update_description",
  form: {
    intent: "update_description",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [{ name: "description", title: "description", type: "textarea" }],
  buttons: [],
  images: [],
};

export const courseImageUpdateFormData: DashboardCustomInputType = {
  heading: "update_image",
  namespace: "update_image",
  form: {
    intent: "update_image",
    actions: ["/save"],
    variant: "one-graphic-button",
  },
  inputs: [{ name: "avatar_url", title: "", type: "file" }],
  buttons: [{ text: "" }, { text: "replace image" }],
  images: [{ url: "", ref: {} }],
};

export const courseTagsUpdateFormData: DashboardCustomInputType = {
  heading: "",
  namespace: "update_tags",
  form: {
    intent: "update_tags",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    { name: "tags", title: "course tags (comma, separated)", type: "text" },
  ],
  buttons: [],
  images: [],
};

export const loader: LoaderFunction = ({ params }) => {
  const courseID = params["course_id"];
  return json({
    course: courseData.find((el) => el.id === +(courseID as string)),
  });
};

export const CourseEditPage: React.FC = () => {
  const contextData = useOutletContext() as { profile: CreatorProfileType };
  const { course: loadedCourse } = useLoaderData<typeof loader>() as {
    course: CourseEntryType;
  };
  void contextData; // BUGFIX: undefined because this is not nested under the dashboard route. we should use this later for verification of the creator (client side)
  return (
    <>
      <section className="course_creation_area">
        <DashboardFormInput
          defaultData={
            {
              title: loadedCourse.title,
            } as DefaultCourseFormDataType
          }
          data={courseTitleUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={
            {
              avatar_url: loadedCourse.imageUrl,
            } as DefaultCourseFormDataType
          }
          data={courseImageUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={
            {
              description: loadedCourse.description,
            } as DefaultCourseFormDataType
          }
          data={courseDescriptionUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={
            {
              tags: loadedCourse.tags.join(", "),
            } as DefaultCourseFormDataType
          }
          data={courseTagsUpdateFormData}
          asInput
        />
      </section>
      <div className="course_creation_cta_area">
        <button>cancel</button>
        <button className="primary">save changes</button>
      </div>

      <section className="course_interaction_area">
        <h2 className="section_header">course lessons</h2>
        <div className="interaction_accordion">
          <div className="accordion_section">
            <div className="accordion_head">
              <h3>
                Getting started in the middle of the conversation. how will the
                blockchain move forward if you{" "}
              </h3>
              <p>41 contents</p>
              <span className="course_item_add_cta">
                <svg>
                  <use xlinkHref="#add"></use>
                </svg>
              </span>
              <span>
                <svg>
                  <use xlinkHref="#caret-up"></use>
                </svg>
              </span>
            </div>
            <ul className="accordion_details">
              <li>
                <CourseContentIcon type="text" />
                <p>what is blockchain and how does it work?</p>
                <button>
                  <svg>
                    <use xlinkHref="#delete"></use>
                  </svg>
                </button>
              </li>
              <li>
                <CourseContentIcon type="text" />
                <p>what is blockchain and how does it work?</p>
                <button>
                  <svg>
                    <use xlinkHref="#delete"></use>
                  </svg>
                </button>
              </li>

              <li>
                <CourseContentIcon type="quiz" />
                <p>what is blockchain and how does it work?</p>

                <div className={`accordion_content_badge`}>
                  <p>20xp</p>
                  <svg
                    viewBox="0 0 12 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 14C0.367392 14 0.240215 13.9473 0.146447 13.8536C0.0526785 13.7598 0 13.6326 0 13.5V1.12906C3.57728e-05 0.998057 0.0343858 0.869347 0.0996304 0.755744C0.164875 0.642142 0.258738 0.547611 0.371875 0.481562C0.75 0.261875 1.51188 0 3 0C4.16281 0 5.46344 0.459688 6.61094 0.865C7.535 1.19156 8.40781 1.5 9 1.5C9.76233 1.49769 10.5166 1.34366 11.2188 1.04688C11.3043 1.01078 11.3974 0.996406 11.4898 1.00503C11.5822 1.01366 11.671 1.04502 11.7484 1.09632C11.8257 1.14762 11.8892 1.21726 11.9331 1.29904C11.977 1.38082 12 1.47218 12 1.565V8.42C11.9999 8.5415 11.9643 8.66033 11.8977 8.76196C11.8311 8.86358 11.7364 8.94359 11.625 8.99219C11.3528 9.11125 10.3591 9.5 9 9.5C8.24563 9.5 7.30062 9.27688 6.30031 9.04031C5.17594 8.77469 4.01344 8.5 3 8.5C1.84781 8.5 1.25813 8.67437 1 8.78469V13.5C1 13.6326 0.947321 13.7598 0.853553 13.8536C0.759785 13.9473 0.632608 14 0.5 14Z"
                      fill="#2D6B10"
                    />
                  </svg>
                </div>

                <Link to={""}>
                  edit quiz{" "}
                  <span>
                    <svg>
                      <use xlinkHref="#link"></use>
                    </svg>
                  </span>
                </Link>

                <button>
                  <svg>
                    <use xlinkHref="#delete"></use>
                  </svg>
                </button>
              </li>

            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseEditPage;
