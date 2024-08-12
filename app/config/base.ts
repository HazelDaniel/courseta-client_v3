import axios from "axios";
import { AuthDao } from "~/dao/auth";

export const BASE_URL: string =
  import.meta.env.VITE_ENV === "dev"
    ? import.meta.env.VITE_BASE_URL_DEV
    : import.meta.env.VITE_BASE_URL_PROD;
export const FAKE_REQUEST_DELAY = 2000;

export const v3Config = {
  apiUrl: `${BASE_URL}/api/v1`,
}

// export const updateInterceptorWithToken = () => {
  // const newToken = AuthDao.getAccessToken;
//   axios.interceptors.request.use((value) => {
//     if (newToken) {
//       value.headers.Authorization = `Bearer ${newToken}`;
//     }
//     return value;
//   });
// };
// updateInterceptorWithToken();
