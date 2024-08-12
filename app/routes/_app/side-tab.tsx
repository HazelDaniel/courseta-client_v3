import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { Logo } from "~/components/logo";
import { AuthDao } from "app/dao/auth";

import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/side-tab.module.css";
import { UserRoleType } from "~/server.types";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const SideTab: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rootContext = useOutletContext() as {
    user: { id: string; role: UserRoleType } | undefined;
  };
  console.log("user entity is ", rootContext);

  const userEntity =
    rootContext.user?.role === "creator"
      ? "creators"
      : rootContext.user?.role === "student"
      ? "students"
      : "others";

  return (
    <nav className={styles.side_tab_styled}>
      <Logo />

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
                    to={`/${userEntity}/${rootContext.user?.id}/dashboard/assessment-results`}
                    className={
                      /^\/(students|creators)\/.*\/dashboard\/assessment-results/i.test(
                        location.pathname
                      )
                        ? styles.active
                        : ""
                    }
                  >
                    assessments
                  </Link>
                </span>
              ) : null}

              <span className={styles.sub_nav_item}>
                <span></span>
                <Link
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
                to="/activities"
                className={
                  location.pathname === "/activities" ? styles.active : ""
                }
              >
                Activities
              </Link>
            </div>
          </li>
        </ul>

        <div className={styles.side_tab_cta_div}>
          <button
            onMouseDown={() => {
              if (AuthDao.isAuthenticated) {
                AuthDao.revokeTokens();
              }
              navigate("/auth?type=sign_in");
            }}
          >
            {AuthDao.isAuthenticated ? "LOGOUT" : "LOGIN"}
            <span>
              <svg>
                {AuthDao.isAuthenticated ? (
                  <use xlinkHref="#logout"></use>
                ) : (
                  <use xlinkHref="#login"></use>
                )}
              </svg>
            </span>
          </button>
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
