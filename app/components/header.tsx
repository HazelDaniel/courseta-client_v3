import headerStyle from "~/styles/landing-header.module.css";
import { Link, useNavigate } from "@remix-run/react";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className={headerStyle["header"]}>
      <div className={headerStyle["logo_parent"]}>
        <img
          src="/logo.svg"
          alt="the logo of the ed-tech platform, courseta. courseta ed-tech logo"
        />
      </div>
      <div className={headerStyle["header_child"]}>
        <nav className={headerStyle["header_links_area"]}>
          <ul>
            <li>
              <Link to="">home</Link>
            </li>
            <li>
              <Link to="">about us</Link>
            </li>
            <li>
              <Link to="">vision</Link>
            </li>
            <li>
              <Link to="/home/#faq">Faq</Link>
            </li>
          </ul>
        </nav>

        <div className={headerStyle["header_cta_area"]}>
          <button
            className={
              headerStyle["btn_secondary"] + " " + headerStyle["header_btn"]
            }
            onClick={() => navigate("/auth?type=sign_up&role=creator")}
          >
            be a creator
          </button>
          <button
            className={
              headerStyle["btn_primary"] + " " + headerStyle["header_btn"]
            }
            onClick={() => navigate("/auth?type=sign_up&role=student")}
          >
            be a student
          </button>
        </div>
      </div>
    </header>
  );
};
