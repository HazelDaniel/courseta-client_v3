import { createCookieSessionStorage } from "@remix-run/node";
import { config } from "dotenv";
import { createToastUtilsWithCustomSession, setToastCookieOptions } from "remix-toast";
config();

export type SessionData = {
  "X-Remix-Location": string;
  "X-Remix-Replace"?: boolean;
};

export type SessionFlashData = {
  [props: string]: any;
};

export const session = createCookieSessionStorage<
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

setToastCookieOptions({ 
  secrets:
    process.env.NODE_ENV === "production"

      ? [process.env.SESSION_SECRET || ""]
      : ["secret"]
});
export const {getSession, commitSession} = session;

export const {
  getToast,
  redirectWithToast, 
  redirectWithSuccess, 
  redirectWithError, 
  redirectWithInfo, 
  redirectWithWarning, 
  jsonWithSuccess, 
  jsonWithError, 
  jsonWithInfo, 
  jsonWithWarning ,
} = createToastUtilsWithCustomSession(session);