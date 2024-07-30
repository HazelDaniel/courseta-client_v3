import { Navigate, useFetcher } from "@remix-run/react";
import {
  ActionFunction,
  Link,
  json,
  redirect,
  useLocation,
  useSubmit,
} from "react-router-dom";
import { Logo } from "~/components/logo";
import { AuthDao } from "~/dao/auth";
import { useSearchParams } from "@remix-run/react";

// import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/auth.module.css";
import axios from "axios";
import { BASE_URL, updateInterceptorWithToken } from "~/config/base";
import { ChangeEvent, useRef, useState } from "react";
import {
  AuthUserIntentType,
  UserAuthPayloadType,
  UserAuthType,
  UserSigninActionType,
  UserSignupActionType,
} from "~/types";
import { serializeAuthFormForAction } from "~/serializers/auth.serializer";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const SignInForm: React.FC = () => {
  const [isCreatorStatus, setCreatorStatus] = useState<boolean>(false);
  const { Form, submit } = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);

  if (AuthDao.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <Form
      className={styles.auth_form}
      method="post"
      ref={formRef}
      onSubmit={(e: React.FormEvent) => {
        if (!formRef.current) return;
        e.preventDefault();
        const formData = new FormData(formRef.current as HTMLFormElement);
        const res: UserAuthType = Object.fromEntries(formData.entries()) as any;
        const payload = serializeAuthFormForAction(res);
        const submitPayload: UserSigninActionType = {
          intent: "SIGN_IN",
          payload,
        };
        submit(submitPayload as any, {
          method: "post",
          action: "./",
          encType: "application/json",
        });
      }}
    >
      <div className={styles.input_wrapper}>
        <label htmlFor="email">Email</label>
        <input type="email" name={"email" as keyof UserAuthType} id="email" />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name={"password" as keyof UserAuthType}
          id="password"
        />
      </div>

      <div className={`${styles.input_wrapper}`}>
        <label htmlFor="rememberMe">Remember me</label>
        <input
          type="checkbox"
          name={"rememberMe" as keyof UserAuthType}
          id="rememberMe"
        />
      </div>

      <div className={`${styles.input_wrapper}`}>
        <label htmlFor="asCreator">login as creator</label>
        <input
          type="checkbox"
          id="asCreator"
          name={"asCreator" as keyof UserAuthType}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.currentTarget.checked) {
              setCreatorStatus(true);
              return;
            }
            setCreatorStatus(false);
          }}
        />
      </div>

      {isCreatorStatus ? (
        <div className={styles.input_wrapper}>
          <label htmlFor="creatorPass">Creator Pass</label>
          <input
            type="password"
            name={"creatorPass" as keyof UserAuthType}
            id="creatorPass"
          />
        </div>
      ) : null}

      <button type="submit">SIGN IN</button>
    </Form>
  );
};

export const SignUpForm: React.FC = () => {
  const { Form, submit } = useFetcher();
  if (AuthDao.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Form
      className={styles.auth_form}
      method="post"
      ref={formRef}
      onSubmit={(e: React.FormEvent) => {
        if (!formRef.current) return;
        e.preventDefault();
        const formData = new FormData(formRef.current as HTMLFormElement);
        const res: UserAuthType = Object.fromEntries(formData.entries()) as any;
        const payload = serializeAuthFormForAction(res);
        const submitPayload: UserSignupActionType = {
          intent: "SIGN_UP",
          payload,
        };
        submit(submitPayload as any, {
          method: "post",
          action: "./",
          encType: "application/json",
        });
      }}
    >
      <div className={styles.input_wrapper}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name={"firstName" as keyof UserAuthType}
          id="firstName"
        />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name={"lastName" as keyof UserAuthType}
          id="lastName"
        />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="email">Email</label>
        <input type="email" name={"email" as keyof UserAuthType} id="email" />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name={"password" as keyof UserAuthType}
          id="password"
        />
      </div>
      <div className={styles.input_wrapper}>
        <label htmlFor="auth-confirm-password">Confirm Password</label>
        <input
          type="password"
          name={"confirm_password" as keyof UserAuthType}
          id="auth-confirm-password"
        />
      </div>

      <div className={`${styles.input_wrapper}`}>
        <label htmlFor="asCreator">sign up as creator</label>
        <input
          type="checkbox"
          name={"asCreator" as keyof UserAuthType}
          id="asCreator"
        />
      </div>

      <button type="submit">SIGN UP</button>
    </Form>
  );
};

