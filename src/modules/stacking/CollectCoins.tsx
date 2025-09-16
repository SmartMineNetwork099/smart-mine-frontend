'use client';
import React, { useState, useEffect } from 'react';
import { Button } from 'rizzui';
import { toast } from 'react-toastify';
import { FaHandHoldingDollar } from 'react-icons/fa6';
import { ClockLoader } from 'react-spinners';
import { IoGiftOutline } from 'react-icons/io5';
import { startMiningApi } from '@/apis/mining';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import { formatTime } from '@/utils/func';
import { io } from 'socket.io-client'; // <-- Add this import
type walletType = {
    miningEarnings: number;
    referralEarnings: number;
    balance: number;
}
const COUNTDOWN_MS = 10 * 1000;
// const COUNTDOWN_MS = 12 * 60 * 60 * 1000; // 12 hours = 43,200,000 ms

const socket = io('http://localhost:5001'); // Use your backend URL and port

const CollectCoins = () => {
    const [nextClaimTime, setNextClaimTime] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('nextClaimTime');
            return saved ? parseInt(saved) : null;
        }
        return null;
    });
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [wallet, setWallet] = useState<walletType>(); // <-- Add wallet state

    useEffect(() => {
        const interval = setInterval(() => {
            if (nextClaimTime) {
                const diff = nextClaimTime - Date.now();
                setTimeLeft(diff > 0 ? diff : 0);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [nextClaimTime]);

    useEffect(() => {
        const id = getUserIdFromWallet();
        setUserId(id);

        if (id) {
            socket.emit('join', id); // Join socket.io room

            // Listen for wallet updates
            socket.on('walletUpdated', (updatedWallet) => {
                setWallet(updatedWallet);
                toast.info('Wallet updated instantly!');
            });
        }

        // Cleanup
        return () => {
            socket.off('walletUpdated');
        };
    }, []);
    console.log("Wallet state:", wallet);
    const handleClaim = async () => {
        const newTime = Date.now() + COUNTDOWN_MS;
        localStorage.setItem('nextClaimTime', newTime.toString());
        setNextClaimTime(newTime);
        // setTimeLeft(COUNTDOWN_MS); 
        const StartMining = await startMiningApi(userId);
        toast.success("🎉 You collected coins!");
        // Wallet will update automatically via socket event
    };
    const isDisabled = timeLeft > 0;

    return (
        <div className="flex items-center justify-between rounded-2xl p-4 sm:p-6 w-full mx-auto border-2 border-red-400 bg-gradient-to-r from-[#ff512f] to-[#f9d423] relative shadow-lg mt-4">
            <div className='w-[70%]'>
                <p className="text-white font-semibold text-sm sm:text-lg mt-1">Act now to stop losing bonus!</p>
                <Button
                    onClick={handleClaim}
                    disabled={isDisabled}
                    className={`mt-2 py-3 px-4 rounded-lg font-semibold border-0 text-white text-xs sm:text-base transition-all duration-300 bg-black ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {isDisabled ? (
                        <div className="flex items-center gap-3">
                            <ClockLoader color="#ffffff" size={22} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <IoGiftOutline className="" size={22} />
                            <span className=''>
                                Collect Coins
                            </span>
                        </div>
                    )}
                </Button>
                {/* Show wallet info */}
                {wallet && (
                    <div className="mt-2 text-white text-xs">
                        <div>Mining Earnings: {wallet.miningEarnings}</div>
                        <div>Referral Earnings: {wallet.referralEarnings}</div>
                        <div>Balance: {wallet.balance}</div>
                    </div>
                )}
            </div>
            <div>
                <FaHandHoldingDollar
                    className="text-5xl sm:text-6xl text-black"
                />
            </div>
        </div>
    );
};

export default CollectCoins;