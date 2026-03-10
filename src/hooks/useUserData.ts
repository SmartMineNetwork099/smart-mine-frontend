// hooks/useUserData.ts
import { useEffect, useState , useCallback } from "react";
import { getUserData } from "@/db/getData";
import { normalizeWalletAddress } from "@/utils/func";
import { useWalletAddress } from "@/hooks/useWallet";

export const useUserData = () => {
  const rawWalletAddress = useWalletAddress();
  const walletAddress = normalizeWalletAddress(useWalletAddress());
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser =  useCallback(async () => {
    if (!walletAddress) return null;

    setLoading(true);
    try {
      const data = await getUserData(walletAddress);
      setUserData(data || null);
      return data;
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    fetchUser();
  }, [walletAddress , fetchUser]);

    useEffect(() => {
    const handleWalletUpdated = (event: any) => {
      const updatedWallet = normalizeWalletAddress(event?.detail?.walletAddress);
      if (updatedWallet && updatedWallet === walletAddress) {
        fetchUser();
      }
    };
    window.addEventListener("wallet-updated", handleWalletUpdated);

    return () => {
      window.removeEventListener("wallet-updated", handleWalletUpdated);
    };
  }, [walletAddress, fetchUser]);

  return {
    userData,
    loading,
    walletAddress,
    status: userData?.status ?? "inActive",
    isFreeze: userData?.freeze ?? true,
    refreshUser: fetchUser,
  };
};