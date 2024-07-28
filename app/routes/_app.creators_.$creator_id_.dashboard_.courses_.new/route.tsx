import { ActionFunction } from "@remix-run/node";
import { useOutletContext, useSubmit } from "@remix-run/react";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from "react";
import { DashboardFormInput } from "~/components/dashboard-form-input";
import { ModalProvider } from "~/contexts/modal.context";
import { InitialModalState, ModalReducer } from "~/reducers/modal.reducer";
import { serializeCourseCreationState } from "~/serializers/course.serializer";
import "~/styles/course-creation-page.css";
import {
  CourseCreationPayloadType,
  CourseEditStateType,
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
    actions: [""],
    variant: "none",
  },
  inputs: [
    { name: "tags", title: "course tags (space separated)", type: "text" },
  ],
  buttons: [],
  images: [],
};

export const CourseCreationArea: React.FC = React.memo(() => {
  const emptyDefault = useMemo(() => ({}), []);
  const [courseCreationState, setCourseCreationState] = useState<
    Partial<CourseEditStateType>
  >({});

  const [uploadImageState, setUploadImageState] = useState<
    [string | null, string | null]
  >([null, null]);

  const submit = useSubmit();

  const courseCreationStateHandler = useCallback(
    (
      source: ChangeEvent,
      setFunction: React.Dispatch<
        React.SetStateAction<typeof courseCreationState>
      >,
      keySelector: keyof typeof courseCreationState
    ) => {
      const target: HTMLInputElement = source.target as HTMLInputElement;
      setFunction((prevState) => {
        if (target.value === prevState[keySelector]) {
          return prevState;
        }
        return {
          ...prevState,
          [keySelector]: target.value || target,
        };
      });
    },
    []
  );

  return (
    <>
      <div className="course_creation_area">
        <DashboardFormInput
          defaultData={emptyDefault as DefaultCourseFormDataType}
          data={courseTitleUpdateFormData}
          asInput
          onChangeHandler={(e) => {
            courseCreationStateHandler(e, setCourseCreationState, "title");
          }}
        />

        <DashboardFormInput
          defaultData={emptyDefault as DefaultDashboardFormDataType}
          data={courseImageUpdateFormData}
          asInput
          onUploadHandler={(state) => {
            setUploadImageState(state);
          }}
        />

        <DashboardFormInput
          defaultData={emptyDefault as DefaultFormDataType}
          data={courseDescriptionUpdateFormData}
          asInput
          onChangeHandler={(e) => {
            courseCreationStateHandler(
              e,
              setCourseCreationState,
              "description"
            );
          }}
        />

        <DashboardFormInput
          defaultData={emptyDefault as DefaultCourseFormDataType}
          data={courseTagsUpdateFormData}
          asInput
          onChangeHandler={(e) => {
            courseCreationStateHandler(e, setCourseCreationState, "tags");
          }}
        />
      </div>

      <div className="course_creation_cta_area">
        <button>cancel</button>
        <button
          className="primary"
          onClick={() => {
            const resCourseCreationPayload = serializeCourseCreationState(
              courseCreationState,
              uploadImageState
            );

            submit(resCourseCreationPayload, {
              method: "post",
              encType: "application/json",
              action: "./",
            });
          }}
        >
          save changes
        </button>
      </div>
    </>
  );
});

export const CourseCreationPage: React.FC = () => {
  const [modalState, modalDispatch] = useReducer(
    ModalReducer,
    InitialModalState
  );

  const modalContextValue = useMemo(
    () => ({ modalState, modalDispatch }),
    [modalState, modalDispatch]
  );
  return (
    <ModalProvider value={modalContextValue}>
      <CourseCreationArea />
    </ModalProvider>
  );
};

export default CourseCreationPage;

export const action: ActionFunction = async ({ params, request }) => {
  const reqJson = await request.json();
  console.log("hitting the action for the course creation route");
  console.log("request form data is : ", reqJson);
  return {};
};
