'use client';
import React from 'react'
import WalletData from '@/modules/dashboard/WalletData';
import UserDetails from '@/modules/dashboard/UserDetails';
import ReferralLink from '@/modules/dashboard/ReferralLink';
import Summery from '@/modules/dashboard/Summery';
import TotalLostBalance from '@/modules/dashboard/TotalLostBalance';
import RankBonus from '@/modules/dashboard/RankBonus';
import RecentBonus from '@/modules/dashboard/RecentBonus';
import CollectCoins from '@/modules/dashboard/CollectCoins';
import Tab from '@/components/Tab'
const tabs = [
  { label: 'Staking' },
  { label: 'Binery' },
  { label: 'Gaming' }
];
const index = () => {
  return (
    <>
      <WalletData />
      {/* <UserDetails /> */}
      {/* <TotalLostBalance /> */}
      <div className='mt-4'>
        <Tab tabs={tabs} heading='Projects' style='min-w-20 sm:min-w-24' />
      </div>
      <CollectCoins />
      <ReferralLink />
      <Summery />
      <RankBonus />
      <RecentBonus />
    </>
  )
}

export default index