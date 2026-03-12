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
  (config) => config,
  (error) => Promise.reject(error),
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
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }
      /////////////////////////////
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/api/auth/refreshAccessToken"); // ✅ cookie update ho jayegi
        processQueue(null, true);
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
  },
);

export default api;
