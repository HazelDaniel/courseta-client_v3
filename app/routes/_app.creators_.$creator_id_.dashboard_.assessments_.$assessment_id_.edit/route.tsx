import { QuestionAdditionModal } from "~/components/question-addition-modal";
import "~/styles/assessment-update.css";
export const AssessmentEditPage: React.FC = () => {
  return (
    <div className="assessment_edit_body">
      <h2 className="section_header">Assessment questions</h2>
      <div className="edit_area">
        <div className="assessment_edit_cta_area">
          <button>cancel</button>
          <button className="primary">save changes</button>
        </div>
        <div className="assessment_table_head">
          <div className="table_head_left">
            <h3>question</h3>
            <h3>points</h3>
          </div>
          <div className="table_head_right">
            <button>
              <span>
                <svg>
                  <use xlinkHref="#add"></use>
                </svg>
              </span>
              Add Question
            </button>
          </div>
        </div>
        <ul className="assessment_table_body">
          <li className={`assessment_table_entry current`}>
            <div className="entry_main">
              <div className="entry_left">
                <p className="date_text">
                  three of the following questions are wrong. your job would be
                  to answer at least two correctly. the first question is:
                </p>
                <p className="points_text">200</p>
              </div>
              <div className="entry_right">
                <span>
                  <svg>
                    <use xlinkHref="#trash"></use>
                  </svg>
                </span>

                <span>
                  <svg>
                    <use xlinkHref="#caret-up"></use>
                  </svg>
                </span>
              </div>
            </div>
            <div className="entry_detail">
              <p>Answers</p>
              <div className="answer_detail">
                <span>
                  <svg>
                    <use xlinkHref="#cancel"></use>
                  </svg>
                </span>
                the application is different and the execution is direct. there
                is no feasible way to determine if this was going to be
              </div>
              <div className="answer_detail">
                <span>
                  <svg>
                    <use xlinkHref="#check"></use>
                  </svg>
                </span>
                the application is different and the execution is direct. there
                is infact a feasible way
              </div>
            </div>
          </li>

          <li className={`assessment_table_entry`}>
            <div className="entry_main">
              <div className="entry_left">
                <p className="date_text">
                  three of the following questions are wrong. your job would be
                  to answer at least two correctly. the first question is:
                </p>
                <p className="points_text">200</p>
              </div>
              <div className="entry_right">
                <span>
                  <svg>
                    <use xlinkHref="#trash"></use>
                  </svg>
                </span>

                <span>
                  <svg>
                    <use xlinkHref="#caret-up"></use>
                  </svg>
                </span>
              </div>
            </div>
            <div className="entry_detail">
              <p>Answers</p>
              <div className="answer_detail">
                <span>
                  <svg>
                    <use xlinkHref="#cancel"></use>
                  </svg>
                </span>
                the application is different and the execution is direct. there
                is no feasible way to determine if this was going to be
              </div>
              <div className="answer_detail">
                <span>
                  <svg>
                    <use xlinkHref="#check"></use>
                  </svg>
                </span>
                the application is different and the execution is direct. there
                is infact a feasible way
              </div>
            </div>
          </li>
          <li className={`assessment_table_entry`}>
            <div className="entry_main">
              <div className="entry_left">
                <p className="date_text">
                  three of the following questions are wrong. your job would be
                  to answer at least two correctly. the first question is:
                </p>
                <p className="points_text">200</p>
              </div>
              <div className="entry_right">
                <span>
                  <svg>
                    <use xlinkHref="#trash"></use>
                  </svg>
                </span>

                <span>
                  <svg>
                    <use xlinkHref="#caret-up"></use>
                  </svg>
                </span>
              </div>
            </div>
            <div className="entry_detail">
              <p>Answers</p>
              <div className="answer_detail">
                <span>
                  <svg>
                    <use xlinkHref="#cancel"></use>
                  </svg>
                </span>
                the application is different and the execution is direct. there
                is no feasible way to determine if this was going to be
              </div>
              <div className="answer_detail">
                <span>
                  <svg>
                    <use xlinkHref="#check"></use>
                  </svg>
                </span>
                the application is different and the execution is direct. there
                is infact a feasible way
              </div>
            </div>
          </li>
        </ul>

        <QuestionAdditionModal />

        <div className="assessment_table_navigation">
          <button>
            <span>
              <svg>
                <use xlinkHref="#arrow-left"></use>
              </svg>
            </span>{" "}
            previous
          </button>

          <button className="flipped">
            next
            <span>
              <svg>
                <use xlinkHref="#arrow-left"></use>
              </svg>
            </span>{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentEditPage;
