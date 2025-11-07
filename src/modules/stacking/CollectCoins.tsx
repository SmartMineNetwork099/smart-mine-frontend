"use client";
import React from "react";
import { toast } from "react-toastify";
import { startMiningApi } from "@/apis/mining";
import { getUserIdFromWallet, getUserWalletAddress } from "@/utils/walletHelpers";
import MiningCountdown from "@/components/MiningCountdown ";
import Card from "@/components/Card";
import {sendPlatformFee} from "@/utils/paymentHandler";

const CollectCoins = () => {
  const handleClaim = async () => {
    try {
      const userId = getUserIdFromWallet();
    //   this wallet address is temporary actual given from sendPlatformFee
      const userWalletAddress = getUserWalletAddress();
      if (!userId) {
        toast.error("User not authenticated.");
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
        userId,
        amount: 1.00,
        miningTime,
        // feeTxHash,
        walletAddress: userWalletAddress,
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
      <MiningCountdown handleClaim={handleClaim} />
    </Card>
  );
};

export default CollectCoins;
