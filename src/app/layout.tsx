'use client';
import React, { useState, useEffect } from 'react';
import Tab from '@/components/Tab';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoGameControllerOutline } from "react-icons/io5";
import { BiMoneyWithdraw } from "react-icons/bi";
import { TbBinaryTree } from "react-icons/tb";
import { LiaDonateSolid } from "react-icons/lia";
import { usePathname } from 'next/navigation';
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { RiTeamLine } from 'react-icons/ri';
import { MdOutlineInfo } from "react-icons/md";
import WalletData from '@/components/WalletData';
import ROUTES from '@/constants/routes';
import { initSocket } from "@/utils/socket";
import { useWalletAddress } from '@/hooks/useWallet';
import { silentLogin } from '@/apis/auth';
const tabs = [
  { label: 'Stacking', icon: LiaDonateSolid, link: ROUTES?.STACKING?.DASHBOARD },
  // { label: 'Binary', icon: TbBinaryTree, link: ROUTES?.BINARY?.DASHBOARD },
  // { label: 'Gaming', icon: IoGameControllerOutline, link: ROUTES?.GAMING?.HOME },
  { label: 'Community', icon: BiMoneyWithdraw, link: ROUTES?.WITHDRAW?.HOME },
  { label: 'Withdraw', icon: BiMoneyWithdraw, link: ROUTES?.WITHDRAW?.HOME },
];
const tabs2 = [ 
  { label: 'Dashboard', icon: RiDashboardHorizontalLine, link: ROUTES?.BINARY?.DASHBOARD },
  { label: 'MY IDS', icon: RiTeamLine, link: ROUTES?.BINARY?.MY_IDS },
  { label: 'Community Tree', icon: TbBinaryTree, link: ROUTES?.BINARY?.COMMUNITY_TREE },
  { label: 'Community Info', icon: MdOutlineInfo, link: ROUTES?.BINARY?.COMMUNITY_INFO },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [accessToken ,  setAccessToken] = useState<string | null>(null);
  const walletAddress = useWalletAddress()

useEffect(() => {
  if (!walletAddress) return;

  const ethereum = typeof window !== "undefined" ? (window as any).ethereum : null;

  // 🔹 Init socket
  initSocket(walletAddress);

  // 🔹 Get accessToken_ from localStorage
  const accessToken=
    typeof window !== "undefined"
      ? localStorage.getItem(`accessToken_${walletAddress}`)
      : null;

  if (accessToken) {
    setAccessToken(accessToken);
  }

  // 🔹 Silent login (initial)
  // const init = async () => {
  //   if (!ethereum) return;
  //   await silentLogin(walletAddress);
  // };

  // init();

  // 🔹 Wallet switch listener
  const handleAccountsChanged = async (accounts: string[]) => {
    const newWallet = accounts?.[0];
    const currentWallet = localStorage.getItem("activeWallet");

    if (newWallet && newWallet !== currentWallet) {
      await silentLogin(newWallet);
    }
  };

  if (ethereum) {
    ethereum.on("accountsChanged", handleAccountsChanged);
  }

  // 🔹 Cleanup
  return () => {
    if (ethereum) {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    }
  };
}, [walletAddress]);



  const pathname = usePathname();
  // const isBinaryPage = pathname.includes('/binary');
const isNotGamingPage = !(pathname.includes('/gaming') || pathname.includes('/binary') || pathname.includes('/stacking/community'));
  const isAuthRoute = pathname.includes(ROUTES?.AUTH?.LOGIN);
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='w-full bg-black min-h-screen'>

          {/* ✅ Show only when tokken exists */}
          { !isAuthRoute && (
            <>
              <Header />

              {/* <div className="w-full p-4">
                <Tab tabs={tabs} style='min-w-20 sm:w-32' defaultLink={ROUTES?.STACKING?.DASHBOARD} />
              </div> */}

              {isNotGamingPage && (
                <>

                  <div className="w-full px-4">
                    <WalletData />
                  </div>
                </>
              )}

              {/* {isBinaryPage && (
                <div className="w-full p-4">
                  <Tab tabs={tabs2} style='min-w-36 sm:min-w-44' defaultLink={ROUTES?.BINARY?.DASHBOARD} />
                </div>
              )} */}
            </>
          )}

          <main className="p-4">
            {children}
            <ToastContainer />
          </main>

        </div>
      </body>
    </html>
  );
}
