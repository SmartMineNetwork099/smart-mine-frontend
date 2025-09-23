"use client"
import React, { useEffect, useState } from "react";
import Card from '@/components/Card'
import { getTeamStats } from "@/apis/user";
import { getUserWalletAddress } from "@/utils/walletHelpers";

const NetworkOverview = () => {
    const [stats, setStats] = useState<{ directTeam: number; communitySize: number } | null>(null);
    const [loading, setLoading] = useState(true);

    const walletAddress = getUserWalletAddress();
    useEffect(() => {
        if (!walletAddress) {
            setLoading(false); // agar wallet nahi mila to loading false kar do
            return;
        }
        const fetchStats = async () => {
            setLoading(true);
            const { data, error } = await getTeamStats(walletAddress);
            if (error) {
                console.error(error);
            } else {
                setStats(data);
            }
            setLoading(false);
        };

        if (walletAddress) fetchStats();
    }, [walletAddress]);
    console.log(stats, 'statsstats')

    return (
        <>
            <Card className='mt-4'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                    Network <span className='text-green-500'>Overview</span>
                </p>
                <div className='flex items-center justify-between sm:justify-start gap-2 mt-3 text-gray-300'>
                    <div className='border border-green-500 rounded-lg p-2'>
                        <p>Direct Team</p>
                        <p className='text-sm sm:text-base'>{stats?.directTeam || 0}</p>
                    </div>
                    <div className='border border-green-500 rounded-lg p-2'>
                        <p>Community Size</p>
                        <p className='text-sm sm:text-base'>{stats?.communitySize || 0}</p>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default NetworkOverview
