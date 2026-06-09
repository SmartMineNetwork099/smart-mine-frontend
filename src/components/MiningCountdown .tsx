"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { formatAmount,  formatTime, normalizeWalletAddress } from "@/utils/func";
import { MiningTimeApi } from "@/apis/mining";
import Messages from "@/constants/messages";
import { useUserData } from "@/hooks/useUserData";
import { Button } from "rizzui/button";
import { upsertUserData } from "@/db/saveData";
import { collectBonusApi } from "@/apis/stackingApis";
import { getUserData } from "@/db/getData";
import { getUserDataApi } from "@/apis/user";

interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
  miningFeeLoading?:boolean;
  userStackingInvestments?:any;
  userStackingInvestmentsLoading?:boolean;
}

const NEXT_CYCLE_KEY = "nextCycleTime";
const INDIA_TZ = "Asia/Kolkata";

const MiningCountdown: React.FC<MiningCountdownProps> = ({
  handleClaim,
  miningFeeLoading,
  userStackingInvestments,
  userStackingInvestmentsLoading
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [walletData, setWalletData] = useState<any>({});
  
  
  const { isFreeze,walletAddress, refreshUser } = useUserData();


// ✅ Fetch user data (local first, then server, then upsert local)
  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;
    setLoading2(true)

    try {
      // 1) Local (IndexedDB) data
      const localUser:any = await getUserData(walletAddress);
      if (localUser) {
        setWalletData(localUser);
      }
      setLoading2(false)

      // 2) Server data
      const res = await getUserDataApi();
      const user = res?.data?.user || {};

      setWalletData(user);
      // 3) Upsert local
      await upsertUserData(walletAddress, user);

    } catch (err) {
      console.error("Failed to fetch user data:", err);
      toast.error(Messages?.SOME_THING_WRONG);
    }
  };


  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextCycleRef = useRef<string | null>(null);

  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  const storageKey = useMemo(() => {
    return walletAddress ? `${NEXT_CYCLE_KEY}_${walletAddress}` : "";
  }, [walletAddress]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const fetchNextCycle = async () => {
    const res = await MiningTimeApi();
    const nextCycle = res?.data?.nextCycle;
    if (nextCycle && storageKey) {
      localStorage.setItem(storageKey, nextCycle);
    }
    nextCycleRef.current = nextCycle || null;
    return nextCycle || null;
  };

  const ensureNextCycle = async () => {
    if (!storageKey) return null;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      nextCycleRef.current = cached;
      return cached;
    }
    return await fetchNextCycle();
  };

  const startTicking = async () => {
    if (!walletAddress) return;

    await ensureNextCycle();
    if (!nextCycleRef.current) return;

    clearTimer();
    timerRef.current = setInterval(async () => {
      const nowIndia = moment().tz(INDIA_TZ);
      const endIndia = moment(nextCycleRef.current).tz(INDIA_TZ);

      const diff = endIndia.diff(nowIndia, "seconds");

      if (diff <= 0) {
        setTimeLeft(0);
        clearTimer();
        if (storageKey) localStorage.removeItem(storageKey);
        await fetchNextCycle();
        await startTicking();
        return;
      }

      setTimeLeft(diff);
    }, 1000);
  };


  // Load timer
  useEffect(() => {
    if (!walletAddress) return;
    startTicking();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

     // Load status from DB
     const fetchStatus = async () => {
     await refreshUser()
     };

  useEffect(() => {
    if (!walletAddress) return;
      handleWalletDataFetch()
      fetchStatus()
  }, [walletAddress]);

  // Progress accurate to India midnight cycle
  const percentage = useMemo(() => {
    if (!nextCycleRef.current) return 0;

    const nowIndia = moment().tz(INDIA_TZ);
    const endIndia = moment(nextCycleRef.current).tz(INDIA_TZ);
    const startIndia = endIndia.clone().subtract(1, "day");

    const total = endIndia.diff(startIndia, "seconds");
    const elapsed = nowIndia.diff(startIndia, "seconds");

    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }, [timeLeft]);

  const dashOffset = circumference - (percentage / 100) * circumference;

  // Start mining
  const startMining = async () => {
    toast.dismiss()
    if (!walletAddress) {
      toast.error(Messages?.WAIT_MESSAGE("fetching Wallet Address"));
      return;
    }
  
  if(isFreeze){
      toast.error(Messages?.FREEZE_ACCOUNT)
      return;
    }

    if (loading) return;

    if (walletData?.status === "active") {
      toast.error("You already mined today. Try again after 12:00 AM reset.");
      return;
    }

    setLoading(true);
    try {
      const success = await handleClaim?.();
      if (success) {
        await refreshUser()
        window.dispatchEvent(
     new CustomEvent("wallet-updated", {
     detail: { walletAddress },
      })
      );
      handleWalletDataFetch()
      //////////////////////////////////////////
     
        const {data , error} = await collectBonusApi();
      if (data?.success) {
           const updatedFields = {
                   wallet : data?.wallet,
                  }
                  await upsertUserData(walletAddress || '', updatedFields);
                  await refreshUser();
                   window.dispatchEvent(
                new CustomEvent("wallet-updated", {
                 detail: { walletAddress },
                })
                );

        toast.success("Mining successful and bonus collected.");
      } else {
        toast.success("Mining successful.")
      }
      /////////////////////////////////////////
      }
      
    } finally {
      setLoading(false);
    }
  };
  ////////////////////////////////////////


  const isDisabled = miningFeeLoading || loading || walletData?.status === "active";

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!isDisabled && walletAddress) startMining();
        }}
      >
        <svg className="absolute inset-0" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r={radius} stroke="#e7ebf1ff" strokeWidth="15" fill="white" />
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="#22c55e"
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-xl sm:text-3xl font-bold">
          <p className={`text-black ${walletData?.status === "active" ? "bg-green-500" : "bg-red-500"} text-base px-3 py-1 mb-1 sm:mb-3 rounded`}>
            {walletData?.status === "active" ? "active" : "inActive"}
          </p>
          {loading ? (
            <span className="text-green-600">Processing...</span>
          ) : (
            <p className="text-center text-black">{formatTime(timeLeft)}</p>
          )}
          <p className="text-center text-green-500 font-bold">{userStackingInvestmentsLoading ? "Loading..." : `${userStackingInvestments}`}</p>
          <div className="mt-1 sm:mt-2">
            {!loading2 &&
           <Button className={`w-full text-black cursor-pointer border-0 font-bold text-sm sm:text-xl ${Number(formatAmount(walletData?.wallet?.collectableBonus)) <= 0 ? "bg-green-300 px-5" : "bg-green-500"}`}> ${formatAmount(walletData?.wallet?.collectableBonus) || 0} </Button>
            }
         </div>

        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;