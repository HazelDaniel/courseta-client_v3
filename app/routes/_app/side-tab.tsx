import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";
import { Logo } from "~/components/logo";

import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/side-tab.module.css";
import { SessionUserType, UserRoleType } from "~/server.types";
import { UserAuthActionType } from "~/types";
import { useState } from "react";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

const AuthControlButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext() as {
    user: SessionUserType | undefined;
  };
  const submit = useSubmit();

  return (
    <button
      onClick={() => {
        if (user) {
          const payload: UserAuthActionType = {
            intent: "LOGOUT",
            payload: { id: user.id, role: user.role },
          };
          submit(payload as any, {
            action: "/",
            encType: "application/json",
            navigate: false,
            method: "post",
          });
          return;
        }
        navigate("/auth?type=sign_in", { replace: true });
      }}
    >
      {user ? "LOGOUT" : "LOGIN"}
      <span>
        <svg>
          {user ? (
            <use xlinkHref="#logout"></use>
          ) : (
            <use xlinkHref="#login"></use>
          )}
        </svg>
      </span>
    </button>
  );
};

export const SideTab: React.FC = () => {
  const location = useLocation();
  const [expanded, expand] = useState(false);

  const rootContext = useOutletContext() as {
    user: { id: string; role: UserRoleType } | undefined;
  };

  const userEntity = rootContext.user?.role + "s";

  return (
    <nav
      className={`${
        !expanded
          ? styles.side_tab_styled
          : styles.side_tab_styled + " " + styles.expanded
      }`}
    >
      <Logo />
      <div
        className={expanded ? styles["side_tab_toggler"] + " " + styles.flipped :  styles["side_tab_toggler"]}
        onClick={() => expand((prev) => !prev)}
      >
        <svg viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 8L8 1L1 8"
            stroke="#CAC8C8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <svg viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1L8 8L15 1"
            stroke="#CAC8C8"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div className={styles.side_tab_body}>
        <ul className={styles.nav_list}>
          <li className={`${styles.nav_item} ${styles.nested}`}>
            <div>
              <span>
                <svg>
                  <use xlinkHref="#dashboard"></use>
                </svg>
              </span>
              <NavLink
                onClick={() => expand(prev => !prev)}
                to={`/${userEntity}/${rootContext.user?.id}/dashboard`}
                className={
                  /^\/(students|creators)\/.*\/dashboard(\/)?/i.test(
                    location.pathname
                  )
                    ? styles.active
                    : ""
                }
              >
                Dashboard
              </NavLink>
            </div>

            <div className={styles.sub_nav_list}>
              <span className={styles.sub_nav_item}>
                <span></span>
                <Link
                onClick={() => expand(prev => !prev)}
                  to={`/${userEntity}/${rootContext.user?.id}/dashboard/courses`}
                  className={
                    /^\/(students|creators)\/.*\/dashboard\/courses$/i.test(
                      location.pathname
                    )
                      ? styles.active
                      : ""
                  }
                >
                  my courses
                </Link>
              </span>

              {userEntity === "students" ? (
                <span className={styles.sub_nav_item}>
                  <span></span>{" "}
                  <Link
										onClick={() => expand(prev => !prev)}
                    to={`/${userEntity}/${rootContext.user?.id}/dashboard/assessment-results`}
                    className={
                      /^\/(students|creators)\/.*\/dashboard\/assessment-results/i.test(
                        location.pathname
                      )
                        ? styles.active
                        : ""
                    }
                  >
                    assessment results
                  </Link>
                </span>
              ) : null}

              <span className={styles.sub_nav_item}>
                <span></span>
                <Link
									onClick={() => expand(prev => !prev)}
                  to={`/${userEntity}/${rootContext.user?.id}/dashboard/profile`}
                  className={
                    /^\/(students|creators)\/.*\/dashboard(\/)?$/i.test(
                      location.pathname
                    )
                      ? styles.active
                      : ""
                  }
                >
                  profile
                </Link>
              </span>
              {/* <span className={styles.sub_nav_item}>
                <span></span> <a href="">some other item</a>
              </span> */}
            </div>
          </li>

          <li className={styles.nav_item}>
            <div>
              <span>
                <svg>
                  <use xlinkHref="#course"></use>
                </svg>
              </span>
              <Link
								onClick={() => expand(prev => !prev)}
                to="/courses"
                className={
                  location.pathname === "/courses" ? styles.active : ""
                }
              >
                All Courses
              </Link>
            </div>
          </li>

          <li className={styles.nav_item}>
            <div>
              <span>
                <svg>
                  <use xlinkHref="#analytics"></use>
                </svg>
              </span>
              <Link
								onClick={() => expand(prev => !prev)}
                to="/activities"
                className={
                  location.pathname === "/activities" ? styles.active : ""
                }
              >
                Communities
              </Link>
            </div>
          </li>
        </ul>

        <div className={styles.side_tab_cta_div}>
          <AuthControlButton />
        </div>

        <div className={styles.side_tab_notif_box}>
          <p className={styles.notif_text}>
            Explore Other Courses to expand on your knowlege
          </p>

          <button className={styles.notif_box_cta}>explore</button>
        </div>
      </div>
    </nav>
  );
};
