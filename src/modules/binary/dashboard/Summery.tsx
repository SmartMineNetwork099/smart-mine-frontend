'use client';
import React, { useEffect, useState } from 'react';
import TeamStats from '@/components/TeamStats';
import { getTeamStats } from '@/apis/user';

const Summery = () => {
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
    );
};

export default Summery;
