import { DashboardCustomInputType } from "~/types";
import "~/styles/dashboard-form-input.css";
import { Form } from "@remix-run/react";

export const DashboardFormInput: React.FC<{
  data: DashboardCustomInputType;
}> = ({ data }) => {
  const [action] = data.form.actions;
  const { variant } = data.form;

  return (
    <Form action={action} className={`input_form ${variant}`}>
      <div className="input_form_top">
        {variant === "one-dual-button" ? null : (
          <>
            <p>{data.heading}</p>
            <button
              className="input_button_primary"
              name="intent"
              value={data.form.intent}
            >
              {data.buttons[0].text}
            </button>
          </>
        )}
      </div>
      <div className="input_form_bottom">
        {data.inputs.map(({ name, title, type }) => {
          return (
            <div className="input_wrapper">
              <label htmlFor={`${data.namespace}.${name}`}>{title}</label>
              <input
                type={type}
                id={`${data.namespace}.${name}`}
                name={`${data.namespace}.${name}`}
              />
            </div>
          );
        })}

        {variant === "one-dual-button" ? (
          <div className="dual_buttons">
            <button className="input_button_secondary">
              {data.buttons[0].text}
            </button>
            <button className="input_button_primary">
              {data.buttons[1].text}
            </button>
          </div>
        ) : null}
      </div>
    </Form>
  );
};
