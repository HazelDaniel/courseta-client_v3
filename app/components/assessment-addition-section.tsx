import {
  AssessmentEditStateType,
  DashboardCustomInputType,
  DefaultFormDataType,
  ExamCreationActionType,
  QuizCreationActionType,
} from "~/types";
import { DashboardFormInput } from "./dashboard-form-input";
import { useNavigate, useSubmit } from "@remix-run/react";
import "~/styles/assessment-addition.css";
import { ChangeEvent, useCallback, useState } from "react";
import { serializeQuizForCreateAction } from "~/serializers/quiz.serializer";
import { serializeExamForCreateAction } from "~/serializers/exam.serializer";

export const AssessmentTitleFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_title",
  form: {
    intent: "add_title",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [{ name: "title", title: "title", type: "text" }],
  buttons: [],
  images: [],
};

export const AssessmentPassScoreFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_pass_score",
  form: {
    intent: "add_pass_score",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    {
      name: "pass_score",
      title: "pass score",
      type: "number",
      min: 0,
      max: 100,
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentDurationFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_duration",
  form: {
    intent: "add_duration",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    {
      name: "duration",
      title: "duration (seconds)",
      type: "number",
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentStartDateFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_start_date",
  form: {
    intent: "add_start_date",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    {
      name: "start_date",
      title: "start date",
      type: "datetime-local",
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentEndDateFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_end_date",
  form: {
    intent: "add_end_date",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    {
      name: "end_date",
      title: "end date",
      type: "datetime-local",
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentDescriptionFormData: DashboardCustomInputType<string> = {
  heading: "",
  namespace: "add_description",
  form: {
    intent: "add_description",
    actions: ["/save"],
    variant: "none",
  },
  inputs: [
    {
      name: "description",
      title: "description",
      type: "textarea",
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentAdditionSection: React.FC<{
  variant: "exam" | "quiz";
}> = ({ variant }) => {
  const [assessmentEditState, setAssessmentEditState] =
    useState<AssessmentEditStateType>({});

  const AssessmentEditStateHandler = useCallback(
    (
      source: ChangeEvent,
      setFunction: React.Dispatch<
        React.SetStateAction<AssessmentEditStateType>
      >,
      keySelector: keyof AssessmentEditStateType,
      isNumeric?: boolean
    ) => {
      const target: HTMLInputElement = source.target as HTMLInputElement;
      setFunction((prevState) => {
        if (target.value === prevState[keySelector]) {
          return prevState;
        }
        return {
          ...prevState,
          [keySelector]: isNumeric ? +target.value : target.value || target,
        };
      });
    },
    []
  );
  const submit = useSubmit();
  const navigate = useNavigate();

  return (
    <section className="quiz_addition_area">
      <h2 className="section_header">Add {variant}</h2>
      <div className={`quiz_addition_body${` ${variant}`}`}>
        <DashboardFormInput
          defaultData={{} as DefaultFormDataType}
          data={AssessmentTitleFormData}
          asInput
          onChangeHandler={(e) => {
            AssessmentEditStateHandler(e, setAssessmentEditState, "title");
          }}
        />

        <DashboardFormInput
          defaultData={{} as DefaultFormDataType}
          data={AssessmentPassScoreFormData}
          asInput
          onChangeHandler={(e) => {
            AssessmentEditStateHandler(
              e,
              setAssessmentEditState,
              "passScore",
              true
            );
          }}
        />

        {variant === "exam" ? (
          <>
            <DashboardFormInput
              defaultData={{} as DefaultFormDataType}
              data={AssessmentDurationFormData}
              asInput
              onChangeHandler={(e) => {
                AssessmentEditStateHandler(
                  e,
                  setAssessmentEditState,
                  "duration",
                  true
                );
              }}
            />

            <DashboardFormInput
              defaultData={{} as DefaultFormDataType}
              data={AssessmentStartDateFormData}
              asInput
              onChangeHandler={(e) => {
                AssessmentEditStateHandler(
                  e,
                  setAssessmentEditState,
                  "startDate"
                );
              }}
            />
            <DashboardFormInput
              defaultData={{} as DefaultFormDataType}
              data={AssessmentEndDateFormData}
              asInput
              onChangeHandler={(e) => {
                AssessmentEditStateHandler(
                  e,
                  setAssessmentEditState,
                  "endDate"
                );
              }}
            />
          </>
        ) : null}

        <DashboardFormInput
          defaultData={{} as DefaultFormDataType}
          data={AssessmentDescriptionFormData}
          asInput
          onChangeHandler={(e) => {
            AssessmentEditStateHandler(
              e,
              setAssessmentEditState,
              "description"
            );
          }}
        />
      </div>

      <div className="assessment_creation_cta_area">
        <button
          onClick={() => {
            navigate("..", { replace: true, relative: "route" });
          }}
        >
          cancel
        </button>
        <button
          className="primary"
          onClick={() => {
            if (variant === "quiz") {
              const payload = serializeQuizForCreateAction(assessmentEditState);
              const submitPayload: QuizCreationActionType = {
                intent: "ADD_QUIZ",
                payload,
              };
              submit(submitPayload as any, {
                method: "post",
                action: "./",
                encType: "application/json",
                navigate: false,
              });
            } else {
              const payload = serializeExamForCreateAction(assessmentEditState);
              const submitPayload: ExamCreationActionType = {
                intent: "ADD_EXAM",
                payload,
              };
              submit(submitPayload as any, {
                method: "post",
                action: "./",
                encType: "application/json",
                navigate: false,
              });
            }
          }}
        >
          save changes
        </button>
      </div>
    </section>
  );
};
