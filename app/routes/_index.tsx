import type { MetaFunction } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Courseta | Home" },
    {
      name: "description",
      content: "home page for the Courseta edtech platform",
    },
  ];
};

export default function Index() {
  return null;
}
