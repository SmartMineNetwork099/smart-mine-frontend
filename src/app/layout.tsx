'use client';
import React, {  useEffect } from 'react';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';
import WalletData from '@/components/WalletData';
import { useWalletAddress } from '@/hooks/useWallet';
import { silentLogin } from '@/apis/auth';
import { normalizeWalletAddress } from '@/utils/func';



export default function RootLayout({ children }: { children: React.ReactNode }) {
  let walletAddress = useWalletAddress()
  walletAddress = normalizeWalletAddress(walletAddress)

useEffect(() => {
  if (!walletAddress) return;

  const ethereum = typeof window !== "undefined" ? (window as any).ethereum : null;

  // 🔹 Silent login (initial)
  // const init = async () => {
  //   if (!ethereum) return;
  //   await silentLogin(walletAddress);
  // };

  // init();

  // 🔹 Wallet switch listener
  const handleAccountsChanged = async (accounts: string[]) => {
    console.log(accounts,'accountsaccountsaccounts')
    const newWallet = accounts?.[0] || '';
    console.log(newWallet,'newWalletnewWalletnewWallet')
    const currentWallet = localStorage.getItem("activeWallet") || '';
    console.log(currentWallet,'currentWalletcurrentWalletcurrentWallet')


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
  const showHeader = pathname.includes('stacking/dashboard');
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='fixed-bg w-full min-h-screen'>

          {/* ✅ Show only when tokken exists */}
          { showHeader && (
          <>
                  <Header />

                  <div className="w-full px-3">
                    <WalletData />
                  </div>
          </>
          )}
                

          <main className="p-3">
            {children}
            <ToastContainer />
          </main>

        </div>
      </body>
    </html>
  );
}
