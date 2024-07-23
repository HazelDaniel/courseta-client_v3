import { Form } from "@remix-run/react";
import { useState } from "react";
import { useUpdateLessonItemValue } from "~/hooks/use-update-content-value";
import "~/styles/lesson-item-addition-box.css";
import {
  LessonContentFormType,
  LessonContentType,
  QuizFormType,
} from "~/types";

const InputWithLessonUpdate: React.FC<{
  type: string;
  name: string;
  id: string;
  itemID: number;
  propKey: keyof QuizFormType | keyof LessonContentFormType;
  min?: number;
  max?: number;
  _default?: number | string;
  checked?: boolean;
}> = ({ id, name, type, checked, min, max, propKey, _default, itemID }) => {
  const contentTest = /^.+\.content.*$/gi.test(name);
  const quizTest = /^.+\.quiz.*$/gi.test(name);
  const { dispatch } = useUpdateLessonItemValue<
    Partial<QuizFormType> | Partial<LessonContentFormType>
  >({}, contentTest ? "content" : "quiz");

  const [isChecked, setChecked] = useState<boolean>(!!checked);
  const [numberValue, setNumberValue] = useState<number>(+(_default || 0));
  const [textValue, setTextValue] = useState<string>("");
  if (type === "number") {
    return (
      <input
        type={type}
        name={name}
        id={id}
        min={min || 0}
        max={max || 20000}
        value={numberValue}
        onChange={(e) => {
          dispatch({ [propKey]: +e.target.value, id: itemID });
          setNumberValue(+e.target.value);
        }}
      />
    );
  }
  if (type === "radio") {
    return (
      <input
        type={type}
        name={name}
        id={id}
        onChange={(e) => {
          const typePicked: LessonContentType["type"] = /^.+_video.*$/gi.test(
            id
          )
            ? "video"
            : "text";

          dispatch({ [propKey]: typePicked, id: itemID });
          setChecked((checked) => !checked);
        }}
      />
    );
  }
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={textValue}
      onChange={(e) => {
        dispatch({ [propKey]: e.target.value, id: itemID });
        setTextValue(e.target.value);
      }}
    />
  );
};

const LessonItemInput: React.FC<{
  type: string;
  name: string;
  id: string;
  propKey: keyof QuizFormType | keyof LessonContentFormType;
  min?: number;
  max?: number;
  _default?: number | string;
  checked?: boolean;
  withUpdate?: boolean;
  itemID?: number;
}> = ({
  id,
  name,
  type,
  checked,
  min,
  max,
  propKey,
  _default,
  withUpdate,
  itemID,
}) => {
  const [isChecked, setChecked] = useState<boolean>(!!checked);
  const [numberValue, setNumberValue] = useState<number>(+(_default || 0));
  const [textValue, setTextValue] = useState<string>("");

  if (withUpdate)
    return (
      <InputWithLessonUpdate
        type={type}
        name={name}
        id={id}
        propKey={propKey}
        _default={_default}
        max={max}
        min={min}
        checked={checked}
        itemID={itemID ?? -1}
      />
    );
  if (type === "number") {
    return (
      <input
        type={type}
        name={name}
        id={id}
        min={min || 0}
        max={max || 20000}
        value={numberValue}
        onChange={(e) => {
          setNumberValue(+e.target.value);
        }}
      />
    );
  }
  if (type === "radio") {
    return (
      <input
        type={type}
        name={name}
        id={id}
        onChange={(e) => {
          setChecked((checked) => !checked);
        }}
      />
    );
  }
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={textValue}
      onChange={(e) => {
        setTextValue(e.target.value);
      }}
    />
  );
};

export const LessonItemAdditionBox: React.FC<{
  lessonPositionID: number;
  itemType: "quiz" | "content";
  itemID?: number;
  withUpdate?: boolean;
}> = ({ lessonPositionID, itemType, withUpdate, itemID }) => {
  if (itemType === "quiz") {
    return (
      <li className="content_addition_box quiz">
        <Form>
          <div className="input_wrapper">
            <label htmlFor={`${lessonPositionID}.quiz_title`}>quiz title</label>
            <LessonItemInput
              type="text"
              name={`${lessonPositionID}.quiz_title`}
              id={`${lessonPositionID}.quiz_title`}
              propKey={"title"}
              withUpdate={withUpdate}
              itemID={itemID}
            />
          </div>
          <div className="input_wrapper">
            <label htmlFor={`${lessonPositionID}.quiz_description`}>
              quiz description
            </label>
            <LessonItemInput
              type="text"
              name={`${lessonPositionID}.quiz_description`}
              id={`${lessonPositionID}.quiz_description`}
              propKey={"description"}
              withUpdate={withUpdate}
              itemID={itemID}
            />
          </div>

          <div className="input_wrapper number">
            <label htmlFor={`${lessonPositionID}.quiz_pass_score`}>
              quiz pass score
            </label>
            <LessonItemInput
              type="number"
              name={`${lessonPositionID}.quiz_pass_score`}
              id={`${lessonPositionID}.quiz_pass_score`}
              min={0}
              max={100}
              _default={0}
              propKey={"passScore"}
              withUpdate={withUpdate}
              itemID={itemID}
            />
          </div>
        </Form>
      </li>
    );
  }

  return (
    <li className="content_addition_box">
      <Form>
        <div className="input_wrapper">
          <label htmlFor={`${lessonPositionID}.content_title`}>
            content title
          </label>
          <LessonItemInput
            type="text"
            name={`${lessonPositionID}.content_title`}
            id={`${lessonPositionID}.content_title`}
            propKey={"title"}
            withUpdate={withUpdate}
            itemID={itemID}
          />
        </div>
        <div className="input_wrapper">
          <label htmlFor={`${lessonPositionID}.content_href`}>
            content url
          </label>
          <LessonItemInput
            type="url"
            name={`${lessonPositionID}.content_href`}
            id={`${lessonPositionID}.content_href`}
            propKey={"href"}
            withUpdate={withUpdate}
            itemID={itemID}
          />
        </div>

        <div className="radio_options">
          <p>content type</p>
          <div className="input_wrapper radio">
            <div>
              <LessonItemInput
                type="radio"
                name={`${lessonPositionID}.content_type`}
                id={`${lessonPositionID}.content_type_text`}
                propKey={"type"}
                withUpdate={withUpdate}
                itemID={itemID}
              />
              <label htmlFor={`${lessonPositionID}.content_type_text`}>
                text
              </label>
            </div>

            <div>
              <LessonItemInput
                type="radio"
                name={`${lessonPositionID}.content_type`}
                id={`${lessonPositionID}.content_type_video`}
                propKey="type"
                withUpdate={withUpdate}
                itemID={itemID}
              />
              <label htmlFor={`${lessonPositionID}.content_type_video`}>
                video
              </label>
            </div>
          </div>
        </div>

        <div className="input_wrapper number">
          <label htmlFor={`${lessonPositionID}.content_duration`}>
            content duration (seconds)
          </label>
          <LessonItemInput
            type="number"
            name={`${lessonPositionID}.content_duration`}
            id={`${lessonPositionID}.content_duration`}
            _default={0}
            propKey="duration"
            withUpdate={withUpdate}
            itemID={itemID}
          />
        </div>
      </Form>
    </li>
  );
};
