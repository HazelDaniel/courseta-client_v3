import { useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { CreatorProfileType, DashboardCustomInputType, StudentProfileType } from "~/types";
import { DashboardFormInput } from "./dashboard-form-input";

import "~/styles/dashboard-edit-area.css";

export const namesUpdateFormData: DashboardCustomInputType = {
  heading: "update names",
  namespace: "update_names",
  form: {
    intent: "update_names",
    actions: ["/save"],
    variant: "two-uni-button",
  },
  inputs: [
    { name: "first_name", title: "first name", type: "text" },
    { name: "last_name", title: "last name", type: "text" },
  ],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const emailUpdateFormData: DashboardCustomInputType = {
  heading: "update email",
  namespace: "update_email",
  form: {
    intent: "update_email",
    actions: ["/save"],
    variant: "one-uni-button",
  },
  inputs: [{ name: "email", title: "email", type: "email" }],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const passWordUpdateFormData: DashboardCustomInputType = {
  heading: "update password",
  namespace: "update_password",
  form: {
    intent: "update_password",
    actions: ["/save"],
    variant: "two-uni-button",
  },
  inputs: [
    { name: "old_password", title: "old password", type: "password" },
    { name: "new_password", title: "new password", type: "password" },
  ],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const creatorPassUpdateFormData: DashboardCustomInputType = {
  heading: "update creator pass",
  namespace: "update_creator_pass",
  form: {
    intent: "submit",
    actions: ["/save", "/reset"],
    variant: "one-dual-button",
  },
  inputs: [{ name: "creator_pass", title: "creator pass", type: "password" }],
  buttons: [{ text: "request a new pass" }, { text: "save changes" }],
  images: [],
};

export const avatarUpdateFormData: DashboardCustomInputType = {
  heading: "update avatar",
  namespace: "update_avatar",
  form: {
    intent: "update_avatar",
    actions: ["/save"],
    variant: "one-graphic-button",
  },
  inputs: [{ name: "avatar", title: "avatar", type: "file" }],
  buttons: [{ text: "save changes" }, { text: "replace image" }],
  images: [{ url: "/illustrations/avatar1.jpg", ref: {} }],
};

export const DashboardEditArea: React.FC<{
  profile: StudentProfileType | CreatorProfileType;
}> = ({ profile }) => {
  const [currentParams] = useSearchParams();
  const formInputParentRef = useRef<HTMLDivElement>(null);
  const {
    user: { avatar, firstName, lastName, email, role },
  } = profile;

  useEffect(() => {
    if (currentParams.get("mode") === "edit") {
      formInputParentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [formInputParentRef, currentParams]);

  return (
    <div
      className="dashboard_form_input_area"
      id="edit-profile"
      ref={formInputParentRef}
    >
      <DashboardFormInput
        data={namesUpdateFormData}
        key={namesUpdateFormData.namespace}
        defaultData={{ first_name: firstName, last_name: lastName }}
        checkMode
      />
      <DashboardFormInput
        data={avatarUpdateFormData}
        key={avatarUpdateFormData.namespace}
        defaultData={{ avatar: avatar.url }}
        checkMode
      />
      <DashboardFormInput
        data={emailUpdateFormData}
        key={emailUpdateFormData.namespace}
        defaultData={{ email }}
        checkMode
      />
      <DashboardFormInput
        data={passWordUpdateFormData}
        key={passWordUpdateFormData.namespace}
        defaultData={{}}
        checkMode
      />
      {(role as "creator" | "student") === "creator" ? (
        <DashboardFormInput
          data={creatorPassUpdateFormData}
          key={creatorPassUpdateFormData.namespace}
          defaultData={{
            creator_pass: (profile as CreatorProfileType).user.creatorPass,
          }}
          checkMode
        />
      ) : null}
    </div>
  );
};