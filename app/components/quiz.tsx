import { QuizAnswerType, QuestionType } from "~/types";

import styles from "~/styles/assessment.module.css";
import { useCallback, useState } from "react";
import { AssessmentVariantType } from "~/server.types";

export const QuizAnswerInput: React.FC<{
  value: QuestionType;
  assessmentID: string;
  onSelectHandler: (answerQuestion: {
    questionID: number;
    answerID: number;
  }) => void;
  onUnSelectHandler: (answerQuestion: {
    questionID: number;
    answerID: number;
  }) => void;
  opt: QuestionType["options"][number];
  type: "radio" | "check"
}> = ({ value, assessmentID, onSelectHandler, onUnSelectHandler, opt, type}) => {
  const [isChecked, setChecked] = useState(false);
  return (
    <input
      type="radio"
      name={`${value.id}:${value.id}`}
      id={`${assessmentID}:${value.id}:${opt.id}`}
      checked={isChecked}
      // defaultValue={`${assessmentID}-${value.id}-${opt.id}`}
      onChange={(e: React.FormEvent) => {
        setChecked((prevChecked) => (type === "radio" ? true : !isChecked));
        if ((e.currentTarget as HTMLInputElement).checked) {
          onSelectHandler({
            questionID: +value.id,
            answerID: +opt.id,
          });
        } else {
          onUnSelectHandler({
            questionID: +value.id,
            answerID: +opt.id,
          });
        }
      }}
    />
  );
};

export const Quiz: React.FC<{
  value: QuestionType;
  key_: number;
  assessmentID: string;
  variant: AssessmentVariantType;
  onSelectHandler: (answerQuestion: {
    questionID: number;
    answerID: number;
  }) => void;
  onUnSelectHandler: (answerQuestion: {
    questionID: number;
    answerID: number;
  }) => void;
}> = ({
  value,
  key_,
  assessmentID,
  variant,
  onSelectHandler,
  onUnSelectHandler,
}) => {
  return (
    <>
      <span>
        {key_}. {value.question}
      </span>

      <div className={styles.options_area}>
        {value.options.map((opt: QuizAnswerType, index) => {
          return (
            <div className={styles.option} key={index}>
              <QuizAnswerInput
                assessmentID={assessmentID}
                onSelectHandler={onSelectHandler}
                onUnSelectHandler={onUnSelectHandler}
                opt={opt}
                value={value}
                key={opt.id}
                type="radio"
              />

              <label htmlFor={`${assessmentID}:${value.id}:${opt.id}`}>
                {opt.text}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};
