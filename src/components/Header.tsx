"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { Button } from 'rizzui'
import { DEFAULT_CURRENCY } from "@/constants/currency";
import ROUTES from '@/constants/routes';
import { useWalletAddress } from '@/hooks/useWallet';
import { logout } from '@/apis/auth';
import { toast } from 'react-toastify';
import Messages from '@/constants/messages'
import { normalizeWalletAddress } from '@/utils/func';
import Image from 'next/image';
const Header = () => {
  const router = useRouter();
  let walletAddress = useWalletAddress()
  walletAddress = normalizeWalletAddress(walletAddress)
  
  const goHomePage = () => {
    router.push(ROUTES?.STACKING?.DASHBOARD);
  }
  const handleLogout = async() => {
    if(!walletAddress) return;
    try {
      const res =await logout(walletAddress);
      console.log("logout res", res);
      toast.success(res?.message || Messages?.SUCCESSFULLY_MESSAGE('logout'));
    } catch (error) {
      console.log("logout error", error);
    }finally{
      router.push(ROUTES?.AUTH?.LOGIN);

    }
   
  }
  return (
    <>
      <div className='flex items-center justify-between p-2'>
        <div onClick={goHomePage} className='pl-1'>
          {/* <p className='cursor-pointer font-bold border-2 border-yellow-300 text-yellow-300 py-2 px-3 rounded-full text-center'>{DEFAULT_CURRENCY}</p> */}
          <Image src='/logo.JPEG' width={40} height={40} alt='company logo'/>
        </div>
        <div>
          <p className='text-green-500 font-bold text-2xl'>ST Project Here</p>
        </div>
        <Button onClick={handleLogout} className='bg-red-500 px-3 py-2 cursor-pointer text-white font-semibold rounded-md border-0'>Logout</Button>
      </div>
    </>
  )
}

export default Header
