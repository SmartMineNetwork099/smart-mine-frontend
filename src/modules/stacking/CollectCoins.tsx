'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { startMiningApi } from '@/apis/mining';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import MiningCountdown from '@/components/MiningCountdown ';
import Card from '@/components/Card';

const CollectCoins = () => {

    const handleClaim = async () => {
        try {
            const userId = getUserIdFromWallet();
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
        </Card>
    );
};

export default CollectCoins;