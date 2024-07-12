import { useSearchParams } from "@remix-run/react";
import { Link } from "react-router-dom";
import { courseData } from "~/data/course-list";
import { rankData } from "~/data/user-rank";
import { CreatorProfileType, StudentProfileType } from "~/types";
import { CompletedRanks } from "./completed-ranks";
import { StudentAttemptedCourses } from "./student-attempted-courses";
import { DashboardEditArea } from "./dashboard-edit-area";

export const DashboardBody: React.FC<{
  profile: StudentProfileType | CreatorProfileType;
}> = ({ profile }) => {
  console.log("profile is ");
  console.log(profile);
  const { role, avatar, createdAt, email, firstName, lastName, id } =
    profile.user;
  const currentRank =
    role === "student" ? (profile as StudentProfileType).currentRank : -1;
  const [currentParams, setParams] = useSearchParams();
  return (
    <>
      {/* <div className={profileStyles.banner_styled}> */}
      <div className="banner_styled">
        <img
          src="/images/profile-header-bg.svg"
          alt="generic header image for the courseta platform"
        />
      </div>

      {/* <div className={profileStyles.profile_user_display_area}> */}
      <div className="profile_user_display_area">
        <div className="display_area_left">
          <div className="da_left_top">
            <img
              src={avatar.url}
              alt="the profile picture of the platform user"
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
                      />
                    </span>
                    {rankData[currentRank as number].title}
                  </div>
                ) : null}
              </li>
              <li>
                <p>{new Date(createdAt).toDateString()}</p>
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
              <h2>500k</h2> <p>students enrolled</p>
            </li>
            <li>
              <h2>150</h2> <p>courses</p>
            </li>
            <li>
              <h2>150</h2> <p>total reviews</p>
            </li>
            <li>
              <h2>4.5</h2> <p>average rating</p>
            </li>
          </ul>
        </div>
      ) : null}

      {role === "student" ? <CompletedRanks rankValue={currentRank} /> : null}
      {role === "student" ? (
        <StudentAttemptedCourses courses={courseData.slice(0, 3)} />
      ) : null}
      <DashboardEditArea profile={profile} />
    </>
  );
};
