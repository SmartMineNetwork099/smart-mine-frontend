'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { startMiningApi } from '@/apis/mining';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import MiningCountdown from '@/components/MiningCountdown ';
import Card from '@/components/Card';
import { getSocket, initSocket } from "@/utils/socket";
import { useSearchParams } from 'next/navigation';

type walletType = {
    miningEarnings: number;
    referralEarnings: number;
    balance: number;
};

const CollectCoins = () => {
    const [wallet, setWallet] = useState<walletType>();
    const [userId, setUserId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkUserId = () => {
            let id = getUserIdFromWallet();
            if (!id) {
                const urlId = searchParams?.get("userId");
                if (urlId) {
                    id = urlId;
                    // save back to localStorage for future reads
                    try {
                        localStorage.setItem("userID", urlId);
                    } catch (err) {
                        console.warn("Couldn't write userID to localStorage", err);
                    }
                }
            }
            setUserId(id);
        };

        checkUserId(); // first time check        
    }, []);

    useEffect(() => {
        // const id = getUserIdFromWallet();
        // setUserId(id);
        // if (!id) {
        //     toast.warn('id not find')
        //     return;
        // }
        // ✅ Ensure socket is always initialized here
        initSocket(userId);
        const socket = getSocket();
        if (!socket) {
            console.warn("⚠️ Socket not initialized yet");
            return;
        }

        // ✅ Wait until socket is connected before attaching listeners
        const handleConnect = () => {
            console.log("🔌 Socket connected in CollectCoins, attaching wallet listener...");
            if (userId) {
                socket.on('walletUpdated', (data: any) => {
                    console.log("💰 Wallet update received:", data);
                    setWallet(data.wallet || data);
                    // toast.info('Wallet updated instantly!');
                });
            }
        };

        if (socket.connected) {
            handleConnect(); // already connected → directly attach listener
        } else {
            socket.on('connect', handleConnect);
        }

        return () => {
            socket.off('walletUpdated');
            socket.off('connect', handleConnect);
        };
    }, [userId]);

    const handleClaim = async () => {
        try {
            const response = await startMiningApi(userId);
            console.log(response, 'responseresponseresponse')
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                return true;
            } else {
                toast.error(response?.data?.message || "Failed to start mining");
                return false;
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong!");
            return false;
        }
    };


    return (
        <Card>
            <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
                Claim <span className="text-green-500">Reward</span>
            </p>

            <MiningCountdown handleClaim={handleClaim} />

            {wallet && (
                <div className="mt-2 text-white text-xs">
                    <div>Mining Earnings: {wallet.miningEarnings}</div>
                    <div>Referral Earnings: {wallet.referralEarnings}</div>
                    <div>Balance: {wallet.balance}</div>
                </div>
            )}
        </Card>
    );
};

export default CollectCoins;
