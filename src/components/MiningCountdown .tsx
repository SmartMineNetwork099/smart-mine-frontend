'use client';
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { ApexOptions } from "apexcharts";

interface MiningCountdownProps {
  totalTime?: number;
  handleClaim?: () => void;
}

const MiningCountdown: React.FC<MiningCountdownProps> = ({ totalTime = 6, handleClaim }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [series, setSeries] = useState<number[]>([0]);
  const [isMining, setIsMining] = useState(false);
  const [fontSize, setFontSize] = useState("20px");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMining && timeLeft >= 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
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
  }, [isMining, timeLeft, totalTime]);

  useEffect(() => {
    const percentage = timeLeft >= 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    setSeries([parseFloat(percentage.toFixed(2))]);
  }, [timeLeft, totalTime]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setFontSize("20px");
      } else if (window.innerWidth > 640) {
        setFontSize("30px");
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "radialBar",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.5,
          },
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.7,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
            // text: "Countdown",
          },
          value: {
            formatter: () => {
              if (!isMining || timeLeft === 0) {
                return "Claim Reward";
              }
              const minutes = Math.floor(timeLeft / 60);
              const seconds = timeLeft % 60;
              return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
    stroke: {
      lineCap: "round",
    },
    labels: ["25$"],
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          style={{ cursor: (!isMining || timeLeft === 0) ? 'pointer' : 'default' }}
          onClick={() => {
            if (!isMining || timeLeft === 0) {
              setTimeLeft(totalTime);
              setIsMining(true);
              handleClaim && handleClaim();
            }
          }}
          className="w-[250px] sm:w-[450px]"
        >
          {
            mounted &&
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={350}
              className="w-full"
            />
          }
        </div>
      </div>
    </>
  );
};

export default MiningCountdown;