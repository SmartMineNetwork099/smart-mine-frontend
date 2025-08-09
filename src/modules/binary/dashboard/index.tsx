'use client';
import React from 'react'
import WalletData from '@/components/WalletData';
import Summery from '@/modules/binary/dashboard/Summery';
import RankBonus from '@/modules/binary/dashboard/RankBonus';
import RecentBonus from '@/modules/binary/dashboard/RecentBonus';

const tabs2 = [
  { label: 'Dashboard', link: 'dashboard' },
  { label: 'My Team', link: 'myTeam' },
  { label: 'Community Tree', link: 'communityTree' },
  { label: 'Community Info', link: 'communityInfo' },
  { label: 'Royalty & Rewards', link: 'royaltyAndRewards' },
];
const index = () => {
  return (
    <>
      {/* <div className="w-full p-4">
        <Tab tabs={tabs2} style='min-w-36 sm:min-w-44' />
      </div> */}
      <WalletData />
      {/* <UserDetails /> */}
      {/* <TotalLostBalance /> */}

     
      <Summery />
      <RankBonus />
      <RecentBonus />
    </>
  )
}

export default index