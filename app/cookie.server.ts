import { createCookieSessionStorage } from "@remix-run/node";
import { config } from "dotenv";
config();

export type SessionData = {
  "X-Remix-Location": string;
  "X-Remix-Replace"?: boolean;
};

export type SessionFlashData = {
  "X-Remix-Location"?: string;
  "X-Remix-Replace"?: boolean;
};

export const { getSession, commitSession } = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET as string],
    sameSite: "lax",
    httpOnly: true,
  },
});
