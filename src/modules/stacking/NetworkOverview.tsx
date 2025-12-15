"use client"
import React, { useEffect, useState } from "react";
import { getTeamStats } from "@/apis/user";
import TeamStats from "@/components/TeamStats";
import { useWalletAddress } from "@/hooks/useWallet";

const NetworkOverview = () => {
    const [stats, setStats] = useState<{ directTeam: number; communitySize: number } | null>(null);
    const walletAddress = useWalletAddress();
    useEffect(() => {
        if (walletAddress) fetchStats();
    }, [walletAddress]);
    const fetchStats = async () => {
        if(!walletAddress) return;
        const { data, error } = await getTeamStats(walletAddress);
        if (error) {
            console.error(error);
        } else {
            setStats(data);
        }
    };
    return (
        <>
            <TeamStats data={stats} />
        </>
    )
}

export default NetworkOverview
