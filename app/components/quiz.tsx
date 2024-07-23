import { QuizAnswerType, QuestionType } from "~/types";

import styles from "~/styles/assessment.module.css";

export const Quiz: React.FC<{
  value: QuestionType;
  key_: number;
  assessmentID: number;
}> = ({ value, key_, assessmentID }) => {
  return (
    <>
      <span>
        {key_}. {value.question}
      </span>

      <div className={styles.options_area}>
        {value.options.map((opt: QuizAnswerType, index) => {
          return (
            <div className={styles.option} key={index}>
              <input
                type="radio"
                name={`${assessmentID}-${value.id}`}
                id={`${assessmentID}-${value.id}-${opt.id}`}
                // defaultValue={`${assessmentID}-${value.id}-${opt.id}`}
                onChange={(e: React.FormEvent) => {
                  if ((e.currentTarget as HTMLInputElement).checked) {
                    console.log(e.currentTarget);
                  }
                }}
              />
              <label htmlFor={`${assessmentID}-${value.id}-${opt.id}`}>
                {opt.text}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};
