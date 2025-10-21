"use client"
import React, { Suspense } from 'react'
import CollectCoins from '@/modules/stacking/CollectCoins'
import ReferralLink from '@/modules/stacking/ReferralLink'
import YourCommunity from '@/modules/stacking/YourCommunity'
import NetworkOverview from '@/modules/stacking/NetworkOverview'
import WalletActions from '@/components/WalletActions'
import StakingPlansTable from '@/components/tables/StackingPlansTable'
const index = () => {
    return (
        <>
         <Suspense fallback={<p className="text-white hidden">Loading...</p>}>
         <div className='mb-4'>
            <WalletActions />
         </div>
            <CollectCoins />
            <ReferralLink />
            <div className='my-4'>
              <StakingPlansTable/>
         </div>
            <NetworkOverview />
            <YourCommunity />
            </Suspense>
        </>
    )
}

export default index