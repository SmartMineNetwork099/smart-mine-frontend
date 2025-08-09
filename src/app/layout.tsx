'use client';
import React from 'react';
import Tab from '@/components/Tab';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

   const tabs = [
       { label: 'Dashboard', link: 'dashboard' },
       { label: 'My Team', link: 'myTeam' },
       { label: 'Community Tree', link: 'communityTree' },
       { label: 'Community Info', link: 'communityInfo' },
       { label: 'Royalty & Rewards', link: 'royaltyAndRewards' },
   ];  
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="bg-gray-200">
          <div className='bg-gradient-to-b w-full from-[#0f0c29] via-[#302b63] to-[#24243e]'>
            <Header />
            <div className="w-full p-4">
              <Tab tabs={tabs} style='min-w-36 sm:min-w-44'/>
            </div>
            <main className="p-4">
              {children}
              <ToastContainer />
            </main>
          </div>
      </body>
    </html>
  );
}
