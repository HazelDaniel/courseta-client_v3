import type { RankType } from "~/types";

export const rankData: RankType[] = [
  {
    level: 1,
    title: "novice",
    icon: `/icons/badge-l1.png`,
    xpRange: {
      max: 199,
      min: 0,
    },
  },
  {
    level: 2,
    title: "amateur",
    icon: `/icons/badge-l2.png`,
    xpRange: {
      max: 999,
      min: 200,
    },
  },
  {
    level: 3,
    title: "senior",
    icon: `/icons/badge-l3.png`,
    xpRange: {
      max: 9999,
      min: 1000,
    },
  },
  {
    level: 4,
    title: "professional",
    icon: `/icons/badge-l4.png`,
    xpRange: {
      max: "149.9K",
      min: "10K",
    },
  },
  {
    level: 5,
    title: "master",
    icon: `/icons/badge-l5.png`,
    xpRange: {
      max: "2.99M",
      min: "150K",
    },
  },
  {
    level: 6,
    title: "legendary",
    icon: `/icons/badge-l6.png`,
    xpRange: {
      max: "...",
      min: "3M",
    },
  },
];
