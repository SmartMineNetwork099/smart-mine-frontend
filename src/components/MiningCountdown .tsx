"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/func";
import { MiningTimeApi } from "@/apis/mining";
import { getSocket, initSocket } from "@/utils/socket";
import { useSearchParams } from "next/navigation";
import Messages from "@/constants/messages";

interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
  walletAddress?: string;
}


const NEXT_CYCLE_KEY = "nextCycleTime";

const MiningCountdown: React.FC<MiningCountdownProps> = ({ handleClaim , walletAddress='' }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const searchParams = useSearchParams();
  

  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  

  // ✅ Fetch next cycle time from backend
  const fetchNextCycle = async () => {
    try {
      console.log("📡 Fetching next cycle time...");
      const res = await MiningTimeApi();
      if (walletAddress) {
        localStorage.setItem(`${NEXT_CYCLE_KEY}_${walletAddress}`, res?.data?.nextCycle);
      }
      return res?.data?.nextCycle;
    } catch (err) {
      console.error("❌ Timer API Error:", err);
    }
  };

  // ✅ Timer setup
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const initTimer = async () => {
      if (!walletAddress) {
        console.warn("⚠️ walletAddress not ready yet — skipping timer init");
        return;
      }

      let nextCycle = localStorage.getItem(`${NEXT_CYCLE_KEY}_${walletAddress}`);
      console.log("⏱️ Next Cycle from localStorage:", nextCycle);

      if (!nextCycle) {
        console.log("⏳ Fetching new cycle time from API...");
        nextCycle = await fetchNextCycle();
      }

      timer = setInterval(async () => {
        const now = moment();
        const end = moment(nextCycle);
        const diff = end.diff(now, "seconds");

        if (diff <= 0) {
          clearInterval(timer);
          localStorage.removeItem(`${NEXT_CYCLE_KEY}_${walletAddress}`);
          nextCycle = await fetchNextCycle();
          setTimeLeft(0);
          setIsMining(false);
          return;
        }

        setTimeLeft(diff);
        setIsMining(true);
      }, 1000);
    };

    initTimer();
    return () => clearInterval(timer);
  }, [ walletAddress]);

  // ✅ Calculate progress
  const percentage =
    timeLeft > 0 ? ((24 * 3600 - timeLeft) / (24 * 3600)) * 100 : 100;
  const dashOffset = circumference - (percentage / 100) * circumference;

  // ✅ Mining start logic
  const startMining = async () => {
    console.log("⛏️ Attempting to start mining...");
    if(!walletAddress) {
      toast.error(Messages?.WAIT_MESSAGE('fetching Wallet Address'));
      return;
    }
    setLoading(true);

    if (status === "active") {
      toast.error(Messages?.ALREADY_MESSAGE("mined today. Try again after reset!"));
      setLoading(false);
      return;
    }

    // if (timeLeft <= 0) {
    //   toast.error(Messages?.WAIT_MESSAGE('for the next cycle to start.'));
    //   setLoading(false);
    //   return;
    // }
    console.log("⛏️ Starting mining process...");
    const success = await handleClaim?.();
    console.log("⛏️ Mining process result:", success);
    if (success) {
      toast.success(Messages?.SUCCESSFULLY_MESSAGE("✅ Mining started"));
      setIsMining(true);
    }

    setLoading(false);
  };

  // ✅ Load wallet data
  useEffect(() => {
    if (!walletAddress) return;
    const data = localStorage.getItem(`walletData_${walletAddress}`);
    console.log("📂 Loading wallet data from localStorage for address:", data);
    const userWalletData = data ? JSON.parse(data) : null;
    console.log("📂 Loaded wallet data from localStorage:", userWalletData);
    setStatus(userWalletData?.status || '');
  }, [walletAddress]);

  // ✅ Setup socket listener
  useEffect(() => {
    if (!walletAddress) return;

    initSocket(walletAddress);
    const socket = getSocket();
    if (!socket) {
      console.warn("⚠️ Socket not initialized yet");
      return;
    }

    const handleConnect = () => {
      console.log("🔌 Socket connected, listening for wallet updates...");
      socket.on("walletUpdated", (data: any) => {
        console.log("💰 Wallet update received:", data);
        setStatus(data?.status || '');
      });
    };

    if (socket.connected) handleConnect();
    else socket.on("connect", handleConnect);

    return () => {
      socket.off("walletUpdated");
      socket.off("connect", handleConnect);
    };
  }, [walletAddress]);
  console.log(loading,'loadingloading')
  console.log(status,'statusstatus')
  console.log(walletAddress,'walletAddresswalletAddress')

  // ✅ UI
  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] ${
          loading || status?.toLowerCase() === "active"
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={() => {
          if (!loading && status?.toLowerCase() !== "active" && walletAddress)
            startMining();
        }}
      >
        {/* Progress Circle */}
        <svg className="absolute inset-0" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="#e7ebf1ff"
            strokeWidth="15"
            fill="white"
          />
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

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xl sm:text-3xl font-bold">
          {loading ? (
            <span className="text-green-600">Processing...</span>
          ) : (
            <p className="text-center text-black">{formatTime(timeLeft)}</p>
          )}
          {status && (
            <p
              className={`text-white ${
                status === "active" ? "bg-green-500" : "bg-red-500"
              } text-sm sm:text-base px-2 py-0.5 rounded`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;
