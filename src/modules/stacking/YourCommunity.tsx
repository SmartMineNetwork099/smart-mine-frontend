'use client'
import React, { useEffect, useState } from 'react'
import StakingTable from '@/components/StakingTable';
import { getReferralsAtLevel } from '@/apis/user';
import Pagination from '@/components/Pagination';
import { io } from "socket.io-client";

const YourCommunity = () => {
    const [tableData, setTableData] = useState<any>([]);
    const [walletAddress, setWalletAddress] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const walletDataString = localStorage.getItem("walletData");
        const referralLink = walletDataString ? JSON.parse(walletDataString) : null;
        setWalletAddress(referralLink?.walletAddress)
    }, []);

    const getLevelData = async (LevelNumber: number = 1) => {
        if (!walletAddress) return;
        try {
            setLoading(true);
            const response = await getReferralsAtLevel(walletAddress, LevelNumber);
            setTableData(Array.isArray(response?.data) ? response.data : []);
            console.log(response?.data, "referrals data");
        } catch (error) {
            console.error("Error fetching referrals:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (walletAddress) {
            getLevelData(page);
        }
    }, [walletAddress, page]);

    const socket = io(process.env.NEXT_PUBLIC_API_BASE, {
        transports: ["websocket"],
    });
    // 👇 Real-time listener for status updates
    useEffect(() => {
        socket.on("statusUpdated", (data) => {
            setTableData((prev: any) =>
                prev.map((user: any) =>
                    user._id === data.userId
                        ? { ...user, status: data.status }
                        : user
                )
            );
        });

        return () => {
            socket.off("statusUpdated");
        };
    }, []);
    return (
        <div className='p-4'>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>
                Your <span className='text-green-500'>Community</span>
            </p>
            <div className='my-2'>
                <Pagination currentPage={page} onPageChange={setPage} />
            </div>
            <StakingTable data={tableData} loading={loading} />
        </div>
    );
}

export default YourCommunity;
