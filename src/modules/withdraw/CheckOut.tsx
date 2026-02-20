"use client"
import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/routes';
const CheckOut = () => {
    const router = useRouter();
  
  const handleBack = () => {
    console.log('Back button clicked');
    router.push(ROUTES?.STACKING?.DASHBOARD)
  }
  return (
   <>
   <div className='flex gap-2 items-center mb-4'>
               <IoMdArrowRoundBack className='cursor-pointer text-4xl' onClick={handleBack}/>
               <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                  <span className='text-green-500'>Withdraw</span>
               </p>
               </div>
        <h1 className='text-2xl font-bold text-center mt-10'>Withdraw Coming Soon </h1>
   </>
  )
}

export default CheckOut