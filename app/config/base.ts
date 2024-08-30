export const BASE_URL: string =
  import.meta.env.VITE_ENV === "dev"
    ? import.meta.env.VITE_BASE_URL_DEV
    : import.meta.env.VITE_BASE_URL_PROD;

export const IMAGE_URL: string =
  import.meta.env.VITE_ENV === "dev"
    ? import.meta.env.VITE_IMAGE_URL_DEV
    : import.meta.env.VITE_IMAGE_URL_PROD;

export const FAKE_REQUEST_DELAY = 2000;

export const v3Config = {
  apiUrl: `${BASE_URL}/api/v1`,
  imageAPIUrl: `${IMAGE_URL}/api/v1/images`
}