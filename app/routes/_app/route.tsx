import { Navigate, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Header } from "./header";
import { SideTab } from "./side-tab";
import { AuthType } from "~/types";

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

  const loaderData: AuthType = useLoaderData() as AuthType;
  loaderData.token = "kjlfklsjfsdfs";
  loaderData.user = {
    avatarURL: "illustrations/avatar1.jpg",
    email: "hazeldaniel856@gmail.com",
    isLoggedIn: true,
    name: "daniel emmanuel",
    role: "student",
  };

  if (!loaderData.token) {
    return <Navigate to={"/auth?type=sign_in"} />;
  }
  console.log("current user is ", loaderData.user);

  return (
    <div id="app">
      {(() => {
        if (variant === "side-tab") {
          return (
            <div className="side-tab-wrapper">
              <SideTab />
            </div>
          );
        }
      })()}

      <div
        className={
          variant === "no-side-tab"
            ? "root-wrapper-styled compact"
            : "root-wrapper-styled"
        }
      >
        <Header variant={variant} user={loaderData.user} />

        <Outlet />
      </div>
    </div>
  );
};
