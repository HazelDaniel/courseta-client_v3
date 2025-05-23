import { useLocation, useParams } from "@remix-run/react";
import { GenericAssessmentType } from "~/types";
import {
  AssessmentCountdown,
  AssessmentForm,
  BackToCourseCTA,
} from "./course-details";
import { courseDataDetailed } from "~/data/course-list";
import { StatusErrorElement } from "./not-found";
import { useGetLinkedResourceKeys } from "~/hooks/use-get-linked-resource-keys";

export const AssessmentBody: React.FC<{
  assessment: GenericAssessmentType | null;
}> = ({ assessment }) => {
  const [isLinkedResource] = useGetLinkedResourceKeys();

  if (!assessment && isLinkedResource) return <StatusErrorElement />;
  if (!isLinkedResource) {
    // assessmentID = +(params["assessment_id"] as string);
    assessment = courseDataDetailed[0].lessons[0]
      .assessment as GenericAssessmentType;
  }

  return (
    <>
      <div className="accessment_cta_area">
        <button className="accessment_cta">
          <span>
            <svg>
              <use xlinkHref="#share"></use>
            </svg>
          </span>
          share
        </button>

        {isLinkedResource ? <BackToCourseCTA /> : null}
      </div>

      {!isLinkedResource ? (
        <div className="accessment_countdown_area">
          <div className="countdown_area_left">
            <p>{!isLinkedResource ? `Examination` : "Quiz"}</p>
          </div>
          <div className="countdown_area_right">
            <AssessmentCountdown duration={100} />
          </div>
        </div>
      ) : null}

      <div className="accessment_description_area">
        <p>
          {!isLinkedResource ? (
            <i>This exam tests your foundation in the previous courses taken</i>
          ) : (
            <i>
              {assessment?.description ||
                "This quiz tests your basic understanding of the current lesson"}
            </i>
          )}
        </p>
      </div>
      <AssessmentForm variant={isLinkedResource ? "quiz" : "exam"} />
    </>
  );
};
