import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { ActionFunction } from "react-router-dom";
import { Logo } from "~/components/logo";
import { useSearchParams, useLocation, json, Link } from "@remix-run/react";

// import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/auth.module.css";
import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  ActionResponseType,
  AuthUserIntentType,
  RedirectPayloadType,
  UserAuthPayloadType,
  UserAuthType,
  UserSigninActionType,
  UserSignupActionType,
} from "~/types";
import { serializeAuthFormForAction } from "~/serializers/auth.serializer";
import { v3Config } from "~/config/base";
import { commitSession, getSession } from "~/cookie.server";
import {
  jsonWithError,
  jsonWithSuccess,
  redirectWithSuccess,
  redirectWithToast,
} from "remix-toast";
import { ServerPayloadType } from "~/server.types";
import { LoaderFunction, redirect } from "@remix-run/node";
import { toast } from "sonner";

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const successMessage = session.get("X-Signup-Message");
  const successDescription = session.get("X-Signup-Description");
  const mutationReplaceCondition = session.get("X-Remix-Replace");

  const isSigninSuccess = !!successMessage;
  const sessionResult = await commitSession(session);

  if (isSigninSuccess) {
    return json(
      {
        redirectPayload: {
          location: "./?type=login",
          replace: mutationReplaceCondition,
          message: {
            text: successMessage,
            description: successDescription,
          },
        } as RedirectPayloadType,
      },
      {
        headers: {
          "Set-Cookie": sessionResult,
        },
      }
    );
  }
  return json(
    { redirectPayload: {} },
    {
      headers: {
        "Set-Cookie": sessionResult,
      },
    }
  );
};

