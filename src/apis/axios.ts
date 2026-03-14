import ROUTES from "@/constants/routes";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

/* =========================
   REFRESH STATE
========================= */
let isRefreshing = false;
let isRedirecting = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const shouldSkipRefresh = (url = "") => {
  const skipUrls = [
    "/api/auth/nonce",
    "/api/auth/verify",
    "/api/auth/refreshAccessToken",
    "/api/auth/logout",
    "/api/auth/login",
  ];

  return skipUrls.some((path) => url.includes(path));
};

const clearClientAuthState = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("activeWallet");

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("accessToken_")) {
      localStorage.removeItem(key);
    }
  });
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (isRedirecting) return;

  isRedirecting = true;
  clearClientAuthState();

  const loginRoute = ROUTES?.AUTH?.LOGIN || "/auth/login";
  window.location.replace(loginRoute);
};

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = originalRequest.url || "";

    if (
      status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh(requestUrl)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/api/auth/refreshAccessToken", {
          withCredentials: true,
        });

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Agar refresh endpoint khud fail ho jaye
    if (
      status === 401 &&
      requestUrl.includes("/api/auth/refreshAccessToken")
    ) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default api;