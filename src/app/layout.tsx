'use client';
import React, { useState, useEffect } from 'react';
import Tab from '@/components/Tab';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoGameControllerOutline } from "react-icons/io5";
import { TbBinaryTree } from "react-icons/tb";
import { LiaDonateSolid } from "react-icons/lia";
import { usePathname } from 'next/navigation';
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { MdOutlineInfo } from "react-icons/md";
import WalletData from '@/components/WalletData';
import ROUTES from '@/constants/routes';
import UserData from '@/components/UserData';
const tabs = [
  { label: 'Stacking', icon: LiaDonateSolid, link: ROUTES?.STACKING?.DASHBOARD },
  { label: 'Binary', icon: TbBinaryTree, link: ROUTES?.BINARY?.DASHBOARD },
  { label: 'Gaming', icon: IoGameControllerOutline, link: ROUTES?.GAMING?.HOME },
];
const tabs2 = [
  { label: 'Dashboard', icon: RiDashboardHorizontalLine, link: ROUTES?.BINARY?.DASHBOARD },
  { label: 'Community Tree', icon: TbBinaryTree, link: ROUTES?.BINARY?.COMMUNITY_TREE },
  { label: 'Community Info', icon: MdOutlineInfo, link: ROUTES?.BINARY?.COMMUNITY_INFO },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [tokken, setTokken] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setTokken(token);
    }
  }, []);

  const pathname = usePathname();
  const isBinaryPage = pathname.includes('/binary');
  const isNotGamingPage = !pathname.includes('/gaming');
  const isAuthRoute = pathname.includes(ROUTES?.AUTH?.LOGIN);
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='bg-gradient-to-b w-full from-[#0f0c29] via-[#302b63] to-[#24243e]'>

          {/* ✅ Show only when tokken exists */}
          {tokken && !isAuthRoute && (
            <>
              <Header />

              <div className="w-full p-4">
                <Tab tabs={tabs} style='min-w-20 sm:w-32' defaultLink={ROUTES?.STACKING?.DASHBOARD} />
              </div>

              {isNotGamingPage && (
                <>
                <div className="w-full p-4 pt-0">
                  <UserData />
                </div>
                <div className="w-full p-4 pt-0">
                  <WalletData />
                </div>
                </>
              )}

              {isBinaryPage && (
                <div className="w-full p-4">
                  <Tab tabs={tabs2} style='min-w-40 sm:min-w-44' defaultLink={ROUTES?.BINARY?.DASHBOARD} />
                </div>
              )}
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
