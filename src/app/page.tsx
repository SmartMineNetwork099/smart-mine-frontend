"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { getAccessToken } from "@/utils/authSession";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      router.replace(ROUTES?.STACKING?.DASHBOARD);
    } else {
      router.replace(ROUTES?.AUTH?.LOGIN);
    }
  }, [router]);

  return null;
}