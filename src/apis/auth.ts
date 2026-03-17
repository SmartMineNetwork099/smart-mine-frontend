import { AxiosError } from "axios";
import axios from "axios";
import api from "./axios";
import {
  clearAccessToken,
  clearWalletSession,
  getWalletSession,
  saveWalletSession,
  setCurrentWalletAccessToken,
} from "@/utils/authSession";
import { normalizeWalletAddress } from "@/utils/func";

const API = process.env.NEXT_PUBLIC_API_BASE;

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  message: string;
  userId: string;
  walletAddress: string;
  status?: string;
  freeze?: boolean;
  referralLink?: string | null;
  image_url?: string | null;
  referredBy?: string | null;
};

// Get Nonce
export const getNonceApi = async (
  walletAddress: string,
  ref: string | null = null,
) => {
  try {
    const res = await api.post<{ nonce: string }>(`/api/auth/nonce`, {
      walletAddress,
      ref,
    });
    return { data: res?.data, error: null };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      data: null,
      error: error.response?.data?.message ?? "error try again.",
    };
  }
};

// Verify Signature
export const verifySignatureApi = async (
  walletAddress: string,
  signature: string,
) => {
  try {
    const res = await api.post<AuthResponse>(`/api/auth/verify`, {
      walletAddress,
      signature,
    });
    return { data: res?.data, error: null };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      data: null,
      error: error.response?.data?.message ?? "error try again.",
    };
  }
};

export const persistAuthSession = async (authData: AuthResponse) => {
  const normalizedWallet = normalizeWalletAddress(authData?.walletAddress);

  if (!normalizedWallet || !authData?.accessToken || !authData?.refreshToken) {
    throw new Error("Incomplete auth session data");
  }

  await saveWalletSession(normalizedWallet, {
    ...authData,
    walletAddress: normalizedWallet,
  });
};

export const restoreWalletSession = async (walletAddress: string) => {
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  if (!normalizedWallet) {
    clearAccessToken();
    return { success: false, message: "Wallet address is required." };
  }

  const storedSession: any = await getWalletSession(normalizedWallet);
  const refreshToken = storedSession?.refreshToken;

  if (!refreshToken) {
    clearAccessToken();
    return {
      success: false,
      message: "Refresh token not found for this wallet.",
    };
  }

  try {
    const res = await axios.get<AuthResponse & { ok: boolean }>(
      `${API}/api/auth/refreshAccessToken`,
      {
        headers: {
          "x-refresh-token": refreshToken,
        },
      },
    );

    await saveWalletSession(normalizedWallet, {
      ...storedSession,
      ...res.data,
      walletAddress: normalizeWalletAddress(res.data.walletAddress) || normalizedWallet,
    });

    return { success: true, data: res.data };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const status = error.response?.status;
    console.log(status,'statusstatusstatus')

    if (status === 401 || status === 403) {
      await clearWalletSession(normalizedWallet);
    }

    return {
      success: false,
      message: error.response?.data?.message ?? "Unable to restore session.",
    };
  }
};

export const silentLogin = async (walletAddress: string) => {
  return restoreWalletSession(walletAddress);
};

export const hydrateAccessTokenForWallet = async (walletAddress: string) => {
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  if (!normalizedWallet) {
    clearAccessToken();
    return null;
  }

  const session: any = await getWalletSession(normalizedWallet);
  if (!session?.refreshToken) {
    clearAccessToken();
    return null;
  }

  const restoreResult = await restoreWalletSession(normalizedWallet);
  if (!restoreResult?.success || !restoreResult?.data?.accessToken) {
    return null;
  }

  setCurrentWalletAccessToken(normalizedWallet, restoreResult.data.accessToken);
  return restoreResult.data.accessToken;
};

export const logout = async (walletAddress?: string) => {
  const normalizedWallet = normalizeWalletAddress(walletAddress || "");
  const session: any = normalizedWallet
    ? await getWalletSession(normalizedWallet)
    : null;
  const refreshToken = session?.refreshToken;

  try {
    const res = await api.post(
      `/api/auth/logout`,
      refreshToken ? { refreshToken } : {},
      refreshToken
        ? {
            headers: {
              "x-refresh-token": refreshToken,
            },
          }
        : undefined,
    );

    return { data: null, message: res?.data?.message || null };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return {
      data: null,
      error: error.response?.data?.message ?? "error try again.",
    };
  } finally {
    await clearWalletSession(normalizedWallet);
  }
};
