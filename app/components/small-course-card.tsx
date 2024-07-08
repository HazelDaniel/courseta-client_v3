import { Link, useNavigate } from "@remix-run/react";
import type { CourseEntryType } from "~/types";
import { useEffect, useRef } from "react";
import { LinksFunction } from "@remix-run/node";
import smallCourseCardStyles from "~/styles/small-course-card.module.css";
import countdownCircleStyles from "~/styles/countdown-circle.module.css";

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
    <div
      className={`${countdownCircleStyles.countdown_circle_styled} ${countdownCircleStyles.course_entry_progress}`}
    >
      <div className={countdownCircleStyles.skill}>
        <svg>
          <circle cx="15" cy="15" r="50%"></circle>
          <circle
            className={countdownCircleStyles.progress}
            cx="15"
            cy="15"
            r="50%"
            data-value={entry.progress}
            data-stroke="var(--countdown-circle-stroke-here)"
            ref={progressRef}
          ></circle>
        </svg>
        <span
          className={countdownCircleStyles.data_progress}
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
    <li
      className={`${smallCourseCardStyles.small_course_card_styled} ${smallCourseCardStyles.course_card_wrapper} ${smallCourseCardStyles[variant]}`}
    >
      <div className={smallCourseCardStyles.course_card_small}>
        <div className={smallCourseCardStyles.top}>
          <img
            src={entry.imageUrl}
            alt="image representing a course card in a list of courses"
          />
          {!withCTA ? <Link to={`/courses/${entry.id}`}></Link> : null}
        </div>
        <div className={smallCourseCardStyles.bottom}>
          <p className={smallCourseCardStyles.card_bottom_text}>
            {entry.title}
          </p>
          {!withCTA ? (
            <div
              className={smallCourseCardStyles.course_circle_progress_wrapper}
            >
              <StaticProgress entry={entry} />
            </div>
          ) : null}
          <div className={smallCourseCardStyles.course_info_cta_area}>
            <p>{entry.lessonCount} lessons</p>
            {withCTA ? (
              <button
                onClick={() => {
                  console.log("some button is clicked");
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
