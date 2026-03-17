"use client";
import { useEffect, useState } from "react";
import { getConnectedWalletAddress } from "@/utils/walletHelpers";
import { normalizeWalletAddress } from "@/utils/func";
import {
  clearAccessToken,
  clearActiveWallet,
  setActiveWallet,
} from "@/utils/authSession";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWalletAddress = () => {
  const [wallet, setWallet] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const load = async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const res = await getConnectedWalletAddress();
        console.log(res, "rreeddssaa");

        if (!isMounted) return;

        if (res.success) {
          const normalized: any = normalizeWalletAddress(res.userWalletAddress);
          setWallet(normalized);
          console.log(normalized, "normalizednormalizednormalizedv");
          if (normalized) {
            setActiveWallet(normalized);
          }
          return;
        }

        console.log("Wallet not connected:", res.message);
        console.log(res, "rrrrrrrrrreeessss");

        if (res.message === "Wallet not connected.") {
          setWallet(null);
          clearAccessToken();
          clearActiveWallet();
          return;
        }

        if (attempt < 5) {
          await sleep(250);
        }
      }

      if (isMounted) {
        setWallet(undefined);
      }
    };

    load();

    // ✅ handle wallet switching
    const onAccountsChanged = (accounts: string[]) => {
      const addr = accounts?.[0] ?? null;
      const normalized = addr ? normalizeWalletAddress(addr) : null;
      setWallet(normalized);

      if (normalized) setActiveWallet(normalized);
      else {
        clearAccessToken();
        clearActiveWallet();
      }
    };

    window.ethereum?.on?.("accountsChanged", onAccountsChanged);

    return () => {
      isMounted = false;
      window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, []);

  return wallet;
};
