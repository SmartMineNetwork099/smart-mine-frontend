'use client';
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Tab from '@/components/Tab';
import WalletData from '@/components/WalletData';
import { useWalletAddress } from '@/hooks/useWallet';
import { silentLogin } from '@/apis/auth';
import { normalizeWalletAddress } from '@/utils/func';
import ROUTES from '@/constants/routes';
import {
  clearAccessToken,
  clearActiveWallet,
  getAccessToken,
  getAccessTokenWallet,
} from '@/utils/authSession';
import { LiaDonateSolid } from 'react-icons/lia';
import { RiDashboardHorizontalLine } from 'react-icons/ri';
import { MdOutlineInfo } from 'react-icons/md';
import { TbBinaryTree } from "react-icons/tb";
import { IoGameControllerOutline } from "react-icons/io5";



const protectedPrefixes = ['/stacking', '/binary', '/withdraw', '/history', '/gaming'];
const tabs = [
  { label: 'Stacking', icon: LiaDonateSolid, value: ROUTES?.STACKING?.DASHBOARD },
  { label: 'Binary', icon: TbBinaryTree, value: ROUTES?.BINARY?.DASHBOARD },
  { label: 'Gaming', icon: IoGameControllerOutline, value: ROUTES?.GAMING?.HOME },
];
const tabs2 = [
  { label: 'Dashboard', icon: RiDashboardHorizontalLine, value: ROUTES?.BINARY?.DASHBOARD },
  { label: 'Community Tree', icon: TbBinaryTree, value: ROUTES?.BINARY?.COMMUNITY_TREE },
  { label: 'Level Tree', icon: TbBinaryTree, value: ROUTES?.BINARY?.LEVEL_TREE },
  { label: 'Community Info', icon: MdOutlineInfo, value: ROUTES?.BINARY?.COMMUNITY_INFO },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const walletAddress = useWalletAddress();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const ethereum = typeof window !== 'undefined' ? (window as any).ethereum : null;
    const isLoginPage = pathname === ROUTES?.AUTH?.LOGIN;
    const isProtectedRoute = protectedPrefixes.some((prefix) =>
      pathname.startsWith(prefix),
    );
    // console.log(ethereum,'ethereumethereumethereum_inside_use_effect')
    // console.log(isLoginPage,'isLoginPageisLoginPage')
    console.log(walletAddress,'walletAddresswalletAddressinside_use_effect')

    let cancelled = false;

    const syncCurrentWalletSession = async (targetWallet?: string | null) => {
      if (typeof targetWallet === 'undefined') {
        return;
      }

      const normalizedWallet = normalizeWalletAddress(targetWallet);

      if (!normalizedWallet) {
        clearAccessToken();
        clearActiveWallet();

        if (isProtectedRoute && !isLoginPage) {
          router.replace(ROUTES?.AUTH?.LOGIN);
        }
        return;
      }

      const accessToken = getAccessToken();
      const tokenWallet = normalizeWalletAddress(getAccessTokenWallet());

      if (accessToken && tokenWallet === normalizedWallet) {
        if (isLoginPage) {
          router.replace(ROUTES?.STACKING?.DASHBOARD);
        }
        return;
      }

      const restoreResult = await silentLogin(normalizedWallet);
      if (cancelled) return;

      if (restoreResult?.success) {
        if (isLoginPage || pathname === '/') {
          router.replace(ROUTES?.STACKING?.DASHBOARD);
        }
        return;
      }

      if (isProtectedRoute && !isLoginPage) {
        router.replace(ROUTES?.AUTH?.LOGIN);
      }
    };

    syncCurrentWalletSession(walletAddress);

    const handleAccountsChanged = async (accounts: string[]) => {
      const newWallet = normalizeWalletAddress(accounts?.[0] || '');
      console.log(newWallet,'newWalletnewWalletnewWallet')

      if (!newWallet) {
        clearAccessToken();
        clearActiveWallet();

        if (isProtectedRoute) {
          router.replace(ROUTES?.AUTH?.LOGIN);
        }
        return;
      }

      const currentWallet = normalizeWalletAddress(getAccessTokenWallet());
      const currentToken = getAccessToken();

      if (currentWallet === newWallet && currentToken) {
        return;
      }

      const restoreResult = await silentLogin(newWallet);

      if (restoreResult?.success) {
        if (isLoginPage) {
          router.replace(ROUTES?.STACKING?.DASHBOARD);
        } else {
          router.refresh();
        }
        return;
      }

      router.replace(ROUTES?.AUTH?.LOGIN);
    };

    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
    }


    
    return () => {
      cancelled = true;
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [pathname, router, walletAddress]);
   const handleTabClick = (link?: string ) => {
         router.push(link||'')
    };

  const showHeader = pathname.includes('stacking/dashboard');
  const notshowHeader = pathname.includes('auth');
  const showWallet = pathname.includes('stacking');

  const isNotGamingPage = !(pathname.includes('/gaming'));
  const isBinaryPage = pathname.includes('/binary' ) || pathname.includes('/userBinary') ;
  console.log(isBinaryPage,'isBinaryPageisBinaryPageisBinaryPage')
 


  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='fixed-bg w-full min-h-screen'>
          {!notshowHeader && ( 
            <>
              <Header />

               <div className="w-full p-4">
                <Tab tabs={tabs} style='min-w-20 sm:w-32' onTabChange={handleTabClick} defaultTab={ROUTES?.STACKING?.DASHBOARD} />
              </div>

              {isBinaryPage && (
                <div className="w-full p-4">
                  <Tab tabs={tabs2} style='min-w-40 sm:min-w-44' onTabChange={handleTabClick} defaultTab={ROUTES?.BINARY?.DASHBOARD} />
                </div>
              )}

             {showWallet && (
                <>
                  <div className="w-full px-3">
                    <WalletData />
                  </div>
                </>
              )}


              
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
