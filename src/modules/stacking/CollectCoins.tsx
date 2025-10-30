'use client';
import React from 'react';
import { toast } from 'react-toastify';
import { startMiningApi } from '@/apis/mining';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import MiningCountdown from '@/components/MiningCountdown ';
import Card from '@/components/Card';
import { ethers } from 'ethers';
const PLATFORM_FEE = "0.00001"; // BNB fee (string)

const CollectCoins = () => {

    const handleClaim = async () => {
        try {
            if (!(window as any).ethereum) {
                toast.error("SafePal / wallet provider not found.");
                return false;
            }
            const userId = getUserIdFromWallet();
            if (!userId) {
                toast.error("User not authenticated.");
                return false;
            }

            // Create provider & signer for SafePal dApp browser
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const signer = await provider.getSigner();
            const userWalletAddress = await signer.getAddress();
            // 1) Send fee tx from user wallet to platform fee address (user will approve)
            // const txResponse = await signer.sendTransaction({
            //     to: process.env.NEXT_PUBLIC_PLATFORM_FEE_ADDRESS, // ensure this is set in frontend env
            //     value: ethers.parseUnits(PLATFORM_FEE, "ether"),
            // });
            toast.info("Waiting for fee transaction confirmation...");
            // const confirmations = Number(process.env.NEXT_PUBLIC_MIN_FEE_CONFIRMATIONS || 1);
            // const receipt = await txResponse.wait(confirmations);

            // if (!receipt || receipt.status !== 1) {
            //     toast.error("Fee transaction failed on-chain.");
            //     return false;
            // }
/////////////////////////////////////////////////////////////////////////
            // ✅ Calculate actual fee details
            // const gasUsed = BigInt(receipt.gasUsed.toString());
            // const gasPrice = BigInt(receipt.gasPrice.toString());
            // const gasFeeBNB = Number(ethers.formatEther(gasUsed * gasPrice)); // gas cost in BNB
            // const sentBNB = Number(ethers.formatEther(txResponse.value)); // sent amount in BNB
//////////////////////////////////////////////////////////////////////////
            // ✅ Transaction hash safely extract karo
            // const feeTxHash =
            //     "transactionHash" in receipt
            //         ? receipt.transactionHash
            //         : (receipt as any).hash;
            const miningTime = new Date().toISOString();
            const payload = {
                userId,
                amount: 1.00,           // numeric reward amount (your logic)
                miningTime,
                // feeTxHash,
                walletAddress: userWalletAddress, // helpful for backend double-check
            };
            // const payload = {
            //     userId,
            //     amount: 1.00,           // numeric reward amount (your logic)
            //     miningTime,
            //     feeTxHash,
            //     walletAddress: userWalletAddress, // helpful for backend double-check
            // };
            const response = await startMiningApi(payload);
            console.log(response,'responseminingresponse')
            if (response?.data?.success) {
                toast.success(response?.data?.message);
                return true;
            } else {
                toast.error(response?.error || "Failed to start mining");
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