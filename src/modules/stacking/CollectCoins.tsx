'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { startMiningApi } from '@/apis/mining';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import MiningCountdown from '@/components/MiningCountdown ';
import Card from '@/components/Card';
import { getSocket } from "@/utils/socket";


type walletType = {
    miningEarnings: number;
    referralEarnings: number;
    balance: number;
};


const CollectCoins = () => {
    
    const [wallet, setWallet] = useState<walletType>();
    const [userId, setUserId] = useState<string | null>(null);
    const socket = getSocket();


    // 🔗 Socket.IO listener
    useEffect(() => {
        const id = getUserIdFromWallet();
        setUserId(id);
        if (id) {
            socket.on('walletUpdated', (updatedWallet:any) => {
                setWallet(updatedWallet);
                // toast.info('Wallet updated instantly!');
            });
        }
        return () => {
            socket.off('walletUpdated');
        };
    }, []);


    const handleClaim = async () => {
        const response = await startMiningApi(userId);
        console.log(response, "responseeeee");
        toast.success(response?.data?.message);
        if (response?.error) toast.error(response?.error);
    };


    return (
        <>

            <Card>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Claim <span className='text-green-500'>Reward</span></p>

                <MiningCountdown handleClaim={handleClaim} />
                {/* Wallet info */}
                {wallet && (
                    <div className="mt-2 text-white text-xs">
                        <div>Mining Earnings: {wallet.miningEarnings}</div>
                        <div>Referral Earnings: {wallet.referralEarnings}</div>
                        <div>Balance: {wallet.balance}</div>
                    </div>
                )}
            </Card>

        </>
    );
};

export default CollectCoins;
