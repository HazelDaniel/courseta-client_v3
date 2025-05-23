import { useNavigate, useRouteLoaderData, useSubmit } from "@remix-run/react";
import { CachableImage } from "~/components/cachable-image";
import { ContextButtonHOC } from "~/components/context-button";
import { CourseDetailViewType, SessionUserType } from "~/server.types";
import styles from "~/styles/course-stat-info.module.css";
import {
  CourseCreatorViewType,
  StudentEnrollActionType,
  StudentEnrollPayloadType,
} from "~/types";
// import { LinksFunction } from "@remix-run/node";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

const CourseReviewButton: React.FC = () => {
  const navigate = useNavigate();
  const MutationButtonContent = (ContextButtonHOC(() => <> Review Course </>
)({classes: [styles.course_cta, styles.secondary], onClick: () => {
    navigate("./reviews", { state: { focusReviewBox: true } });
  }
}));
  return MutationButtonContent;
}

const CourseEnrollButton: React.FC = () => {
  const navigate = useNavigate();
  const loadedResult = useRouteLoaderData(
    "routes/_app.courses_.$course_id"
  ) as {
    creator: CourseCreatorViewType;
    course: CourseDetailViewType;
    user: SessionUserType;
  };
  const { course, user } = loadedResult;
  const submit = useSubmit();

  const MutationButtonContent = (ContextButtonHOC(() => <> 
    {course.isEnrolled ? "Unenroll" : "Enroll Now"}
  </>
)({classes: [styles.course_cta], onClick: () => {
    if (!user) {
      navigate("/auth?type=sign_in");
      return;
    }
    if (user.role === "creator") return;
    const payload = {
      studentID: user.id,
    } as StudentEnrollPayloadType;
    const resPayload = {
      intent: !course.isEnrolled ? "ENROLL": "UNENROLL",
      payload,
    } as StudentEnrollActionType;

    submit(resPayload as any, {
      action: "./?index",
      method: "POST",
      encType: "application/json",
      navigate: false,
    });
  }
}));
  return MutationButtonContent;
}

