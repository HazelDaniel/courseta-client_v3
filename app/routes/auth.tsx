import { Navigate } from "@remix-run/react";
import {
  ActionFunction,
  Form,
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

// export const links: LinksFunction = () => {
//   return [{ rel: "stylesheet", href: styles }];
// };

export const SignInForm: React.FC = () => {
  const signInSubmit = useSubmit();

  if (AuthDao.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <Form
      className={styles.auth_form}
      method="post"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        let email: string = (formData.get("email") as string) || "";
        let password: string = (formData.get("password") as string) || "";
        email = email.trim();
        password = password.trim();
        const res = { email, password };
        signInSubmit(res, {
          method: "POST",
          encType: "application/json",
        });
      }}
    >
      <div className={styles.input_wrapper}>
        <label htmlFor="auth-email">Email</label>
        <input type="email" name="email" id="auth-email" />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="auth-password">Password</label>
        <input type="password" name="password" id="auth-password" />
      </div>
      <button type="submit">SIGN IN</button>
    </Form>
  );
};

export const SignUpForm: React.FC = () => {
  if (AuthDao.isAuthenticated) {
    return <Navigate to={"/"} replace={true} />;
  }
  return (
    <Form className={styles.auth_form}>
      <div className={styles.input_wrapper}>
        <label htmlFor="auth-first-name">First Name</label>
        <input type="text" name="first_name" id="auth-first-name" />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="auth-last-name">Last Name</label>
        <input type="text" name="last_name" id="auth-last-name" />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="auth-email">Email</label>
        <input type="email" name="email" id="auth-email" />
      </div>

      <div className={`${styles.input_wrapper} ${styles.breaker}`}>
        <label htmlFor="auth-phone">Phone</label>
        <input type="tel" name="phone" id="auth-phone" />
      </div>

      <div className={styles.input_wrapper}>
        <label htmlFor="auth-password">Password</label>
        <input type="password" name="password" id="auth-password" />
      </div>
      <div className={styles.input_wrapper}>
        <label htmlFor="auth-confirm-password">Confirm Password</label>
        <input
          type="password"
          name="confirm_password"
          id="auth-confirm-password"
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

// TODO: don't forget to add form validation logic
export const action: ActionFunction = async (args) => {
  const { request } = args;
  const requestBody = await request.json();
  // console.log("action getting hit by a ", request.method, "method");
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/token`,
      JSON.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 401) {
      console.log(" response status is ", response.status);
      throw new Response("user not authenticated", { status: 401 });
    } else if (response.status === 200) {
      const body: AuthResolveType = await response.data;
      AuthDao.setAccessToken(body.access);
      AuthDao.setRefreshToken(body.refresh);
      updateInterceptorWithToken();
      return redirect("/", { status: 200 });
    } else {
      throw response;
    }
  } catch (err) {
    console.error(
      "an error occurred while trying to submit the authentication credentials",
      err
    );
  }
  // const formdata: FormData | null =
  //   request.method === "POST" ? await request.formData() : null;
  // console.log("form data is ", formdata);
  // let searchTerm: string | null;
  // if (formdata) {
  //   console.log(Object.fromEntries(formdata));
  //   searchTerm = formdata.get("search") as string;
  //   console.log("search term is ", searchTerm);
  // }
  console.log(" request  body is ", requestBody);
  return json({});
};

export default Auth;
