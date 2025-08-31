
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
export default function Home() {
    const router = useRouter();
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            router.replace(ROUTES?.STACKING?.DASHBOARD);
        } else {
            router.replace(ROUTES?.AUTH?.LOGIN);
        }
    }, []);
    return null;
}
