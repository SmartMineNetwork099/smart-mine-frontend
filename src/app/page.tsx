
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
export default function Home() {
    const router = useRouter();
    const userID = getUserIdFromWallet()
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem(`token_${userID}`) : null;
        if (token) {
            router.replace(ROUTES?.STACKING?.DASHBOARD);
        } else {
            router.replace(ROUTES?.AUTH?.LOGIN);
        }
    }, [router, userID]);
    return null;
}
