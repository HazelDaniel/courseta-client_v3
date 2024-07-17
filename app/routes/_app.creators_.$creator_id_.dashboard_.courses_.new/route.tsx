import { useOutletContext } from "@remix-run/react";
import { DashboardFormInput } from "~/components/dashboard-form-input";
import "~/styles/course-creation-page.css";
import {
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
  images: [{ url: "/images/computer-networks.jpg", ref: {} }],
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

export const CourseCreationPage: React.FC = () => {
  const contextData = useOutletContext() as { profile: CreatorProfileType };
  void contextData; // BUGFIX: undefined because this is not nested under the dashboard route. we should use this later for verification of the creator (client side)
  console.log("context data is : ", contextData);
  return (
    <>
      <div className="course_creation_area">
        <DashboardFormInput
          defaultData={{} as DefaultCourseFormDataType}
          data={courseTitleUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={{} as DefaultDashboardFormDataType}
          data={courseImageUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={ {} as DefaultFormDataType }
          data={courseDescriptionUpdateFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={ {} as DefaultCourseFormDataType }
          data={courseTagsUpdateFormData}
          asInput
        />
      </div>
      <div className="course_creation_cta_area">
        <button>cancel</button>
        <button className="primary">save changes</button>
      </div>
    </>
  );
};

export default CourseCreationPage;
