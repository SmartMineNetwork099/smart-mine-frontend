"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { formatTime, normalizeWalletAddress } from "@/utils/func";
import { MiningTimeApi } from "@/apis/mining";
import Messages from "@/constants/messages";
import { useUserData } from "@/hooks/useUserData";

interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
  walletAddress?: string;
}

const NEXT_CYCLE_KEY = "nextCycleTime";
const DUBAI_TZ = "Asia/Dubai";

const MiningCountdown: React.FC<MiningCountdownProps> = ({
  handleClaim,
  walletAddress = null,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isFreeze, status, refreshUser } = useUserData();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextCycleRef = useRef<string | null>(null);

  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  walletAddress = normalizeWalletAddress(walletAddress )

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
      const nowDubai = moment().tz(DUBAI_TZ);
      const endDubai = moment(nextCycleRef.current).tz(DUBAI_TZ);

      const diff = endDubai.diff(nowDubai, "seconds");

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
      fetchStatus()
  }, [walletAddress]);

  // Progress accurate to Dubai midnight cycle
  const percentage = useMemo(() => {
    if (!nextCycleRef.current) return 0;

    const nowDubai = moment().tz(DUBAI_TZ);
    const endDubai = moment(nextCycleRef.current).tz(DUBAI_TZ);
    const startDubai = endDubai.clone().subtract(1, "day");

    const total = endDubai.diff(startDubai, "seconds");
    const elapsed = nowDubai.diff(startDubai, "seconds");

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

    if (status === "active") {
      toast.error("You already mined today. Try again after Dubai 12:00 AM reset.");
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
      }
      
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || status === "active";

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] ${
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
          {loading ? (
            <span className="text-green-600">Processing...</span>
          ) : (
            <p className="text-center text-black">{formatTime(timeLeft)}</p>
          )}

          <p className={`text-white ${status === "active" ? "bg-green-500" : "bg-red-500"} text-sm sm:text-base px-2 py-0.5 rounded`}>
            {status === "active" ? "active" : "inActive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;