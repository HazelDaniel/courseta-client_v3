import { courseData } from "~/data/course-list";
import { AuthType, CourseListType, UserType } from "~/types";
import { AnnouncementTab } from "~/components/announcement-tab";
import { WideCourseCard } from "~/components/wide-course-card";
import { SmallCourseCard } from "~/components/small-course-card";
import axios from "axios";
import { BASE_URL } from "~/config/base";
import React, { useEffect } from "react";
import {
  Await,
  useAsyncValue,
  useNavigate,
  useRouteLoaderData,
} from "@remix-run/react";

import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/app-main.css";
import wideCourseCardStyles from "~/styles/wide-course-card.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, { rel: "stylesheet", href: wideCourseCardStyles }];
};

const WelcomeBoard: React.FC<{ user: UserType }> = ({ user }) => {
  return (
    <div className="welcome-board-styled">
      <div className="wp-left">
        <span>welcome,</span>
        <h2>{user?.name}</h2>
      </div>
      <div className="wp-right">
        <img
          src="/illustrations/community-learning.png"
          alt="community learning illustration"
        />
      </div>
    </div>
  );
};

const CurrentCourseSection: React.FC = () => {
  const courses = useAsyncValue();
  const navigate = useNavigate();
  console.log("courses are : ", courses);

  return (
    <section className="current-course-section-styled">
      <div className="ccs-top">
        <p className="home-section-title">Recent Unfinished</p>
        <button
          className="home-section-cta"
          onClick={() => {
            navigate(`/courses/${courseData[1].id}`);
          }}
        >
          Continue Course
        </button>
      </div>
      <div className="ccs-bottom">
        <WideCourseCard entry={courseData[1]} />
      </div>
    </section>
  );
};

const RecommendedCourseSection: React.FC<{ courses: CourseListType }> = ({
  courses,
}) => {
  return (
    <section className="recommended-course-section-styled">
      <div className="rcs-top">
        <p className="home-section-title">Recommended Courses</p>
      </div>
      <div className="rcs-bottom">
        <ul className="list-course-cards">
          {courses.slice(0, 4).map((entry) => {
            return (
              <SmallCourseCard
                entry={entry}
                withCTA={true}
                variant="home"
                key={entry.id}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export const AppMain: React.FC = () => {
  const authData: AuthType = useRouteLoaderData("root") as AuthType;
  const { user } = authData;
  // const coursesRes = axios.get(`${BASE_URL}/courses/`);
  const coursesRes = courseData[1];

  return (
    <main className="app-main-styled">
      <div className="app-main-content">
        <WelcomeBoard user={user} />
        <React.Suspense fallback={<div>loading...</div>}>
          <Await
            resolve={coursesRes}
            errorElement={<div>couldn't fetch courses</div>}
          >
            <CurrentCourseSection />
          </Await>
        </React.Suspense>
        <RecommendedCourseSection courses={courseData} />
      </div>

      <AnnouncementTab />
    </main>
  );
};

export const Errorboundary: React.FC = () => {
  console.log("hitting the error boundary instead");
  return <h2>an error occurred in the app main</h2>;
};
