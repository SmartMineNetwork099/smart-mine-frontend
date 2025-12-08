'use client';
import React from 'react'
import Summery from '@/modules/binary/dashboard/Summery';
import PlansSummery from '@/modules/binary/dashboard/PlansSummery';
// import RecentBonus from '@/modules/binary/dashboard/RecentBonus';
// import Card from '@/components/Card';
// import Image from 'next/image';

const index = () => {
  return (
    <>
     {/* <Card className='h-[70vh] flex flex-col gap-2 justify-center items-center'>
        <Image src='/undraw_coming_soon.svg'
          className='w-28 sm:w-40 h-28 sm:h-40'
          alt="Referral image"
          width={160}
          height={160} />
        <p className="text-white font-semibold text-lg">Comming Soon</p>
      </Card> */}
      <Summery />
      <PlansSummery />
      {/* <RecentBonus /> */}
    </>
  )
}

export default index