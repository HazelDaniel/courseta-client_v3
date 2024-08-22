import { StudentReviewActionType, StudentReviewPayloadType } from "~/types";

export const serializeStudentReviewForm: (
  reviewState: { review_text: string },
  rating: number,
  studentID: string
) => StudentReviewActionType = (reviewState, rating, studentID) => {
  const { review_text: reviewText } = reviewState;
  return {
    intent: "REVIEW_COURSE",
    payload: {
      rating,
      reviewText,
      studentID: studentID,
    }
  } as StudentReviewActionType;
};
