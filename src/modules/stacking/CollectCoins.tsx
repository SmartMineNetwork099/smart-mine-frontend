"use client";
import React from "react";
import { toast } from "react-toastify";
import { startMiningApi } from "@/apis/mining";
import MiningCountdown from "@/components/MiningCountdown ";
import Card from "@/components/Card";
import {sendPlatformFee} from "@/utils/paymentHandler";
import { useWalletAddress } from "@/hooks/useWallet";
import HashLoader from "@/components/HashLoader";

const CollectCoins = () => {
    const walletAddress = useWalletAddress();
  const handleClaim = async () => {
    try {
      if(!walletAddress) {
        toast.error("Wallet address not found.");
        return false;
      }
    // const feeResult = await sendPlatformFee(true);
    // if (!feeResult.success) {
    //   toast.error(feeResult.message || "Payment failed.");
    //   return false;
    // }
    // const { feeTxHash, userWalletAddress } = feeResult;
    const miningTime = new Date().toISOString();

      const payload = {
        amount: 1.00,
        miningTime,
        // feeTxHash,
        walletAddress,
      };

      const response = await startMiningApi(payload);
      if (response?.data?.success) {
        toast.success(response.data.message);
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
    {walletAddress ? (
  <MiningCountdown
    handleClaim={handleClaim}
    walletAddress={walletAddress}
  />
) : <HashLoader/>}

    </Card>
  );
};

export default CollectCoins;
