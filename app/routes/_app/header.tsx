import { Form, Link, Location, useLocation, useSubmit } from "react-router-dom";
import { useRef } from "react";
import { CreatorUserType, UserType } from "~/types";
import {useOutletContext} from "@remix-run/react";

import styles from "~/styles/header.module.css";

function calcHeaderVisible(location: Location) {
  let res: boolean = true;
  const studentsCoursesRegex = /^\/students\/.*\/dashboard\/courses/i;
  const creatorsCoursesRegex = /^\/creators\/.*\/dashboard\/courses/i;
  const CoursesRegex = /^\/courses((\/|\?)[^\d]*)?$/i;

  console.log(
    "courses regex did match ?",
    CoursesRegex.test(location.pathname)
  );
  const pathString = location.pathname;

  res =
    studentsCoursesRegex.test(pathString) ||
    creatorsCoursesRegex.test(pathString) ||
    CoursesRegex.test(pathString);

  return res;
}

const HeaderSearchBox: React.FC<{ dest: string }> = ({ dest }) => {
  const location = useLocation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const submit = useSubmit();
  const existingSearch = new URLSearchParams(location.search);
  console.log(location.pathname);

  void dest;
  return (
    <Form
      action={location.pathname}
      onChange={(e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInputRef.current) return;
        void e;
        submit(
          { search: searchInputRef.current.value.trim() },
          {
            action: location.pathname,
            encType: "application/x-www-form-urlencoded",
            replace: !!existingSearch,
          }
        );
      }}
      ref={formRef}
    >
      <div className={styles.header_searchbox_styled}>
        <input
          type="search"
          name="search"
          id=""
          ref={searchInputRef}
          defaultValue={existingSearch.get("search") || ""}
        />

        <span className={styles.search_icon}>
          <input type="submit" value="" />
          <svg>
            <use xlinkHref="#search"></use>
          </svg>
        </span>
      </div>
    </Form>
  );
};

export const Header: React.FC<{
  variant: "side-tab" | "no-side-tab";
  user: UserType | CreatorUserType;
}> = ({ variant, user }) => {
  const location = useLocation();
  const isVisible = calcHeaderVisible(location);
  const rootContext = useOutletContext() as {
    userID: string;
    role: "student" | "creator";
  };

  const userEntity =
    rootContext.role === "creator"
      ? "creators"
      : rootContext.role === "student"
      ? "students"
      : "others";

  return (
    <header
      className={`${
        variant === "no-side-tab"
          ? `${styles.header_styled} ${styles.shrink}`
          : styles.header_styled
      }`}
    >
      <div
        className={
          isVisible
            ? styles.header_left
            : `${styles.header_left} ${styles.hidden}`
        }
      >
        <HeaderSearchBox dest={`${location.pathname}${location.search}`} />
      </div>
      <div className={styles.header_right}>
        <span className={styles.notif_icon_area}>
          <svg>
            <use xlinkHref="#bell"></use>
          </svg>
          <span className={styles.notif_icon_shadow}></span>
        </span>
        <div className={styles.profile_summary_area}>
          <span className={styles.summary_area_text}>{`${
            user.email.split("@")[0]
          }`}</span>
          <div className={styles.profile_image_div}>
            <img
              src={
                user.avatar?.url?.length
                  ? user.avatar?.url
                  : "icons/user-icon.svg"
              }
              alt="avatar image of the user of the courseta platform"
              className={styles.summary_area_image}
            />
            <Link to={`/${userEntity}/${user.id}/dashboard`}></Link>
          </div>
        </div>
      </div>
    </header>
  );
};
