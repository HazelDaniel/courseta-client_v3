import Styles from "~/styles/small-course-card.css?url";
import CountdownCircleStyles from "~/styles/countdown-circle.css?url";
import SmallCourseCardStyles from "~/styles/small-course-card.css?url";

import { Link, useNavigate } from "@remix-run/react";
import type { CourseEntryType } from "~/types";
import { useEffect, useRef } from "react";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: Styles },
    { rel: "stylesheet", href: SmallCourseCardStyles },
    { rel: "stylesheet", href: CountdownCircleStyles },
  ];
};

export const StaticProgress: React.FC<{ entry: CourseEntryType }> = ({
  entry,
}) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!progressRef || !textRef) return;
    const progressEl = progressRef.current as SVGCircleElement;

    const percentage = progressEl.getAttribute("data-value")!;
    const color = progressEl.getAttribute("data-stroke");
    const radius = progressEl.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const stroke = circumference - (circumference * +percentage) / 100;

    progressEl.style.setProperty("--stroke-dashoffset", stroke.toString());
    progressEl.style.setProperty(
      "--stroke-dasharray",
      circumference.toString()
    );
    progressEl.style.setProperty("--stroke", color);
  }, [progressRef]);

  return (
    <div className="countdown-circle-styled course-entry-progress">
      <div className="skill">
        <svg>
          <circle cx="15" cy="15" r="50%"></circle>
          <circle
            className="progress"
            cx="15"
            cy="15"
            r="50%"
            data-value={entry.progress}
            data-stroke="var(--countdown-circle-stroke-here)"
            ref={progressRef}
          ></circle>
        </svg>
        <span
          className="data-progress"
          data-value={entry.progress}
          ref={textRef}
        >
          {Math.round(entry.progress)}%
        </span>
      </div>
    </div>
  );
};

export const SmallCourseCard: React.FC<{
  entry: CourseEntryType;
  withCTA: boolean;
  variant: "home" | "others";
}> = ({ entry, withCTA, variant }) => {
  const navigate = useNavigate();
  return (
    <li className={`small-course-card-styled course-card-wrapper ${variant}`}>
      <div className="course-card-small">
        <div className="top">
          <img
            src={entry.imageUrl}
            alt="image representing a course card in a list of courses"
          />
          {!withCTA ? <Link to={`/courses/${entry.id}`}></Link> : null}
        </div>
        <div className="bottom">
          <p className="card-bottom-text">{entry.title}</p>
          {!withCTA ? (
            <div className="course-circle-progress-wrapper">
              <StaticProgress entry={entry} />
            </div>
          ) : null}
          <div className="course-info-cta-area">
            <p>{entry.lessonCount} lessons</p>
            {withCTA ? (
              <button
                onClick={() => {
                  navigate(`/courses/${entry.id}`);
                }}
              >
                View course
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
};
