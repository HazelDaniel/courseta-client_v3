import { ActionFunction, json, redirect } from "@remix-run/node";
import { useNavigate, useOutletContext, useSubmit } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import React, {
  ChangeEvent,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from "react";
import { ContextButtonHOC } from "~/components/context-button";
import { DashboardFormInput } from "~/components/dashboard-form-input";
import { v3Config } from "~/config/base";
import { ModalProvider } from "~/contexts/modal.context";
import { InitialModalState, ModalReducer } from "~/reducers/modal.reducer";
import { serializeCourseCreationState } from "~/serializers/course.serializer";
import { ServerPayloadType } from "~/server.types";
import "~/styles/course-creation-page.css";
import {
  ActionResponseType,
  CourseCreationPayloadType,
  CourseEditStateType,
  DashboardCustomInputType,
  DefaultCourseFormDataType,
  DefaultDashboardFormDataType,
  DefaultFormDataType,
} from "~/types";

export const courseTitleUpdateFormData: DashboardCustomInputType<string> = {
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

export const courseDescriptionUpdateFormData: DashboardCustomInputType<string> =
  {
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

export const courseImageUpdateFormData: DashboardCustomInputType<string> = {
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

export const courseTagsUpdateFormData: DashboardCustomInputType<string> = {
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

const CourseCreationButton: React.FC<{courseCreationState: Partial<CourseEditStateType>; uploadImageState: [string | null, string | null]}> = ({courseCreationState, uploadImageState}) => {
  const submit = useSubmit();
  const resCourseCreationPayload = serializeCourseCreationState(
    courseCreationState,
    uploadImageState
  );
  const MutationButtonContent = (ContextButtonHOC(() => <> save changes</>
)({classes: ["primary"], onClick: () => {


    submit(resCourseCreationPayload, {
      method: "post",
      encType: "application/json",
      action: "./",
      navigate: false,
    })
}
}));
  return MutationButtonContent;
}

export const CourseCreationArea: React.FC = React.memo(() => {
  const emptyDefault = useMemo(() => ({}), []);
  const [courseCreationState, setCourseCreationState] = useState<
    Partial<CourseEditStateType>
  >({});

  const [uploadImageState, setUploadImageState] = useState<
    [string | null, string | null]
  >([null, null]);

  const navigate = useNavigate();

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
        <button
          onClick={() => navigate("../", { relative: "path", replace: true })}
        >
          cancel
        </button>

        <CourseCreationButton courseCreationState={courseCreationState} uploadImageState={uploadImageState}/>
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
  try {
    const { creator_id: creatorID } = params;
    const reqJson: CourseCreationPayloadType = await request.json();
    const cookieHeader = request.headers.get("Cookie");
    let creationRequestURL: string = `${v3Config.apiUrl}/creators/${creatorID}/courses`;
    const creationRequest: AxiosResponse<
      ServerPayloadType<number>,
      any
    > = await axios.post(creationRequestURL, reqJson, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (creationRequest.status !== 201) {
      if (creationRequest.status - 500 >= 0)
        throw json(
          { error: "something went wrong while creating the course" },
          500
        );
      return json({
        data: null,
        error: `could not create your course.`,
      } as ActionResponseType<null>);
    }
    throw redirect(
      `/creators/${creatorID}/dashboard/courses/${creationRequest.data.payload}/edit`
    );
  } catch (err) {
    if (err instanceof Response && err.status >= 300 && err.status < 400)
      throw err;
    throw json(
      { error: err instanceof Error ? err.message : "could not create course" },
      500
    );
  }
};
