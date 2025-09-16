'use client';
import React, { useState, useEffect } from 'react';
import { Button } from 'rizzui';
import { toast } from 'react-toastify';
import { FaHandHoldingDollar } from 'react-icons/fa6';
import { startMiningApi } from '@/apis/mining';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import { formatTime } from '@/utils/func';
import { io } from 'socket.io-client';
import MiningCountdown from '@/components/MiningCountdown ';
import { IoGiftOutline } from 'react-icons/io5';
import { ClockLoader } from 'react-spinners';
import Card from '@/components/Card';

type walletType = {
    miningEarnings: number;
    referralEarnings: number;
    balance: number;
};

const socket = io(process.env.NEXT_PUBLIC_API_BASE as string);

const CollectCoins = () => {

    const [wallet, setWallet] = useState<walletType>();
    const [userId, setUserId] = useState<string | null>(null);


    // 🔗 Socket.IO listener
    useEffect(() => {
        const id = getUserIdFromWallet();
        setUserId(id);
        if (id) {
            socket.emit('join', id);
            socket.on('walletUpdated', (updatedWallet) => {
                setWallet(updatedWallet);
                toast.info('Wallet updated instantly!');
            });
        }
        return () => {
            socket.off('walletUpdated');
        };
    }, []);


    const handleClaim = async () => {
        await startMiningApi(userId);
        toast.success('🎉 You collected coins!');
    };


    return (
        <>

            <Card>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Claim <span className='text-green-500'>Reward</span></p>

                <MiningCountdown totalTime={10} handleClaim={handleClaim} />
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