export const CourseStatInfo: React.FC = () => {
  const loadedResult = useRouteLoaderData(
    "routes/_app.courses_.$course_id"
  ) as {
    creator: CourseCreatorViewType;
    course: CourseDetailViewType;
    user: SessionUserType;
  };
  const { creator, course } = loadedResult;
  return (
    <aside className={styles.course_stat_info_styled}>
      <div className={styles.course_stat_info_area}>
        <div className={styles.course_stat_info}>
          <div className={styles.stat_info_top}>
            <ul className={styles.stat_info_list}>
              <li>
                <p>Last update</p>
                <span>{new Date(course.updatedAt).toLocaleDateString()}</span>
              </li>

              <li>
                <p>Members Enrolled</p>
                <span>{course.studentCount}</span>
              </li>
              <li>
                <p>Duration</p>
                <span>{course.courseLength}s</span>
              </li>
            </ul>
            <div className={styles.stat_info_share_area}>
              <button>
                <span>
                  <svg
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 20C14.1667 20 13.4583 19.7083 12.875 19.125C12.2917 18.5417 12 17.8333 12 17C12 16.8833 12.0083 16.7623 12.025 16.637C12.0417 16.5117 12.0667 16.3993 12.1 16.3L5.05 12.2C4.76667 12.45 4.45 12.646 4.1 12.788C3.75 12.93 3.38333 13.0007 3 13C2.16667 13 1.45833 12.7083 0.875 12.125C0.291667 11.5417 0 10.8333 0 10C0 9.16667 0.291667 8.45833 0.875 7.875C1.45833 7.29167 2.16667 7 3 7C3.38333 7 3.75 7.071 4.1 7.213C4.45 7.355 4.76667 7.55067 5.05 7.8L12.1 3.7C12.0667 3.6 12.0417 3.48767 12.025 3.363C12.0083 3.23833 12 3.11733 12 3C12 2.16667 12.2917 1.45833 12.875 0.875C13.4583 0.291667 14.1667 0 15 0C15.8333 0 16.5417 0.291667 17.125 0.875C17.7083 1.45833 18 2.16667 18 3C18 3.83333 17.7083 4.54167 17.125 5.125C16.5417 5.70833 15.8333 6 15 6C14.6167 6 14.25 5.92933 13.9 5.788C13.55 5.64667 13.2333 5.45067 12.95 5.2L5.9 9.3C5.93333 9.4 5.95833 9.51267 5.975 9.638C5.99167 9.76333 6 9.884 6 10C6 10.116 5.99167 10.237 5.975 10.363C5.95833 10.489 5.93333 10.6013 5.9 10.7L12.95 14.8C13.2333 14.55 13.55 14.3543 13.9 14.213C14.25 14.0717 14.6167 14.0007 15 14C15.8333 14 16.5417 14.2917 17.125 14.875C17.7083 15.4583 18 16.1667 18 17C18 17.8333 17.7083 18.5417 17.125 19.125C16.5417 19.7083 15.8333 20 15 20ZM15 4C15.2833 4 15.521 3.90433 15.713 3.713C15.905 3.52167 16.0007 3.284 16 3C15.9993 2.716 15.9033 2.47867 15.712 2.288C15.5207 2.09733 15.2833 2.00133 15 2C14.7167 1.99867 14.4793 2.09467 14.288 2.288C14.0967 2.48133 14.0007 2.71867 14 3C13.9993 3.28133 14.0953 3.519 14.288 3.713C14.4807 3.907 14.718 4.00267 15 4ZM3 11C3.28333 11 3.521 10.904 3.713 10.712C3.905 10.52 4.00067 10.2827 4 10C3.99933 9.71733 3.90333 9.48 3.712 9.288C3.52067 9.096 3.28333 9 3 9C2.71667 9 2.47933 9.096 2.288 9.288C2.09667 9.48 2.00067 9.71733 2 10C1.99933 10.2827 2.09533 10.5203 2.288 10.713C2.48067 10.9057 2.718 11.0013 3 11ZM15 18C15.2833 18 15.521 17.904 15.713 17.712C15.905 17.52 16.0007 17.2827 16 17C15.9993 16.7173 15.9033 16.48 15.712 16.288C15.5207 16.096 15.2833 16 15 16C14.7167 16 14.4793 16.096 14.288 16.288C14.0967 16.48 14.0007 16.7173 14 17C13.9993 17.2827 14.0953 17.5203 14.288 17.713C14.4807 17.9057 14.718 18.0013 15 18Z"
                      fill="#CAC8C8"
                    />
                  </svg>
                </span>
                Share Course
              </button>
            </div>
          </div>
          <div className={styles.stat_info_bottom}></div>
        </div>
        <div className={styles.course_cta_area}>
          <CourseEnrollButton/>


          <CourseReviewButton/>

        </div>
      </div>

      <div className={styles.creator_stat_info_area}>
        <div className={styles.creator_stat_info}>
          <div className={styles.top}>
            <span className={styles.creator_icon_wrapper}>
              <svg>
                <use xlinkHref="#profile"></use>
              </svg>
            </span>
            <p>Creator</p>
          </div>
          <div className={styles.middle}>
            <div className={styles.creator_name_title_area}>
              <h2 className={styles.creator_name}>
                {creator.firstName} {creator.lastName}
              </h2>
              <p className={styles.creator_title}> Courseta edtech platform</p>
            </div>
            <div className={styles.creator_avatar_area}>
              <CachableImage
                src={creator.avatar}
                alt="avatar image of a course creator on the courseta platform"
                metaData={creator.avatarMeta}
              />
            </div>
          </div>
          <div className={styles.bottom}>
            <p>{creator.courseCount} courses</p>
            <span></span>
            <p>{creator.studentCount} enrolled</p>
          </div>
        </div>
        <div className={styles.author_stat_ratings_area}>
          <div className={styles.ratings_area_left}>
            <p>creator ratings</p>
            <span>
              <svg>
                <use xlinkHref="#info"></use>
              </svg>
            </span>
          </div>
          <div className={styles.ratings_area_right}>
            <span>
              <svg>
                <use xlinkHref="#star-filled"></use>
              </svg>
            </span>

            <p>
              {creator.averageCourseRating} ({creator.courseReviewCount}{" "}
              Ratings)
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
