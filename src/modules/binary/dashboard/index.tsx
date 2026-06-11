'use client';
import React from 'react'
import Summery from '@/modules/binary/dashboard/Summery';
import BuyIds from '@/modules/binary/dashboard/BuyIds';
import PlansSummery from '@/modules/binary/dashboard/PlansSummery';
import RecentBonus from '@/modules/binary/dashboard/RecentBonus';
import Card from '@/components/Card';


const index = () => {
  return (
    <>
      {/* <Summery /> */}
      <BuyIds />
      {/* <PlansSummery /> */}
      {/* <RecentBonus /> */}
    </>
  )
}

export default index