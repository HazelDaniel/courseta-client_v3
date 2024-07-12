import { rankData } from "~/data/user-rank";

import "~/styles/completed-ranks.css";

export const CompletedRanks: React.FC<{
  rankValue: number;
}> = ({ rankValue }) => {
  return (
    <div className="completed_ranks_area">
      <h2>completed ranks</h2>
      <div className="completed_ranks_wrapper">
        <ul className="completed_ranks">
          {rankData.map((el, i) => {
            return (
              <li
                className={`${i <= rankValue ? "filled" : ""}${
                  i === rankValue ? " stop" : ""
                }`}
                key={el.title}
              >
                <div className="xp_badge">
                  {" "}
                  <p>
                    {el.xpRange.min} - {el.xpRange.max}
                  </p>{" "}
                </div>
                <div>
                  <span></span>
                </div>
                <img
                  className="rank_badge_icon"
                  src={rankData[i].icon}
                  alt="an icon representing a student level in the courseta platform"
                />
              </li>
            );
          })}
        </ul>
        <div className="completed_ranks_track"> </div>
      </div>
    </div>
  );
};