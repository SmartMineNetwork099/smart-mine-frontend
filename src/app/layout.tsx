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
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { MdOutlineInfo } from "react-icons/md";
import WalletData from '@/components/WalletData';

const tabs = [
  { label: 'Stacking', icon: LiaDonateSolid, link: 'stacking/dashboard' },
  { label: 'Binary', icon: TbBinaryTree, link: 'binary/dashboard' },
  { label: 'Gaming', icon: IoGameControllerOutline, link: 'gaming' }
];
const tabs2 = [
  { label: 'Dashboard', icon: RiDashboardHorizontalLine, link: 'binary/dashboard' },
  { label: 'Community Tree', icon: TbBinaryTree, link: 'binary/communityTree' },
  { label: 'Community Info', icon: MdOutlineInfo, link: 'binary/communityInfo' },
];
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBinaryPage = pathname.includes('/binary');
  const isNotGammingPage = !pathname.includes('/gaming');
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='bg-gradient-to-b w-full from-[#0f0c29] via-[#302b63] to-[#24243e]'>
          <Header />
          <div className="w-full p-4">
            <Tab tabs={tabs} style='min-w-20 sm:w-32' defaultLink='stacking/dashboard' />
          </div>
          {isNotGammingPage &&
            <div className="w-full p-4 pt-0">
              <WalletData />
            </div>
          }
          {isBinaryPage && (
            <div className="w-full p-4">
              <Tab tabs={tabs2} style='min-w-40 sm:min-w-44' defaultLink='binary/dashboard' />
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
