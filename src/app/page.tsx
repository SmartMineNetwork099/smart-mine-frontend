
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
        const token = typeof window !== "undefined" ? localStorage.getItem(`token_${walletAddress}`) : null;
        if (token) {
            router.replace(ROUTES?.STACKING?.DASHBOARD);
        } else {
            router.replace(ROUTES?.AUTH?.LOGIN);
        }
    }, [router , walletAddress]);
    return null;
}
