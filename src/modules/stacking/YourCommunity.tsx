'use client'
import React, { useEffect, useState } from 'react'
import StakingTable from '@/components/tables/StakingTable';
import { getReferralsAtLevel } from '@/apis/user';
import Pagination from '@/components/Pagination';
// import { getSocket, initSocket } from "@/utils/socket";
import { useWalletAddress } from '@/hooks/useWallet';
import { IoMdArrowRoundBack } from 'react-icons/io';
import ROUTES from '@/constants/routes';
import { useRouter } from 'next/navigation';
// import Messages from '@/constants/messages';
// import { toast } from 'react-toastify';


const YourCommunity = () => {
    const [tableData, setTableData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const walletAddress = useWalletAddress();
    const router = useRouter();
    

    const getLevelData = async (LevelNumber: number = 1) => {
        if (!walletAddress) return;
        try {
            setLoading(true);
            const response = await getReferralsAtLevel(walletAddress, LevelNumber);
            setTableData(Array.isArray(response?.data) ? response?.data : []);
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

    // 👇 Unified real-time listener for wallet + status updates
    // useEffect(() => {
    //     if (!walletAddress) {
            // toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address'));
    //         return;
    //     }
    //     // ✅ Ensure socket is always initialized here
    //     initSocket(walletAddress);
    //     const socket = getSocket();
    //     if (!socket) {
    //         console.warn("⚠️ Socket not initialized yet");
    //         return;
    //     }
    //     socket.on("statusUpdated", (data: any) => {
    //         console.log("🔄 Real-time update:", data);
    //         setTableData((prev: any) =>
    //             prev.map((user: any) =>
    //                 user._id === data.userId || user._id === data._id
    //                     ? {
    //                         ...user,
    //                         status: data.status ?? user.status,
    //                         wallet: data.wallet ?? user.wallet,
    //                     }
    //                     : user
    //             )
    //         );

    //         // 📝 Optional: update localStorage walletData if current user matches
    //         const walletDataString = localStorage.getItem(`walletData_${walletAddress}`);
    //         if (walletDataString) {
    //             const parsed = JSON.parse(walletDataString);
    //             if (parsed._id === data.userId || parsed._id === data._id) {
    //                 const updated = {
    //                     ...parsed,
    //                     wallet: data.wallet ?? parsed.wallet,
    //                     status: data.status ?? parsed.status,
    //                     miningTime: data.miningTime ?? parsed.miningTime
    //                 };
    //                 localStorage.setItem(`walletData_${walletAddress}`, JSON.stringify(updated));
    //             }
    //         }
    //     });

    //     return () => {
    //         socket.off("statusUpdated");
    //     };
    // }, [walletAddress]);
      const handleBack = () => {
    console.log('Back button clicked');
    router.push(ROUTES?.STACKING?.DASHBOARD)
  }

    return (
        <div className='p-4'>
            <div className='flex gap-2 items-center mb-4'>
            <IoMdArrowRoundBack className='cursor-pointer text-4xl' onClick={handleBack}/>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                Your <span className='text-green-500'>Community</span>
            </p>
            </div>
            <div className='my-2'>
                <Pagination currentPage={page} onPageChange={setPage} pages={10}/>
            </div>
            <StakingTable data={tableData} loading={loading} />
        </div>
    );
}

export default YourCommunity;
