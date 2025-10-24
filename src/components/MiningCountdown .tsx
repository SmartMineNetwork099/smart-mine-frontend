"use client";
import React, { useState, useEffect } from "react";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
import { toast } from "react-toastify";
import { formatTime } from "@/utils/func";

interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
}

const MINING_COOLDOWN_MINUTES = 2; // ✅ Example: 130 min = 2h 10m
const LAST_MINING_KEY = "lastMiningTimestamp";

const MiningCountdown: React.FC<MiningCountdownProps> = ({ handleClaim }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [loading, setLoading] = useState(false);
  const user_Id = getUserIdFromWallet();

  const radius = 150;
  const circumference = 2 * Math.PI * radius;

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const lastMining = localStorage.getItem(`${LAST_MINING_KEY}_${user_Id}`);
      if (lastMining) {
        const lastTime = parseInt(lastMining, 10);
        const nextAvailable = lastTime + MINING_COOLDOWN_MINUTES * 60 * 1000;
        const remainingMs = nextAvailable - Date.now();

        if (remainingMs > 0) {
          setTimeLeft(Math.ceil(remainingMs / 1000));
          setIsMining(true);
        } else {
          setTimeLeft(0);
          setIsMining(false);
        }
      } else {
        setTimeLeft(0);
        setIsMining(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user_Id]);


  const percentage =
    timeLeft > 0
      ? ((MINING_COOLDOWN_MINUTES * 60 - timeLeft) / (MINING_COOLDOWN_MINUTES * 60)) * 100
      : 100;

  const dashOffset = circumference - (percentage / 100) * circumference;

  const startMining = async () => {
    setLoading(true);
    if (timeLeft > 0) {
      toast.error(`⏳ Wait ${formatTime(timeLeft)}`);
      setLoading(false);
      return;
    }

    const success = await handleClaim?.();
    console.log(success, 'successsuccesssuccess');
    if (!success) return setLoading(false);

    setLoading(false);
    setIsMining(true);
    setTimeLeft(MINING_COOLDOWN_MINUTES * 60);
    localStorage.setItem(`${LAST_MINING_KEY}_${user_Id}`, Date.now().toString());
  };


  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] cursor-pointer ${loading ? "opacity-50 pointer-events-none" : ""}`}
        onClick={() => timeLeft === 0 && !loading && startMining()}
      >
        {/* Background circle */}
        <svg className="absolute inset-0" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="#e7ebf1ff"
            strokeWidth="15"
            fill="white"
          />
          {/* Animated progress circle */}
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
            style={{
              transition: "stroke-dashoffset 1s linear",
            }}
          />
        </svg>

        {/* Text inside circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-xl sm:text-3xl font-bold">
          {loading ? (
            <span className="text-green-600">Processing...</span>
          ) : (
            <span className="text-black">
              {isMining && timeLeft > 0 ? formatTime(timeLeft) : "Start Mining"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;
