import { DashboardCustomInputType, DefaultFormDataType } from "~/types";
import { DashboardFormInput } from "./dashboard-form-input";
import { useNavigate } from "@remix-run/react";
import "~/styles/assessment-addition.css";

export const AssessmentTitleFormData: DashboardCustomInputType = {
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

export const AssessmentPassScoreFormData: DashboardCustomInputType = {
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

export const AssessmentDurationFormData: DashboardCustomInputType = {
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

export const AssessmentStartDateFormData: DashboardCustomInputType = {
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
      type: "date",
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentEndDateFormData: DashboardCustomInputType = {
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
      type: "date",
    },
  ],
  buttons: [],
  images: [],
};

export const AssessmentDescriptionFormData: DashboardCustomInputType = {
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
  const navigate = useNavigate();
  return (
    <section className="quiz_addition_area">
      <h2 className="section_header">Add quiz</h2>
      <div className={`quiz_addition_body${` ${variant}`}`}>
        <DashboardFormInput
          defaultData={{} as DefaultFormDataType}
          data={AssessmentTitleFormData}
          asInput
        />

        <DashboardFormInput
          defaultData={{} as DefaultFormDataType}
          data={AssessmentPassScoreFormData}
          asInput
        />

        {variant === "exam" ? (
          <>
            <DashboardFormInput
              defaultData={{} as DefaultFormDataType}
              data={AssessmentDurationFormData}
              asInput
            />

            <DashboardFormInput
              defaultData={{} as DefaultFormDataType}
              data={AssessmentStartDateFormData}
              asInput
            />
            <DashboardFormInput
              defaultData={{} as DefaultFormDataType}
              data={AssessmentEndDateFormData}
              asInput
            />
          </>
        ) : null}

        <DashboardFormInput
          defaultData={{} as DefaultFormDataType}
          data={AssessmentDescriptionFormData}
          asInput
        />
      </div>

      <div className="assessment_creation_cta_area">
        <button>cancel</button>
        <button
          className="primary"
          onClick={() => navigate("/creators/0/dashboard/assessments/0/edit")}
        >
          save changes
        </button>
      </div>
    </section>
  );
};
