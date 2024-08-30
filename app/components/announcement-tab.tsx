import { AnnouncementsData } from "~/data/announcement-data";
import type { AnnouncementGroupType } from "~/types";
// import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/announcement-tab.module.css";
import { useState } from "react";

// export const links: LinksFunction = () => {
// return [{ rel: "stylesheet", href: styles }];
//   return [{ rel: "stylesheet", href: "/styles/announcement-tab.css" }];
// };

const computeTimeWithMeridian = (dateString: string) => {
  const dateComputed = new Date(dateString);
  const template = `${(dateComputed.getHours() % 12 || 12)
    .toString()
    .padStart(2, "0")}:${dateComputed
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${dateComputed.getHours() > 12 ? "pm" : "am"}`;
  return template;
};

export const AnnouncementTabList: React.FC<{ data: AnnouncementGroupType }> = ({
  data,
}) => {
  const timeDeltaHours: number =
    (new Date().getTime() - new Date(data.announcementDate).getTime()) /
    3600000;

  return (
    <>
      <div className={styles.announcement_tab_separator}>
        <h3>
          {timeDeltaHours <= 24
            ? "TODAY"
            : timeDeltaHours <= 48
            ? "YESTERDAY"
            : data.announcementDate}
        </h3>
        <span></span>
      </div>

      <ul className={styles.at_item_list}>
        {data.announcements.map((entry, i) => {
          return (
            <li className={styles.announcement_tab_item} key={i}>
              <span className={`${styles.ati_badge} ${styles[entry.target]}`}>
                {" "}
                {entry.target}{" "}
              </span>
              <div className={styles.ati_body}>
                <p>{entry.title}</p>
                <div className={styles.ati_expand_cta} tabIndex={0}>
                  <span>
                    <svg>
                      <use xlinkHref="#caret-right"></use>
                    </svg>
                  </span>
                </div>
              </div>
              <div className={styles.ati_time_area}>
                {computeTimeWithMeridian(entry.dateDelivered)}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const AnnouncementTab: React.FC = () => {
  const [expanded, expand] = useState(false);
  return (
		<div className={expanded ? styles.announcement_tab_styled + " " + styles.expanded : styles.announcement_tab_styled}>
      <div className={expanded ? styles.announcement_tab_toggler + " " + styles.flipped : styles.announcement_tab_toggler} onClick={() => expand(prev => !prev)}>
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.3 13.4C12.4 13.4 15.9 16.2 15.9 16.2V5C15.9 5 12.4 7.8 10.3 7.8M10.3 13.4V7.8M10.3 13.4H6.8C5.2537 13.4 4 12.7777 4 10.6C4 8.4223 5.2537 7.8 6.8 7.8H10.3M6.1 13.4L8.2 19H11L8.9 13.4M15.9 12.7C16.1758 12.7 16.4489 12.6457 16.7036 12.5401C16.9584 12.4346 17.1899 12.2799 17.3849 12.0849C17.5799 11.8899 17.7346 11.6584 17.8401 11.4036C17.9457 11.1489 18 10.8758 18 10.6C18 10.3242 17.9457 10.0511 17.8401 9.79636C17.7346 9.54158 17.5799 9.31008 17.3849 9.11508C17.1899 8.92007 16.9584 8.76539 16.7036 8.65985C16.4489 8.55432 16.1758 8.5 15.9 8.5M10.3 16.2C11 16.2 12.4 15.5 12.4 14.1M11.5 22C5.70101 22 1 17.299 1 11.5C1 5.70101 5.70101 1 11.5 1C17.299 1 22 5.70101 22 11.5C22 17.299 17.299 22 11.5 22Z" stroke="#CAC8C8"/>
        </svg>
      </div>
      <div className={styles.at_top}>
        <h2>Announcements</h2>
      </div>
      <div className={styles.at_bottom}>
        {AnnouncementsData.map((entry, i) => {
          return <AnnouncementTabList data={entry} key={i} />;
        })}
      </div>
    </div>
  );
};
