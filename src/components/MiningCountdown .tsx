'use client';
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts";

interface MiningCountdownProps {
  handleClaim?: () => void;
}

const MINING_COOLDOWN_MINUTES = 0.1; // time  in minutes
const LAST_MINING_KEY = "lastMiningTimestamp"; // localStorage key

const MiningCountdown: React.FC<MiningCountdownProps> = ({ handleClaim }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds remaining
  const [series, setSeries] = useState<number[]>([0]);
  const [isMining, setIsMining] = useState(false);
  const [fontSize, setFontSize] = useState("20px");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Calculate remaining cooldown time when component mounts
  useEffect(() => {
    const lastMining = localStorage.getItem(LAST_MINING_KEY);
    if (lastMining) {
      const lastTime = parseInt(lastMining, 10);
      const nextAvailable = lastTime + MINING_COOLDOWN_MINUTES * 60 * 1000;
      const remainingMs = nextAvailable - Date.now();
      if (remainingMs > 0) {
        setTimeLeft(Math.ceil(remainingMs / 1000)); // convert ms -> sec
        setIsMining(true);
      }
    }
  }, []);

  // Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isMining && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsMining(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMining, timeLeft]);


  // Progress Bar % (based on total cooldown)
  useEffect(() => {
    const percentage = timeLeft > 0
      ? (((MINING_COOLDOWN_MINUTES * 60) - timeLeft) / (MINING_COOLDOWN_MINUTES * 60)) * 100
      : 100;
    setSeries([parseFloat(percentage.toFixed(2))]);
  }, [timeLeft]);

  // Handle Responsive Font Size
  useEffect(() => {
    const handleResize = () => {
      setFontSize(window.innerWidth <= 640 ? "20px" : "30px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check & Start Mining
  const startMining = async () => {
    if (timeLeft > 0) {
      const remainingMinutes = Math.ceil(timeLeft / 60);
      toast.error(`⏳ Mining will be available after ${remainingMinutes} minutes`);
      return;
    }
    // 🔥 Wait for API response first
    const success = await handleClaim?.();
    console.log(success, 'successsuccesssuccess')
    if (!success) {
      // ❌ Agar API fail ho gai to countdown start na karo
      return;
    }

    // ✅ Save new mining start timestamp
    localStorage.setItem(LAST_MINING_KEY, Date.now().toString());

    setTimeLeft(MINING_COOLDOWN_MINUTES * 60); // convert minutes → sec
    setIsMining(true);
  };

  const options: ApexOptions = {
    chart: { height: 350, type: "radialBar", toolbar: { show: true } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          position: "front",
          dropShadow: { enabled: true, top: 3, blur: 4, opacity: 0.5 },
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0,
          dropShadow: { enabled: true, top: -3, blur: 4, opacity: 0.7 },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: () => {
              if (!isMining || timeLeft === 0) return "Claim Reward";
              const hours = Math.floor(timeLeft / 3600);
              const minutes = Math.floor((timeLeft % 3600) / 60);
              const seconds = timeLeft % 60;
              return `${hours}h ${minutes}m ${seconds.toString().padStart(2, "0")}s`;
            },
            color: "#111",
            fontSize: fontSize,
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Mining"],
  };

  return (
    <div className="flex flex-col items-center">
      <div
        style={{ cursor: timeLeft === 0 ? "pointer" : "default" }}
        onClick={() => timeLeft === 0 && startMining()}
        className="w-[250px] sm:w-[450px]"
      >
        {mounted && (
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={350}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
};

export default MiningCountdown;
