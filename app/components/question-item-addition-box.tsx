import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useUpdateQuestionValue } from "~/hooks/use-update-question-value";
import { QuestionModalStateType } from "~/types";

export const QuestionItemAdditionBox: React.FC<{
  modalQuestion: QuestionModalStateType;
  setModalQuestion: React.Dispatch<
    React.SetStateAction<QuestionModalStateType>
  >;
}> = ({ modalQuestion, setModalQuestion }) => {
  const { dispatch } = useUpdateQuestionValue(
    modalQuestion,
    1000,
    setModalQuestion
  );
  const [questionText, setQuestionText] = useState<string>(
    modalQuestion.question.question || ""
  );
  const [questionPoints, setQuestionPoints] = useState<number>(
    modalQuestion.question.points || 0
  );

  useEffect(() => {
    setQuestionText(modalQuestion.question?.question || "");
    setQuestionPoints(modalQuestion.question?.points || 0);
  }, [modalQuestion]);

  return (
    <div className="content_addition_box question">
      <Form>
        <div className="input_wrapper">
          <label htmlFor={`question_text`}>question text</label>
          <input
            type="text"
            name={`question_text`}
            id={`question_text`}
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
              dispatch({
                ...modalQuestion,
                question: {
                  ...modalQuestion.question,
                  question: e.target.value,
                },
              });
            }}
          />
        </div>

        <div className="input_wrapper number">
          <label htmlFor={`question_points`}>question points</label>
          <input
            type="number"
            name={`question_points`}
            id={`question_points`}
            min={0}
            value={questionPoints}
            onChange={(e) => {
              setQuestionPoints(+e.target.value);
              dispatch({
                ...modalQuestion,
                question: {
                  ...modalQuestion.question,
                  points: +e.target.value,
                },
              });
            }}
          />
        </div>
      </Form>
    </div>
  );
};
