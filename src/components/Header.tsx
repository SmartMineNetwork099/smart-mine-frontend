"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from 'rizzui'
import { DEFAULT_CURRENCY } from "@/constants/currency";
import ROUTES from '@/constants/routes';
import { useWalletAddress } from '@/hooks/useWallet';
import { logout } from '@/apis/auth';
import { toast } from 'react-toastify';
const Header = () => {
  const router = useRouter();
  const walletAddress = useWalletAddress()
  
  const goHomePage = () => {
    router.push(ROUTES?.STACKING?.DASHBOARD);
  }
  const handleLogout = async() => {
    if(!walletAddress) return;
    try {
      const res =await logout();
      console.log("logout res", res);
      toast.success(res?.message || "Logged out successfully");
    } catch (error) {
      console.log("logout error", error);
    }finally{
      [`walletData_${walletAddress}`, `accessToken_${walletAddress}` , 'activeWallet'].forEach(key => localStorage.removeItem(key));
      router.push(ROUTES?.AUTH?.LOGIN);

    }
   
  }
  return (
    <>
      <div className='flex items-center justify-between bg-black p-2'>
        <div onClick={goHomePage}>
          <p className='cursor-pointer font-bold border-2 border-yellow-300 text-yellow-300 py-2 px-3 rounded-full text-center'>{DEFAULT_CURRENCY}</p>
        </div>
        <Button onClick={handleLogout} className='bg-red-500 px-3 py-2 cursor-pointer text-white font-semibold rounded-md border-0'>Logout</Button>
      </div>
    </>
  )
}

export default Header