"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { calculateMiningBonusAndFeeApi, startMiningApi } from "@/apis/mining";
import MiningCountdown from "@/components/MiningCountdown ";
import Card from "@/components/Card";
import HashLoader from "@/components/HashLoader";
import Messages from "@/constants/messages";
import { Button } from "rizzui/button";
import {collectBonusApi, getUserStackingInvestments } from "@/apis/stackingApis";
import { upsertUserData } from "@/db/saveData";
import { useUserData } from "@/hooks/useUserData";
import { normalizeTxHash } from "@/utils/func";
import { sendPlatformFee } from "@/utils/paymentHandler";
import { roundTo4 } from "@/utils/amount";

const CollectCoins = () => {
          const [collectAbleIncome, setCollectAbleIncome] = useState<boolean>(false);
        const [loading, setLoading] = useState<boolean>(false);
        const [miningFeeLoading, setMiningFeeLoading] = useState<boolean>(false);
        const [userStackingInvestments, setUserStackingInvestments] = useState<any[]>([]);
        const {userData, isFreeze,walletAddress, refreshUser } = useUserData();
       // const fetchWalletLocally = async() =>{
        //         await refreshUser()
        //         if (userData?.wallet?.collectableBonus>0) {
        //         setCollectAbleIncome(true)
        //         }

        // }
        const calculateMiningBonusAndFee = async ()=>{
          setMiningFeeLoading(true)
          let requiredFee='';
          const {data , error} = await calculateMiningBonusAndFeeApi()
          if(error){
            toast.error(error)
          }
          if(data){
            console.log(data,'calculateMiningBonusAndFeecalculateMiningBonusAndFee')
             requiredFee = String(data?.requiredBnbForMiningFee)
          }
          setMiningFeeLoading(false)
          return requiredFee
        }
  const handleClaim = async () => {
    try {
      if(!walletAddress) {
        toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address')); 
        return false;
      }
    
    if(isFreeze){
      toast.error(Messages?.FREEZE_ACCOUNT)
      return false;
    }
    if(miningFeeLoading){
      toast.error('please wait while fetching mining fee')
      return false;
    }
    const miningFeeAmount = await calculateMiningBonusAndFee()
    console.log(miningFeeAmount,'miningFeeAmountminingFeeAmount')
    if (!miningFeeAmount || isNaN(Number(miningFeeAmount)) || Number(miningFeeAmount) <= 0) {

      toast.error('Kindly buy any plan.')
      return false;
    }
    const { success, message, feeTxHash, userWalletAddress } = await sendPlatformFee( {type:"mining" , miningFee:miningFeeAmount} );
    if (success===false) {
      toast.error(message || "Payment failed.");
      return false;
    }
    const miningTime = new Date().toISOString();
    const txHash = normalizeTxHash(feeTxHash);

      const payload = {
        feeTxHash:txHash
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
        // toast.success(response.data.message);
        await refreshUser();
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
   // const collectBonus = async () => {
  //   try {
  //     console.log('collect coins')
  //     toast.dismiss()
  //       if (isFreeze) {
  //         toast.error(Messages?.FREEZE_ACCOUNT);
  //         return;
  //         }
  //     if(!collectAbleIncome){
  //       toast.error("No bonus available to collect");
  //       return
  //     }
  //     if(!walletAddress) {
  //       toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address')); 
  //       return false;
  //     }
  //     setLoading(true)

  //     const {data , error} = await collectBonusApi();
  //     if (data?.success) {
  //          const updatedFields = {
  //                  wallet : data?.wallet,
  //                 }
  //                 await upsertUserData(walletAddress || '', updatedFields);
  //                 await refreshUser();
  //                  window.dispatchEvent(
  //               new CustomEvent("wallet-updated", {
  //                detail: { walletAddress },
  //               })
  //               );
  //               setLoading(false)

  //       toast.success(data.message);
  //     } else {
  //       toast.error(error|| Messages?.SOME_THING_WRONG);
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message || Messages?.SOME_THING_WRONG);
  //   }
  // }


   const getUserStackingInvestment = async () => {
    try {
      setLoading(true);
      const { data, error } = await getUserStackingInvestments();
      setUserStackingInvestments(data || 0);
      setLoading(false);
      console.log(data,'getUserStackingInvestmentgetUserStackingInvestment')
      if (error) {
        toast.error(error);
        setLoading(false);
        return;
      }
    }
      catch (error: any) {
        toast.error(error?.message || Messages?.SOME_THING_WRONG);
      }
    }
  useEffect(() => {
    getUserStackingInvestment()
  }, [])

  return (
    <Card>
      <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
        Claim <span className="text-green-500">Reward</span>
      </p>
      {/* <p className="font-semibold text-sm sm:text-base text-white text-end">
        Stacking Amount <span className="ml-1 p-1 rounded-md border-2 border-green-500">{loading ? "Loading..." : `${roundTo4(userStackingInvestments)}`}</span>
      </p> */}
      {/* ////////////////////////////////////////////////////// */}
       <div
                          className={`py-3 sm:py-4 px-3 sm:px-2 mt-2 backdrop-blur-sm text-white rounded-lg w-full sm:w-[49%] `}
                        >
              
                          <div>
                            <p className={`font-bold text-xs sm:text-base`}>
                             Stacking Amount
                            </p>
                          </div>
                          <div className="sm:w-auto">
                            <p
                              className={`font-bold text-green-500" rounded-lg text-sm sm:text-base inline sm:block text-green-500`}
                            >
                              {loading ? "Loading..." : `${roundTo4(userStackingInvestments)}`}
                            </p>
                          </div>
                          </div>
      {/* ////////////////////////////////////////////////////// */}

    {walletAddress ? (
  <MiningCountdown
    handleClaim={handleClaim}
    miningFeeLoading={miningFeeLoading}
  />
) : <HashLoader/>}
{/* <div>
  <Button onClick={collectBonus} disabled={loading} className={`w-full bg-green-500 ${collectAbleIncome ? 'bg-green-500 cursor-pointer' : 'bg-red-400/40 cursor-not-allowed'} ${loading && 'bg-red-400/40 cursor-not-allowed'} border-0 font-bold text-xl`}>Claim Coins</Button>
</div> */}

    </Card>
  );
};

export default CollectCoins;
