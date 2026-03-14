import { AxiosError } from "axios";
import api from "./axios";

export const getMeApi = async () => {
  try {
    const res = await api.get("/api/auth/me");
    return { data: res.data, error: null };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      data: null,
      error: error.response?.data?.message ?? "Unauthorized",
    };
  }
};