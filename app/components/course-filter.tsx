import { useState } from "react";
import { filterData } from "~/data/course-filter";
import { CourseFilterSelect } from "./course-filter-select";

import styles from "~/styles/course-filter.module.css";

export const CourseFilter: React.FC = () => {
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  return (
    <div className={styles.course_filter_styled}>
      <div className={styles.filter_controller_area}>
        <h2>filter results</h2>
        <div className={styles.filter_controller_parent}>
          <span
            className={styles.filter_icon}
            tabIndex={0}
            onMouseDown={() => {
              setFilterVisible(!filterVisible);
            }}
          >
            <svg>
              <use xlinkHref="#filter"></use>
            </svg>
          </span>
          <span
            className={
              filterVisible
                ? styles.chevron_icon
                : `${styles.chevron_icon} ${styles.flipped}`
            }
          >
            <svg>
              <use xlinkHref="#caret-up"></use>
            </svg>
          </span>
        </div>
      </div>

      <div
        className={`${styles.filter_select_area}${
          filterVisible ? ` ${styles.visible}` : ""
        }`}
      >
        <ul className={styles.filter_select_parent}>
          {filterData.map((entry, idx) => {
            return <CourseFilterSelect data={entry} key={idx} />;
          })}
        </ul>
        <button
          className={styles.filter_select_cta}
          onClick={() => {
            setFilterVisible(false);
          }}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};
