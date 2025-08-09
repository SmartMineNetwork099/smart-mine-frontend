'use client';
import React from 'react'
import WalletData from '@/components/WalletData';
import Summery from '@/modules/binary/dashboard/Summery';
import RankBonus from '@/modules/binary/dashboard/RankBonus';
import RecentBonus from '@/modules/binary/dashboard/RecentBonus';
import Tab from '@/components/Tab';

// const tabs2 = [
//   { label: 'Dashboard', link: 'binary/dashboard' },
//   { label: 'My Team', link: 'binary/myTeam' },
//   { label: 'Community Tree', link: 'binary/communityTree' },
//   { label: 'Community Info', link: 'binary/communityInfo' },
//   { label: 'Royalty & Rewards', link: 'binary/royaltyAndRewards' },
// ];
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