'use client';
import React from 'react';
import Tab from '@/components/Tab';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoGameControllerOutline } from "react-icons/io5";
import { TbBinaryTree } from "react-icons/tb";
import { LiaDonateSolid } from "react-icons/lia";
import { usePathname } from 'next/navigation';
const tabs = [
  { label: 'Stacking', icon: LiaDonateSolid, link: 'stacking/dashboard' },
  { label: 'Binary', icon: TbBinaryTree, link: 'binary/dashboard' },
  { label: 'Gaming', icon: IoGameControllerOutline, link: 'gaming' }
];
const tabs2 = [
  { label: 'Dashboard', link: 'binary/dashboard' },
  { label: 'My Team', link: 'binary/myTeam' },
  { label: 'Community Tree', link: 'binary/communityTree' },
  { label: 'Community Info', link: 'binary/communityInfo' },
  { label: 'Royalty & Rewards', link: 'binary/royaltyAndRewards' },
];
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBinaryPage = pathname.includes('/binary');
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='bg-gradient-to-b w-full from-[#0f0c29] via-[#302b63] to-[#24243e]'>
          <Header />
          <div className="w-full p-4">
            <Tab tabs={tabs} style='min-w-20 sm:w-32' defaultLink='stacking/dashboard' />
          </div>
          {isBinaryPage && (
            <div className="w-full p-4">
              <Tab tabs={tabs2} style='min-w-36 sm:min-w-44' defaultLink='binary/dashboard' />
            </div>
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