export const SignInForm: React.FC = () => {
  const [isCreatorStatus, setCreatorStatus] = useState<boolean>(false);
  const { Form, submit, state } = useFetcher({ key: "sign-in-fetcher" });
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

      <button type="submit" className="with_loader" disabled={state === "submitting"}>
        SIGN IN
        <div
          className={`button_loader${
            state === "submitting" ? " submitting" : ""
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </Form>
  );
};

export const SignupCheckBox: React.FC = () => {
  const [paramsState] = useSearchParams();
  const userType: "creator" | "student" | string | null =
    paramsState.get("role");
  const [checked, setChecked] = useState(userType === "creator");

  return (
    <input
      type="checkbox"
      name={"asCreator" as keyof UserAuthType}
      id="asCreator"
      checked={checked}
      onChange={() => setChecked((prev) => !prev)}
    />
  );
};

export const SignUpForm: React.FC = () => {
  const { Form, submit, state } = useFetcher({ key: "sign-up-fetcher" });
  const { redirectPayload }: { redirectPayload: RedirectPayloadType } =
    useLoaderData<typeof loader>() as { redirectPayload: RedirectPayloadType };
  const [paramsState, setParamsState] = useSearchParams();

  useEffect(() => {
    if (redirectPayload.replace && redirectPayload.location) {
      const destParams = new URLSearchParams();
      destParams.set("type", "sign_in");
      setParamsState(destParams, { replace: true });
      if (redirectPayload.message)
        toast.info(redirectPayload.message.text, {
          description: redirectPayload.message.description,
        });
    }
  }, [redirectPayload]);
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
        {/* here */}
        <SignupCheckBox />
      </div>

      <button type="submit" className="with_loader" disabled={state === "submitting"}>
        SIGN UP
        <div
          className={`button_loader${
            state === "submitting" ? " submitting" : ""
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
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
  const submit = useSubmit();
  const authType: PossibleAuthTypes = searchParams.get(
    "type"
  ) as PossibleAuthTypes;

  useEffect(() => {
    try {
      const user_id = searchParams.get("user_id");
      const verification_id = searchParams.get("verification_id");
      if (!user_id || !verification_id) return;
      const submitPayload: {
        intent: AuthUserIntentType;
        payload: { user_id: string; verification_id: string };
      } = {
        intent: "VERIFY",
        payload: {
          user_id,
          verification_id,
        },
      };
      submit(submitPayload as any, {
        action: "./",
        method: "post",
        encType: "application/json",
        navigate: false,
        replace: true,
      });
    } catch (err) {
      console.error(err);
    }
  }, [searchParams]);

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

export const action: ActionFunction = async (args) => {
  const { request, params } = args;

  const session = await getSession(request.headers.get("Cookie"));
  const reqJson: { intent: AuthUserIntentType; payload: object } =
    await request.json();
  try {
    switch (reqJson.intent) {
      case "SIGN_IN": {
        let payloadJson: UserAuthPayloadType =
          reqJson.payload as UserAuthPayloadType;
        switch (payloadJson.role) {
          case "student":
            const studentLoginRequest = await axios.post(
              `${v3Config.apiUrl}/students/auth/login`,
              payloadJson
            );
            const responsePayload: ServerPayloadType<null> =
              studentLoginRequest.data;
            const cookieHeader =
              studentLoginRequest.headers["set-cookie"] ||
              studentLoginRequest.headers["Set-Cookie"];
            if (responsePayload.user) {
              return redirectWithSuccess(
                `/${responsePayload.user.role}s/${responsePayload.user.id}/dashboard`,
                {
                  message: "signed in successfully!",
                },
                {
                  headers: {
                    "Set-Cookie": `${cookieHeader}`,
                  },
                }
              );
            } else {
              return jsonWithError(null, "sign in failed!. please try again.");
            }
          default: {
            const creatorLoginRequest = await axios.post(
              `${v3Config.apiUrl}/creators/auth/login`,
              payloadJson
            );
            const responsePayload: ServerPayloadType<null> =
              creatorLoginRequest.data;
            const cookieHeader =
              creatorLoginRequest.headers["set-cookie"] ||
              creatorLoginRequest.headers["Set-Cookie"];
            if (responsePayload.user) {
              throw redirect(
                `/${responsePayload.user.role}s/${responsePayload.user.id}/dashboard`,
                {
                  headers: {
                    "Set-Cookie": `${cookieHeader}`,
                  },
                }
              );
            } else {
              
              return jsonWithError(null, "sign in failed!. please try again.");
            }
          }
        }
      }
      case "SIGN_UP": {
        let payloadJson: UserAuthPayloadType =
          reqJson.payload as UserAuthPayloadType;
        switch (payloadJson.role) {
          case "student": {
            const studentSignupRequest = await axios.post(
              `${v3Config.apiUrl}/students/auth/signup`,
              payloadJson
            );
            if (studentSignupRequest.status === 201) {
              session.flash(
                "X-Signup-Message",
                `user registered successfully!`
              );
              session.flash(
                "X-Signup-Description",
                `you can now check your email to verify you account`
              );
              session.flash("X-Remix-Replace", true);
              return jsonWithSuccess(null, "success!", {
                headers: {
                  "Set-Cookie": await commitSession(session),
                },
              });
            }
            return jsonWithError(null, "sign up failed!. please try again.");
          }
          default:
            const creatorSignupRequest = await axios.post(
              `${v3Config.apiUrl}/creators/auth/signup`,
              payloadJson
            );
            const responsePayload: ServerPayloadType<null> =
              creatorSignupRequest.data;
            if (creatorSignupRequest.status === 201) {
              session.flash(
                "X-Signup-Message",
                `user registered successfully!`
              );
              session.flash(
                "X-Signup-Description",
                `you can now check your email to verify you account and get your creator pass later`
              );
              session.flash("X-Remix-Replace", true);
              return jsonWithSuccess(null, "success!", {
                headers: {
                  "Set-Cookie": await commitSession(session),
                },
              });
            }
            return jsonWithError(null, "sign up failed!. please try again.");
        }
      }
      case "VERIFY": {
        const { user_id, verification_id } = reqJson.payload as any;
        if (!user_id || !verification_id)
          return jsonWithError(null, "no verification credentials provided");
        const userVerificationRequest = await axios.get(
          `${v3Config.apiUrl}/verify?user_id=${user_id}&verification_id=${verification_id}`
        );
        if (userVerificationRequest.status === 200) {
          return redirectWithSuccess(
            "/auth?type=sign_in",
            "verified successfully!"
          );
        }
      }
    }
  } catch (err) {
    if (err instanceof Response && err.status >= 300 && err.status < 400) {
      throw err;
    }
    return jsonWithError(null, err instanceof Error ? err.message : "");
  }
};

export default Auth;
