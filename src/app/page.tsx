
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useWalletAddress } from "@/hooks/useWallet";
import { normalizeWalletAddress } from "@/utils/func";
export default function Home() {
    const router = useRouter();
    const walletAddress = useWalletAddress()
    const normalizedWalletAddress = normalizeWalletAddress(walletAddress);

    useEffect(() => {
        if(!normalizedWalletAddress) return;
        const accessToken = typeof window !== "undefined" ? localStorage.getItem(`accessToken_${normalizedWalletAddress}`) : null;
        if (accessToken) {
            router.replace(ROUTES?.STACKING?.DASHBOARD);
        }
        //  else {
            // router.replace(ROUTES?.AUTH?.LOGIN);
        // }
    }, [router , normalizedWalletAddress]);
    return null;
}
