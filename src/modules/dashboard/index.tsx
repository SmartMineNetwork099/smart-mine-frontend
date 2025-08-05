'use client';
import React from 'react'
import TodayBonus from '@/modules/dashboard/TodayBonus';
import UserDetails from '@/modules/dashboard/UserDetails';
import ReferralLink from '@/modules/dashboard/ReferralLink';
import Summery from '@/modules/dashboard/Summery';
import TotalLostBalance from '@/modules/dashboard/TotalLostBalance';
import RankBonus from '@/modules/dashboard/RankBonus';
import RecentBonus from '@/modules/dashboard/RecentBonus';
import CollectCoins from '@/modules/dashboard/CollectCoins';
const index = () => {
  return (
    <>
      <TodayBonus />
      <UserDetails />
      <TotalLostBalance />
      <CollectCoins />
      <ReferralLink />
      <Summery />
      <RankBonus />
      <RecentBonus />
    </>
  )
}

export default index