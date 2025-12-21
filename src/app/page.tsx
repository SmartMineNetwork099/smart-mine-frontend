
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { useWalletAddress } from "@/hooks/useWallet";
export default function Home() {
    const router = useRouter();
    const walletAddress = useWalletAddress()
    useEffect(() => {
        if(!walletAddress) return;
        const accessToken = typeof window !== "undefined" ? localStorage.getItem(`accessToken_${walletAddress}`) : null;
        if (accessToken) {
            router.replace(ROUTES?.STACKING?.DASHBOARD);
        }
        //  else {
            // router.replace(ROUTES?.AUTH?.LOGIN);
        // }
    }, [router , walletAddress]);
    return null;
}
