"use client"
import React, { useEffect, useState } from "react";
import Card from '@/components/Card'
import { getTeamStats } from "@/apis/user";
import { getUserWalletAddress } from "@/utils/walletHelpers";

const NetworkOverview = () => {
    const [stats, setStats] = useState<{ directTeam: number; communitySize: number } | null>(null);
    const walletAddress = getUserWalletAddress();
    useEffect(() => {
        if (walletAddress) fetchStats();
    }, [walletAddress]);
    const fetchStats = async () => {
        if (!walletAddress) return;
        const { data, error } = await getTeamStats(walletAddress);
        if (error) {
            console.error(error);
        } else {
            setStats(data);
        }
    };
    return (
        <>
            <Card className='mt-4'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                    Network <span className='text-green-500'>Overview</span>
                </p>
                <div className='flex items-center justify-between sm:justify-start mt-3 gap-0 sm:gap-4 text-gray-300 text-sm sm:text-base'>
                    <div className='border-2 border-green-500 rounded-lg py-2 px-3 w-[45%] sm:w-52'>
                        <p className='font-semibold'>Direct Team</p>
                        <p className=''>{stats?.directTeam || 0}</p>
                    </div>
                    <div className='border-2 border-green-500 rounded-lg py-2 px-3 w-[54%] sm:w-52' >
                        <p className='font-semibold'>Community Size</p>
                        <p className=''>{stats?.communitySize || 0}</p>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default NetworkOverview
