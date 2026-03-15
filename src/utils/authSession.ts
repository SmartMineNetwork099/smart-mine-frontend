import { deleteUserData, getUserData } from "@/db/getData";
import { upsertUserData } from "@/db/saveData";
import { normalizeWalletAddress } from "@/utils/func";

export const ACCESS_TOKEN_KEY = "accessToken";
export const ACCESS_TOKEN_WALLET_KEY = "accessTokenWallet";
export const ACTIVE_WALLET_KEY = "activeWallet";
//  const normalizedWallet:any = normalizeWalletAddress(walletAddress);
// if (!normalizedWallet) return null;

export type WalletSessionPayload = {
  accessToken?: string | null;
  refreshToken?: string | null;
  walletAddress?: string | null;
  userId?: string | null;
  [key: string]: any;
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (
  accessToken: string,
  walletAddress?: string | null,
) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (walletAddress) {
     const normalizedWallet = normalizeWalletAddress(walletAddress);
     if (!normalizedWallet) return null;
    localStorage.setItem(ACCESS_TOKEN_WALLET_KEY, normalizedWallet);
  }
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_WALLET_KEY);
};

export const getActiveWallet = () => {
  if (typeof window === "undefined") return null;
  const activeWalletAddress = localStorage.getItem(ACTIVE_WALLET_KEY);
  const normalizedWallet = normalizeWalletAddress(activeWalletAddress)
  if (!normalizedWallet) return null;
  return normalizedWallet;
};

export const setActiveWallet = (walletAddress: string) => {
  if (typeof window === "undefined") return;
 const normalizedWallet = normalizeWalletAddress(walletAddress);
 if (!normalizedWallet) return null;
  localStorage.setItem(ACTIVE_WALLET_KEY, normalizedWallet);
};

export const clearActiveWallet = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVE_WALLET_KEY);
};

export const getWalletSession = async (walletAddress: string) => {
  const normalizedWallet = normalizeWalletAddress(walletAddress);
  if (!normalizedWallet) return null;
  return getUserData(normalizedWallet);
};

export const saveWalletSession = async (
  walletAddress: string,
  payload: WalletSessionPayload,
) => {
  const normalizedWallet = normalizeWalletAddress(
    payload.walletAddress || walletAddress,
  );

  if (!normalizedWallet) {
    throw new Error("Invalid wallet address");
  }

  const { accessToken, ...persistedPayload } = payload;

  if (accessToken) {
    setAccessToken(accessToken, normalizedWallet);
  }

  setActiveWallet(normalizedWallet);

  await upsertUserData(normalizedWallet, {
    ...persistedPayload,
    accessToken: null,
    walletAddress: normalizedWallet,
  });
};

export const clearWalletSession = async (walletAddress?: string | null) => {
  const normalizedWallet = normalizeWalletAddress(walletAddress || getActiveWallet());

  if (!normalizedWallet) {
    clearAccessToken();
    clearActiveWallet();
    return;
  }

  await deleteUserData(normalizedWallet);

  if (getActiveWallet() === normalizedWallet) {
    clearAccessToken();
    clearActiveWallet();
  }
};

export const setCurrentWalletAccessToken = (
  walletAddress: string,
  accessToken: string,
) => {
  const normalizedWallet = normalizeWalletAddress(walletAddress);
  if (!normalizedWallet) return;
  setActiveWallet(normalizedWallet);
  setAccessToken(accessToken, normalizedWallet);
};

export const getAccessTokenWallet = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_WALLET_KEY);
};
