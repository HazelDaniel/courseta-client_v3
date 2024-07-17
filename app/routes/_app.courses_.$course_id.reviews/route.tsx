import { LoaderFunction } from "@remix-run/node";
import { Form, json, useLoaderData, useOutletContext } from "@remix-run/react";
import { RatingForm } from "~/components/rating-form";
import { courseReviews } from "~/data/course-reviews";
import "~/styles/course-reviews.css";
import { CourseDetailType, CourseReviewType } from "~/types";

export const loader: LoaderFunction = () => {
  return json({ reviews: courseReviews });
};

export const CourseReviews: React.FC = () => {
  const outletCourse = useOutletContext() as CourseDetailType;
  const { reviews } = useLoaderData<typeof loader>() as {
    reviews: CourseReviewType[];
  };
  return (
    <div className="course_reviews_area">
      <div className="course_reviews_top">
        <ul>
          {reviews.map((reviewEntry, idx) => {
            return (
              <li className="review_entry">
                <img
                  src={reviewEntry.studentAvatarURL}
                  alt="the image url of a student making a review on a course"
                />
                <div className="review_entry_right">
                  <div className="entry_message_top">
                    <h2>{reviewEntry.studentEmail}</h2>
                    <span>
                      {new Date(reviewEntry.dateCreated).toDateString()}
                    </span>
                  </div>
                  <div className="entry_rating_area">
                    <div className="rating_container">
                      <RatingForm
                        variant="view"
                        value={reviewEntry.rating}
                        namespace={reviewEntry.studentEmail}
                      />
                    </div>
                  </div>
                  <p className="entry_message_body">{reviewEntry.reviewText}</p>
                </div>
              </li>
            );
          })}

          {/* <li className="review_entry">
            <img
              src="/illustrations/person-admin.png"
              alt="the image url of a student making a review on a course"
            />
            <div className="review_entry_right">
              <div className="entry_message_top">
                <h2>peterstokes20@gmail.com</h2>
                <span>10 mins ago</span>
              </div>
              <div className="entry_rating_area">
                <div className="rating_container">
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                </div>
              </div>
              <p className="entry_message_body">
                i just don't like this course. it's full of typos. can i get my
                refund back please?
              </p>
            </div>
          </li>
          <li className="review_entry">
            <img
              src="/illustrations/person-admin.png"
              alt="the image url of a student making a review on a course"
            />
            <div className="review_entry_right">
              <div className="entry_message_top">
                <h2>peterstokes20@gmail.com</h2>
                <span>10 mins ago</span>
              </div>
              <div className="entry_rating_area">
                <div className="rating_container">
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                </div>
              </div>
              <p className="entry_message_body">
                i just don't like this course. it's full of typos. can i get my
                refund back please?
              </p>
            </div>
          </li> */}
        </ul>
      </div>
      <RatingForm variant="edit" />
      <div className="course_review_create_area">
        <img
          src="/illustrations/avatar1.jpg"
          alt="image of a student creating a review on a course"
        />
        <Form action="./" method="post">
          <textarea
            name="review_text"
            id=""
            cols={30}
            rows={10}
            maxLength={250}
            placeholder="write your review..."
          ></textarea>
          <button type="submit">
            <svg>
              <use xlinkHref="#send"></use>
            </svg>
          </button>
        </Form>
      </div>
    </div>
  );
};

export default CourseReviews;
