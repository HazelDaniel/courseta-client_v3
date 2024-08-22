import { useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { CreatorProfileType, CreatorUserType, DashboardCustomInputType, DashboardEditActionIntentType, StudentProfileType, StudentUserType } from "~/types";
import { DashboardFormInput } from "./dashboard-form-input";

import "~/styles/dashboard-edit-area.css";

export const namesUpdateFormData: DashboardCustomInputType<DashboardEditActionIntentType> = {
  heading: "update names",
  namespace: "update_names",
  form: {
    intent: "UPDATE_NAMES",
    actions: ["?index"],
    variant: "two-uni-button",
  },
  inputs: [
    { name: "firstName", title: "first name", type: "text" },
    { name: "lastName", title: "last name", type: "text" },
  ],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const emailUpdateFormData: DashboardCustomInputType<DashboardEditActionIntentType> = {
  heading: "update email",
  namespace: "update_email",
  form: {
    intent: "UPDATE_EMAIL",
    actions: ["?index"],
    variant: "one-uni-button",
  },
  inputs: [{ name: "email", title: "email", type: "email" }],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const passWordUpdateFormData: DashboardCustomInputType<DashboardEditActionIntentType> = {
  heading: "update password",
  namespace: "update_password",
  form: {
    intent: "UPDATE_PASSWORD",
    actions: ["?index"],
    variant: "two-uni-button",
  },
  inputs: [
    { name: "oldPassword", title: "old password", type: "password" },
    { name: "newPassword", title: "new password", type: "password" },
  ],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const creatorPassUpdateFormData: DashboardCustomInputType<DashboardEditActionIntentType> = {
  heading: "update creator pass",
  namespace: "update_creator_pass",
  form: {
    intent: "REQUEST_NEW_PASS",
    actions: ["?index", "?index"],
    variant: "one-dual-button",
  },
  inputs: [{ name: "creatorPass", title: "creator pass", type: "password" }],
  buttons: [{ text: "request a new pass", name: "REQUEST_NEW_PASS" }, { text: "save changes" }],
  images: [],
};

export const avatarUpdateFormData: DashboardCustomInputType<DashboardEditActionIntentType> = {
  heading: "update avatar",
  namespace: "update_avatar",
  form: {
    intent: "UPDATE_AVATAR",
    actions: ["?index"],
    variant: "one-graphic-button",
  },
  inputs: [{ name: "newAvatar", title: "avatar", type: "file" }],
  buttons: [{ text: "save changes" }, { text: "replace image" }],
  images: [{ url: "/illustrations/avatar1.jpg", ref: {} }],
};

export const DashboardEditArea: React.FC<{
  profile: StudentUserType | CreatorUserType;
}> = ({ profile }) => {
  const [currentParams] = useSearchParams();
  const formInputParentRef = useRef<HTMLDivElement>(null);
  const { avatar, firstName, lastName, email, role } = profile;

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
        defaultData={{firstName, lastName}}
        checkMode
      />
      <DashboardFormInput
        data={avatarUpdateFormData}
        key={avatarUpdateFormData.namespace}
        defaultData={{ newAvatar: avatar, avatarID: profile.avatarMeta.id }}
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
            creatorPass: (profile as CreatorUserType).creatorPass,
          }}
          checkMode
        />
      ) : null}
    </div>
  );
};