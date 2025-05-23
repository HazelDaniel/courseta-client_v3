import {
  DashboardCustomInputType,
  DashboardEditActionIntentType,
  DefaultFormDataType,
} from "~/types";
import "~/styles/dashboard-form-input.css";
import { useFetcher, useSearchParams } from "@remix-run/react";

import { ImageReplaceButton } from "./image-replace-button";
import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FileUploadFormModal } from "./file-upload-form-modal";

export const InputGraphicWrapper: React.FC<{
  imageUrl: string;
  buttonText: string;
  willDisable: boolean;
  asInput?: boolean;
}> = ({ buttonText, imageUrl, willDisable, asInput }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <div className={`graphic_wrapper${asInput ? " vertical" : ""}`}>
      <img
        src={imageUrl}
        alt="image upload preview"
        className="image_upload_preview"
        ref={imageRef}
      />

      <ImageReplaceButton text={buttonText} willDisable={willDisable} />
    </div>
  );
};

export const GraphicInputForm: React.FC<{
  data: DashboardCustomInputType<string>;
  willDisable: boolean;
  asInput?: boolean;
  onChangeHandler?: (e: ChangeEvent<HTMLElement>) => void;
  onUploadHandler?: (state: [string, string]) => void;
}> = ({ data, willDisable, asInput, onChangeHandler, onUploadHandler }) => {
  const [action] = data.form.actions;
  const { variant } = data.form;
  const fetcher = useFetcher();

  const [imageState, setImageState] = useState<[string, string]>([
    data.images[0].url,
    "",
  ]);

  useEffect(() => {
    if (onUploadHandler) onUploadHandler(imageState);
  }, [imageState, onUploadHandler]);

  return (
    <>
      <fetcher.Form
        action={action}
        className={`graphic_input_form input_form ${variant}`}
      >
        <input
          type="text"
          name="uploaded_image_high"
          defaultValue={asInput ? imageState[0] : ""}
          tabIndex={-1}
          readOnly
          hidden
        />
        <input
          type="text"
          name="uploaded_image_low"
          value={asInput ? imageState[1] : ""}
          tabIndex={-1}
          readOnly
          hidden
        />

        {!asInput ? (
          <div className="input_form_top">
            <p>{data.heading}</p>
            <button
              className="input_button_primary"
              name="intent"
              value={data.form.intent}
              disabled={willDisable}
              onClick={(e) => {
                e.preventDefault();
                const resFormData = new FormData();
                resFormData.append("newAvatar", JSON.stringify(imageState));
                resFormData.append("oldAvatarID", JSON.stringify(data.images[0].id || ""));
                resFormData.append("intent", "UPDATE_AVATAR" as DashboardEditActionIntentType);
                fetcher.submit(resFormData, {method: "post", action, encType: "application/x-www-form-urlencoded"});
              }}
            >
              {data.buttons[0].text}
            </button>
          </div>
        ) : null}

        <div className="input_form_bottom">
          <InputGraphicWrapper
            imageUrl={imageState[0]}
            buttonText={data.buttons[1]?.text}
            willDisable={willDisable}
            asInput={asInput}
          />
        </div>
      </fetcher.Form>
      <FileUploadFormModal
        inputType={data.inputs[0]?.type}
        setImageState={setImageState}
        originalImage={data.images[0].url}
        onChangeHandler={onChangeHandler}
      />
    </>
  );
};

export const DashboardFormInput: React.FC<{
  data: DashboardCustomInputType<string>;
  defaultData: DefaultFormDataType;
  checkMode?: boolean;
  asInput?: boolean;
  onChangeHandler?: (e: ChangeEvent<HTMLElement>) => void;
  onUploadHandler?: (state: [string, string]) => void;
}> = React.memo(
  ({
    data,
    defaultData,
    checkMode = false,
    asInput,
    onChangeHandler,
    onUploadHandler,
  }) => {
    const [action] = data.form.actions;
    const { variant } = data.form;
    const [params] = useSearchParams();
    const mode = params.get("mode");
    if (data.images[0]) {
      data.images[0].url = defaultData[data.inputs[0].name] as string;
      data.images[0].id = defaultData.avatarID as string;

    }


    const willDisable = checkMode ? (mode === "edit" ? false : true) : false;
    const [e, setE] = useState<ChangeEvent<HTMLElement> | null>(null);
    const {Form, state} = useFetcher();

    useEffect(() => {
      const handler = setTimeout(() => {
        if (e && onChangeHandler) onChangeHandler(e);
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }, [e]);

    if (variant === "one-graphic-button") {
      return (
        <GraphicInputForm
          data={data}
          willDisable={willDisable || state === "submitting" || state === "loading"}
          asInput={asInput}
          onChangeHandler={onChangeHandler}
          onUploadHandler={onUploadHandler}
        />
      );
    }

    return (
      <Form action={action} method="post" className={`input_form ${variant}`}>
        <div className="input_form_top">
          {variant === "one-dual-button" || asInput ? null : (
            <>
              <p>{data.heading}</p>
              <button
                className="input_button_primary"
                name="intent"
                value={data.form.intent}
                disabled={willDisable || state === "submitting" || state === "loading"}
              >
                {data.buttons[0]?.text}
              </button>
            </>
          )}
        </div>
        <div className="input_form_bottom">
          {data.inputs.map(({ name, title, type }, idx) => {
            return (
              <div className={`input_wrapper ${name}`} key={idx}>
                <label htmlFor={`${data.namespace}.${name}`}>{title}</label>
                {type === "textarea" ? (
                  <textarea
                    id={`${data.namespace}.${name}`}
                    name={name as string}
                    disabled={willDisable || state === "submitting" || state === "loading"}
                    maxLength={200}
                    cols={20}
                    rows={10}
                    defaultValue={`${
                      name === "old_password" || name === "new_password"
                        ? ""
                        : defaultData[name] || ""
                    }`}
                    onChange={(e) => {
                      setE(e);
                    }}
                  />
                ) : (
                  <input
                    type={type}
                    id={`${data.namespace}.${name}`}
                    name={name as string}
                    disabled={willDisable || state === "submitting" || state === "loading"}
                    min={data.inputs[idx].min || 0}
                    max={data.inputs[idx].max || ""}
                    defaultValue={`${
                      name === "old_password" || name === "new_password"
                        ? ""
                        : defaultData[name] || ""
                    }`}
                    onChange={(e) => {
                      setE(e);
                    }}
                  />
                )}
              </div>
            );
          })}

          {variant === "one-dual-button" && !asInput ? (
            <div className="dual_buttons">
              <button
                className="input_button_secondary"
                name="intent"
                value={data.buttons[0].name || ""}
                disabled={willDisable || state === "submitting" || state === "loading"}
              >
                {data.buttons[0].text}
              </button>
              <button
                className="input_button_primary"
                name={"intent"}
                value={data.buttons[1].name || ""}
                disabled={willDisable || state === "submitting" || state === "loading"}
              >
                {data.buttons[1].text}
              </button>
            </div>
          ) : null}
        </div>
      </Form>
    );
  }
);