export const AuthLink: React.FC<{
  to: string;
  text: string;
  param?: PossibleAuthTypes;
}> = ({ to, text, param }) => {
  const [_1, setSearchParams] = useSearchParams();
  const paramsUrl = new URLSearchParams();
  return (
    <Link
      to={to}
      onClick={(e) => {
        e.preventDefault();
        if (param) {
          paramsUrl.set("type", param);
          setSearchParams(paramsUrl, { replace: true });
        }
      }}
    >
      {text}
    </Link>
  );
};

type PossibleAuthTypes = "sign_in" | "sign_up";

export const Auth: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const authType: PossibleAuthTypes = searchParams.get(
    "type"
  ) as PossibleAuthTypes;

  return (
    <div className={styles.auth_styled}>
      <div className={styles.auth_content_wrapper}>
        <div className={styles.auth_left}>
          <div className={styles.auth_logo_area}>
            <Logo />
          </div>
          {authType === "sign_up" ? <SignUpForm /> : <SignInForm />}
        </div>
        <div className={styles.auth_right}>
          <p className={styles.auth_right_header}>
            <span></span>
            {authType === "sign_up" ? "or sign up using" : "or sign in using"}
            <span></span>
          </p>
          <ul>
            <li>
              <svg>
                <use xlinkHref="#google"></use>
              </svg>
              <AuthLink
                to={`${location.pathname}${location.search}`}
                text=""
              ></AuthLink>
            </li>

            <li>
              <svg>
                <use xlinkHref="#meta"></use>
              </svg>
              <AuthLink
                to={`${location.pathname}${location.search}`}
                text=""
              ></AuthLink>
            </li>

            <li>
              <svg>
                <use xlinkHref="#linkedin"></use>
              </svg>
              <AuthLink
                to={`${location.pathname}${location.search}`}
                text=""
              ></AuthLink>
            </li>

            <li>
              <svg>
                <use xlinkHref="#github"></use>
              </svg>
              <AuthLink
                to={`${location.pathname}${location.search}`}
                text=""
              ></AuthLink>
            </li>
          </ul>

          {authType === "sign_up" ? (
            <div className={styles.auth_optional_redirect_area}>
              <span>already have an account?</span>{" "}
              <AuthLink to="/auth?type=sign_in" text="login" param="sign_in" />
            </div>
          ) : (
            <div className={styles.auth_optional_redirect_area}>
              <span>don't have an account?</span>
              <AuthLink
                to="/auth?type=sign_up"
                text="sign up"
                param="sign_up"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type AuthResolveType = {
  refresh: string;
  access: string;
};

export const action: ActionFunction = async (args) => {
  const { request } = args;
  const reqJson: { intent: AuthUserIntentType; payload: object } =
    await request.json();
  switch (reqJson.intent) {
    case "SIGN_IN": {
      let payloadJson: UserAuthPayloadType =
        reqJson.payload as UserAuthPayloadType;
      switch (payloadJson.role) {
        case "student":
          console.log("signing in with student credentials");
          break;
        default:
          console.log("signing in with creator credentials");
      }
      console.table(payloadJson);
      break;
    }
    case "SIGN_UP": {
      let payloadJson: UserAuthPayloadType =
        reqJson.payload as UserAuthPayloadType;
      switch (payloadJson.role) {
        case "student":
          console.log("signing up with student credentials");
          break;
        default:
          console.log("signing up with creator credentials");
      }
      console.table(payloadJson);
      break;
    }
    default: {
      break;
    }
  }
  try {
    // const response = await axios.post(
    //   `${BASE_URL}/auth/token`,
    //   JSON.stringify(requestBody),
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    // if (response.status === 401) {
    //   throw new Response("user not authenticated", { status: 401 });
    // } else if (response.status === 200) {
    //   const body: AuthResolveType = await response.data;
    //   AuthDao.setAccessToken(body.access);
    //   AuthDao.setRefreshToken(body.refresh);
    //   updateInterceptorWithToken();
    //   return redirect("/", { status: 200 });
    // } else {
    //   throw response;
    // }
  } catch (err) {
    // console.error(
    //   "an error occurred while trying to submit the authentication credentials",
    //   err
    // );
  }

  return json({});
};

export default Auth;
