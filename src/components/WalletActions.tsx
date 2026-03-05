"use client"
import React from 'react'
import { Button } from 'rizzui/button'
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/routes';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { BiMoneyWithdraw } from 'react-icons/bi';


const WalletActions = () => {
        const router = useRouter();
         const handleTabClick = (name?: any ) => {
          if(name==='withdraw'){
            router.push(ROUTES?.WITHDRAW?.HOME)
          }
          if(name==='history'){
            router.push(ROUTES?.HISTORY?.HOME)
          }
    };
    
  return (
    <>
    <div className='flex items-center justify-center gap-2'>
         <Button className={`w-full flex items-center justify-center gap-2 py-4 h-[50px] rounded-lg bg-green-500 font-bold text-sm sm:text-xl transition text-white cursor-pointer border-0`}
        onClick={() => handleTabClick('withdraw')}
        >
            Withdraw <BiMoneyWithdraw className='text-xl'/>
         </Button>


         <Button className={`w-full flex items-center justify-center gap-2 py-4 h-[50px] rounded-lg bg-green-500 font-bold text-sm sm:text-xl transition text-white cursor-pointer border-0`}
        onClick={() => handleTabClick('history')}
        >
            View History   <MdOutlineWorkHistory className='text-xl'/>

         </Button>         
    </div>
    </>
  )
}

export default WalletActions