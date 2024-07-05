import rootStyles from "~/styles/root.css?url";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useRouteError,
} from "@remix-run/react";

import type {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { AuthType, DBUserType } from "./types";
import { AuthDao } from "./dao/auth";
import axios from "axios";
import { BASE_URL } from "./config/base";
import { transformUserProfile } from "./transformers/users";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: rootStyles }];
};

export const loader: LoaderFunction = async (args: LoaderFunctionArgs) => {
  try {
    const { request } = args;
    void request;
    const res: Partial<AuthType> = {};
    const authToken = AuthDao.getAccessToken;
    res.token = authToken || null;
    if (authToken) {
      const response = await axios.get(`${BASE_URL}/auth/me`);
      if (response.status === 200) {
        const user: DBUserType = response.data;
        res.user = transformUserProfile(user);
      }
    }
    return json(res as AuthType);
  } catch (err) {
    throw new Response("internal server error", { status: 500 });
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}
