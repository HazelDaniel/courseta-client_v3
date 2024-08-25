import React from "react";
import "~/styles/user-activity-chart.css";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const colors = {
  purple: {
    default: "#696969f8",
    half: "rgba(99, 99, 99, 0.164)",
    quarter: "rgba(194, 194, 194, 0.137)",
    zero: "rgba(149, 76, 233, 0)",
  },
  grey: {
    default: "#313131",
    quarter: "rgba(196, 196, 196, 0.25)",
  },
};

const data = [
  { day: "Mon", count: 50 },
  { day: "Tue", count: 22 },
  { day: "Wed", count: 42 },
  { day: "Thur", count: 61 },
  { day: "fri", count: 50 },
  { day: "Sat", count: 40 },
  { day: "Sun", count: 49 },
];

export const UserActivityChartSkeleton: React.FC = () => {
  return (
    <div className="user_activity_chart_area">
      <h2>your activity </h2>
      <p>loading ...</p>
      <div className="user_activity_chart_container"></div>
    </div>
  );
};

export const UserActivityChart: React.FC = () => {
  return (
    <div className="user_activity_chart_area">
      <h2>your activity </h2>
      <p>
        this represents the number of times per day you have checked into the
        platform <br />
        <center>(for the past one week)</center>
      </p>
      <div className="user_activity_chart_container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 40, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={colors.grey.quarter}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: colors.grey.default, fontFamily: "Poppins" }}
              tickMargin={10}
              angle={15}
              interval={0}
            />
            <YAxis
              tick={{ fill: colors.grey.default, fontFamily: "Poppins" }}
              allowReorder="yes"
              tickMargin={10}
              domain={[57, 63]}
            />
            <Tooltip />
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors.purple.half}
                  stopOpacity={1}
                />
                <stop
                  offset="15%"
                  stopColor={colors.purple.quarter}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={colors.purple.zero}
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="count"
              stroke={colors.purple.default}
              strokeWidth={1}
              fill="url(#colorWeight)"
              fillOpacity={1}
              dot={{ fill: colors.purple.default, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;
