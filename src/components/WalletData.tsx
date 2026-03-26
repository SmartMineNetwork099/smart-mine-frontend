"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import { toast } from "react-toastify";
import Messages from "@/constants/messages";

import { useWalletAddress } from "@/hooks/useWallet";
import { formatAmount, formatWalletAddress, normalizeWalletAddress } from "@/utils/func";

import { getUserDataApi , updateUserImage } from "@/apis/user";

import { getUserData } from "@/db/getData";
import { upsertUserData } from "@/db/saveData";

// ✅ Icons (single clean import)
import {
  FaRegUser,
  FaRegUserCircle,
  FaUser,
  FaUserGraduate,
  FaUserCircle,
  FaUserNurse,
  FaUserMd,
} from "react-icons/fa";
import { FaUserSecret } from "react-icons/fa6";
import { LuCopy, LuCopyCheck } from "react-icons/lu";

type WalletDataType = any;

const ICONS: Record<string, React.ElementType> = {
  FaRegUser,
  FaRegUserCircle,
  FaUser,
  FaUserGraduate,
  FaUserCircle,
  FaUserNurse,
  FaUserSecret,
  FaUserMd,
};

const WalletData = () => {
  let walletAddress = useWalletAddress();
  walletAddress = normalizeWalletAddress(walletAddress)

  const [walletData, setWalletData] = useState<WalletDataType>({});
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  

  // ✅ avatar icon state
  const [selectedIcon, setSelectedIcon] = useState<string>("FaRegUser");
  const [clickIcon, setClickIcon] = useState<boolean>(false);

  const SelectedIconComp = useMemo(() => {
    return ICONS[selectedIcon] || FaRegUser;
  }, [selectedIcon]);


  const loadLocalUserData = async () => {
  if (!walletAddress) return;

  try {
    const localUser: any = await getUserData(walletAddress);
    console.log(localUser,'localUserlocalUser')
    if (localUser) {
      setWalletData(localUser);
      setSelectedIcon(localUser?.image_url || "FaRegUser");
    }
  } catch (err) {
    console.error("Failed to load local wallet data:", err);
  }
};

  // ✅ Fetch user data (local first, then server, then upsert local)
  const handleWalletDataFetch = async () => {
    if (!walletAddress) return;

    try {
      // 1) Local (IndexedDB) data
      const localUser:any = await getUserData(walletAddress);
      if (localUser) {
        setWalletData(localUser);
        setSelectedIcon(localUser?.image_url || "FaRegUser");
      }

      // 2) Server data
      const res = await getUserDataApi();
      const user = res?.data?.user || {};

      setWalletData(user);
      setSelectedIcon(user?.image_url || localUser?.image_url || "FaRegUser");
      // 3) Upsert local
      await upsertUserData(walletAddress, user);

    } catch (err) {
      console.error("Failed to fetch user data:", err);
      toast.error(Messages?.SOME_THING_WRONG);
    }
  };
  useEffect(() => {
  if (!walletAddress) return;
  console.log('testing1')

  const handleWalletUpdated = async (event: Event) => {
    console.log('testing2')
    const customEvent = event as CustomEvent<{ walletAddress?: string }>;
    const updatedWalletAddress = normalizeWalletAddress(
      customEvent?.detail?.walletAddress
    );
    console.log(updatedWalletAddress,'updatedWalletAddressupdatedWalletAddress')
    console.log(walletAddress,'walletAddresswalletAddresswalletAddresswalletAddress')

    if (!updatedWalletAddress) return;

    if (updatedWalletAddress === walletAddress) {
      await loadLocalUserData();
    }
  };

  window.addEventListener("wallet-updated", handleWalletUpdated);

  return () => {
    window.removeEventListener("wallet-updated", handleWalletUpdated);
  };
}, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    handleWalletDataFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  // ✅ Detect mobile screen for short address
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // ✅ Generate display address
  const displayAddress = walletData?.walletAddress
    ? isMobile
      ? formatWalletAddress(walletData?.walletAddress)
      : walletData.walletAddress
    : "";

  const walletInfo = [
    { name: "Today Income", transactions: `${formatAmount(walletData?.wallet?.todayIncome || 0)} $` },
    { name: "Total Income", transactions: `${formatAmount(walletData?.wallet?.totalEarning || 0)} $` },
    { name: "Today Commission", transactions: `${formatAmount(walletData?.wallet?.todayTeamCommision || 0)} $` },
    // { name: "Collectable Income", transactions: `${formatAmount(walletData?.wallet?.collectableBonus || 0)} $` },
    { name: "Total Withdraw", transactions: `${formatAmount(walletData?.wallet?.totalWithdraw || 0)} $` },
    // { name: "Share Income", transactions: `${formatAmount(walletData?.wallet?.shareIncome || 0)} $` },
    { name: "YesterDay Loss", transactions: `${formatAmount(walletData?.wallet?.yesterdayLossIncome || 0)} $` },
    { name: "Total Loss", transactions: `${formatAmount(walletData?.wallet?.lossIncome || 0)} $` },
  ];

  // ✅ Icon select handler: save locally + (optional) server
  const handleIconSelect = async (iconName: string) => {
    setSelectedIcon(iconName);

    if (!walletAddress) {
      toast.error(Messages?.WAIT_MESSAGE("fetching Wallet Address"));
      return;
    }

    try {
      const updatedUser = { ...(walletData || {}), image_url: iconName };

      // ✅ Local save
      await upsertUserData(walletAddress, updatedUser);
      setWalletData(updatedUser);
      handleIconClick(); // Close icon picker

      // ✅ Optional server save (uncomment after you add API)
      const {data , error} = await updateUserImage(iconName);
       if(error){
       toast.error(error || Messages?.FAILED_MESSAGE("Avatar update"))
      }
      if(data){
      toast.success(data?.message)
      } 
    } catch (err) {
      console.error("Failed to save avatar icon:", err);
      toast.error(Messages?.FAILED_MESSAGE("Avatar update"));
    }
  };
  const handleIconClick = () => {
    setClickIcon((prev) => !prev);
  };
  const handleCopy = () => {
        navigator.clipboard.writeText(walletData?.userId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Auto hide after 1.5s
    };
console.log(walletData,'walletDatawalletDatawalletData')
  return (
    <Card className="flex flex-col flex-grow">
      <div className="rounded-2xl text-white">
        <div className="flex gap-2">
          {/* ✅ Avatar Icon + Picker */}
          <div className="flex flex-col gap-2">
            {/* Selected Avatar */}
            <div className="flex justify-center">
              <div onClick={handleIconClick} className="rounded-full p-1 hover:opacity-80 transition">
                <SelectedIconComp className="w-10 sm:w-16 h-10 sm:h-16 text-white" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-[10px] sm:text-sm text-gray-300 flex flex-col justify-center  w-full">
            <p className="relative flex items-center gap-2  w-full">
               <span>User ID: {walletData?.userId}</span>
               {/* Copy Button + Tooltip */}
                              <span
                                  className='cursor-pointer flex items-center justify-center text-white relative '
                                  onClick={handleCopy}
                              >
                                  <span className=''>
                                  {copied ? <LuCopyCheck /> : <LuCopy />}
                                  </span>
              
                                  {/* ✅ Custom Tooltip */}
                                  {copied && (
                                      <span className="absolute -top-8 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-md">
                                          Copied!
                                      </span>
                                   )} 
                              </span>
            </p>
            <p>
              Refer By: <span>{walletData?.referredBy || "-"}</span>
            </p>
            <p>
              Address: <span>{displayAddress}</span>
            </p>
          </div>
        </div>

         {/* Icon Picker */}
           {
                clickIcon && (
                     <div className={`grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2 `}>
              {Object.entries(ICONS).map(([key, IconCmp]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleIconSelect(key)}
                  className={`rounded-lg border p-2 hover:opacity-80 transition ${
                    selectedIcon === key ? "border-green-500" : "border-gray-600"
                  }`}
                  title={key}
                >
                  <IconCmp className="w-6 h-6 mx-auto text-white" />
                </button>
              ))}
            </div>
                )
           }
      </div>

      {/* Wallet Card total loss  */}
       {/* <div
            className={`flex flex-col justify-between py-3 sm:py-4 px-3 sm:px-2 -mb-4 mt-4 backdrop-blur-sm bg-red-500
               rounded-lg font-bold text-black text-base`}
          >
            <div>
              <p>
                Total Loss
              </p>
            </div>
            <div className="sm:w-auto">
              <p>
                {formatAmount(walletData?.wallet?.lossIncome || 0)} $
              </p>
            </div>
          </div> */}
      {/* Wallet Cards */}
      <div className=" py-2 px-0.5 grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
        {walletInfo?.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between py-3 sm:py-4 px-3 sm:px-2 backdrop-blur-sm ${
              item?.name.includes("Loss") ? "bg-red-500" : " "
            } text-white rounded-lg`}
          >
            <div>
              <p className={`font-bold ${item?.name.includes("Loss") ? "text-black" : "text-gray-300"} text-xs sm:text-base`}>
                {item?.name}
              </p>
            </div>
            <div className="sm:w-auto">
              <p
                className={`font-bold ${
                  item?.name.includes("Loss") ? "text-black" : "text-green-500"
                } rounded-lg text-sm sm:text-base inline sm:block`}
              >
                {item?.transactions}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WalletData;