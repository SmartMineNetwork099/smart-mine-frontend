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
        if (!socket) {
            console.warn("⚠️ Socket not initialized yet");
            return;
        }
        if (id) {
            socket.on('walletUpdated', (updatedWallet: any) => {
                setWallet(updatedWallet);
                // toast.info('Wallet updated instantly!');
            });
        }
        return () => {
            socket.off('walletUpdated');
        };
    }, []);


    const handleClaim = async () => {
        try {
            const response = await startMiningApi(userId);
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                return true; // ✅ mining start kar sakte ho
            } else {
                toast.error(response?.data?.message || "Failed to start mining");
                return false; // ❌ mining start na ho
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!");
            return false;
        }
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
