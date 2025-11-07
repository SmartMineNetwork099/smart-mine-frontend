"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/func";
import { MiningTimeApi } from "@/apis/mining";
import { getSocket, initSocket } from "@/utils/socket";
import { useSearchParams } from "next/navigation";

interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
}

interface WalletData {
  status?: string;
}

const NEXT_CYCLE_KEY = "nextCycleTime";

const MiningCountdown: React.FC<MiningCountdownProps> = ({ handleClaim }) => {
  // ✅ Single consistent userId (instant from localStorage)
  const [userId, setUserId] = useState<string | null>(() => getUserIdFromWallet());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const searchParams = useSearchParams();

  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  // ✅ Fetch next cycle time from backend
  const fetchNextCycle = async () => {
    try {
      console.log("📡 Fetching next cycle time...");
      const res = await MiningTimeApi();
      if (userId) {
        localStorage.setItem(`${NEXT_CYCLE_KEY}_${userId}`, res?.data?.nextCycle);
      }
      return res?.data?.nextCycle;
    } catch (err) {
      console.error("❌ Timer API Error:", err);
    }
  };

  // ✅ Ensure userId available (from localStorage or URL param)
  useEffect(() => {
    if (!userId) {
      const urlId = searchParams?.get("userId");
      if (urlId) {
        setUserId(urlId);
        try {
          localStorage.setItem("userID", urlId);
        } catch (err) {
          console.warn("⚠️ Couldn't write userID to localStorage", err);
        }
      }
    }
  }, [userId, searchParams]);

  // ✅ Timer setup
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const initTimer = async () => {
      if (!userId) {
        console.warn("⚠️ User ID not ready yet — skipping timer init");
        return;
      }

      let nextCycle = localStorage.getItem(`${NEXT_CYCLE_KEY}_${userId}`);
      console.log("👤 userId:", userId);
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
          localStorage.removeItem(`${NEXT_CYCLE_KEY}_${userId}`);
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
  }, [userId]);

  // ✅ Calculate progress
  const percentage =
    timeLeft > 0 ? ((24 * 3600 - timeLeft) / (24 * 3600)) * 100 : 100;
  const dashOffset = circumference - (percentage / 100) * circumference;

  // ✅ Mining start logic
  const startMining = async () => {
    setLoading(true);

    if (walletData?.status === "active") {
      toast.error("⚠️ You have already mined today. Try again after reset!");
      setLoading(false);
      return;
    }

    if (timeLeft <= 0) {
      toast.error("⏳ Please wait for the next cycle to start.");
      setLoading(false);
      return;
    }

    const success = await handleClaim?.();
    if (success) {
      toast.success("✅ Mining started successfully!");
      setIsMining(true);
    }

    setLoading(false);
  };

  // ✅ Load wallet data
  useEffect(() => {
    if (!userId) return;
    const data = localStorage.getItem(`walletData_${userId}`);
    const userWalletData = data ? JSON.parse(data) : null;
    setWalletData(userWalletData);
  }, [userId]);

  // ✅ Setup socket listener
  useEffect(() => {
    if (!userId) return;

    initSocket(userId);
    const socket = getSocket();
    if (!socket) {
      console.warn("⚠️ Socket not initialized yet");
      return;
    }

    const handleConnect = () => {
      console.log("🔌 Socket connected, listening for wallet updates...");
      socket.on("walletUpdated", (data: any) => {
        console.log("💰 Wallet update received:", data);
        setWalletData(data);
      });
    };

    if (socket.connected) handleConnect();
    else socket.on("connect", handleConnect);

    return () => {
      socket.off("walletUpdated");
      socket.off("connect", handleConnect);
    };
  }, [userId]);

  // ✅ UI
  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] ${
          loading || walletData?.status?.toLowerCase() === "active"
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={() => {
          if (!loading && walletData?.status?.toLowerCase() !== "active")
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
          {walletData?.status && (
            <p
              className={`text-white ${
                walletData?.status === "active" ? "bg-green-500" : "bg-red-500"
              } text-sm sm:text-base px-2 py-0.5 rounded`}
            >
              {walletData.status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;
