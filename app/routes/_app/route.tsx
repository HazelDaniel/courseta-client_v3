import {
  Navigate,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { Header } from "./header";
import { SideTab } from "./side-tab";
import { AuthType } from "~/types";

import styles from "~/styles/root-wrapper.module.css";
import { NotFound } from "~/components/not-found";
// import { LinksFunction } from "@remix-run/node";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const App: React.FC<{ variant?: "side-tab" | "no-side-tab" }> = ({
  variant,
}) => {
  const location = useLocation();
  const paramsURL = new URLSearchParams(location.search);
  variant =
    variant ||
    (location.pathname.startsWith("/assessments/") &&
    paramsURL.get("course_id") &&
    paramsURL.get("lesson_id")
      ? "no-side-tab"
      : "side-tab");

  const loaderData: AuthType = useRouteLoaderData("root") as AuthType;

  if (!loaderData.token) {
    return <Navigate to={"/auth?type=sign_in"} />;
  }

  return (
    <div id="app">
      {(() => {
        if (variant === "side-tab") {
          return (
            <div className="side_tab_wrapper">
              <SideTab />
            </div>
          );
        }
      })()}

      <div
        className={
          variant === "no-side-tab"
            ? `${styles.root_wrapper_styled} ${styles.compact}`
            : styles.root_wrapper_styled
        }
      >
        <Header variant={variant} user={loaderData.user} />
        <Outlet />
      </div>
    </div>
  );
};

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <NotFound />;
    }
  } else {
    return <h2>something went wrong! {(error as Error)?.message}</h2>;
  }
};

export default App;
