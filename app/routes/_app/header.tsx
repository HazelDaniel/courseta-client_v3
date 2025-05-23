import { Form, Link, Location, useLocation, useSubmit } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import {
  AuthUserType,
  CreatorUserType,
  SessionUserType,
  UserRoleType,
  UserType,
} from "~/types";
import { useOutletContext, useRouteLoaderData } from "@remix-run/react";

import styles from "~/styles/header.module.css";
import { ServerPayloadType } from "~/server.types";
import ImageCacheDAO from "~/dao/image-cache";

function calcHeaderVisible(location: Location) {
  let res: boolean = true;
  const studentsCoursesRegex = /^\/students\/.*\/dashboard\/courses$/i;
  const creatorsCoursesRegex = /^\/creators\/.*\/dashboard\/courses$/i;
  const CoursesRegex = /^\/courses((\/|\?)[^\d\/]*)?$/i;

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

  void dest;
  return (
    <Form
      action={location.pathname}
      onChange={(e: React.FormEvent) => {
        e.preventDefault();
        if (!searchInputRef.current) return;
        return;
        submit(
          { search: searchInputRef.current?.value.trim() || "" },
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

const HeaderImage: React.FC = React.memo(
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
        src={userImage || "/illustrations/user_icon.svg"}
        alt="avatar image of the user of the courseta platform"
        className={styles.summary_area_image}
        loading="lazy"
      />
    );
  }
);

export const Header: React.FC<{
  variant: "side-tab" | "no-side-tab";
}> = ({ variant }) => {
  const location = useLocation();
  const isVisible = calcHeaderVisible(location);
  // 

  const { user } = useOutletContext() as {
    user: SessionUserType | undefined;
  };

  const userEntity = user ? user.role + "s" : undefined;

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
            user ? user.email.split("@")[0] : "anon"
          }`}</span>
          <div className={styles.profile_image_div}>
            <HeaderImage/>
            {user ? (
              <Link to={`/${userEntity}/${user.id}/dashboard`}></Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
