"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getUserIdFromWallet } from "@/utils/walletHelpers";

interface MiningCountdownProps {
  handleClaim?: () => Promise<boolean>;
}

const MINING_COOLDOWN_MINUTES = 1;
const LAST_MINING_KEY = "lastMiningTimestamp";

const MiningCountdown: React.FC<MiningCountdownProps> = ({ handleClaim }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [fontSize, setFontSize] = useState("20px");
  const user_Id = getUserIdFromWallet();

  const radius = 150; // circle radius
  const circumference = 2 * Math.PI * radius;

  // resize font
  const handleResize = useCallback(() => {
    setFontSize(window.innerWidth <= 640 ? "20px" : "30px");
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // countdown logic
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
    if (timeLeft > 0) {
      const { toast } = await import("react-toastify");
      toast.error(`⏳ Wait ${Math.ceil(timeLeft / 60)} minutes`);
      return;
    }
    const success = await handleClaim?.();
    if (!success) return;

    localStorage.setItem(`${LAST_MINING_KEY}_${user_Id}`, Date.now().toString());
    setIsMining(true);
    setTimeLeft(MINING_COOLDOWN_MINUTES * 60);

    const { toast } = await import("react-toastify");
    toast.success("Mining Started! ✅");
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] cursor-pointer"
        onClick={() => timeLeft === 0 && startMining()}
      >
        {/* Background circle */}
        <svg className="absolute inset-0" viewBox="0 0 400 400">
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke="#e5e7eb"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* <span className="text-gray-500 font-semibold text-sm">Mining</span> */}
          <span className="font-bold" style={{ fontSize }}>
            {isMining && timeLeft > 0
              ? `${Math.floor(timeLeft / 60)}m ${String(timeLeft % 60).padStart(
                  2,
                  "0"
                )}s`
              : "Start Mining"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MiningCountdown;
