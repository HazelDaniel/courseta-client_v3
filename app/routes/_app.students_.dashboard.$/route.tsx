import { Link, redirect, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { LoaderFunction, json } from "react-router";
import { DashboardFormInput } from "~/components/dashboard-form-input";
import { WideCourseCard } from "~/components/wide-course-card";
import { courseData } from "~/data/course-list";
import { rankData } from "~/data/user-rank";
// import profileStyles from "~/styles/profile.module.css";

// import "~/styles/profile.module.css";
import "~/styles/profile.css";
import { DashboardCustomInputType } from "~/types";

export const dummyData1: DashboardCustomInputType = {
  heading: "update names",
  namespace: "update_names",
  form: {
    intent: "update_names",
    actions: ["/save"],
    variant: "two-uni-button",
  },
  inputs: [
    { name: "first_name", title: "first name", type: "text" },
    { name: "last_name", title: "last name", type: "text" },
  ],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const dummyData2: DashboardCustomInputType = {
  heading: "update email",
  namespace: "update_email",
  form: {
    intent: "update_email",
    actions: ["/save"],
    variant: "one-uni-button",
  },
  inputs: [{ name: "email", title: "email", type: "email" }],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const dummyData2b: DashboardCustomInputType = {
  heading: "update password",
  namespace: "update_password",
  form: {
    intent: "update_password",
    actions: ["/save"],
    variant: "two-uni-button",
  },
  inputs: [
    { name: "old_password", title: "old password", type: "password" },
    { name: "new_password", title: "new password", type: "password" },
  ],
  buttons: [{ text: "save changes" }],
  images: [],
};

export const dummyData3: DashboardCustomInputType = {
  heading: "update creator pass",
  namespace: "update_creator_pass",
  form: {
    intent: "submit",
    actions: ["/save", "/reset"],
    variant: "one-dual-button",
  },
  inputs: [{ name: "creator_pass", title: "creator pass", type: "password" }],
  buttons: [{ text: "request a new pass" }, { text: "save changes" }],
  images: [],
};

export const dummyData3b: DashboardCustomInputType = {
  heading: "update avatar",
  namespace: "update_avatar",
  form: {
    intent: "update_avatar",
    actions: ["/save"],
    variant: "one-graphic-button",
  },
  inputs: [{ name: "avatar", title: "avatar", type: "file" }],
  buttons: [{ text: "save changes" }, { text: "replace image" }],
  images: [{ url: "/illustrations/avatar1.jpg", ref: {} }],
};

export const DashboardEditArea: React.FC = () => {
  const [currentParams] = useSearchParams();
  const formInputParentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentParams.get("mode") === "edit") {
      formInputParentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [formInputParentRef, currentParams]);

  return (
    <div
      className="dashboard_form_input_area"
      id="edit-profile"
      ref={formInputParentRef}
    >
      <DashboardFormInput data={dummyData1} checkMode />
      <DashboardFormInput data={dummyData3b} checkMode />
      <DashboardFormInput data={dummyData2} checkMode />
      <DashboardFormInput data={dummyData2b} checkMode />
      <DashboardFormInput data={dummyData3} checkMode />
    </div>
  );
};

export const StudentAttemptedCourses: React.FC = () => {
  return (
    <div className="student_profile_middle_area">
      <div className="profile_bottom_title_div">
        <h2>Recently Attempted Courses</h2>
        <button>view all courses</button>
      </div>{" "}
      <div className="attempted_courses_area">
        <ul>
          {courseData.slice(0, 3).map((entry, idx) => {
            return (
              <li key={idx}>
                <WideCourseCard entry={entry} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export const CompletedRanks: React.FC<{
  rankValue: number;
}> = ({ rankValue }) => {
  return (
    <div className="completed_ranks_area">
      <h2>completed ranks</h2>
      <div className="completed_ranks_wrapper">
        <ul className="completed_ranks">
          {rankData.map((el, i) => {
            return (
              <li
                className={`${i <= rankValue ? "filled" : ""}${
                  i === rankValue ? " stop" : ""
                }`}
                key={el.title}
              >
                <div className="xp_badge">
                  {" "}
                  <p>
                    {el.xpRange.min} - {el.xpRange.max}
                  </p>{" "}
                </div>
                <div>
                  <span></span>
                </div>
                <img
                  className="rank_badge_icon"
                  src={rankData[i].icon}
                  alt="an icon representing a student level in the courseta platform"
                />
              </li>
            );
          })}
        </ul>
        <div className="completed_ranks_track"> </div>
      </div>
    </div>
  );
};

export const loader: LoaderFunction = ({ params }) => {
  const splat = params["*"];
  if (splat !== "profile") {
    if (splat === "") {
      throw redirect("/students/dashboard/profile", { status: 307 });
    }
    throw json({ error: "not found!" }, { status: 404 });
  }
  return json({});
};

export const Dashboard: React.FC = () => {
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
              src="/illustrations/avatar1.jpg"
              alt="the profile picture of the platform user"
            />
            <p className="da_profile_name_area">
              John Doe <span>~johndoe20@gmail.com~</span>
            </p>
          </div>
          <div className="da_left_bottom">
            <ul>
              <li>
                <div className="user_type_badge">student</div>
                <div className="user_rank_badge_area">
                  <span className="user_rank_badge">
                    <img
                      src="/icons/badge-l2.png"
                      alt="image of a rank badge"
                    />
                  </span>
                  senior
                </div>
              </li>
              <li>
                <p>20-04-2020</p>
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

      <div className="profile_user_stat_area" hidden>
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

      <CompletedRanks rankValue={2} />
      <StudentAttemptedCourses />
      <DashboardEditArea />
    </>
  );
};

export default Dashboard;
