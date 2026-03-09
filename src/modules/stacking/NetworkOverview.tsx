"use client"
import React, { useEffect, useState } from "react";
import { getTeamStats } from "@/apis/user";
import TeamStats from "@/components/TeamStats";

const NetworkOverview = () => {
    const [stats, setStats] = useState<{ directTeam: number; communitySize: number } | null>(null);
    useEffect(() => {
     fetchStats();
    }, []);
    const fetchStats = async () => {
        const { data, error } = await getTeamStats();
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
