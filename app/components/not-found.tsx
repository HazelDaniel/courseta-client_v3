import { Link } from "@remix-run/react";
import { Logo } from "./logo";

// import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/not-found.module.css";
// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

const ErrorSVG: React.FC<{ code: number }> = ({ code }) => {
  return (
    <>
      {code === 404 ? (
        <svg
          viewBox="0 0 124 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.393555 34.164V29.754L22.9476 0.899993H29.7516L7.38655 29.754L4.17355 28.746H39.3906V34.164H0.393555ZM24.9006 45V34.164L25.0896 28.746V19.17H31.0116V45H24.9006Z"
            fill="var(--text-color)"
          />
          <path
            d="M61.1851 45.504C57.7411 45.504 54.6541 44.622 51.9241 42.858C49.2361 41.094 47.0941 38.532 45.4981 35.172C43.9441 31.812 43.1671 27.738 43.1671 22.95C43.1671 18.162 43.9441 14.088 45.4981 10.728C47.0941 7.368 49.2361 4.806 51.9241 3.042C54.6541 1.278 57.7411 0.395996 61.1851 0.395996C64.5871 0.395996 67.6531 1.278 70.3831 3.042C73.1131 4.806 75.2551 7.368 76.8091 10.728C78.3631 14.088 79.1401 18.162 79.1401 22.95C79.1401 27.738 78.3631 31.812 76.8091 35.172C75.2551 38.532 73.1131 41.094 70.3831 42.858C67.6531 44.622 64.5871 45.504 61.1851 45.504ZM61.1851 39.897C63.4951 39.897 65.5111 39.267 67.2331 38.007C68.9971 36.747 70.3621 34.857 71.3281 32.337C72.3361 29.817 72.8401 26.688 72.8401 22.95C72.8401 19.212 72.3361 16.083 71.3281 13.563C70.3621 11.043 68.9971 9.15299 67.2331 7.89299C65.5111 6.63299 63.4951 6.003 61.1851 6.003C58.8751 6.003 56.8381 6.63299 55.0741 7.89299C53.3101 9.15299 51.9241 11.043 50.9161 13.563C49.9501 16.083 49.4671 19.212 49.4671 22.95C49.4671 26.688 49.9501 29.817 50.9161 32.337C51.9241 34.857 53.3101 36.747 55.0741 38.007C56.8381 39.267 58.8751 39.897 61.1851 39.897Z"
            fill="var(--text-color)"
          />
          <path
            d="M84.5576 34.164V29.754L107.112 0.899993H113.916L91.5506 29.754L88.3376 28.746H123.555V34.164H84.5576ZM109.065 45V34.164L109.254 28.746V19.17H115.176V45H109.065Z"
            fill="var(--text-color)"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
          <text
            x={120}
            y={70}
            width={400}
            height={400}
            fontSize="80"
            fontFamily="Poppins"
            fontWeight="bold"
            textAnchor="middle"
            stroke="black"
            className={styles["status-text"]}
          >
            {code}
          </text>
          {/* <text
        x="50"
        y="50"
        fill="blue"
      >
        Hello, SVG!
      </text> */}
        </svg>
      )}
    </>
  );
};

export const StatusErrorElement: React.FC<{ code?: number }> = ({ code }) => {
  code = code || 404;

  return (
    <div className={styles.not_found_styled}>
      <div className={styles._404_content_area}>
        <div className={styles._404_logo_parent}>
          <Logo />
        </div>
        <div className={styles._404_icon_parent}>
          <ErrorSVG code={code} />
        </div>
        <span></span>
        <div className={styles._404_text_area}>
          <p>was this a mistake?</p>
          <Link to={"/home"} reloadDocument={code !== 404}>
            return home
          </Link>
        </div>
      </div>
    </div>
  );
};
