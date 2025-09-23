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
                <div className='flex items-center justify-between sm:justify-start gap-2 mt-3 text-gray-300 text-sm sm:text-base'>
                    <div className='border border-green-500 rounded-lg py-2 px-3'>
                        <p className='font-semibold'>Direct Team</p>
                        <p className=''>{stats?.directTeam || 0}</p>
                    </div>
                    <div className='border border-green-500 rounded-lg py-2 px-3'>
                        <p className='font-semibold'>Community Size</p>
                        <p className=''>{stats?.communitySize || 0}</p>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default NetworkOverview
