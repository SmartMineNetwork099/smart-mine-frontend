// src/hooks/useWallet.ts
import { useEffect, useState } from "react";
import { getUserWalletAddress } from "@/utils/walletHelpers";
import { normalizeWalletAddress } from "@/utils/func";

export const useWalletAddress = () => {
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    getUserWalletAddress().then(res => {
      if (res?.success){
        console.log("Fetched wallet address:", res?.userWalletAddress);
        const walletAddress = res?.userWalletAddress || null;
        const normalizedWalletAddress = normalizeWalletAddress(walletAddress);
        setWallet(normalizedWalletAddress);
        localStorage.setItem("activeWallet", normalizedWalletAddress || "");
      } 
    });
  }, []);

  return wallet;
};
