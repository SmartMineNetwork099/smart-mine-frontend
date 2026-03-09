"use client";
import React, { useEffect, useState } from "react";
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
import { upsertUserData } from "@/db/saveData";
import { normalizeTxHash, normalizeWalletAddress } from "@/utils/func";
import { getUserData } from "@/db/getData";

const CollectCoins = () => {
     let walletAddress = useWalletAddress();
        walletAddress = normalizeWalletAddress(walletAddress)
        const [collectAbleIncome, setCollectAbleIncome] = useState<boolean>(false);
        const fetchWalletLocally = async() =>{
          const localUser:any = await getUserData(walletAddress);
                if (localUser?.wallet?.collectableBonus>0) {
                setCollectAbleIncome(true)
                }

        }
          useEffect(() => {
            if(!walletAddress) return
            fetchWalletLocally();
          }, [walletAddress]);
  const handleClaim = async () => {
    try {
      if(!walletAddress) {
        toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address')); 
        return false;
      }
    // const { success, message, feeTxHash, userWalletAddress } = await sendPlatformFee( {type:"mining"} );
    // if (success===false) {
    //   toast.error(message || "Payment failed.");
    //   return false;
    // }
    // const miningTime = new Date().toISOString();
    // const txHash = normalizeTxHash(feeTxHash);

      const payload = {
        amount: 1.00,
        // feeTxHash:txHash
      };

      const response = await startMiningApi(payload);
      console.log("Mining response:", response);
      if (response?.data?.success) {
      const updatedFields = {
       wallet : response?.data?.wallet,
       status : response?.data?.status,
       lastMiningDate : response?.data?.lastMiningDate,
       timezone : response?.data?.timezone, 
      }
      await upsertUserData(walletAddress, updatedFields);
        toast.success(response.data.message);
        window.dispatchEvent(
        new CustomEvent("wallet-updated", {
         detail: { walletAddress },
        })
        );
        return true;
      } else {
        toast.error(response?.error || Messages?.SOME_THING_WRONG);
        return false;
      }
    } catch (error: any) {
      toast.error(error?.message || Messages?.SOME_THING_WRONG);
      return false;
    }
  };
  const collectBonus = async () => {
    try {
      console.log('collect coins')
      toast.dismiss()
      if(!collectAbleIncome){
        toast.error("No bonus available to collect");
        return
      }

      const {data , error} = await collectBonusApi();
      if (data?.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(error|| Messages?.SOME_THING_WRONG);
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
  <Button onClick={collectBonus} className={`w-full bg-green-500 ${collectAbleIncome ? 'bg-green-500 cursor-pointer' : 'bg-red-400/40 cursor-not-allowed'} border-0 font-bold text-xl`}>Claim Coins</Button>
</div>

    </Card>
  );
};

export default CollectCoins;
