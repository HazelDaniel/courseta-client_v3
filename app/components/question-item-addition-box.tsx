import { Form } from "@remix-run/react"

export const QuestionItemAdditionBox: React.FC = () => {
  return (
    <div className="content_addition_box question">
      <Form>
        <div className="input_wrapper">
          <label htmlFor={`question_text`}>
            question text
          </label>
          <input
            type="text"
            name={`question_text`}
            id={`question_text`}
            defaultValue={"this is the question text"}
          />
        </div>

        <div className="input_wrapper number">
          <label htmlFor={`question_points`}>
            question points
          </label>
          <input
            type="number"
            name={`question_points`}
            id={`question_points`}
            min={0}
            defaultValue={0}
          />
        </div>
      </Form>
    </div>
  )
}
