import {
  SessionUserType,
  UserRoleType,
} from "~/types";
import { AnnouncementTab } from "~/components/announcement-tab";
import { WideCourseCard } from "~/components/wide-course-card";
import { SmallCourseCard } from "~/components/small-course-card";
import { AxiosResponse } from "axios";
import React, { Suspense } from "react";
import {
  Await,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "@remix-run/react";

// import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/app-main.module.css";
import UserActivityChart, {
  UserActivityChartSkeleton,
} from "~/components/user-activity-chart";
import { ClientOnly } from "remix-utils/client-only";
import {
  CourseViewType,
  ServerPayloadType,
  StudentCourseViewType,
} from "~/server.types";
import { NoContent } from "~/components/no-content";
import { TopCoursesCard } from "~/components/top-courses-card";
// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }, { rel: "stylesheet", href: wideCourseCardStyles }];
// };

const WelcomeBoard: React.FC<{ user: SessionUserType }> = ({ user }) => {
  return (
    <div className={styles.welcome_board_styled}>
      <div className={styles.wp_left}>
        <span>welcome,</span>
        <h2>{user.email.split("@")[0]}</h2>
      </div>
      <div className={styles.wp_right}>
        <img
          src={`/illustrations/${user.role}_illustration.svg`}
          alt="community learning illustration"
          loading="lazy"
          className={styles.img}
        />
      </div>
    </div>
  );
};

const CurrentCourseSection: React.FC = () => {
  const loaderResult = useLoaderData() as {
    unfinishedCourse: StudentCourseViewType[];
  };
  const navigate = useNavigate();
  const lastUnfinishedCourse = (
    loaderResult.unfinishedCourse as StudentCourseViewType[]
  )[0];
  // console.log("last unfinished course is ", loaderResult.unfinishedCourse);
  // return null;

  return (
    <section className={styles.current_course_section_styled}>
      <div className={styles.ccs_top}>
        <p className={styles.home_section_title}>Recent Unfinished</p>

        {lastUnfinishedCourse ? (
          <button
            className={styles.home_section_cta}
            onClick={() => {
              navigate(`/courses/${lastUnfinishedCourse.courseID}`);
            }}
          >
            Continue Course
          </button>
        ) : null}
      </div>
      <div className={styles.ccs_bottom}>
        {lastUnfinishedCourse ? (
          <WideCourseCard entry={lastUnfinishedCourse} />
        ) : (
          <NoContent
            text="no unfinished course to display"
            variant="course_outline"
          />
        )}
      </div>
    </section>
  );
};

const GenericCourseListSkeleton: React.FC<{}> = () => {
  return (
    <section className={styles.recommended_course_section_styled}>
      <div className={styles.rcs_top}>
        <p className={styles.home_section_title}>loading your courses...</p>
      </div>
      <div className={styles.rcs_bottom}>
        <div className={styles.skeleton}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

const GenericCourseListSection: React.FC<{
  title: string;
  role: UserRoleType;
  courses:
    | CourseViewType[]
    | (Omit<CourseViewType, "lessonCount"> & { studentCount: number })[];
}> = ({ title, role, courses }) => {
  return (
    <section className={styles.recommended_course_section_styled}>
      <div className={styles.rcs_top}>
        <p className={styles.home_section_title}>{title}</p>
      </div>
      <div className={styles.rcs_bottom}>
        <ul className={styles.list_course_cards}>
          {courses.length ? (
            courses.map((entry) => {
              if ("lessonCount" in entry) {
                return (
                  <SmallCourseCard
                    entry={entry}
                    withCTA={true}
                    variant="home"
                    key={entry.courseID}
                  />
                );
              }
              return <TopCoursesCard entry={entry} key={entry.courseID} />;
            })
          ) : (
            <NoContent
              text={
                role === "student"
                  ? "your recommended courses will appear here"
                  : "your top courses will be listed here"
              }
              variant="course_outline"
            />
          )}
        </ul>
      </div>
    </section>
  );
};

export const AppMain: React.FC = () => {
  const authData = useRouteLoaderData("root") as { user: SessionUserType };
  const { user } = authData;
  // const coursesRes = axios.get(`${BASE_URL}/courses/`);
  const { courses } = useLoaderData() as {
    courses: Promise<
      AxiosResponse<
        ServerPayloadType<
          | (Omit<CourseViewType, "lessonCount"> & { studentCount: number })[]
          | CourseViewType[]
        >
      >
    >;
  };

  return (
    <main className={styles.app_main_styled}>
      <div className={styles.app_main_content}>
        <WelcomeBoard user={user} />
        {user.role === "student" ? <CurrentCourseSection /> : null}
        <ClientOnly fallback={<UserActivityChartSkeleton />}>
          {() => <UserActivityChart />}
        </ClientOnly>

        <Suspense fallback={<GenericCourseListSkeleton />}>
          <Await resolve={courses}>
            {(res) => {
              if (res.data.payload)
                return (
                  <GenericCourseListSection
                    title={
                      user.role === "student"
                        ? "Recommended Courses"
                        : "Your Top Courses"
                    }
                    role={user.role}
                    courses={res.data.payload}
                  />
                );
            }}
          </Await>
        </Suspense>
      </div>

      <AnnouncementTab />
    </main>
  );
};

export const Errorboundary: React.FC = () => {
  return <h2>an error occurred in the app main</h2>;
};
