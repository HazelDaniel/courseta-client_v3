import { Form } from "@remix-run/react";
import "~/styles/lesson-item-addition-box.css";

export const LessonItemAdditionBox: React.FC<{
  lessonPositionID: number;
  itemType: "quiz" | "content";
}> = ({ lessonPositionID, itemType }) => {
  if (itemType === "quiz") {
    return (
      <li className="content_addition_box quiz">
        <Form>
          <div className="input_wrapper">
            <label htmlFor={`${lessonPositionID}.quiz_title`}>quiz title</label>
            <input
              type="text"
              name={`${lessonPositionID}.quiz_title`}
              id={`${lessonPositionID}.quiz_title`}
              defaultValue={"this is the input title"}
            />
          </div>
          <div className="input_wrapper">
            <label htmlFor={`${lessonPositionID}.quiz_description`}>
              quiz description
            </label>
            <input
              type="text"
              name={`${lessonPositionID}.quiz_description`}
              id={`${lessonPositionID}.quiz_description`}
              defaultValue={"this is the input url"}
            />
          </div>

          <div className="input_wrapper number">
            <label htmlFor={`${lessonPositionID}.quiz_pass_score`}>
              quiz pass score
            </label>
            <input
              type="number"
              name={`${lessonPositionID}.quiz_pass_score`}
              id={`${lessonPositionID}.quiz_pass_score`}
              min={0}
              max={100}
              defaultValue={0}
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
          <input
            type="text"
            name={`${lessonPositionID}.content_title`}
            id={`${lessonPositionID}.content_title`}
            defaultValue={"this is the input title"}
          />
        </div>
        <div className="input_wrapper">
          <label htmlFor={`${lessonPositionID}.content_href`}>
            content url
          </label>
          <input
            type="url"
            name={`${lessonPositionID}.content_href`}
            id={`${lessonPositionID}.content_href`}
            defaultValue={"this is the input url"}
          />
        </div>

        <div className="radio_options">
          <p>content type</p>
          <div className="input_wrapper radio">
            <div>
              <input
                type="radio"
                name={`${lessonPositionID}.content_type`}
                id={`${lessonPositionID}.content_type_text`}
                checked
              />
              <label htmlFor={`${lessonPositionID}.content_type_text`}>
                text
              </label>
            </div>

            <div>
              <input
                type="radio"
                name={`${lessonPositionID}.content_type`}
                id={`${lessonPositionID}.content_type_video`}
                checked
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
          <input
            type="number"
            name={`${lessonPositionID}.content_duration`}
            id={`${lessonPositionID}.content_duration`}
            defaultValue={0}
          />
        </div>
      </Form>
    </li>
  );
};
