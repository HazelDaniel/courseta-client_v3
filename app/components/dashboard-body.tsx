import {
  Await,
  useLoaderData,
  useSearchParams,
  useAsyncError,
} from "@remix-run/react";
import { Link } from "react-router-dom";
import { rankData } from "~/data/user-rank";
import {
  CreatorProfileType,
  CreatorUserType,
  StudentProfileType,
  StudentUserType,
} from "~/types";
import { CompletedRanks } from "./completed-ranks";
import { StudentAttemptedCourses } from "./student-attempted-courses";
import { DashboardEditArea } from "./dashboard-edit-area";
import { Suspense } from "react";
import { AxiosResponse } from "axios";
import { ServerPayloadType, StudentCourseViewType } from "~/server.types";
import { NoContent } from "./no-content";

const UnfinishedCourseErrorElement: React.FC = () => {
  const error = useAsyncError();
  return <h2>error occurred fetching your unfinished courses!</h2>;
};

export const DashboardBody: React.FC<{
  profile: StudentUserType | CreatorUserType;
}> = ({ profile }) => {
  const loadedStudentData = useLoaderData() as {
    unfinishedCourses: Promise<
      AxiosResponse<ServerPayloadType<StudentCourseViewType[]>, any>
    >;
  };

  const {
    role,
    avatar,
    createdAt,
    email,
    firstName,
    lastName,
    id,
    avatarMeta,
  } = profile;
  const currentRank =
    (role === "student"
      ? rankData.find((el) => el.title === (profile as StudentUserType).rank)
          ?.level || -1
      : -1) - 1;
  console.log("current rank is ", currentRank);
  console.log("loaded student data is ", loadedStudentData);
  const [currentParams, setParams] = useSearchParams();
  return (
    <>
      {/* <div className={profileStyles.banner_styled}> */}
      <div className="banner_styled">
        <img
          src="/images/profile-header-bg.svg"
          loading="lazy"
          alt="generic header image for the courseta platform"
        />
      </div>

      {/* <div className={profileStyles.profile_user_display_area}> */}
      <div className="profile_user_display_area">
        <div className="display_area_left">
          <div className="da_left_top">
            <img
              src={avatar || "/icons/user-icon.svg"}
              alt="the profile picture of the platform user"
              loading="lazy"
            />
            <p className="da_profile_name_area">
              {firstName} {lastName} <span>~{email}~</span>
            </p>
          </div>
          <div className="da_left_bottom">
            <ul>
              <li>
                <div className="user_type_badge">{role}</div>
                {role === "student" ? (
                  <div className="user_rank_badge_area">
                    <span className="user_rank_badge">
                      <img
                        src={rankData[currentRank].icon}
                        alt="image of a rank badge"
                        loading="lazy"
                      />
                    </span>
                    {rankData[currentRank as number].title}
                  </div>
                ) : null}
              </li>
              <li>
                <p>
                  {new Date(
                    (profile as CreatorUserType).createdAt
                  ).toDateString()}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="display_area_right">
          <Link
            to={""}
            onClick={(e) => {
              e.preventDefault();
              if (currentParams.get("mode") === "edit") return;
              const editParams = new URLSearchParams();
              editParams.set("mode", "edit");
              setParams(editParams);
            }}
          >
            Edit profile
          </Link>
        </div>
      </div>

      {(role as "student" | "creator") === "creator" ? (
        <div className="profile_user_stat_area">
          <ul className="profile_user_stats">
            <li>
              <h2>{(profile as CreatorUserType).studentCount}</h2>{" "}
              <p>students enrolled</p>
            </li>
            <li>
              <h2>{(profile as CreatorUserType).courseCount}</h2> <p>courses</p>
            </li>
            <li>
              <h2>{(profile as CreatorUserType).courseReviewCount}</h2>{" "}
              <p>total reviews</p>
            </li>
            <li>
              <h2>{(profile as CreatorUserType).averageCourseRating}</h2>{" "}
              <p>average rating</p>
            </li>
          </ul>
        </div>
      ) : null}

      {role === "student" ? <CompletedRanks rankValue={currentRank} /> : null}
      {role === "student" ? (
        <Suspense
          fallback={
            <NoContent
              text="No unfinished courses to display"
              variant="course_outline"
            />
          }
        >
          <Await
            resolve={(() => {
              return loadedStudentData.unfinishedCourses;
            })()}
            errorElement={<UnfinishedCourseErrorElement />}
          >
            {(res) => {
              console.log("data received is ", res);
              return (
                <StudentAttemptedCourses courses={res.data.payload || []} />
              );
            }}
          </Await>
        </Suspense>
      ) : null}
      <DashboardEditArea profile={profile} />
    </>
  );
};
