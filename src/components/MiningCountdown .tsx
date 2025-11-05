"use client";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/func";
import { MiningTimeApi } from "@/apis/mining";
import { getSocket, initSocket } from '@/utils/socket';
import { useSearchParams } from "next/navigation";


interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
}

interface WalletData {
  status?: string;
}

const NEXT_CYCLE_KEY = "nextCycleTime";

const MiningCountdown: React.FC<MiningCountdownProps> = ({ handleClaim }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const user_Id = getUserIdFromWallet();
      const searchParams = useSearchParams();
  

  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  // ✅ Fetch next 12AM time from backend
  const fetchNextCycle = async () => {
    try {
      const res = await MiningTimeApi();
      localStorage.setItem(`${NEXT_CYCLE_KEY}_${userID}`, res?.data?.nextCycle);
      return res?.data?.nextCycle;
    } catch (err) {
      console.error("Timer API Error:", err);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const initTimer = async () => {
      let nextCycle = localStorage.getItem(`${NEXT_CYCLE_KEY}_${userID}`);
      if (!nextCycle) nextCycle = await fetchNextCycle();

      timer = setInterval(async () => {
        const now = moment();
        const end = moment(nextCycle);
        const diff = end.diff(now, "seconds");

        if (diff <= 0) {
          // Reset at midnight automatically
          clearInterval(timer);
          localStorage.removeItem(`${NEXT_CYCLE_KEY}_${userID}`);
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
  }, [user_Id]);

  const percentage =
    timeLeft > 0 ? ((24 * 3600 - timeLeft) / (24 * 3600)) * 100 : 100;
  const dashOffset = circumference - (percentage / 100) * circumference;

  // ✅ Updated startMining (status-based logic)
  const startMining = async () => {
    setLoading(true);

    // 1️⃣ Check if user already mined today (status = active)
    if (walletData?.status === "active") {
      toast.error("⚠️ You have already mined today. Try again after midnight!");
      setLoading(false);
      return;
    }

    // 2️⃣ Check if valid mining window
    if (timeLeft <= 0) {
      toast.error("⏳ Please wait for timer to start.");
      setLoading(false);
      return;
    }

    // ✅ Perform mining
    const success = await handleClaim?.();
    if (success) {
      toast.success("✅ Mining started successfully!");
      setIsMining(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    const data = localStorage.getItem(`walletData_${user_Id}`);
    const userWalletData = data ? JSON.parse(data) : null;
    setWalletData(userWalletData);
  }, [user_Id]);
  useEffect(() => {
          // ✅ Ensure socket is always initialized here
          initSocket(user_Id);
          const socket = getSocket();
          if (!socket) {
              console.warn("⚠️ Socket not initialized yet");
              return;
          }
  
          // ✅ Wait until socket is connected before attaching listeners
          const handleConnect = () => {
              console.log("🔌 Socket connected in CollectCoins, attaching wallet listener...");
              if (user_Id) {
                  socket.on('walletUpdated', (data: any) => {
                      console.log("💰 Wallet update received1122:", data);
                      setWalletData(data);
                  });
              }
          };
  
          if (socket.connected) {
              handleConnect();
          } else {
              socket.on('connect', handleConnect);
          }
  
          return () => {
              socket.off('walletUpdated');
              socket.off('connect', handleConnect);
          };
      }, [userID]);
      // Init: prefer localStorage, fallback to URL param; listen to storage events
          useEffect(() => {
              const init = async () => {
                  let id = getUserIdFromWallet();
      
                  if (!id) {
                      const urlId = searchParams?.get("userId");
                      if (urlId) {
                          id = urlId;
                          // save back to localStorage for future reads
                          try {
                              localStorage.setItem("userID", urlId);
                          } catch (err) {
                              console.warn("Couldn't write userID to localStorage", err);
                          }
                      }
                  }
      
                  setUserID(id);
              };
      
              init();
          }, []);
      

      return (
    <div className="flex flex-col items-center space-y-4">
      <div
     className={`relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px]  ${
    loading || walletData?.status?.toLowerCase() === "active"
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer"
       }`}
      onClick={() => {
        if (!loading && walletData?.status?.toLowerCase() !== "active") startMining();
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
            <p className="text-center text-black">
              {formatTime(timeLeft)}
            </p>
          )}
          {walletData?.status && (
            <p className={`text-white ${walletData?.status ==='active' ? 'bg-green-500' : 'bg-red-500'} text-sm sm:text-base px-2 py-0.5 rounded`}>
              {walletData.status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;
