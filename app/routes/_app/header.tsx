import { Form, Link, Location, useLocation, useSubmit } from "react-router-dom";
import { useRef } from "react";
import { UserType } from "~/types";

import styles from "~/styles/header.module.css";

function calcHeaderVisible(location: Location) {
  let res: boolean = true;
  const pathString = location.pathname;
  res =
    pathString === "/students/dashboard/courses" ||
    pathString === "/creators/dashboard/courses" ||
    pathString.startsWith("/students/dashboard/courses?") ||
    pathString.startsWith("/creators/dashboard/courses?");

  res =
    res ||
    pathString === "/courses" ||
    pathString === "/courses/" ||
    pathString.startsWith("/courses?");

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
  user: UserType;
}> = ({ variant, user }) => {
  const location = useLocation();
  const isVisible = calcHeaderVisible(location);

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
                user.avatarURL?.length ? user.avatarURL : "icons/user-icon.svg"
              }
              alt="avatar image of the user of the courseta platform"
              className={styles.summary_area_image}
            />
            <Link to={"/students/dashboard"}></Link>
          </div>
        </div>
      </div>
    </header>
  );
};
