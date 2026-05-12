'use client';
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
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

const protectedPrefixes = ['/stacking', '/binary', '/withdraw', '/history', '/gaming'];

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

  const showHeader = pathname.includes('stacking/dashboard');

  return (
    <html lang="en">
      <body className="bg-gray-200">
        <div className='fixed-bg w-full min-h-screen'>
          {showHeader && (
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
