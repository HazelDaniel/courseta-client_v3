import { Link } from "react-router-dom";
import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/logo.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const Logo: React.FC = () => {
  return (
    <div className="logo-container logo-root-parent">
      <span className="logo-div">
        <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_218_1780)">
            <circle cx="18.4722" cy="16.7213" r="9.47541" fill="#3C4442" />
            <path
              d="M26.2755 21.1803C26.2755 23.9508 22.9066 26.1967 18.7509 26.1967C14.5952 26.1967 11.2263 23.9508 11.2263 21.1803C11.2263 18.4099 12.087 22.8525 16.2427 22.8525C20.3984 22.8525 26.2755 18.4099 26.2755 21.1803Z"
              fill="#F3F3F3"
            />
            <g filter="url(#filter0_d_218_1780)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.9148 34C12.6326 34 7.56687 32.2089 3.83185 29.0208C3.50975 28.7459 3.19982 28.4625 2.90237 28.1713C4.31465 28.9319 5.88933 29.4928 7.57197 29.8076C7.28341 29.5557 7.00254 29.2934 6.72998 29.0208C3.54186 25.8327 1.7508 21.5087 1.7508 17C1.7508 12.8024 3.3032 8.76496 6.09006 5.65511C4.09809 6.22083 2.29562 7.14071 0.785156 8.32726C1.62605 7.1171 2.64653 5.99094 3.83185 4.97918C7.56687 1.79107 12.6326 0 17.9148 0V0.0205501C18.1926 0.00688132 18.4713 0 18.7508 0V4.45902H18.7508C11.8246 4.45902 6.20977 10.0738 6.20977 17C6.20977 23.9262 11.8246 29.541 18.7508 29.541H18.7508V34C18.4713 34 18.1926 33.9931 17.9148 33.9795V34Z"
                fill="url(#paint0_radial_218_1780)"
              />
            </g>
          </g>
          <defs>
            <filter
              id="filter0_d_218_1780"
              x="-3.21484"
              y="0"
              width="25.9656"
              height="42"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_218_1780"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_218_1780"
                result="shape"
              />
            </filter>
            <radialGradient
              id="paint0_radial_218_1780"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(9.96423 17) rotate(146.31) scale(23.5748 12.457)"
            >
              <stop stop-color="#F3F3F3" />
              <stop offset="1" stop-color="white" />
            </radialGradient>
            <clipPath id="clip0_218_1780">
              <rect width="34" height="34" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <Link to="/"></Link>
      </span>
    </div>
  );
};
