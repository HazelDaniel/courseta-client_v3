import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import {
  json,
  useFetcher,
  useLoaderData,
  useOutletContext,
  useRouteLoaderData,
} from "@remix-run/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { toast } from "sonner";
import { CachableImage } from "~/components/cachable-image";
import { NoContent } from "~/components/no-content";
import { RatingForm } from "~/components/rating-form";
import { v3Config } from "~/config/base";
import ImageCacheDAO from "~/dao/image-cache";
import { courseReviews } from "~/data/course-reviews";
import { serializeStudentReviewForm } from "~/serializers/review.serializer";
import { ServerPayloadType } from "~/server.types";
import "~/styles/course-reviews.css";
import {
  ActionResponseType,
  AuthUserType,
  CourseDetailType,
  CourseReviewType,
  LoaderResponseType,
  SessionUserType,
  StudentReviewActionType,
} from "~/types";

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { course_id: courseID } = params;
    const cookieHeader = request.headers.get("Cookie");
    const reviewsRequest: AxiosResponse<
      ServerPayloadType<CourseReviewType[]>,
      any
    > = await axios.get(`${v3Config.apiUrl}/courses/${courseID}/reviews`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (reviewsRequest.status !== 200) {
      if (reviewsRequest.status - 500 >= 0)
        throw json(
          {
            data: null,
            error: "an error occurred while fetching course reviews.",
          } as LoaderResponseType<null>,
          500
        );
      throw redirect("/auth?type=sign_in");
    }

    return json({
      reviews: reviewsRequest.data.payload,
      user: reviewsRequest.data.user,
    });
  } catch (err) {
    if (err instanceof Response) {
      throw err;
    }
    throw json(
      { error: (err as Error)?.message || "An unexpected error occurred" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
};

const UserReviewImage: React.FC = React.memo(
  () => {
    const {user} = useRouteLoaderData("root") as {user: AuthUserType};
    const [userImage, setUserImage] = useState<string | null>(null);

    useEffect(() => {
      if (user) {
        const fetchUserImage = async () => {
          try {
            const imageCache = ImageCacheDAO.instance;
            const resultImage = await imageCache.get(user.avatarMeta.id || "");
            if (!resultImage) return;
            setUserImage(resultImage.image_text);
          } catch (err) {
            return;
          }
        };
        fetchUserImage();
      }
    }, [user]);

    return (
        <img
          src={userImage || "/illustrations/avatar1.jpg"}
          alt="image of a student creating a review on a course"
          loading="lazy"
        />
    );
  }
);

const CourseReviewArea: React.FC = () => {
  const fetcher = useFetcher({ key: "student-review" });
  const { user } = useLoaderData<typeof loader>() as {
    user: SessionUserType | undefined;
  };
  const [rating, setRating] = useState(0);

  return (
    <>
      <RatingForm variant="edit" onChangeHandler={(x) => setRating(x)} />
      <div className="course_review_create_area">

        <UserReviewImage/>

        <fetcher.Form
          action="./"
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(
              new FormData(e.currentTarget as HTMLFormElement)
            );
            const reviewPayload = serializeStudentReviewForm(
              data as { review_text: string },
              rating,
              user?.id || ""
            );
            fetcher.submit(reviewPayload as any, {
              action: "./",
              method: "post",
              encType: "application/json",
            });
          }}
        >
          <textarea
            name={"review_text"}
            id=""
            cols={30}
            rows={10}
            maxLength={250}
            placeholder="write your review..."
          ></textarea>
          <button
            type="submit"
            onClick={(e) => {
              if (user && user.role === "creator") {
                e.preventDefault();
                toast.error(
                  "you are not allowed to review a course as a creator!"
                );
                return;
              }
              //  some pop-up message to tell them to enroll first if they have not already enrolled
              //  OR some pop-up message to tell them to authenticate first if they have not already authenticated
              console.log("submitting a review i see");
            }}
          >
            <svg>
              <use xlinkHref="#send"></use>
            </svg>
          </button>
        </fetcher.Form>
      </div>
    </>
  );
};

export const CourseReviews: React.FC = () => {
  const { reviews } = useLoaderData<typeof loader>() as {
    reviews: CourseReviewType[];
  };

  return (
    <div className="course_reviews_area">
      <div className="course_reviews_top">
        <ul>
          {reviews.length ? (
            reviews.map((reviewEntry, idx) => {
              return (
                <li className="review_entry" key={idx}>
                  <CachableImage
                    src={reviewEntry.avatar}
                    alt="the image url of a student making a review on a course"
                    metaData={reviewEntry.avatarMeta}
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
                    <p className="entry_message_body">
                      {reviewEntry.reviewText}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <NoContent
              text="no reviews for this course"
              variant="course_outline"
            />
          )}
        </ul>
      </div>
      <CourseReviewArea />
    </div>
  );
};

export default CourseReviews;

export const action: ActionFunction = async ({ request, params }) => {
  try {
    const reqJson = (await request.json()) as StudentReviewActionType;
    const { course_id: courseID } = params;
    const cookieHeader = request.headers.get("Cookie");
    let actionRequest: AxiosResponse<ServerPayloadType<void>, any>;
    let requestURL: string;
    switch (reqJson.intent) {
      case "REVIEW_COURSE": {
        requestURL = `${v3Config.apiUrl}/courses/${courseID}/reviews`;
        actionRequest = await axios.post(requestURL, reqJson.payload, {
          headers: {
            Cookie: cookieHeader,
          },
        });
        if (actionRequest.status !== 201) break;
        return jsonWithSuccess(null, "review posted!");
      }
    }

    if (actionRequest.status - 500 >= 0) {
      throw json({ error: "something went wrong" }, 500);
    } else {
      return jsonWithError(
        null,
        `couldn't proceed with action. REASON: ${actionRequest.data.message}`
      );
    }
    // return json({
    //   data: null,
    //   error: `couldn't proceed with action. REASON: ${actionRequest.data.message}`,
    // } as ActionResponseType<null>);
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error(err.response?.data.message);
      return jsonWithError(
        null,
        err.response?.data.message || "couldn't proceeed with action!"
      );
    }
    if (err instanceof Response) {
      if (err.status >= 300 && err.status < 400) throw err;
    }
    throw json(
      {
        error:
          err instanceof Error ? err.message : "could not proceed with action",
      },
      500
    );
  }
};

export const ErrorBoundary: React.FC = () => {
  return <h2>na here e take happen. no dey whine boss</h2>;
};
