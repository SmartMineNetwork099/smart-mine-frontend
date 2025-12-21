// src/hooks/useWallet.ts
import { useEffect, useState } from "react";
import { getUserWalletAddress } from "@/utils/walletHelpers";

export const useWalletAddress = () => {
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    getUserWalletAddress().then(res => {
      if (res?.success){
        const walletAddress = res?.userWalletAddress || null;
        setWallet(walletAddress);
        localStorage.setItem("activeWallet", walletAddress || "");
      } 
    });
  }, []);

  return wallet;
};
