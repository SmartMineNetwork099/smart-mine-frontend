"use client";
import React from "react";
import { toast } from "react-toastify";
import { startMiningApi } from "@/apis/mining";
import MiningCountdown from "@/components/MiningCountdown ";
import Card from "@/components/Card";
import {sendPlatformFee} from "@/utils/paymentHandler";
import { useWalletAddress } from "@/hooks/useWallet";
import HashLoader from "@/components/HashLoader";
import Messages from "@/constants/messages";
import { Button } from "rizzui/button";
import { collectBonusApi } from "@/apis/stackingApis";

const CollectCoins = () => {
    const walletAddress = useWalletAddress();
  const handleClaim = async () => {
    try {
      if(!walletAddress) {
        toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address')); 
        return false;
      }
    // const feeResult = await sendPlatformFee(true);
    // if (!feeResult.success) {
    //   toast.error(feeResult.message || "Payment failed.");
    //   return false;
    // }
    // const { feeTxHash, userWalletAddress } = feeResult;
    // const miningTime = new Date().toISOString();

      const payload = {
        amount: 1.00,
        // miningTime,
        // feeTxHash,
        walletAddress,
      };

      const response = await startMiningApi(payload);
      if (response?.data?.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response?.data?.message || Messages?.SOME_THING_WRONG);
        return false;
      }
    } catch (error: any) {
      toast.error(error?.message || Messages?.SOME_THING_WRONG);
      return false;
    }
  };
  const collectBonus = async () => {
    try {
      if(!walletAddress) {
        toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address')); 
        return false;
      }
      const payload = {
        walletAddress,
      };

      const response = await collectBonusApi(payload);
      if (response?.data?.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response?.data?.message || Messages?.SOME_THING_WRONG);
        return false;
      }
    } catch (error: any) {
      toast.error(error?.message || Messages?.SOME_THING_WRONG);
      return false;
    }
  }

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
<div>
  <Button onClick={collectBonus} className="w-full bg-green-500 border-0 font-bold text-xl cursor-pointer">Claim Coins</Button>
</div>

    </Card>
  );
};

export default CollectCoins;
