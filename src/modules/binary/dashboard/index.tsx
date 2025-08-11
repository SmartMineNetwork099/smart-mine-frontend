'use client';
import React from 'react'
import Summery from '@/modules/binary/dashboard/Summery';
import RankBonus from '@/modules/binary/dashboard/RankBonus';
import RecentBonus from '@/modules/binary/dashboard/RecentBonus';

const index = () => {
  return (
    <>
      <Summery />
      <RankBonus />
      <RecentBonus />
    </>
  )
}

export default index