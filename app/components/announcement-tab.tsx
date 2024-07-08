import { AnnouncementsData } from "~/data/announcement-data";
import type { AnnouncementGroupType } from "~/types";
// import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/announcement-tab.module.css";

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
  console.log("rendering .announcement tab..");
  return (
    <div className={styles.announcement_tab_styled}>
      <div className={styles.at_top}>
        <h2>Announcements</h2>
        <button>view all</button>
      </div>
      <div className={styles.at_bottom}>
        {AnnouncementsData.map((entry, i) => {
          return <AnnouncementTabList data={entry} key={i} />;
        })}
      </div>
    </div>
  );
};
