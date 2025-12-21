import ROUTES from "@/constants/routes";
import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE;

const api = axios.create({
  baseURL: API,
  withCredentials: true, // 🔑 refresh token cookie ke liye
});

/* =========================
   🔐 REFRESH LOCK STATE
========================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
/* =========================
   REQUEST INTERCEPTOR
   ========================= */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      ////////////////////////////////////////
      const skipAuth =
        config.url?.includes("/api/auth/nonce") ||
        config.url?.includes("/api/auth/verify") ||
        config.url?.includes("/api/auth/refreshAccessToken");

      if (!skipAuth) {
        const walletAddress = localStorage.getItem("activeWallet");
        const accessToken = walletAddress
          ? localStorage.getItem(`accessToken_${walletAddress}`)
          : null;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      ///////////////////////////////////////
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   (AUTO REFRESH TOKEN)
   ========================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refreshAccessToken")
    ) {
      //////////////////////////////
      if (isRefreshing) {
        // ⏳ wait for refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }
      /////////////////////////////
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.get("/api/auth/refreshAccessToken");
        const accessToken = res?.data?.accessToken;
        const walletAddress = localStorage.getItem("activeWallet");
        if (walletAddress) {
          localStorage.setItem(`accessToken_${walletAddress}`, accessToken);
        }
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        // 🔥 refresh token invalid / expired
        processQueue(err, null);
        localStorage.removeItem("activeWallet");
        // optional: clear all access tokens
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("accessToken_")) {
            localStorage.removeItem(key);
          }
        });
        window.location.href = ROUTES?.AUTH?.LOGIN;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
