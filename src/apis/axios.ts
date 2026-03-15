import ROUTES from "@/constants/routes";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  clearWalletSession,
  getAccessToken,
  getActiveWallet,
  getWalletSession,
  saveWalletSession,
  setCurrentWalletAccessToken,
} from "@/utils/authSession";
import { normalizeWalletAddress } from "@/utils/func";

const API = process.env.NEXT_PUBLIC_API_BASE;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: API,
});

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

const redirectToLogin = async () => {
  if (typeof window === "undefined" || isRedirecting) return;

  isRedirecting = true;
  const activeWallet = getActiveWallet();
  await clearWalletSession(activeWallet);

  const loginRoute = ROUTES?.AUTH?.LOGIN || "/auth/login";
  window.location.replace(loginRoute);
};

const refreshCurrentWalletSession = async () => {
  const activeWallet = normalizeWalletAddress(getActiveWallet());

  if (!activeWallet) {
    throw new Error("No active wallet found");
  }

  const storedSession: any = await getWalletSession(activeWallet);
  const refreshToken = storedSession?.refreshToken;

  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  const response = await axios.get(`${API}/api/auth/refreshAccessToken`, {
    headers: {
      "x-refresh-token": refreshToken,
    },
  });

  await saveWalletSession(activeWallet, {
    ...storedSession,
    ...response.data,
    walletAddress: normalizeWalletAddress(response.data.walletAddress) || activeWallet,
  });

  setCurrentWalletAccessToken(
    normalizeWalletAddress(response.data.walletAddress) || activeWallet,
    response.data.accessToken,
  );

  return response.data.accessToken;
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
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
        const newAccessToken = await refreshCurrentWalletSession();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        await redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      status === 401 &&
      requestUrl.includes("/api/auth/refreshAccessToken")
    ) {
      await redirectToLogin();
    }

    return Promise.reject(error);
  },
);

export default api;
