'use client';
import React from 'react'
import Summery from '@/modules/binary/dashboard/Summery';
import PlansSummery from '@/modules/binary/dashboard/PlansSummery';
import RecentBonus from '@/modules/binary/dashboard/RecentBonus';

const index = () => {
  return (
    <>
      <Summery />
      <PlansSummery />
      <RecentBonus />
    </>
  )
}

export default index