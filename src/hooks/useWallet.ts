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
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getConnectedWalletAddress();
      console.log(res,'rreeddssaa')

      if (res.success) {
        const normalized:any = normalizeWalletAddress(res.userWalletAddress);
        setWallet(normalized);
        if (normalized) {
          setActiveWallet(normalized);
        }
      } else {
        console.log("Wallet not connected:", res.message);
        setWallet(null);
        
          clearAccessToken();
          clearActiveWallet();
        
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
      window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, []);

  return wallet;
};
