export const BASE_URL: string =
  import.meta.env.VITE_ENV === "prod"
    ? import.meta.env.VITE_BASE_URL_PROD
    : import.meta.env.VITE_BASE_URL_DEV;

export const IMAGE_URL: string =
  import.meta.env.VITE_ENV === "prod"
    ? import.meta.env.VITE_IMAGE_URL_PROD
    : import.meta.env.VITE_IMAGE_URL_DEV;

export const FAKE_REQUEST_DELAY = 2000;

export const v3Config = {
  apiUrl: `${BASE_URL}/api/v2`,
  imageAPIUrl: `${IMAGE_URL}/api/v1/images`,
};
