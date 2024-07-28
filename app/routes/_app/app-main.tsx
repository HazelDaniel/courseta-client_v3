import { courseData } from "~/data/course-list";
import { AuthType, CourseListType, CreatorUserType, UserType } from "~/types";
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
import styles from "~/styles/app-main.module.css";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }, { rel: "stylesheet", href: wideCourseCardStyles }];
// };

const WelcomeBoard: React.FC<{ user: UserType | CreatorUserType }> = ({
  user,
}) => {
  return (
    <div className={styles.welcome_board_styled}>
      <div className={styles.wp_left}>
        <span>welcome,</span>
        <h2>{user?.firstName}</h2>
      </div>
      <div className={styles.wp_right}>
        <img
          src="/illustrations/community-learning.png"
          alt="community learning illustration"
          loading="lazy"
          className={styles.img}
        />
      </div>
    </div>
  );
};

const CurrentCourseSection: React.FC = () => {
  const courses = useAsyncValue();
  const navigate = useNavigate();

  return (
    <section className={styles.current_course_section_styled}>
      <div className={styles.ccs_top}>
        <p className={styles.home_section_title}>Recent Unfinished</p>
        <button
          className={styles.home_section_cta}
          onClick={() => {
            navigate(`/courses/${courseData[1].id}`);
          }}
        >
          Continue Course
        </button>
      </div>
      <div className={styles.ccs_bottom}>
        <WideCourseCard entry={courseData[1]} />
      </div>
    </section>
  );
};

const RecommendedCourseSection: React.FC<{ courses: CourseListType }> = ({
  courses,
}) => {
  return (
    <section className={styles.recommended_course_section_styled}>
      <div className={styles.rcs_top}>
        <p className={styles.home_section_title}>Recommended Courses</p>
      </div>
      <div className={styles.rcs_bottom}>
        <ul className={styles.list_course_cards}>
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
    <main className={styles.app_main_styled}>
      <div className={styles.app_main_content}>
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
  return <h2>an error occurred in the app main</h2>;
};
